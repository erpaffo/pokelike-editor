import { currentRun, allPokemon, selectedAddPokemon, setSelectedAddPokemon, autoSave } from '../state.js';
import { getSprite, setStatus } from '../ui.js';
import { renderAll } from '../main.js';

let searchQuery = '';

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


export function initAddListeners() {
  document.getElementById('searchPokemon')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderAdd();
  });

  document.getElementById('contentAdd')?.addEventListener('click', (e) => {
    const opt = e.target.closest('.pokemon-option');
    if (opt) {
      document.querySelectorAll('.pokemon-option').forEach(el => el.style.border = '1px solid transparent');
      opt.style.border = '1px solid var(--gold)';
      setSelectedAddPokemon(parseInt(opt.dataset.id));
    }
  });

  document.getElementById('btnAddSelected')?.addEventListener('click', () => {
    if (!currentRun || !selectedAddPokemon) return;
    if (currentRun.team && currentRun.team.length >= currentRun.maxTeamSize) {
      setStatus('Squadra piena (Max 6)!', 'err');
      return;
    }
    if (!currentRun.team) currentRun.team = [];
    currentRun.team.push({
      species: selectedAddPokemon,
      level: 5,
      ivs: [31,31,31,31,31,31],
      moves: [],
      nature: 0,
      abilityIndex: 0,
      shiny: false,
      hp: 20
    });
    autoSave();
    setStatus('✅ Pokémon aggiunto!', 'ok');
    
    document.querySelector('.tab[data-tab="team"]')?.click();
  });
}
