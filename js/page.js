import { t } from './i18n.js';

// Ponte verso la scheda di pokelike.xyz.
//
// Due mondi distinti:
//  - ISOLATED (default): vede solo il localStorage della pagina. Basta per
//    leggere e scrivere il salvataggio.
//  - MAIN: condivide lo scope della pagina, quindi vede le costanti e le
//    funzioni del gioco. Serve per leggere i cataloghi (achievement, sfide)
//    senza doverli copiare dentro l'estensione.

export function getGameTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      resolve(tab && tab.url && tab.url.includes('pokelike.xyz') ? tab : null);
    });
  });
}

function runInWorld(world, func, args) {
  return getGameTab().then((tab) => {
    if (!tab) return Promise.reject(new Error(t('status.openSiteAction')));
    return new Promise((resolve, reject) => {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, world, func, args }, (results) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!results || !results[0]) return reject(new Error(t('status.noResponse')));
        resolve(results[0].result);
      });
    });
  });
}

export function execInPage(func, args = []) {
  return runInWorld('ISOLATED', func, args);
}

// Dopo un ripristino il gioco ha ancora in memoria la partita precedente e al
// primo salvataggio automatico sovrascriverebbe i dati appena ripristinati:
// la scheda va ricaricata subito.
export function reloadGameTab() {
  return getGameTab().then((tab) => {
    if (!tab) return false;
    return new Promise(resolve => chrome.tabs.reload(tab.id, {}, () => resolve(true)));
  });
}

// Come sopra, ma aspetta che la pagina abbia finito di caricare: serve quando
// dopo il reload bisogna ancora parlare con il gioco.
export function reloadGameTabAndWait(timeoutMs = 20000) {
  return getGameTab().then((tab) => {
    if (!tab) return false;
    return new Promise((resolve) => {
      let done = false;
      const finish = (value) => {
        if (done) return;
        done = true;
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(value);
      };
      const listener = (tabId, info) => {
        if (tabId === tab.id && info.status === 'complete') finish(true);
      };
      chrome.tabs.onUpdated.addListener(listener);
      setTimeout(() => finish(false), timeoutMs);
      chrome.tabs.reload(tab.id);
    });
  });
}

// ── Sincronizzazione cloud del gioco ─────────────────────────────────────

export function isCloudSyncActive() {
  return readSaveKeys(['poke_save_token', 'poke_save_token_exp'])
    .then(({ poke_save_token: token, poke_save_token_exp: exp }) => {
      if (!token) return false;
      const expiry = Number(exp);
      return !Number.isFinite(expiry) || expiry > Date.now();
    })
    .catch(() => false);
}

const PAUSE_SCRIPT_ID = 'pokelike-editor-pause-cloud-sync';

// Va registrato prima del reload e rimosso subito dopo: deve valere solo per
// il caricamento del ripristino, non per le visite successive.
export async function pauseCloudSyncOnNextLoad() {
  await unpauseCloudSync();
  await chrome.scripting.registerContentScripts([{
    id: PAUSE_SCRIPT_ID,
    matches: ['https://pokelike.xyz/*'],
    js: ['src/pause-cloud-sync.js'],
    runAt: 'document_start',
    world: 'MAIN',
    allFrames: false
  }]);
}

export async function unpauseCloudSync() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [PAUSE_SCRIPT_ID] });
  } catch (e) {
    // Non era registrato: va bene cosi'.
  }
}

// Carica sul server il salvataggio locale, chiamando la funzione del gioco.
// Senza questo passaggio il server conserverebbe lo stato piu' recente e al
// caricamento successivo rimetterebbe indietro il ripristino.
export function pushSaveToCloud() {
  // La funzione viene eseguita nella pagina e non vede lo scope del modulo:
  // i messaggi tradotti vanno passati come argomenti.
  const msg = {
    missing: t('backup.pushMissing'),
    rejected: t('backup.pushRejected'),
    network: t('backup.pushNetwork')
  };
  return execInMain((msg) => {
    try {
      if (typeof _push !== 'function') return { ok: false, reason: msg.missing };
      return Promise.resolve(_push())
        .then(r => (r && r.ok) ? { ok: true } : { ok: false, reason: msg.rejected })
        .catch(e => ({ ok: false, reason: (e && e.message) || msg.network }));
    } catch (e) {
      return { ok: false, reason: (e && e.message) || msg.network };
    }
  }, [msg]);
}

export function execInMain(func, args = []) {
  return runInWorld('MAIN', func, args);
}

// Legge i cataloghi direttamente dal gioco. Le costanti top-level dichiarate
// con `const` non finiscono su window ma restano raggiungibili per nome dallo
// scope globale, quindi ogni lettura e' protetta da un try/catch singolo.
export function readGameCatalog() {
  return execInMain(() => {
    const pick = (fn) => { try { return fn(); } catch (e) { return null; } };

    const achievements = pick(() => ACHIEVEMENTS);
    const challenges = pick(() => CHALLENGES);
    const storyCounters = pick(() => STORY_COUNTERS);

    // Nomi e descrizioni degli obiettivi in tutte le lingue del gioco: la
    // ricerca deve trovarli anche se l'utente scrive in un'altra lingua.
    const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
    const everyLang = dict ? Object.keys(dict) : [];
    const achTexts = (id) => {
      const out = [];
      everyLang.forEach(code => {
        const ach = dict[code] && dict[code].ach;
        if (!ach) return;
        ['name', 'desc'].forEach(kind => {
          const v = ach[kind] && ach[kind][id];
          if (typeof v === 'string' && v) out.push(v);
        });
      });
      return out;
    };

    const normalize = (list) => Array.isArray(list)
      ? list.filter(a => a && a.id).map(a => ({
          id: a.id,
          name: a.name || a.id,
          desc: a.desc || '',
          icon: typeof a.icon === 'string' ? a.icon : '',
          category: a.category || 'altro',
          search: [a.id, a.name || '', a.desc || '', ...achTexts(a.id)].filter(Boolean)
        }))
      : null;

    return {
      achievements: normalize(achievements),
      challenges: normalize(challenges),
      storyCounters: storyCounters && typeof storyCounters === 'object'
        ? JSON.parse(JSON.stringify(storyCounters))
        : null
    };
  });
}

// Catalogo delle megapietre, letto dal gioco come gli achievement.
// Serve solo l'essenziale per popolare i menu; l'oggetto vero e proprio lo
// costruisce il gioco con makeMegaStoneItem().
export function readMegaStones() {
  return execInMain(() => {
    try {
      if (typeof MEGA_STONES === 'undefined' || !Array.isArray(MEGA_STONES)) return null;
      return MEGA_STONES
        .filter(s => s && s.id)
        .map(s => ({
          id: s.id,
          name: s.name || s.id,
          megaName: s.megaName || '',
          species: s.species
        }));
    } catch (e) {
      return null;
    }
  });
}

// L'oggetto da scrivere nel salvataggio viene costruito dal gioco stesso: cosi'
// ha esattamente i campi che syncMegaForm() si aspetta, anche se un domani
// cambiassero.
export function buildMegaStoneItem(stoneId) {
  return execInMain((stoneId) => {
    try {
      if (typeof makeMegaStoneItem !== 'function') return null;
      if (typeof MEGA_STONE_BY_ID === 'undefined') return null;
      const def = MEGA_STONE_BY_ID[stoneId];
      return def ? makeMegaStoneItem(def) : null;
    } catch (e) {
      return null;
    }
  }, [stoneId]);
}

// Riprende la run dalla schermata del titolo dopo un ricaricamento.
//
// Il gioco ha tre pulsanti "riprendi" e ne mostra solo quello pertinente: e'
// lui la fonte attendibile, non il salvataggio. Una run puo' infatti essere
// insieme endless e sfida (challengeId "endless2"), e in quel caso il pulsante
// giusto e' quello della sfida. Il salvataggio serve solo come preferenza
// iniziale nell'ordine di ricerca.
export function resumeRun(preferred) {
  return execInPage((preferred) => {
    const BUTTONS = {
      challenge: 'btn-continue-challenge',
      endless: 'btn-continue-endless',
      story: 'btn-continue-run'
    };

    const isVisible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && el.offsetParent !== null;
    };

    const order = BUTTONS[preferred]
      ? [BUTTONS[preferred], ...Object.values(BUTTONS).filter(id => id !== BUTTONS[preferred])]
      : Object.values(BUTTONS);

    // La schermata del titolo compare dopo il caricamento del gioco: si
    // controlla a intervalli invece di dare per scontato che sia gia' pronta.
    return new Promise((resolve) => {
      const deadline = Date.now() + 8000;
      const tick = () => {
        for (const id of order) {
          const el = document.getElementById(id);
          if (isVisible(el)) {
            el.click();
            return resolve({ ok: true, id });
          }
        }
        if (Date.now() > deadline) return resolve({ ok: false });
        setTimeout(tick, 200);
      };
      tick();
    });
  }, [preferred]);
}

// Catalogo degli oggetti passivi della run, letto dal gioco. Le voci hanno gia'
// i campi che finiscono in run.passives: basta aggiungere `enabled`.
//
// Nome e descrizione vengono tradotti con il dizionario del gioco stesso
// (window.I18N[lingua].items.name/desc, indicizzato per id), che copre le
// nostre stesse sei lingue. Cosi' le etichette coincidono con quelle che il
// giocatore vede in partita e non c'e' una tabella di traduzioni da mantenere
// qui dentro. `name`/`desc` restano *identici* a quelli del gioco, perche' sono
// i campi che finiscono nel salvataggio: la traduzione vive accanto, in
// `label`/`labelDesc`, e la usa solo l'interfaccia.
export function readPassivePool(lang) {
  return execInMain((lang) => {
    try {
      if (typeof PASSIVE_ITEM_POOL === 'undefined' || !Array.isArray(PASSIVE_ITEM_POOL)) return null;

      const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
      const pick = (code, kind, id) => {
        const items = dict && dict[code] && dict[code].items;
        const v = items && items[kind] && items[kind][id];
        return typeof v === 'string' && v ? v : null;
      };
      // Tutte le lingue che il gioco conosce: servono alla ricerca, che deve
      // trovare la voce comunque la scriva l'utente.
      const everyLang = dict ? Object.keys(dict) : [];
      const allNames = (id) => everyLang
        .map(code => pick(code, 'name', id))
        .filter(Boolean);

      return PASSIVE_ITEM_POOL
        .filter(p => p && p.id)
        .map(p => {
          const name = p.name || p.id;
          const desc = p.desc || '';
          return {
            id: p.id,
            name,
            desc,
            label: pick(lang, 'name', p.id) || pick('en', 'name', p.id) || name,
            labelDesc: pick(lang, 'desc', p.id) || pick('en', 'desc', p.id) || desc,
            search: [p.id, name, desc, ...allNames(p.id)],
            icon: typeof p.icon === 'string' ? p.icon : '',
            hook: p.hook || '',
            iconUrl: p.iconUrl || ''
          };
        });
    } catch (e) {
      return null;
    }
  }, [lang]);
}

// I bonus permanenti non sono indicizzati per specie ma per capostipite della
// linea evolutiva (getLineTotalBuff usa getEvoLineRoot): serve quindi chiedere
// al gioco la radice, altrimenti si scriverebbe su una chiave che non legge.
export function evoLineRoots(speciesIds) {
  return execInMain((ids) => {
    try {
      if (typeof getEvoLineRoot !== 'function') return null;
      const out = {};
      ids.forEach(id => { out[id] = getEvoLineRoot(id); });
      return out;
    } catch (e) {
      return null;
    }
  }, [speciesIds]);
}

// Gli starter selezionabili non vengono piu' da poke_used_starters ma da
// poke_hof_index, l'indice che il gioco ricava dalla Hall of Fame e dalle uova
// (showStarterSelect): i non leggendari da evoLineRoots, i leggendari solo da
// eggLegendaries, le varianti shiny da shinySpecies / eggLegendaryShinies.
// Si replica recordEggHatch in una sola scrittura. L'indice si ottiene da
// getHofIndex(), che se manca lo ricostruisce dalla Hall of Fame: scriverne uno
// da zero lo renderebbe "pronto" e il gioco non recupererebbe piu' quegli sblocchi.
export function unlockHofSpecies(speciesIds, shiny, legendaryFallback) {
  return execInMain((ids, shiny, legendaryFallback) => {
    try {
      if (typeof getHofIndex !== 'function') return null;
      const idx = getHofIndex();
      if (!idx || !Array.isArray(idx.evoLineRoots) || !Array.isArray(idx.starterRuns)) return null;
      const root = (id) => (typeof getEvoLineRoot === 'function' ? getEvoLineRoot(id) : id);
      const legendary = typeof LEGENDARY_ID_SET !== 'undefined'
        ? (id) => LEGENDARY_ID_SET.has(id)
        : (id) => legendaryFallback.includes(id);
      const lists = {};
      ['evoLineRoots', 'shinySpecies', 'eggLegendaries', 'eggLegendaryShinies'].forEach(k => {
        lists[k] = new Set(Array.isArray(idx[k]) ? idx[k] : []);
      });
      ids.forEach(id => {
        const r = root(id);
        if (legendary(r)) {
          lists.eggLegendaries.add(r);
          if (shiny) lists.eggLegendaryShinies.add(r);
        } else {
          lists.evoLineRoots.add(r);
          if (shiny) lists.shinySpecies.add(r);
        }
      });
      Object.keys(lists).forEach(k => { idx[k] = [...lists[k]]; });
      localStorage.setItem('poke_hof_index', JSON.stringify(idx));
      return true;
    } catch (e) {
      return null;
    }
  }, [speciesIds, !!shiny, legendaryFallback || []]);
}

// shinySpecies e' la lista delle specie shiny entrate in Hall of Fame: il gioco
// la usa (per capostipite) per offrire lo starter shiny e per i segni shiny di
// Hall of Fame e PC. Qui si aggiungono gli id cosi' come sono, non le radici,
// cosi' che ogni specie del Dex risulti presente.
export function addHofShinySpecies(speciesIds) {
  return execInMain((ids) => {
    try {
      if (typeof getHofIndex !== 'function') return null;
      const idx = getHofIndex();
      if (!idx || !Array.isArray(idx.evoLineRoots) || !Array.isArray(idx.starterRuns)) return null;
      const shiny = new Set(Array.isArray(idx.shinySpecies) ? idx.shinySpecies : []);
      ids.forEach(id => shiny.add(id));
      idx.shinySpecies = [...shiny].sort((a, b) => a - b);
      localStorage.setItem('poke_hof_index', JSON.stringify(idx));
      return true;
    } catch (e) {
      return null;
    }
  }, [speciesIds]);
}

// Tutte le chiavi di gioco: e' l'insieme che compone un salvataggio completo.
export function readFullSave() {
  return execInPage(() => {
    const res = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('poke_') || k.startsWith('pkrl_')) res[k] = localStorage.getItem(k);
    }
    return res;
  });
}

// Riporta il salvataggio esattamente allo stato del backup: non basta
// riscrivere le chiavi salvate, vanno anche rimosse quelle nate dopo, altrimenti
// resterebbero progressi piu' recenti mescolati a quelli ripristinati.
export function writeFullSave(entries) {
  return execInPage((entries) => {
    const keep = new Set(Object.keys(entries));
    const stale = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if ((k.startsWith('poke_') || k.startsWith('pkrl_')) && !keep.has(k)) stale.push(k);
    }
    stale.forEach(k => localStorage.removeItem(k));
    Object.keys(entries).forEach(k => localStorage.setItem(k, entries[k]));
    return { restored: keep.size, removed: stale.length };
  }, [entries]);
}

export function readSaveKeys(keys) {
  return execInPage((keys) => {
    const out = {};
    keys.forEach(k => { out[k] = localStorage.getItem(k); });
    return out;
  }, [keys]);
}

export function writeSaveKeys(entries) {
  return execInPage((entries) => {
    Object.keys(entries).forEach(k => localStorage.setItem(k, entries[k]));
    return true;
  }, [entries]);
}

// ── Tratti della Torre ───────────────────────────────────────────────────
// I tratti NON sono un dato salvato: il gioco li ricalcola dalla squadra a
// ogni lotta (computeTraitTiers -> endlessState.traitTiers), quindi
// endlessState.traitTiers e' solo una cache per l'HUD. Qui si legge il
// catalogo delle descrizioni, tier per tier, tradotto come per i passivi:
// I18N[lingua].traits[Tipo] e' un array lungo TRAIT_MAX_TIER.
export function readTraitCatalog(lang) {
  return execInMain((lang) => {
    try {
      if (typeof TRAIT_DESCRIPTIONS === 'undefined' || !TRAIT_DESCRIPTIONS) return null;
      const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
      const localized = (code, type) => {
        const traits = dict && dict[code] && dict[code].traits;
        const arr = traits && traits[type];
        return Array.isArray(arr) ? arr : null;
      };
      const maxTier = typeof TRAIT_MAX_TIER === 'number' ? TRAIT_MAX_TIER : 12;
      const types = {};
      Object.keys(TRAIT_DESCRIPTIONS).forEach(type => {
        const en = TRAIT_DESCRIPTIONS[type];
        if (!Array.isArray(en)) return;
        const loc = localized(lang, type) || localized('en', type);
        types[type] = en.map((fallback, i) => (loc && loc[i] != null ? loc[i] : fallback));
      });
      return { maxTier, types };
    } catch (e) {
      return null;
    }
  }, [lang]);
}

// Scrive nella cache dei tier della Torre, per allineare subito l'HUD dopo
// aver cambiato la squadra. Il gioco la rifara' comunque alla lotta seguente.
export function writeTraitTiersCache(tiers) {
  return execInPage((tiers) => {
    const raw = localStorage.getItem('poke_endless_state');
    if (!raw) return false;
    try {
      const state = JSON.parse(raw);
      state.traitTiers = tiers;
      localStorage.setItem('poke_endless_state', JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }, [tiers]);
}

// ── Ricompense degli obiettivi ───────────────────────────────────────────
// Il gioco sa da solo quali obiettivi pagano e quanto (achReward tiene conto
// di ACH_REWARD_OVERRIDE e delle categorie): si usano le sue funzioni invece
// di duplicare quella tabella qui dentro.
export function readAchRewards() {
  return execInMain(() => {
    try {
      if (typeof countClaimableAchRewards !== 'function') return null;
      const info = countClaimableAchRewards();
      return { count: info.count || 0, total: info.total || 0 };
    } catch (e) {
      return null;
    }
  });
}

export function claimAchRewards() {
  return execInMain(() => {
    try {
      if (typeof claimAllAchRewards !== 'function') return null;
      return { paid: claimAllAchRewards() || 0 };
    } catch (e) {
      return null;
    }
  });
}

// ── Sfide monotipo, settimanali e giornaliere ────────────────────────────
// Tutte finiscono nella stessa chiave poke_challenges_done, ognuna con il
// proprio id: monotype:<Tipo>, weekly:<id>:<sub>, daily:<Tipo>.
// Della settimanale il gioco tiene traccia solo di quella corrente
// (_loadWeekly azzera lo stato se l'id non coincide).
export function readChallengeExtras(lang) {
  return execInMain((lang) => {
    const pick = (fn) => { try { return fn(); } catch (e) { return null; } };
    const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
    const typeLabel = (type) => {
      const types = dict && dict[lang] && dict[lang].types;
      return (types && types[type]) || type;
    };
    const everyLang = dict ? Object.keys(dict) : [];
    // Il nome del tipo in ogni lingua, per la ricerca.
    const typeAliases = (type) => everyLang
      .map(code => dict[code] && dict[code].types && dict[code].types[type])
      .filter(v => typeof v === 'string' && v);

    const monoTypes = pick(() => MONOTYPE_TYPES);
    const dailyTypes = pick(() => DAILY_CHALLENGE_TYPES);
    const weekly = pick(() => (typeof getCurrentWeeklyChallenge === 'function'
      ? getCurrentWeeklyChallenge() : null));
    const dayNumber = pick(() => (typeof _dailyDayNumber === 'function' ? _dailyDayNumber() : null));
    const todayType = pick(() => (typeof getDailyChallengeType === 'function'
      ? getDailyChallengeType() : null));

    return {
      monotype: Array.isArray(monoTypes)
        ? monoTypes.map(type => ({
            id: 'monotype:' + type, type, label: typeLabel(type),
            search: [type, ...typeAliases(type)]
          }))
        : null,
      daily: Array.isArray(dailyTypes)
        ? dailyTypes.map(type => ({
            id: 'daily:' + type, type, label: typeLabel(type),
            search: [type, ...typeAliases(type)]
          }))
        : null,
      todayType: todayType || null,
      dayNumber: typeof dayNumber === 'number' ? dayNumber : null,
      weekly: weekly && weekly.id
        ? {
            id: weekly.id,
            name: weekly.name || weekly.id,
            subs: (Array.isArray(weekly.subs) ? weekly.subs : [])
              .filter(s => s && s.id)
              .map(s => ({
                subId: s.id,
                id: 'weekly:' + weekly.id + ':' + s.id,
                name: s.name || s.id,
                tier: s.tier || ''
              }))
          }
        : null
    };
  }, [lang]);
}

// Stato della Torre: serve all'editor della mappa per sapere a che mappa
// globale siamo (regione e posizione dentro la regione).
export function readEndlessState() {
  return execInPage(() => {
    const raw = localStorage.getItem('poke_endless_state');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  });
}

// ── Forme Mega senza pietra ──────────────────────────────────────────────
// Nei dati del gioco ci sono forme Mega che nessuna pietra sblocca (la X di
// Charizard, per dirne una). syncMegaForm pero' legge tutto dall'oggetto
// tenuto — megaSpecies, megaStats, megaTypes, megaSprite, megaName — e non
// dal catalogo MEGA_STONES: un oggetto costruito con i dati di quella forma
// funziona davvero. L'unica cosa che manca e' l'abilita' Mega, che il gioco
// cerca in MEGA_ABILITY_BY_STONE per id.
export function readExtraMegaForms() {
  return execInMain(() => {
    const load = () => {
      if (typeof window !== 'undefined' && window.__POKEDEX__) return Promise.resolve(window.__POKEDEX__);
      if (typeof loadStaticPokedex === 'function') return Promise.resolve(loadStaticPokedex());
      return Promise.resolve(null);
    };
    return load().then(dex => {
      if (!dex) return null;
      const stones = (typeof MEGA_STONES !== 'undefined' && Array.isArray(MEGA_STONES)) ? MEGA_STONES : [];
      const takenSlugs = new Set(stones.map(s => (s.slug || '').toLowerCase()).filter(Boolean));

      // nome base -> id della specie, per risalire dalla forma al Pokemon
      const baseIdByName = {};
      Object.keys(dex).forEach(key => {
        const id = Number(key);
        if (!Number.isFinite(id) || id > 10000) return;
        const name = (dex[key] && dex[key].name || '').toLowerCase();
        if (name) baseIdByName[name] = id;
      });

      const out = [];
      Object.keys(dex).forEach(key => {
        const formId = Number(key);
        const entry = dex[key];
        if (!Number.isFinite(formId) || formId < 10000 || !entry) return;
        const slug = (entry.name || '').toLowerCase();
        if (!slug.includes('-mega') || takenSlugs.has(slug)) return;

        const baseName = slug.split('-mega')[0];
        const species = baseIdByName[baseName];
        if (!species) return;

        // "charizard-mega-x" -> "Mega Charizard X"
        const suffix = slug.endsWith('-x') ? ' X' : (slug.endsWith('-y') ? ' Y' : '');
        const pretty = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        const megaName = 'Mega ' + pretty + suffix;

        // Se la specie ha gia' una pietra gemella (Charizardite Y) si riusa il
        // suo nome cambiando la lettera: e' come la chiamerebbe il gioco.
        const twin = stones.find(s => s.species === species);
        let id = slug + '-stone';
        let name = megaName + ' Stone';
        if (twin && suffix && /\s[XY]$/.test(twin.name || '')) {
          name = twin.name.slice(0, -1) + suffix.trim();
          id = (twin.id || '').replace(/-[xy]$/, '') + suffix.toLowerCase().trim().replace(/^/, '-');
        }

        out.push({
          id, name, megaName, species, formId,
          megaTypes: Array.isArray(entry.types) ? entry.types : [],
          megaStats: entry.baseStats || null,
          slug
        });
      });
      return out.filter(d => d.megaStats && d.megaTypes.length);
    }).catch(() => null);
  });
}

// Costruisce l'oggetto con il costruttore del gioco, ma partendo da una
// definizione nostra: cosi' i campi sono esattamente quelli che syncMegaForm
// si aspetta, anche se un domani cambiassero.
export function buildMegaStoneItemFromDef(def) {
  return execInMain((def) => {
    try {
      if (typeof makeMegaStoneItem !== 'function') return null;
      return makeMegaStoneItem(def);
    } catch (e) {
      return null;
    }
  }, [def]);
}

// ── Alias per la ricerca ─────────────────────────────────────────────────
// Il gioco traduce strumenti e specie in sette lingue. Raccogliendo tutti i
// nomi di ogni voce, la casella di ricerca dell'estensione trova quello che
// l'utente scrive anche se non e' la lingua in cui sta guardando l'interfaccia.

// id dello strumento -> nomi in tutte le lingue. Copre anche le megapietre,
// che per il gioco sono strumenti come gli altri.
export function readItemAliases() {
  return execInMain(() => {
    try {
      const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
      if (!dict) return null;
      const out = {};
      Object.keys(dict).forEach(code => {
        const names = dict[code] && dict[code].items && dict[code].items.name;
        if (!names) return;
        Object.keys(names).forEach(id => {
          const v = names[id];
          if (typeof v !== 'string' || !v) return;
          (out[id] = out[id] || []).push(v);
        });
      });
      return out;
    } catch (e) {
      return null;
    }
  });
}

// nome inglese della specie -> nomi in tutte le lingue. Il dizionario del gioco
// e' indicizzato cosi' (tSpecies riceve il nome, non l'id), quindi la mappa
// resta nella stessa forma e chi la usa converte l'id in nome.
export function readSpeciesAliases() {
  return execInMain(() => {
    try {
      const dict = (typeof I18N === 'object' && I18N) ? I18N : (window.I18N || null);
      if (!dict) return null;
      const out = {};
      Object.keys(dict).forEach(code => {
        const species = dict[code] && dict[code].species;
        if (!species) return;
        Object.keys(species).forEach(name => {
          const v = species[name];
          if (typeof v !== 'string' || !v) return;
          (out[name] = out[name] || []).push(v);
        });
      });
      return out;
    } catch (e) {
      return null;
    }
  });
}

// ── Tratti forzati ───────────────────────────────────────────────────────
// I tier dei tratti non si possono imporre dal salvataggio: il gioco li
// ricalcola dalla squadra prima di ogni lotta. L'unico modo e' far girare
// nella pagina uno script che avvolge computeTraitTiers (src/force-traits.js).
// Lo script resta registrato finche' l'utente non lo spegne, perche' deve
// esserci a ogni caricamento della pagina, e legge i valori da una chiave del
// localStorage che non comincia per poke_ o pkrl_, cosi' resta fuori dai
// backup e dalla sincronizzazione del gioco.
const FORCE_TRAITS_SCRIPT_ID = 'pokelike-editor-force-traits';
const FORCED_TRAITS_KEY = 'pkeditor_forced_traits';

export function readForcedTraits() {
  return execInPage((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const cfg = JSON.parse(raw);
      return (cfg && typeof cfg === 'object') ? cfg : null;
    } catch (e) {
      return null;
    }
  }, [FORCED_TRAITS_KEY]);
}

export function writeForcedTraits(config) {
  return execInPage((key, config) => {
    if (!config) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(config));
    return true;
  }, [FORCED_TRAITS_KEY, config]);
}

export async function isForceTraitsRegistered() {
  try {
    const list = await chrome.scripting.getRegisteredContentScripts({ ids: [FORCE_TRAITS_SCRIPT_ID] });
    return Array.isArray(list) && list.length > 0;
  } catch (e) {
    return false;
  }
}

export async function registerForceTraits() {
  if (await isForceTraitsRegistered()) return true;
  await chrome.scripting.registerContentScripts([{
    id: FORCE_TRAITS_SCRIPT_ID,
    matches: ['https://pokelike.xyz/*'],
    js: ['src/force-traits.js'],
    runAt: 'document_start',
    world: 'MAIN',
    allFrames: false
  }]);
  return true;
}

export async function unregisterForceTraits() {
  try {
    await chrome.scripting.unregisterContentScripts({ ids: [FORCE_TRAITS_SCRIPT_ID] });
  } catch (e) {
    // Non era registrato: va bene cosi'.
  }
  return true;
}
