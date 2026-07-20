import { currentRun, allPokemon, selectedAddPokemon, setSelectedAddPokemon, autoSave } from '../state.js';
import { typeClass, hpColor, setStatus } from '../ui.js';

let searchQuery = '';
let filterType = '';
let filterGen = '';

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
    // 1. Text Search
    const matchText = p.name.toLowerCase().includes(q) || p.id.toString() === q;
    
    // 2. Gen Filter
    let matchGen = true;
    if (filterGen) {
      matchGen = getGen(p.id) === filterGen;
    }

    // 3. Type Filter
    let matchType = true;
    if (filterType) {
      const sData = window.getSpeciesData ? window.getSpeciesData(p.id) : null;
      if (sData && sData.types) {
        matchType = sData.types.map(t => t.toLowerCase()).includes(filterType.toLowerCase());
      } else {
        matchType = false;
      }
    }

    return matchText && matchGen && matchType;
  }).slice(0, 50); // limit to 50 for performance

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="color:#8b92a5; grid-column:1/-1; text-align:center; padding: 20px;">Nessun Pokémon trovato</div>`;
    return;
  }

  filtered.forEach(p => {
    const isSelected = selectedAddPokemon === p.id;
    const div = document.createElement('div');
    div.className = 'pokemon-option';
    if (isSelected) div.style.border = '1px solid var(--gold)';
    div.dataset.id = p.id;
    const sprite = window.getSprite ? window.getSprite(p.id) : '';
    
    div.innerHTML = `
      <img src="${sprite}" style="width:40px; height:40px; image-rendering:pixelated; margin-bottom:4px;">
      <div style="font-size:10px; color:#8b92a5">#${p.id}</div>
      <div style="font-size:11px; font-weight:600">${p.name}</div>
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
          Aggiungi ${pName} (#${selectedAddPokemon})
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

  // Costruiamo la UI con filtri
  el.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
      
      <!-- Barra di ricerca e filtri -->
      <div style="display:flex; gap:8px;">
        <input class="search-input" id="searchPoke" type="text" placeholder="Cerca..." value="${searchQuery}" style="flex:1">
        
        <select id="filterType" class="field-input" style="width:100px;">
          <option value="">Tutti i Tipi</option>
          <option value="Normal">Normale</option><option value="Fire">Fuoco</option><option value="Water">Acqua</option>
          <option value="Grass">Erba</option><option value="Electric">Elettro</option><option value="Ice">Ghiaccio</option>
          <option value="Fighting">Lotta</option><option value="Poison">Veleno</option><option value="Ground">Terra</option>
          <option value="Flying">Volante</option><option value="Psychic">Psico</option><option value="Bug">Coleottero</option>
          <option value="Rock">Roccia</option><option value="Ghost">Spettro</option><option value="Dragon">Drago</option>
          <option value="Dark">Buio</option><option value="Steel">Acciaio</option><option value="Fairy">Folletto</option>
        </select>
        
        <select id="filterGen" class="field-input" style="width:100px;">
          <option value="">Tutte le Gen</option>
          <option value="1">Gen 1</option><option value="2">Gen 2</option><option value="3">Gen 3</option>
          <option value="4">Gen 4</option><option value="5">Gen 5</option><option value="6">Gen 6</option>
        </select>
      </div>

      <div class="pokemon-grid" id="pokeGrid" style="flex:1; overflow-y:auto;"></div>
      ${addFormHtml}
    </div>`;

  // Imposta i valori correnti nei filtri
  const typeSelect = document.getElementById('filterType');
  const genSelect = document.getElementById('filterGen');
  if (typeSelect) typeSelect.value = filterType;
  if (genSelect) genSelect.value = filterGen;

  renderPokeGrid();

  // Listeners input
  document.getElementById('searchPoke')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPokeGrid();
  });
  
  document.getElementById('filterType')?.addEventListener('change', (e) => {
    filterType = e.target.value;
    renderPokeGrid();
  });

  document.getElementById('filterGen')?.addEventListener('change', (e) => {
    filterGen = e.target.value;
    renderPokeGrid();
  });

  if (selectedAddPokemon) {
    document.getElementById('btnConfirmAdd')?.addEventListener('click', () => {
      if (!selectedAddPokemon || !currentRun) return;
      if (currentRun.team && currentRun.team.length >= 6) {
        setStatus('❌ Squadra piena (Max 6)', 'err');
        return;
      }
      const level = Math.max(1, Math.min(100, parseInt(document.getElementById('addLevel')?.value) || 5));
      const shiny = document.getElementById('addShiny')?.checked || false;
      const sd = window.getSpeciesData ? window.getSpeciesData(selectedAddPokemon) : { hp:60, atk:60, def:60, speed:60, special:60, spdef:60, types:["Normal"] };
      const maxHp = Math.floor(((2 * sd.hp * level) / 100) + level + 10);

      currentRun.maxTeamSize = 6;
      if (!currentRun.team) currentRun.team = [];
      
      currentRun.team.push({
        species: selectedAddPokemon,
        level: level,
        ivs: [31,31,31,31,31,31],
        moves: [],
        nature: 0,
        abilityIndex: 0,
        shiny: shiny,
        hp: maxHp
      });

      setSelectedAddPokemon(null); 
      searchQuery = '';
      autoSave();
      setStatus('✅ Pokémon aggiunto!', 'ok');
      
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
