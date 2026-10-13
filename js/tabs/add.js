import { currentRun, allPokemon, selectedAddPokemon, setSelectedAddPokemon, autoSave } from '../state.js';
import { setStatus, esc } from '../ui.js';
import { getTypes, getBaseStats, typeName, ALL_TYPES } from '../pokemonTypes.js';
import { t } from '../i18n.js';

let searchQuery = '';
let filterType = '';
let filterType2 = '';
let filterGen = '';

// I due filtri tipo sono indipendenti dallo slot: cercando Volante + Buio
// devono uscire sia i Volante/Buio sia i Buio/Volante.
function matchesTypeFilters(id) {
  if (!filterType && !filterType2) return true;
  const types = getTypes(id);
  if (!types.length) return false;
  const wanted = [filterType, filterType2].filter(Boolean);
  if (wanted.length === 2 && wanted[0] === wanted[1]) return false;
  return wanted.every(w => types.includes(w));
}

// Ricalcolato a ogni disegno: l'ordine alfabetico cambia con la lingua.
function typeOptions() {
  return ALL_TYPES
    .map(v => ({ value: v, label: typeName(v) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function typeOptionsHtml(selected, placeholder) {
  return `<option value="">${placeholder}</option>` + typeOptions()
    .map(o => `<option value="${o.value}"${o.value === selected ? ' selected' : ''}>${o.label}</option>`)
    .join('');
}

function getGen(id) {
  if (id <= 151) return '1';
  if (id <= 251) return '2';
  if (id <= 386) return '3';
  if (id <= 493) return '4';
  if (id <= 649) return '5';
  if (id <= 721) return '6';
  return 'Unknown';
}

function renderPokeGrid() {
  const grid = document.getElementById('pokeGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const q = searchQuery.toLowerCase();
  
  const filtered = allPokemon.filter(p => {
    const matchText = !q || p.name.toLowerCase().includes(q) || p.id.toString() === q;
    const matchGen = !filterGen || getGen(p.id) === filterGen;
    return matchText && matchGen && matchesTypeFilters(p.id);
  });

  const countEl = document.getElementById('filterCount');
  if (countEl) {
    countEl.textContent = filtered.length === allPokemon.length
      ? t('add.countAll', { n: filtered.length })
      : t('add.countFiltered', { n: filtered.length, m: allPokemon.length });
  }

  if (filtered.length === 0) {
    const sameType = filterType && filterType === filterType2;
    const msg = sameType
      ? t('add.sameType')
      : t('add.noneFound');
    grid.innerHTML = `<div style="color:#8b92a5; grid-column:1/-1; text-align:center; padding:20px; font-size:12px;">${msg}</div>`;
    return;
  }

  filtered.forEach(p => {
    const isSelected = selectedAddPokemon === p.id;
    const div = document.createElement('div');
    div.className = 'pokemon-option';
    if (isSelected) div.style.border = '1px solid var(--gold)';
    div.dataset.id = p.id;
    const sprite = window.getSprite ? window.getSprite(p.id) : '';
    
    const imgHtml = sprite ? `<img src="${sprite}" alt="${esc(p.name)}" style="width:40px; height:40px; image-rendering:pixelated; margin-bottom:4px;">` : '';
    const typeLabels = getTypes(p.id).map(typeName).join(' · ');
    div.innerHTML = `
      ${imgHtml}
      <div style="font-size:10px; color:#8b92a5">#${p.id}</div>
      <div style="font-size:11px; font-weight:600">${esc(p.name)}</div>
      <div style="font-size:9px; color:#8b92a5; margin-top:2px;">${typeLabels}</div>
    `;
    grid.appendChild(div);
  });
}

export function renderAdd() {
  const el = document.getElementById('contentAdd');
  if (!el) return;

  const maxLevel = currentRun?.team?.length ? Math.max(...currentRun.team.map(p => p.level || 1)) : 5;
  let addFormHtml = '';
  if (selectedAddPokemon) {
    const pName = allPokemon.find(p => p.id === selectedAddPokemon)?.name || 'Pokémon';
    addFormHtml = `
      <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; margin-top:auto;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--gold);">
          ${t('add.addTitle', { name: pName, id: selectedAddPokemon })}
        </div>
        <div class="field-row" style="margin-bottom: 16px;">
          <label class="field-label">${t('add.level')}</label>
          <input class="field-input" type="number" id="addLevel" min="1" max="100" value="${maxLevel}" style="width:70px">
          <label style="margin-left:12px; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="addShiny"> ${t('team.shiny')}
          </label>
        </div>
        <div class="field-row">
          <button class="btn btn-primary" id="btnConfirmAdd" style="flex:1">${t('add.confirm')}</button>
          <button class="btn btn-ghost" id="btnCancelAdd">${t('common.cancel')}</button>
        </div>
      </div>`;
  }

  // Costruiamo la UI con filtri
  el.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
      
      <!-- Barra di ricerca e filtri -->
      <div style="display:flex; flex-direction:column; gap:8px;">
        <input class="search-input" id="searchPoke" type="text" placeholder="${t('add.search')}" value="${esc(searchQuery)}">

        <div style="display:flex; gap:8px;">
          <select id="filterType" class="field-input" style="flex:1; min-width:0;">
            ${typeOptionsHtml(filterType, t('add.type1'))}
          </select>
          <select id="filterType2" class="field-input" style="flex:1; min-width:0;">
            ${typeOptionsHtml(filterType2, t('add.type2'))}
          </select>
          <select id="filterGen" class="field-input" style="flex:1; min-width:0;">
            <option value="">${t('add.allGens')}</option>
            ${[1,2,3,4,5,6].map(g => `<option value="${g}">${t('add.gen', { n: g })}</option>`).join('')}
          </select>
        </div>

        <div style="display:flex; align-items:center; gap:8px; min-height:18px;">
          <span id="filterCount" style="font-size:11px; color:#8b92a5;"></span>
          <button class="btn btn-ghost" id="btnClearFilters" style="font-size:11px; padding:2px 8px; margin-left:auto;">${t('add.clearFilters')}</button>
        </div>
      </div>

      <div class="pokemon-grid" id="pokeGrid" style="flex:1; overflow-y:auto;"></div>
      ${addFormHtml}
    </div>`;

  document.getElementById('filterGen').value = filterGen;

  renderPokeGrid();

  document.getElementById('searchPoke')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPokeGrid();
  });

  document.getElementById('filterType')?.addEventListener('change', (e) => {
    filterType = e.target.value;
    renderPokeGrid();
  });

  document.getElementById('filterType2')?.addEventListener('change', (e) => {
    filterType2 = e.target.value;
    renderPokeGrid();
  });

  document.getElementById('filterGen')?.addEventListener('change', (e) => {
    filterGen = e.target.value;
    renderPokeGrid();
  });

  document.getElementById('btnClearFilters')?.addEventListener('click', () => {
    searchQuery = ''; filterType = ''; filterType2 = ''; filterGen = '';
    renderAdd();
  });

  if (selectedAddPokemon) {
    document.getElementById('btnConfirmAdd')?.addEventListener('click', async () => {
      if (!selectedAddPokemon || !currentRun) return;
      if (currentRun.team && currentRun.team.length >= 6) {
        setStatus(t('add.teamFull'), 'err');
        return;
      }
      const level = Math.max(1, Math.min(100, parseInt(document.getElementById('addLevel')?.value) || 5));
      const shiny = document.getElementById('addShiny')?.checked || false;
      
      const stats = getBaseStats(selectedAddPokemon)
        || { hp: 60, atk: 60, def: 60, speed: 60, special: 60, spdef: 60 };
      const types = getTypes(selectedAddPokemon);

      const maxHp = Math.floor(((2 * stats.hp * level) / 100) + level + 10);

      currentRun.maxTeamSize = 6;
      if (!currentRun.team) currentRun.team = [];
      const pName = allPokemon.find(p => p.id === selectedAddPokemon)?.name || 'Sconosciuto';
      const maxUid = currentRun.team.length ? Math.max(...currentRun.team.map(p => p._uid || 0)) : 0;
        
      currentRun.team.push({
          _uid: maxUid + 1,
          speciesId: selectedAddPokemon,
          name: pName,
          nickname: null,
          level: level,
          currentHp: maxHp,
          maxHp: maxHp,
          baseStats: { ...stats },
          heldItem: null,
          isShiny: shiny,
          megaStone: null,
          moveTier: 0,
          // Il gioco salva il percorso relativo, non l'URL assoluto.
          spriteUrl: shiny
            ? `img/sprites/pokemon/shiny/${selectedAddPokemon}.png`
            : `img/sprites/pokemon/${selectedAddPokemon}.png`,
          types: types.length ? types : ['Normal']
      });

      setSelectedAddPokemon(null); 
      searchQuery = '';
      autoSave();
      setStatus(t('add.added'), 'ok');
      
      // Simula il click sulla tab "team"
      document.querySelector('.tab[data-tab="team"]')?.click();
    });
    
    document.getElementById('btnCancelAdd')?.addEventListener('click', () => {
      setSelectedAddPokemon(null); 
      renderAdd();
    });
  }
}

export function initAddListeners() {
  document.getElementById('contentAdd')?.addEventListener('click', (e) => {
    const opt = e.target.closest('.pokemon-option');
    if (opt) {
      document.querySelectorAll('.pokemon-option').forEach(el => el.style.border = '1px solid transparent');
      opt.style.border = '1px solid var(--gold)';
      setSelectedAddPokemon(parseInt(opt.dataset.id));
      renderAdd();
    }
  });
}
