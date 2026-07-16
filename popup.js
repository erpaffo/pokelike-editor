// popup.js - ADVANCED Save Editor PRO

let currentRun = null;
let speciesList = [];
let allPokemon = [];
let selectedAddPokemon = null;
let searchQuery = '';
let currentPokedollars = 0;

// PRO License
let isPro = localStorage.getItem('pokelike_premium_unlocked') === 'true';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSpeciesData(id) {
  return POKEMON_STATS[id] || { hp:60, atk:75, def:65, speed:70, special:75, spdef:70, types:["Normal"] };
}

function getSprite(id, shiny = false) {
  const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  return shiny ? `${base}/shiny/${id}.png` : `${base}/${id}.png`;
}

function typeClass(t) { return 't-' + t.toLowerCase().replace(/[^a-z]/g, ''); }

function hpColor(pct) {
  if (pct > 50) return '#00e676';
  if (pct > 25) return '#ffd700';
  return '#ff4d6d';
}

function setStatus(text, type = '') {
  const el = document.getElementById('statusBar');
  if (!el) return;
  el.textContent = text;
  el.className = 'status ' + type;
}

function buildAllPokemon() {
  const map = {};
  speciesList.forEach(s => {
    if (!s.id) return;
    const clean = s.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
    map[s.id] = clean;
  });
  Object.keys(POKEMON_NAMES_FALLBACK).forEach(id => {
    if (!map[id]) map[id] = POKEMON_NAMES_FALLBACK[id];
  });
  Object.assign(POKEMON_NAMES, map);
  allPokemon = Object.keys(map)
    .map(id => ({ id: parseInt(id), name: map[id] }))
    .filter(p => !p.name.toLowerCase().includes('-mega') && POKEMON_STATS[p.id])
    .sort((a, b) => a.id - b.id);
}

const HELD_ITEMS = {
  "nessuno": "Nessuno",
  "lucky_egg": "Fortunuovo",
  "choice_band": "Bendascelta",
  "rocky_helmet": "Bitorzolelmo",
  "leftovers": "Avanzi",
  "charcoal": "Carbonella",
  "miracle_seed": "Miracolseme",
  "hard_stone": "Pietradura",
  "silk_scarf": "Sciarpa Seta",
  "pixie_plate": "Lastrafata",
  "mystic_water": "Acquamagica",
  "magnet": "Calamita",
  "black_belt": "Cinturanera",
  "poison_barb": "Velenaculeo",
  "soft_sand": "Sabbia Soffice",
  "sharp_beak": "Beccaffilato",
  "twisted_spoon": "Cucchiaio Torto",
  "silver_powder": "Argentopolvere",
  "spell_tag": "Spettrotarga",
  "dragon_fang": "Dentedidrago",
  "black_glasses": "Occhialineri",
  "metal_coat": "Metalcoperta",
  "never_melt_ice": "Gelomai"
};

const MEGA_UNLOCKS = {
  "Mega Venusaur": { baseId: 1, req: 1 },
  "Mega Blastoise": { baseId: 7, req: 1 },
  "Mega Charizard": { baseId: 4, req: 1 },
  "Mega Kangaskhan": { baseId: 115, req: 1 },
  "Mega Ampharos": { baseId: 179, req: 1 },
  "Mega Houndoom": { baseId: 228, req: 1 },
  "Mega Blaziken": { baseId: 255, req: 1 },
  "Mega Mawile": { baseId: 303, req: 1 },
  "Mega Aggron": { baseId: 304, req: 1 },
  "Mega Medicham": { baseId: 307, req: 1 },
  "Mega Manectric": { baseId: 309, req: 1 },
  "Mega Banette": { baseId: 353, req: 1 },
  "Mega Abomasnow": { baseId: 459, req: 1 },
  "Mega Pinsir": { baseId: 127, req: 10 },
  "Mega Heracross": { baseId: 214, req: 10 },
  "Mega Lucario": { baseId: 447, req: 10 },
  "Mega Gardevoir": { baseId: 280, req: 10 },
  "Mega Tyranitar": { baseId: 246, req: 10 },
  "Mega Absol": { baseId: 359, req: 25 },
  "Mega Garchomp": { baseId: 443, req: 25 },
  "Mega Scizor": { baseId: 123, req: 25 },
  "Mega Gyarados": { baseId: 129, req: 25 },
  "Mega Gengar": { baseId: 92, req: 25 },
  "Mega Alakazam": { baseId: 63, req: 25 },
  "Mega Aerodactyl": { baseId: 142, req: 25 },
  "Mega Mewtwo": { baseId: 150, req: 100 },
  "Mega Latias": { baseId: 380, req: 100 },
  "Mega Latios": { baseId: 381, req: 100 }
};

let currentStatsKey = null;
let currentStats = null;

// ── Data Loading ──────────────────────────────────────────────────────────────

function loadData() {
  setStatus('Sincronizzazione in corso...', '');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('pokelike.xyz')) {
      setStatus('⚠ Apri pokelike.xyz per iniziare', 'err');
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const res = {};
        for(let i=0; i<localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k.startsWith('poke_') || k.startsWith('pkrl_')) {
            res[k] = localStorage.getItem(k);
          }
        }
        return res;
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results?.[0]) {
        setStatus('❌ Impossibile leggere il salvataggio', 'err');
        return;
      }
      const data = results[0].result;
      const run = data['poke_current_run'];
      const species = data['pkrl_species_list'];
      const pokedollars = data['poke_pokedollars'];
      
      currentStatsKey = null;
      currentStats = null;
      for (const k in data) {
        if (data[k] && data[k].includes('"mvpCounts"')) {
          currentStatsKey = k;
          try { currentStats = JSON.parse(data[k]); } catch(e){}
        }
      }
      if (!currentStats) {
        currentStatsKey = 'poke_stats'; // guess a default
        currentStats = { runs: 0, clears: 0, mvpCounts: {} };
      }

      currentPokedollars = pokedollars ? (JSON.parse(pokedollars) || 0) : 0;

      if (!run) {
        currentRun = null;
        setStatus('⚠ Nessuna partita attiva', 'err');
        const teamEl = document.getElementById('contentTeam');
        if (teamEl) teamEl.innerHTML = `<div class="empty"><p>Nessuna partita attiva. Inizia una run su pokelike.xyz!</p></div>`;
        return;
      }
      try {
        currentRun = JSON.parse(run);
        speciesList = species ? JSON.parse(species) : [];
        buildAllPokemon();
        setStatus(`✅ Partita caricata · ${currentRun.team?.length || 0} Pokémon`, 'ok');
        renderAll();
      } catch (e) {
        setStatus('❌ Errore lettura dati: ' + e.message, 'err');
      }
    });
  });
}

let saveTimer = null;
function autoSave(showMessage = true) {
  clearTimeout(saveTimer);
  if(showMessage && currentRun) setStatus('Salvataggio in corso...', '');
  
  // Save money and stats separately (they exist even without an active run)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pd, statsKey, statsStr) => { 
        localStorage.setItem('poke_pokedollars', JSON.stringify(pd)); 
        if (statsKey && statsStr) localStorage.setItem(statsKey, statsStr);
      },
      args: [currentPokedollars, currentStatsKey, currentStats ? JSON.stringify(currentStats) : null]
    });
  });

  if (!currentRun) return;

  saveTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      currentRun.maxTeamSize = 6;
      const runStr = JSON.stringify(currentRun);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => { localStorage.setItem('poke_current_run', data); return true; },
        args: [runStr]
      }, () => {
        if (!chrome.runtime.lastError && showMessage) {
          setStatus('✅ Modifiche salvate in tempo reale', 'ok');
        }
      });
    });
  }, 300);
}

// ── Render Master ─────────────────────────────────────────────────────────────

function renderAll() {
  const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'team';
  
  checkProState();

  if (activeTab === 'team') renderTeam();
  if (activeTab === 'add') renderAdd();
  if (activeTab === 'run') renderRun();
  if (activeTab === 'bag') renderBag();
  if (activeTab === 'mega') renderMega();
}

function checkProState() {
  const overlay = document.getElementById('globalProOverlay');
  const lockables = document.querySelectorAll('.pro-lockable');
  
  if (isPro) {
    if (overlay) overlay.classList.remove('active');
    lockables.forEach(el => {
      el.parentElement.classList.remove('locked');
    });
  } else {
    lockables.forEach(el => {
      el.parentElement.classList.add('locked');
    });
  }
}

document.getElementById('btnUnlockPro')?.addEventListener('click', () => {
  const key = document.getElementById('licenseKey').value.trim();
  const err = document.getElementById('proError');
  if (key === 'POKELIKE-PRO-2026') {
    isPro = true;
    localStorage.setItem('pokelike_premium_unlocked', 'true');
    err.style.color = '#00e676';
    err.textContent = "✅ Licenza verificata! Benvenuto in PRO.";
    setTimeout(() => {
      checkProState();
      renderAll();
    }, 1000);
  } else {
    err.style.color = '#ff4d6d';
    err.textContent = "❌ Codice non valido.";
  }
});

// ── TEAM TAB ──────────────────────────────────────────────────────────────────

function renderTeam() {
  const el = document.getElementById('contentTeam');
  if (!el || !currentRun) return;
  const team = currentRun.team || [];

  if (team.length === 0) {
    el.innerHTML = `<div class="empty"><p>La tua squadra è vuota<br>Aggiungi dei Pokémon dalla scheda ➕</p></div>`;
    return;
  }

  let html = '';
  team.forEach((pk, idx) => {
    const sd = pk.baseStats || getSpeciesData(pk.speciesId);
    const types = pk.types || ['Normal'];
    const hpPct = pk.maxHp > 0 ? Math.round((pk.currentHp / pk.maxHp) * 100) : 0;
    const color = hpColor(hpPct);
    const sprite = pk.spriteUrl || getSprite(pk.speciesId, pk.isShiny);
    const displayName = pk.nickname || pk.name || POKEMON_NAMES[pk.speciesId] || `#${pk.speciesId}`;

    const heldItemId = (pk.heldItem && typeof pk.heldItem === 'object') ? pk.heldItem.id : (pk.heldItem || '');
    const heldItemDisplay = HELD_ITEMS[heldItemId] || heldItemId || 'Nessuno';

    let itemOptions = Object.keys(HELD_ITEMS).map(k => `<option value="${k === 'nessuno' ? '' : k}" ${heldItemId === k ? 'selected' : ''}>${HELD_ITEMS[k]}</option>`).join('');

    html += `
    <div class="poke-card ${pk.isShiny ? 'shiny' : ''}" data-idx="${idx}">
      <button class="btn-remove" data-remove="${idx}" title="Rimuovi">✕</button>
      <button class="btn-edit" data-edit="${idx}" title="Modifica Stats">✏️</button>
      <div class="poke-card-header">
        <div class="poke-sprite-wrapper" style="background: rgba(0,0,0,0.2); padding:4px; border-radius:8px;">
          <img class="poke-sprite" src="${sprite}" alt="${displayName}" data-fallback="${getSprite(pk.speciesId, false)}">
        </div>
        <div class="poke-info">
          <div class="poke-name">#${pk.speciesId} ${displayName} ${pk.isShiny ? '✨' : ''} <span style="font-size:12px; font-weight:400; color:#aaa;">Lv.${pk.level}</span></div>
          <div style="font-size:10px; margin-top:4px;">
            ${types.map(t => `<span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${t}</span>`).join('')}
          </div>
          <div style="font-size:11px; margin-top:4px; color:#ffd700;">Item: ${heldItemDisplay}</div>
        </div>
      </div>
      
      <div style="font-size:11px; color:#aaa; margin-bottom:4px; display:flex; justify-content:space-between;">
        <span>HP</span><span><span style="color:${color}">${pk.currentHp}</span> / ${pk.maxHp}</span>
      </div>
      <div style="background: rgba(255,255,255,0.1); border-radius:4px; height:6px;">
        <div style="width:${Math.min(100,hpPct)}%; background:${color}; height:100%; border-radius:4px;"></div>
      </div>

      <!-- ADVANCED STATS PANEL (PRO) -->
      <div class="adv-stats-panel" id="advStats_${idx}">
        <div class="pro-lockable">
          <div style="font-size:11px; color:var(--gold); margin-bottom:8px; font-weight:700;">Modifica Numerica (PRO)</div>
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">Lv.</label>
            <input type="number" class="field-input bind-team" data-field="level" data-idx="${idx}" value="${pk.level}" style="width:60px;">
            <label class="field-label" style="margin-left:auto;">✨ Shiny</label>
            <input type="checkbox" class="bind-team" data-field="isShiny" data-idx="${idx}" ${pk.isShiny ? 'checked' : ''}>
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">HP</label>
            <input type="number" class="field-input bind-team" data-field="currentHp" data-idx="${idx}" value="${pk.currentHp}" style="width:60px;">
            <span style="color:#aaa;">/</span>
            <input type="number" class="field-input bind-team" data-field="maxHp" data-idx="${idx}" value="${pk.maxHp}" style="width:60px;">
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">Item</label>
            <select class="field-input bind-team" data-field="heldItem" data-idx="${idx}" style="flex:1;">
              ${itemOptions}
            </select>
            <label class="field-label" style="margin-left:8px;">Mega:</label>
            <input type="text" class="field-input bind-team" data-field="megaStone" data-idx="${idx}" value="${pk.megaStone || ''}" placeholder="es. mawilite" style="width:80px;">
          </div>
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">Tier</label>
            <select class="field-input bind-team" data-field="moveTier" data-idx="${idx}" style="flex:1;">
              <option value="0" ${pk.moveTier===0?'selected':''}>Tier 0</option>
              <option value="1" ${pk.moveTier===1?'selected':''}>Tier 1</option>
              <option value="2" ${pk.moveTier===2?'selected':''}>Tier 2 (Max)</option>
            </select>
          </div>

          <div class="stats-grid">
            <div class="stat-group"><label>Atk</label><input type="number" class="field-input bind-stats" data-field="atk" data-idx="${idx}" value="${sd.atk}"></div>
            <div class="stat-group"><label>Def</label><input type="number" class="field-input bind-stats" data-field="def" data-idx="${idx}" value="${sd.def}"></div>
            <div class="stat-group"><label>Spd</label><input type="number" class="field-input bind-stats" data-field="speed" data-idx="${idx}" value="${sd.speed}"></div>
            <div class="stat-group"><label>Sp.Atk</label><input type="number" class="field-input bind-stats" data-field="special" data-idx="${idx}" value="${sd.special}"></div>
            <div class="stat-group"><label>Sp.Def</label><input type="number" class="field-input bind-stats" data-field="spdef" data-idx="${idx}" value="${sd.spdef}"></div>
            <div class="stat-group"><label>Hp.Base</label><input type="number" class="field-input bind-stats" data-field="hp" data-idx="${idx}" value="${sd.hp}"></div>
          </div>
        </div>
      </div>
    </div>`;
  });

  el.innerHTML = html;

  // Events
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentRun.team.splice(parseInt(e.currentTarget.dataset.remove), 1);
      autoSave();
      renderTeam();
    });
  });

  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!isPro) {
        document.getElementById('globalProOverlay').classList.add('active');
        return;
      }
      const idx = e.currentTarget.dataset.edit;
      const panel = document.getElementById(`advStats_${idx}`);
      panel.classList.toggle('active');
    });
  });

  document.querySelectorAll('.bind-team').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const idx = e.currentTarget.dataset.idx;
      const field = e.currentTarget.dataset.field;
      let val = e.currentTarget.value;
      if (e.currentTarget.type === 'number') val = parseInt(val) || 0;
      if (e.currentTarget.type === 'checkbox') val = e.currentTarget.checked;
      
      if (field === 'heldItem') {
        if (val === '') {
          currentRun.team[idx].heldItem = null;
        } else {
          currentRun.team[idx].heldItem = { id: val, name: HELD_ITEMS[val], desc: "Assegnato da PRO Editor", icon: "✨" };
        }
      } else {
        currentRun.team[idx][field] = val;
      }
      
      if (field === 'isShiny') {
        currentRun.team[idx].spriteUrl = getSprite(currentRun.team[idx].speciesId, val);
      }
      
      autoSave();
    });
  });

  document.querySelectorAll('.bind-stats').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const idx = e.currentTarget.dataset.idx;
      const field = e.currentTarget.dataset.field;
      const val = parseInt(e.currentTarget.value) || 0;
      if (!currentRun.team[idx].baseStats) {
        currentRun.team[idx].baseStats = Object.assign({}, getSpeciesData(currentRun.team[idx].speciesId));
      }
      currentRun.team[idx].baseStats[field] = val;
      autoSave();
    });
  });

  document.querySelectorAll('.poke-sprite').forEach(img => {
    img.addEventListener('error', function() {
      if (this.dataset.fallback && this.src !== this.dataset.fallback) {
        this.src = this.dataset.fallback;
      }
    });
  });
}

// ── RUN TAB ───────────────────────────────────────────────────────────────────

function renderRun() {
  document.getElementById('runMoney').value = currentPokedollars;
  if (!currentRun) return;
  
  document.getElementById('runMoney').value = currentPokedollars;
  document.getElementById('runBadges').value = currentRun.badges || 0;
  document.getElementById('runMap').value = currentRun.currentMap || 0;
  document.getElementById('runNuzlocke').checked = !!currentRun.nuzlockeMode;
  document.getElementById('runEndless').checked = !!currentRun.isEndlessMode;
  
  const stageRow = document.getElementById('endlessStageRow');
  if (currentRun.isEndlessMode) {
    stageRow.style.display = 'flex';
    document.getElementById('runEndlessStage').value = currentRun.endlessStage || 0;
  } else {
    stageRow.style.display = 'none';
  }

  // Bindings attached only once in init bindings
}

// ── BAG TAB ───────────────────────────────────────────────────────────────────

function renderBag() {
  const list = document.getElementById('bagList');
  if (!list || !currentRun) return;

  if (!currentRun.items || currentRun.items.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#888; padding:20px; font-size:11px;">Lo zaino è vuoto.</div>`;
    return;
  }

  list.innerHTML = currentRun.items.map((it, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
      <div>
        <div style="font-size:13px; font-weight:600; color:#fff;">${it.icon || '📦'} ${it.name}</div>
        <div style="font-size:10px; color:#aaa;">ID: ${it.id}</div>
      </div>
      <button class="btn-remove-bag" data-idx="${idx}" style="background:transparent; border:none; color:var(--red-light); cursor:pointer;">✕</button>
    </div>
  `).join('');

  document.querySelectorAll('.btn-remove-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.dataset.idx);
      currentRun.items.splice(i, 1);
      autoSave();
      renderBag();
    });
  });
}

document.getElementById('btnInjectBag')?.addEventListener('click', () => {
  if (!isPro || !currentRun) return;
  const sel = document.getElementById('bagItemSelect');
  const id = sel.value;
  const name = sel.options[sel.selectedIndex].text;
  if (!currentRun.items) currentRun.items = [];
  currentRun.items.push({ id, name, desc: "Generato da PRO Editor", icon: "✨" });
  autoSave();
  renderBag();
});

// ── SBLOCCHI TAB ──────────────────────────────────────────────────────────────

function renderMega() {
  const sel = document.getElementById('megaUnlockSelect');
  if (!sel) return;
  if (sel.children.length === 0) {
    sel.innerHTML = Object.keys(MEGA_UNLOCKS).map(k => `<option value="${k}">${k} (Richiede ${MEGA_UNLOCKS[k].req} MVP)</option>`).join('');
  }
}

document.getElementById('btnUnlockSingleMega')?.addEventListener('click', () => {
  if (!isPro || !currentStats) return;
  const megaName = document.getElementById('megaUnlockSelect').value;
  const megaData = MEGA_UNLOCKS[megaName];
  if (!megaData) return;
  
  if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
  currentStats.mvpCounts[megaData.baseId] = megaData.req;
  
  autoSave(false);
  setStatus(`✅ ${megaName} sbloccato! Ricarica il gioco per vederlo.`, 'ok');
});

document.getElementById('btnUnlockAllMegas')?.addEventListener('click', () => {
  if (!isPro || !currentStats) return;
  if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
  
  Object.keys(MEGA_UNLOCKS).forEach(megaName => {
    const megaData = MEGA_UNLOCKS[megaName];
    currentStats.mvpCounts[megaData.baseId] = megaData.req;
  });
  
  autoSave(false);
  setStatus('✅ TUTTE LE MEGA SBLOCCATE! Ricarica il gioco.', 'ok');
});

function generateFullDexMap() {
  const dex = {};
  // Limit to Gen 6 (721) to avoid missing sprites in Gen 7-9
  for(let i=1; i<=721; i++) dex[i] = 1;
  return dex;
}

function injectDex(keyName) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (key, fullDex) => { localStorage.setItem(key, JSON.stringify(fullDex)); },
      args: [keyName, generateFullDexMap()]
    }, () => {
      setStatus(`✅ ${keyName} completato (fino Gen 6)! Ricarica il gioco.`, 'ok');
    });
  });
}

document.getElementById('btnCompleteDex')?.addEventListener('click', () => {
  if (!isPro) return;
  injectDex('poke_dex');
});

document.getElementById('btnCompleteShinyDex')?.addEventListener('click', () => {
  if (!isPro) return;
  injectDex('poke_shiny_dex');
});

document.getElementById('btnUnlockAllStarters')?.addEventListener('click', () => {
  if (!isPro) return;
  
  // Tutti i Pokémon base (primo stadio evolutivo) fino alla Generazione 6 (id <= 721) ESCLUSI i leggendari
  const baseFormStarters = [1,4,7,10,13,16,19,21,23,27,29,32,37,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,108,109,111,114,115,116,118,120,123,127,128,129,131,132,133,137,138,140,142,147,152,155,158,161,163,165,167,170,172,173,174,175,177,179,187,190,191,193,194,198,200,201,203,204,206,207,209,211,213,214,215,216,218,220,222,223,225,227,228,231,234,235,236,238,239,240,241,246,252,255,258,261,263,265,270,273,276,278,280,283,285,287,290,292,293,296,298,299,300,302,303,304,307,309,311,312,313,314,316,318,320,322,324,325,327,328,331,333,335,336,337,338,339,341,343,345,347,349,351,352,353,355,357,359,360,361,363,366,369,370,371,374,387,390,393,396,399,401,403,406,408,410,412,415,417,418,420,422,425,427,431,433,434,436,438,439,440,441,442,443,446,447,449,451,453,455,456,458,459,495,498,501,504,506,509,511,513,515,517,519,522,524,527,529,531,532,535,538,539,540,543,546,548,550,551,554,556,557,559,561,562,564,566,568,570,572,574,577,580,582,585,587,588,590,592,594,595,597,599,602,605,607,610,613,615,616,618,619,621,622,624,626,627,629,631,632,633,636,650,653,656,659,661,664,667,669,672,674,676,677,679,682,684,686,688,690,692,694,696,698,701,702,703,704,707,708,710,712,714];
  const legendaryStarters = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 716, 717, 718, 719, 720, 721];
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (starterIds) => { 
        // Aggiungiamo i classic starters ai dex (se non ci sono già)
        let dex = {}; let shinyDex = {};
        try { dex = JSON.parse(localStorage.getItem('poke_dex')) || {}; } catch(e){}
        try { shinyDex = JSON.parse(localStorage.getItem('poke_shiny_dex')) || {}; } catch(e){}
        
        starterIds.forEach(id => {
          dex[id] = 1;
          shinyDex[id] = 1;
        });
        
        localStorage.setItem('poke_dex', JSON.stringify(dex));
        localStorage.setItem('poke_shiny_dex', JSON.stringify(shinyDex));
        
        let hof = { evoLineRoots: [], starterRuns: [], shinySpecies: [], eggLegendaries: [], eggLegendaryShinies: [], maxEndlessStage: 10 };
        try { 
          const existing = localStorage.getItem('poke_hof_index');
          if (existing && existing !== 'undefined') {
            const parsed = JSON.parse(existing);
            hof = { ...hof, ...parsed };
          }
        } catch(e){}
        
        hof.evoLineRoots = Array.isArray(hof.evoLineRoots) ? hof.evoLineRoots : [];
        hof.shinySpecies = Array.isArray(hof.shinySpecies) ? hof.shinySpecies : [];
        
        hof.evoLineRoots = [...new Set([...hof.evoLineRoots, ...starterIds])].filter(id => id <= 721);
        hof.shinySpecies = [...new Set([...hof.shinySpecies, ...starterIds])].filter(id => id <= 721);
        
        // Populate starterRuns to max out Battle Tower (Torre Lotta) progression for every region
        hof.starterRuns = Array.isArray(hof.starterRuns) ? hof.starterRuns : [];
        let newRuns = [];
        starterIds.forEach(id => {
          for(let stage = 1; stage <= 6; stage++) {
            newRuns.push(stage + ':' + id);
          }
        });
        hof.starterRuns = [...new Set([...hof.starterRuns, ...newRuns])];
        
        localStorage.setItem('poke_hof_index', JSON.stringify(hof));
        
        // --- FIX OBIETTIVI E INDICE MAPPE ---
        // 1. Aggiorniamo 'poke_used_starters' che è l'array letto per contare gli starter sbloccati
        let usedStarters = [];
        try { usedStarters = JSON.parse(localStorage.getItem('poke_used_starters') || '[]'); } catch(e){}
        usedStarters = [...new Set([...usedStarters, ...starterIds])].filter(id => id <= 721);
        localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
        
        // 2. Aggiungiamo gli achievement per ciascuno starter e le run
        let achievements = [];
        try { achievements = JSON.parse(localStorage.getItem('poke_achievements') || '[]'); } catch(e){}
        starterIds.forEach(id => {
          if(!achievements.includes('starter_' + id)) achievements.push('starter_' + id);
        });
        // Aggiungiamo anche gli achievement per i dex
        const dexAchievs = ['pokedex_complete', 'shinydex_100', 'shinydex_200', 'shinydex_300', 'shinydex_all', 'starters_stage_1', 'gen1_win', 'gen2_win', 'gen3_win', 'gen4_win', 'gen5_win', 'gen6_win'];
        dexAchievs.forEach(a => { if(!achievements.includes(a)) achievements.push(a); });
        
        localStorage.setItem('poke_achievements', JSON.stringify(achievements));
        
      },
      args: [baseFormStarters]
    }, () => {
      setStatus('🌟 TUTTI GLI STARTER BASE (SHINY) SBLOCCATI! Ricarica il gioco.', 'ok');
    });
  });
});

document.getElementById('btnUnlockLegendaries')?.addEventListener('click', () => {
  if (!isPro) return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (legIds) => {
        let dex = {};
        try { dex = JSON.parse(localStorage.getItem('poke_dex')) || {}; } catch(e){}
        legIds.forEach(id => dex[id] = 1);
        localStorage.setItem('poke_dex', JSON.stringify(dex));

        let hof = { evoLineRoots: [], eggLegendaries: [], starterRuns: [] };
        try { 
          const existing = localStorage.getItem('poke_hof_index');
          if (existing && existing !== 'undefined') {
            hof = { ...hof, ...JSON.parse(existing) };
          }
        } catch(e){}
        
        hof.evoLineRoots = Array.isArray(hof.evoLineRoots) ? hof.evoLineRoots : [];
        hof.eggLegendaries = Array.isArray(hof.eggLegendaries) ? hof.eggLegendaries : [];
        hof.starterRuns = Array.isArray(hof.starterRuns) ? hof.starterRuns : [];

        hof.evoLineRoots = [...new Set([...hof.evoLineRoots, ...legIds])];
        hof.eggLegendaries = [...new Set([...hof.eggLegendaries, ...legIds])];
        
        let newRuns = [];
        legIds.forEach(id => {
          for(let stage = 1; stage <= 6; stage++) newRuns.push(stage + ':' + id);
        });
        hof.starterRuns = [...new Set([...hof.starterRuns, ...newRuns])];
        localStorage.setItem('poke_hof_index', JSON.stringify(hof));

        let usedStarters = [];
        try { usedStarters = JSON.parse(localStorage.getItem('poke_used_starters') || '[]'); } catch(e){}
        usedStarters = [...new Set([...usedStarters, ...legIds])];
        localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
      },
      args: [legendaryStarters]
    }, () => {
      setStatus('🐉 LEGGENDARI AGGIUNTI (Come uovo)! Ricarica il gioco.', 'ok');
    });
  });
});

document.getElementById('btnUnlockLegendariesShiny')?.addEventListener('click', () => {
  if (!isPro) return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (legIds) => {
        let dex = {}; let shinyDex = {};
        try { dex = JSON.parse(localStorage.getItem('poke_dex')) || {}; } catch(e){}
        try { shinyDex = JSON.parse(localStorage.getItem('poke_shiny_dex')) || {}; } catch(e){}
        
        legIds.forEach(id => { dex[id] = 1; shinyDex[id] = 1; });
        localStorage.setItem('poke_dex', JSON.stringify(dex));
        localStorage.setItem('poke_shiny_dex', JSON.stringify(shinyDex));

        let hof = { evoLineRoots: [], shinySpecies: [], eggLegendaries: [], eggLegendaryShinies: [], starterRuns: [] };
        try { 
          const existing = localStorage.getItem('poke_hof_index');
          if (existing && existing !== 'undefined') {
            hof = { ...hof, ...JSON.parse(existing) };
          }
        } catch(e){}
        
        hof.evoLineRoots = Array.isArray(hof.evoLineRoots) ? hof.evoLineRoots : [];
        hof.shinySpecies = Array.isArray(hof.shinySpecies) ? hof.shinySpecies : [];
        hof.eggLegendaries = Array.isArray(hof.eggLegendaries) ? hof.eggLegendaries : [];
        hof.eggLegendaryShinies = Array.isArray(hof.eggLegendaryShinies) ? hof.eggLegendaryShinies : [];
        hof.starterRuns = Array.isArray(hof.starterRuns) ? hof.starterRuns : [];

        hof.evoLineRoots = [...new Set([...hof.evoLineRoots, ...legIds])];
        hof.shinySpecies = [...new Set([...hof.shinySpecies, ...legIds])];
        hof.eggLegendaries = [...new Set([...hof.eggLegendaries, ...legIds])];
        hof.eggLegendaryShinies = [...new Set([...hof.eggLegendaryShinies, ...legIds])];
        
        let newRuns = [];
        legIds.forEach(id => {
          for(let stage = 1; stage <= 6; stage++) newRuns.push(stage + ':' + id);
        });
        hof.starterRuns = [...new Set([...hof.starterRuns, ...newRuns])];
        localStorage.setItem('poke_hof_index', JSON.stringify(hof));

        let usedStarters = [];
        try { usedStarters = JSON.parse(localStorage.getItem('poke_used_starters') || '[]'); } catch(e){}
        usedStarters = [...new Set([...usedStarters, ...legIds])];
        localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
      },
      args: [legendaryStarters]
    }, () => {
      setStatus('✨ LEGGENDARI SHINY AGGIUNTI (Come uovo)! Ricarica il gioco.', 'ok');
    });
  });
});

// ── ADD TAB ───────────────────────────────────────────────────────────────────

function renderAdd() {
  const el = document.getElementById('contentAdd');
  if (!el) return;

  const maxLevel = currentRun?.team?.length ? Math.max(...currentRun.team.map(p => p.level || 1)) : 5;
  let addFormHtml = '';
  if (selectedAddPokemon) {
    addFormHtml = `
      <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; margin-top:auto;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--gold);">
          Aggiungi ${selectedAddPokemon.name} (#${selectedAddPokemon.id})
        </div>
        <div class="field-row" style="margin-bottom: 16px;">
          <label class="field-label">Livello</label>
          <input class="field-input" type="number" id="addLevel" min="1" max="100" value="${maxLevel}" style="width:70px">
          <label style="margin-left:12px; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="addShiny"> ✨ Shiny
          </label>
        </div>
        <div class="field-row">
          <button class="btn btn-primary" id="btnConfirmAdd" style="flex:1">➕ Alla Squadra</button>
          <button class="btn btn-ghost" id="btnCancelAdd">Annulla</button>
        </div>
      </div>`;
  }

  el.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
      <input class="search-input" id="searchPoke" type="text" placeholder="Cerca per nome o numero ID..." value="${searchQuery}">
      <div class="pokemon-grid" id="pokeGrid"></div>
      ${addFormHtml}
    </div>`;

  renderPokeGrid(searchQuery);

  document.getElementById('searchPoke').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPokeGrid(searchQuery);
  });

  if (selectedAddPokemon) {
    document.getElementById('btnConfirmAdd')?.addEventListener('click', () => {
      if (!selectedAddPokemon || !currentRun) return;
      if (currentRun.team.length >= 6) {
        setStatus('❌ Squadra piena (Max 6)', 'err');
        return;
      }
      const level = Math.max(1, Math.min(100, parseInt(document.getElementById('addLevel')?.value) || 5));
      const shiny = document.getElementById('addShiny')?.checked || false;
      const sd = getSpeciesData(selectedAddPokemon.id);
      const maxHp = Math.floor(((2 * sd.hp * level) / 100) + level + 10);

      currentRun.maxTeamSize = 6;
      currentRun.team.push({
        speciesId: selectedAddPokemon.id,
        name: selectedAddPokemon.name,
        nickname: null, level, currentHp: maxHp, maxHp, isShiny: shiny,
        types: sd.types,
        baseStats: { hp: sd.hp, atk: sd.atk, def: sd.def, speed: sd.speed, special: sd.special, spdef: sd.spdef },
        spriteUrl: getSprite(selectedAddPokemon.id, shiny),
        megaStone: null, heldItem: null, moveTier: 0,
      });

      selectedAddPokemon = null; searchQuery = '';
      autoSave();
      switchTab('team');
    });
    document.getElementById('btnCancelAdd')?.addEventListener('click', () => {
      selectedAddPokemon = null; renderAdd();
    });
  }
}

function renderPokeGrid(query) {
  const grid = document.getElementById('pokeGrid');
  if (!grid) return;

  const q = (query || '').toLowerCase().trim();
  const filtered = q
    ? allPokemon.filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q))
    : allPokemon;

  grid.innerHTML = filtered.map(p => `
    <div class="pokemon-option" data-id="${p.id}" data-name="${p.name}">
      <img src="${getSprite(p.id)}" alt="${p.name}" loading="lazy" class="grid-sprite" style="width:40px; height:40px; image-rendering:pixelated; margin:0 auto; display:block;">
      <div style="font-size:10px; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
    </div>`).join('');

  grid.querySelectorAll('.pokemon-option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectedAddPokemon = { id: parseInt(opt.dataset.id), name: opt.dataset.name };
      renderAdd();
    });
  });

  grid.querySelectorAll('.grid-sprite').forEach(img => {
    img.addEventListener('error', function() { this.style.opacity = '0.2'; });
  });
}

// ── TABS & INIT ───────────────────────────────────────────────────────────────

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  const map = { team: 'contentTeam', run: 'contentRun', bag: 'contentBag', mega: 'contentMega', add: 'contentAdd' };
  document.getElementById(map[name])?.classList.add('active');
  renderAll();
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

document.getElementById('btnReload').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) { loadData(); return; }
    setStatus('Aggiornamento dati...', '');
    chrome.tabs.reload(tab.id, {}, () => { setTimeout(loadData, 2000); });
  });
});

// Money buttons
document.querySelectorAll('.btn-money').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!isPro) return;
    const amt = parseInt(e.currentTarget.dataset.amt) || 0;
    currentPokedollars = Math.max(0, currentPokedollars + amt);
    document.getElementById('runMoney').value = currentPokedollars;
    autoSave();
  });
});

// Run Tab Global Bindings
['runMoney','runBadges','runMap','runEndlessStage'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', (e) => {
    if(!isPro) return;
    const val = parseInt(e.currentTarget.value) || 0;
    if(id === 'runMoney') currentPokedollars = val;
    if(id === 'runBadges') currentRun.badges = val;
    if(id === 'runMap') currentRun.currentMap = val;
    if(id === 'runEndlessStage') currentRun.endlessStage = val;
    autoSave();
  });
});
['runNuzlocke','runEndless'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', (e) => {
    if(!isPro) return;
    const val = e.currentTarget.checked;
    if(id === 'runNuzlocke') currentRun.nuzlockeMode = val;
    if(id === 'runEndless') {
      currentRun.isEndlessMode = val;
      renderRun(); // update stage visibility
    }
    autoSave();
  });
});

// Close Modal if clicked outside content
document.getElementById('globalProOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'globalProOverlay') {
    e.target.classList.remove('active');
  }
});

loadData();
