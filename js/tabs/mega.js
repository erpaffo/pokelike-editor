import { currentStats, autoSave, speciesSearchTerms } from '../state.js';
import { setStatus, esc } from '../ui.js';
import { MEGA_UNLOCKS, baseFormStarters, legendaryStarters } from '../constants.js';
import {
  readGameCatalog, readSaveKeys, writeSaveKeys,
  readChallengeExtras, readAchRewards, claimAchRewards, unlockHofSpecies, addHofShinySpecies
} from '../page.js';
import { t, getLanguage } from '../i18n.js';
import { filterBySearch, searchBoxHtml, bindSearchBox, searchTerms } from '../search.js';

const DEX_REGIONS = {
  ALL: [1, 721],
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721]
};

const SAVE_KEYS = [
  'poke_achievements', 'poke_dex', 'poke_shiny_dex', 'poke_pokedex',
  'poke_hof_index', 'poke_challenges_done', 'poke_daily', 'poke_weekly'
];

// Catalogo letto dal gioco stesso: resta allineato agli aggiornamenti e non
// duplica nessun dato del gioco dentro l'estensione.
let catalog = { achievements: null, challenges: null, storyCounters: null };
// Sfide monotipo, settimanali e giornaliere: non stanno in CHALLENGES ma
// finiscono nella stessa chiave poke_challenges_done, con id propri.
let extras = { monotype: null, weekly: null, daily: null, todayType: null, dayNumber: null };
// {count, total} delle ricompense obiettivo ancora da riscuotere, secondo il
// gioco stesso.
let rewards = null;
let save = {};
let loadError = '';

// Testo cercato nelle due griglie lunghe: un centinaio di obiettivi e una
// cinquantina di sfide sono troppi da scorrere a occhio.
let achQuery = '';
let chalQuery = '';
let megaQuery = '';

const parse = (raw, fallback) => {
  try { return JSON.parse(raw) ?? fallback; } catch (e) { return fallback; }
};

function megaProgress() {
  const mvp = (currentStats && currentStats.mvpCounts) || {};
  const names = Object.keys(MEGA_UNLOCKS);
  const done = names.filter(n => (mvp[MEGA_UNLOCKS[n].baseId] || 0) >= MEGA_UNLOCKS[n].req);
  return { done: done.length, total: names.length };
}

// Tutte le famiglie di sfide, ognuna con i propri id. Il gioco le registra
// tutte in poke_challenges_done: le base con il proprio id, le monotipo come
// "monotype:<Tipo>", le settimanali come "weekly:<id>:<sub>" e le giornaliere
// come "daily:<Tipo>".
function challengeGroups() {
  const groups = [];
  if (catalog.challenges?.length) {
    groups.push({
      key: 'base', label: t('chal.base'),
      items: catalog.challenges.map(c => ({ id: c.id, label: c.name }))
    });
  }
  if (extras.monotype?.length) {
    groups.push({
      key: 'monotype', label: t('chal.monotype'),
      items: extras.monotype.map(m => ({ id: m.id, label: m.label }))
    });
  }
  if (extras.weekly?.subs?.length) {
    groups.push({
      key: 'weekly', label: t('chal.weekly', { name: extras.weekly.name }),
      items: extras.weekly.subs.map(sub => ({
        id: sub.id, label: sub.tier ? `${sub.name} · ${sub.tier}` : sub.name, subId: sub.subId
      }))
    });
  }
  if (extras.daily?.length) {
    groups.push({
      key: 'daily', label: t('chal.daily'),
      items: extras.daily.map(d => ({
        id: d.id, label: d.label, type: d.type, today: d.type === extras.todayType
      }))
    });
  }
  return groups;
}

function allChallengeIds() {
  return challengeGroups().flatMap(g => g.items.map(i => i.id));
}

function buildGoals() {
  const achList = catalog.achievements || [];
  const unlockedAch = parse(save.poke_achievements, []);
  const dex = parse(save.poke_dex, {});
  const shinyDex = parse(save.poke_shiny_dex, {});
  const hof = parse(save.poke_hof_index, {});
  const challengesDone = parse(save.poke_challenges_done, []);
  const chalList = catalog.challenges || [];
  const everyChallenge = allChallengeIds();
  const mega = megaProgress();

  // Stesse liste che showStarterSelect usa per decidere chi e' selezionabile.
  const starterSet = new Set([...(hof.evoLineRoots || []), ...(hof.shinySpecies || [])]);
  const legendSet = new Set(hof.eggLegendaries || []);

  return [
    {
      key: 'ach', label: t('goal.ach'),
      done: achList.length ? unlockedAch.filter(id => achList.some(a => a.id === id)).length : unlockedAch.length,
      total: achList.length || null,
      note: achList.length ? '' : t('unlocks.catalogUnavailable'),
      action: 'unlockAch', actionLabel: t('common.unlock')
    },
    {
      key: 'dex', label: t('goal.dex'),
      done: Object.keys(dex).length, total: 721,
      action: 'dex', actionLabel: t('common.complete')
    },
    {
      key: 'shiny', label: t('goal.shiny'),
      done: Object.keys(shinyDex).length, total: 721,
      action: 'shinyDex', actionLabel: t('common.complete')
    },
    {
      key: 'mega', label: t('goal.mega'),
      done: mega.done, total: mega.total,
      action: 'megaAll', actionLabel: t('common.unlock')
    },
    {
      key: 'starters', label: t('goal.starters'),
      done: baseFormStarters.filter(id => starterSet.has(id)).length,
      total: baseFormStarters.length,
      action: 'starters', actionLabel: t('common.unlock')
    },
    {
      key: 'legend', label: t('goal.legend'),
      done: legendaryStarters.filter(id => legendSet.has(id)).length,
      total: legendaryStarters.length,
      action: 'legendaries', actionLabel: t('common.unlock')
    },
    {
      // Conta base + monotipo + settimanali + giornaliere: fermarsi alle base
      // faceva sembrare completo un platino che non lo era.
      key: 'chal', label: t('goal.chal'),
      done: everyChallenge.length
        ? challengesDone.filter(id => everyChallenge.includes(id)).length
        : challengesDone.length,
      total: everyChallenge.length || null,
      note: everyChallenge.length ? '' : t('unlocks.catalogUnavailable'),
      action: everyChallenge.length ? 'challenges' : null, actionLabel: t('common.complete')
    }
  ];
}

function goalHtml(g) {
  const known = g.total != null;
  const pct = known && g.total ? Math.min(100, Math.round((g.done / g.total) * 100)) : 0;
  const complete = known && g.done >= g.total;
  const value = known ? `${g.done} / ${g.total}` : t('goal.unlocked', { n: g.done });
  return `
    <div class="goal ${complete ? 'done' : ''}">
      <div class="goal-main">
        <div class="goal-label">${g.label} ${complete ? '<span style="color:var(--gold)">✔</span>' : ''}</div>
        <div class="goal-value">${value}${g.note ? ` · <em style="color:var(--red-light)">${g.note}</em>` : ''}</div>
        ${known ? `<div class="goal-bar"><i style="width:${pct}%"></i></div>` : ''}
      </div>
      <div class="goal-actions">
        ${g.action && !complete
          ? `<button class="btn btn-accent btn-sm" data-goal="${g.action}">${g.actionLabel}</button>`
          : ''}
      </div>
    </div>`;
}

function achievementGridHtml() {
  const list = catalog.achievements;
  if (!list || !list.length) return '';
  const unlocked = new Set(parse(save.poke_achievements, []));
  // `search` porta nome e descrizione in tutte le lingue del gioco.
  const shown = filterBySearch(list, achQuery,
    a => searchTerms(a.name, a.desc, a.id, a.search));
  const chips = shown.map(a => `
    <div class="ach-chip ${unlocked.has(a.id) ? 'unlocked' : ''}" data-ach="${esc(a.id)}"
         role="button" tabindex="0" style="cursor:pointer;"
         title="${esc(a.name + (a.desc ? ' — ' + a.desc : '') + ' · ' + t('unlocks.achToggleHint'))}">
      <b>${a.icon && !a.icon.includes(':') ? esc(a.icon) : '🏅'}</b>${esc(a.name)}
    </div>`).join('');
  return `
    <div class="section">
      <div class="section-title">${t('unlocks.achTitle', { n: unlocked.size, m: list.length })}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">${t('unlocks.achToggleHint')}</p>
      ${searchBoxHtml('achSearch', t('search.achievements'), achQuery)}
      ${shown.length
        ? `<div class="ach-grid">${chips}</div>`
        : `<p style="font-size:11px; color:var(--text-muted);">${t('search.noResults', { q: achQuery })}</p>`}
    </div>`;
}

// Le ricompense degli obiettivi non si riscuotono da sole: il gioco le tiene
// in sospeso finche' non le incassi dalla sua schermata. Qui si mostra quanto
// c'e' da prendere e si chiama la funzione del gioco.
function rewardsHtml() {
  if (!rewards) return '';
  const none = !rewards.count;
  return `
    <div class="section">
      <div class="section-title">${t('rewards.title')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">${t('rewards.hint')}</p>
      <div class="goal ${none ? 'done' : ''}">
        <div class="goal-main">
          <div class="goal-label">${t('rewards.pending')}</div>
          <div class="goal-value">${
            none ? t('rewards.nothing') : t('rewards.amount', {
              n: rewards.count, m: rewards.total.toLocaleString()
            })
          }</div>
        </div>
        <div class="goal-actions">
          <button class="btn btn-gold btn-sm" id="btnClaimRewards" ${none ? 'disabled' : ''}>
            ${t('rewards.claim')}
          </button>
        </div>
      </div>
    </div>`;
}

function challengesHtml() {
  const groups = challengeGroups();
  if (!groups.length) return '';
  const done = new Set(parse(save.poke_challenges_done, []));

  const blocks = groups.map(g => {
    const visible = filterBySearch(g.items, chalQuery,
      item => searchTerms(item.label, item.id, item.type, item.subId, item.search));
    const chips = visible.map(item => `
      <div class="ach-chip ${done.has(item.id) ? 'unlocked' : ''}" data-chal="${esc(item.id)}"
           role="button" tabindex="0" style="cursor:pointer;"
           title="${esc(item.id)}">
        <b>${item.today ? '📅' : '🎯'}</b>${esc(item.label)}
      </div>`).join('');
    const missing = g.items.filter(i => !done.has(i.id)).length;
    // Un gruppo senza risultati sparisce: lasciarlo vuoto darebbe l'idea che
    // quelle sfide non esistano.
    if (!visible.length) return '';
    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
          <span style="font-size:11px; font-weight:600; color:var(--gold);">
            ${esc(g.label)} · ${g.items.length - missing}/${g.items.length}
          </span>
          <button class="btn btn-accent btn-sm" data-chal-group="${g.key}" ${missing ? '' : 'disabled'}>
            ${missing ? t('chal.completeGroup', { n: missing }) : t('chal.groupDone')}
          </button>
        </div>
        <div class="ach-grid">${chips}</div>
      </div>`;
  }).join('');

  return `
    <div class="section">
      <div class="section-title">${t('chal.title')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">${t('chal.hint')}</p>
      ${searchBoxHtml('chalSearch', t('search.challenges'), chalQuery)}
      ${blocks.trim()
        ? blocks
        : `<p style="font-size:11px; color:var(--text-muted);">${t('search.noResults', { q: chalQuery })}</p>`}
    </div>`;
}

function paint() {
  const el = document.getElementById('contentMega');
  if (!el) return;

  const goals = buildGoals();
  const allDone = goals.every(g => g.total != null && g.done >= g.total);

  el.innerHTML = `
    <div class="section">
      <div class="section-title" style="color: var(--gold);">${t('unlocks.platinum')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:6px;">
        ${t('unlocks.platinumHint')}
      </p>
      ${loadError ? `<p style="font-size:11px; color:var(--red-light);">${esc(loadError)}</p>` : ''}
      ${goals.map(goalHtml).join('')}
      <button class="btn btn-gold w-100" id="btnPlatinum" style="margin-top:14px;" ${allDone ? 'disabled' : ''}>
        ${allDone ? t('unlocks.platinumDone') : t('unlocks.platinumAll')}
      </button>
      <p style="font-size:10px; color:var(--text-muted); margin-top:8px;">
        ${t('unlocks.reloadHint')}
      </p>
    </div>

    ${rewardsHtml()}

    ${challengesHtml()}

    ${achievementGridHtml()}

    <div class="section">
      <div class="section-title">${t('unlocks.megaTitle')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
        ${t('unlocks.megaHint')}
      </p>
      ${searchBoxHtml('megaUnlockSearch', t('search.megas'), megaQuery)}
      <div class="field-row">
        <select id="megaUnlockSelect" class="field-input" style="flex:1; min-width:0;"></select>
        <button class="btn btn-accent" id="btnUnlockSingleMega">${t('common.unlock')}</button>
      </div>
      <button class="btn btn-primary w-100" id="btnUnlockAllMegas" style="margin-top:10px;">
        ${t('unlocks.megaAll')}
      </button>
    </div>

    <div class="section">
      <div class="section-title">${t('unlocks.dexRegion')}</div>
      <div class="field-row">
        <select id="dexRegionSelect" class="field-input" style="flex:1; min-width:0;">
          <option value="ALL">${t('unlocks.allRegions')}</option>
          <option value="1">Kanto (Gen 1)</option>
          <option value="2">Johto (Gen 2)</option>
          <option value="3">Hoenn (Gen 3)</option>
          <option value="4">Sinnoh (Gen 4)</option>
          <option value="5">Unova (Gen 5)</option>
          <option value="6">Kalos (Gen 6)</option>
        </select>
      </div>
      <div class="field-row">
        <button class="btn btn-primary" id="btnCompleteDex" style="flex:1;">${t('goal.dex')}</button>
        <button class="btn btn-accent" id="btnCompleteShinyDex" style="flex:1;">${t('goal.shiny')}</button>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${t('unlocks.startersTitle')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px;">
        ${t('unlocks.startersHint')}
      </p>
      <button class="btn btn-accent w-100" id="btnUnlockAllStarters">${t('unlocks.allStarters')}</button>
      <button class="btn btn-accent w-100" id="btnUnlockLegendaries" style="margin-top:8px;">${t('unlocks.legendaries')}</button>
      <button class="btn btn-accent w-100" id="btnUnlockLegendariesShiny" style="margin-top:8px;">${t('unlocks.legendariesShiny')}</button>
    </div>
  `;

  const sel = document.getElementById('megaUnlockSelect');
  if (sel) {
    const names = filterBySearch(Object.keys(MEGA_UNLOCKS), megaQuery,
      k => searchTerms(k, speciesSearchTerms(MEGA_UNLOCKS[k].baseId)));
    sel.innerHTML = names.length
      ? names.map(k => `<option value="${k}">${t('unlocks.megaReq', { name: k, n: MEGA_UNLOCKS[k].req })}</option>`).join('')
      : `<option value="">${t('search.noResults', { q: megaQuery })}</option>`;
    sel.disabled = !names.length;
  }

  bindUnlockActions();
}

// Rilegge il salvataggio a ogni apertura della scheda: i progressi possono
// essere cambiati nel gioco da quando il popup e' stato aperto.
export async function renderMega() {
  paint();
  try {
    save = await readSaveKeys(SAVE_KEYS);
    loadError = '';
  } catch (e) {
    loadError = e.message;
  }
  // Le ricompense le calcola il gioco: vanno rilette dopo ogni scrittura,
  // perche' sbloccare un obiettivo ne rende esigibile il premio.
  rewards = await readAchRewards().catch(() => null);
  paint();
}

const refresh = renderMega;

// ── Azioni ───────────────────────────────────────────────────────────────

async function grantAchievements() {
  const list = catalog.achievements;
  if (!list || !list.length) throw new Error(t('unlocks.achCatalogMissing'));
  const current = new Set(parse(save.poke_achievements, []));
  list.forEach(a => current.add(a.id));
  await writeSaveKeys({ poke_achievements: JSON.stringify([...current]) });
  return list.length;
}

async function grantChallenges() {
  const ids = allChallengeIds();
  if (!ids.length) throw new Error(t('unlocks.chalCatalogMissing'));
  await setChallenges(ids, true);
  return ids.length;
}

// Scrive un gruppo di sfide come completate (o non completate).
//
// Oltre a poke_challenges_done vanno tenute allineate due chiavi che il gioco
// legge a parte: poke_weekly (le prove della settimanale in corso) e
// poke_daily (il giorno piu' avanzato completato). Senza, la schermata delle
// sfide continuerebbe a mostrarle da fare.
async function setChallenges(ids, on) {
  const current = new Set(parse(save.poke_challenges_done, []));
  ids.forEach(id => { if (on) current.add(id); else current.delete(id); });
  const entries = { poke_challenges_done: JSON.stringify([...current]) };

  const weekly = extras.weekly;
  if (weekly) {
    const subsById = new Map(weekly.subs.map(sub => [sub.id, sub.subId]));
    const touched = ids.filter(id => subsById.has(id));
    if (touched.length) {
      const stored = parse(save.poke_weekly, null);
      const state = (stored && stored.id === weekly.id && stored.subs && typeof stored.subs === 'object')
        ? stored
        : { id: weekly.id, subs: {} };
      touched.forEach(id => {
        const subId = subsById.get(id);
        if (on) state.subs[subId] = 1; else delete state.subs[subId];
      });
      entries.poke_weekly = JSON.stringify(state);
    }
  }

  const today = extras.todayType ? 'daily:' + extras.todayType : null;
  if (today && ids.includes(today) && extras.dayNumber != null) {
    const stored = parse(save.poke_daily, null) || {};
    if (on) {
      const day = Math.max(stored.day || 0, extras.dayNumber);
      entries.poke_daily = JSON.stringify({
        day,
        cleared: true,
        maxClearedDay: Math.max(stored.maxClearedDay || 0, extras.dayNumber)
      });
    } else if ((stored.maxClearedDay || 0) >= extras.dayNumber) {
      entries.poke_daily = JSON.stringify({
        day: stored.day || 0,
        cleared: false,
        maxClearedDay: extras.dayNumber - 1
      });
    }
  }

  await writeSaveKeys(entries);
}

async function toggleAchievement(id) {
  const current = new Set(parse(save.poke_achievements, []));
  const on = !current.has(id);
  if (on) current.add(id); else current.delete(id);
  await writeSaveKeys({ poke_achievements: JSON.stringify([...current]) });
  return on;
}

// Ogni contatore punta a una chiave poke_ct_* del salvataggio. Il nome del
// campo che la contiene non e' garantito, quindi si cerca il primo valore che
// somigli a una chiave di salvataggio.
async function maxStoryCounters() {
  const counters = catalog.storyCounters;
  if (!counters) return 0;
  const keys = Object.values(counters)
    .map(c => c && Object.values(c).find(v => typeof v === 'string' && v.startsWith('poke_')))
    .filter(Boolean);
  if (!keys.length) return 0;
  const entries = {};
  keys.forEach(k => { entries[k] = '9999'; });
  await writeSaveKeys(entries);
  return keys.length;
}

async function writeDex(from, to, shinyOnly) {
  const current = await readSaveKeys(['poke_pokedex', 'poke_dex', 'poke_shiny_dex']);
  const pokedex = parse(current.poke_pokedex, {});
  const dex = parse(current.poke_dex, {});
  const shinyDex = parse(current.poke_shiny_dex, {});

  for (let i = from; i <= to; i++) {
    pokedex[i] = { ...(pokedex[i] || {}), caught: true, seen: true };
    dex[i] = 1;
    if (shinyOnly) shinyDex[i] = 1;
  }

  const entries = {
    poke_pokedex: JSON.stringify(pokedex),
    poke_dex: JSON.stringify(dex)
  };
  if (shinyOnly) entries.poke_shiny_dex = JSON.stringify(shinyDex);
  await writeSaveKeys(entries);

  if (shinyOnly) {
    const ids = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    if (!await addHofShinySpecies(ids)) throw new Error(t('unlocks.hofUnavailable'));
  }
}

async function addStarters(ids, alsoShiny) {
  if (!await unlockHofSpecies(ids, alsoShiny, legendaryStarters)) {
    throw new Error(t('unlocks.hofUnavailable'));
  }
  if (!alsoShiny) return;

  const current = await readSaveKeys(['poke_pokedex', 'poke_dex', 'poke_shiny_dex']);
  const pokedex = parse(current.poke_pokedex, {});
  const dex = parse(current.poke_dex, {});
  const shinyDex = parse(current.poke_shiny_dex, {});
  ids.forEach(id => {
    pokedex[id] = { ...(pokedex[id] || {}), caught: true, seen: true };
    dex[id] = 1;
    shinyDex[id] = 1;
  });
  await writeSaveKeys({
    poke_pokedex: JSON.stringify(pokedex),
    poke_dex: JSON.stringify(dex),
    poke_shiny_dex: JSON.stringify(shinyDex)
  });
}

function unlockAllMegas() {
  if (!currentStats) return false;
  if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
  Object.keys(MEGA_UNLOCKS).forEach(name => {
    const m = MEGA_UNLOCKS[name];
    currentStats.mvpCounts[m.baseId] = Math.max(currentStats.mvpCounts[m.baseId] || 0, m.req);
  });
  autoSave(false);
  return true;
}

const GOAL_ACTIONS = {
  unlockAch: async () => t('unlocks.achDone', { n: await grantAchievements() }),
  dex: async () => { await writeDex(1, 721, false); return t('unlocks.dexDone'); },
  shinyDex: async () => { await writeDex(1, 721, true); return t('unlocks.shinyDone'); },
  megaAll: async () => unlockAllMegas() ? t('unlocks.megaDone') : t('unlocks.noStats'),
  starters: async () => { await addStarters(baseFormStarters, false); return t('unlocks.startersDone'); },
  legendaries: async () => { await addStarters(legendaryStarters, false); return t('unlocks.legendDone'); },
  challenges: async () => t('unlocks.chalDone', { n: await grantChallenges() })
};

async function runAction(fn, busyLabel) {
  setStatus(busyLabel, '');
  try {
    const msg = await fn();
    await refresh();
    setStatus(msg, 'ok');
  } catch (e) {
    setStatus('❌ ' + e.message, 'err');
  }
}

function bindUnlockActions() {
  // Le caselle ridisegnano soltanto: i progressi non cambiano mentre si cerca,
  // e rileggere il salvataggio a ogni carattere sarebbe uno spreco.
  bindSearchBox('achSearch', (value) => { achQuery = value; paint(); });
  bindSearchBox('chalSearch', (value) => { chalQuery = value; paint(); });
  bindSearchBox('megaUnlockSearch', (value) => { megaQuery = value; paint(); });

  document.getElementById('btnClaimRewards')?.addEventListener('click', () => {
    runAction(async () => {
      const res = await claimAchRewards();
      if (!res) throw new Error(t('rewards.unavailable'));
      return t('rewards.claimed', { n: res.paid.toLocaleString() });
    }, t('unlocks.working'));
  });

  document.querySelectorAll('[data-chal]').forEach(chip => {
    const toggle = () => runAction(async () => {
      const id = chip.dataset.chal;
      const on = !chip.classList.contains('unlocked');
      await setChallenges([id], on);
      return t(on ? 'chal.marked' : 'chal.unmarked', { name: id });
    }, t('unlocks.working'));
    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  document.querySelectorAll('[data-chal-group]').forEach(btn => {
    btn.addEventListener('click', () => runAction(async () => {
      const group = challengeGroups().find(g => g.key === btn.dataset.chalGroup);
      if (!group) return '';
      const ids = group.items.map(i => i.id);
      await setChallenges(ids, true);
      return t('chal.groupCompleted', { name: group.label, n: ids.length });
    }, t('unlocks.working')));
  });

  document.querySelectorAll('[data-ach]').forEach(chip => {
    const toggle = () => runAction(async () => {
      const on = await toggleAchievement(chip.dataset.ach);
      return t(on ? 'unlocks.achOn' : 'unlocks.achOff', { name: chip.dataset.ach });
    }, t('unlocks.working'));
    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  document.querySelectorAll('[data-goal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = GOAL_ACTIONS[btn.dataset.goal];
      if (action) runAction(action, t('unlocks.working'));
    });
  });

  document.getElementById('btnPlatinum')?.addEventListener('click', () => {
    if (!confirm(t('unlocks.confirmPlatinum'))) return;
    runAction(async () => {
      const steps = [];
      await writeDex(1, 721, true);
      steps.push('dex');
      await addStarters(baseFormStarters, false);
      await addStarters(legendaryStarters, true);
      steps.push('starter');
      if (unlockAllMegas()) steps.push('mega');
      if (catalog.challenges?.length) { await grantChallenges(); steps.push('sfide'); }
      await maxStoryCounters();
      // Gli achievement vanno per ultimi: molti si valutano sui progressi
      // appena scritti sopra.
      save = await readSaveKeys(SAVE_KEYS);
      if (catalog.achievements?.length) { await grantAchievements(); steps.push('achievement'); }
      return t('unlocks.platinumDoneMsg', { steps: steps.join(', ') });
    }, t('unlocks.working'));
  });

  document.getElementById('btnUnlockSingleMega')?.addEventListener('click', () => {
    if (!currentStats) return setStatus(t('unlocks.noStats'), 'err');
    const name = document.getElementById('megaUnlockSelect').value;
    const m = MEGA_UNLOCKS[name];
    if (!m) return;
    if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
    currentStats.mvpCounts[m.baseId] = Math.max(currentStats.mvpCounts[m.baseId] || 0, m.req);
    autoSave(false);
    paint();
    setStatus(t('unlocks.megaOne', { name }), 'ok');
  });

  document.getElementById('btnUnlockAllMegas')?.addEventListener('click', () => {
    runAction(GOAL_ACTIONS.megaAll, t('unlocks.working'));
  });

  const dexRange = () => DEX_REGIONS[document.getElementById('dexRegionSelect')?.value] || DEX_REGIONS.ALL;

  document.getElementById('btnCompleteDex')?.addEventListener('click', () => {
    runAction(async () => {
      const [from, to] = dexRange();
      await writeDex(from, to, false);
      return t('unlocks.dexUpdated');
    }, t('unlocks.working'));
  });

  document.getElementById('btnCompleteShinyDex')?.addEventListener('click', () => {
    runAction(async () => {
      const [from, to] = dexRange();
      await writeDex(from, to, true);
      return t('unlocks.shinyUpdated');
    }, t('unlocks.working'));
  });

  document.getElementById('btnUnlockAllStarters')?.addEventListener('click', () => {
    runAction(GOAL_ACTIONS.starters, t('unlocks.working'));
  });

  document.getElementById('btnUnlockLegendaries')?.addEventListener('click', () => {
    runAction(GOAL_ACTIONS.legendaries, t('unlocks.working'));
  });

  document.getElementById('btnUnlockLegendariesShiny')?.addEventListener('click', () => {
    runAction(async () => {
      await addStarters(legendaryStarters, true);
      return t('unlocks.legendShinyDone');
    }, t('unlocks.working'));
  });
}

export function initMegaListeners() {
  Promise.all([
    readGameCatalog().catch(() => null),
    readChallengeExtras(getLanguage()).catch(() => null)
  ]).then(([c, x]) => {
    catalog = c || { achievements: null, challenges: null, storyCounters: null };
    extras = x || { monotype: null, weekly: null, daily: null, todayType: null, dayNumber: null };
  }).then(refresh);
}
