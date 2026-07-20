import { currentRun, currentPokedollars, allPokemon, POKEMON_NAMES, autoSave } from '../state.js';
import { isPro } from '../api.js';
import { requirePro } from '../ui.js';
import { typeClass, hpColor, setStatus } from '../ui.js';
import { HELD_ITEMS } from '../constants.js';

export function renderTeam() {
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
      if (!requirePro()) return;
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


export function initTeamListeners() {
  document.getElementById('contentTeam')?.addEventListener('click', (e) => {
    // Delete btn
    const delBtn = e.target.closest('.btn-delete');
    if (delBtn) {
      const idx = parseInt(delBtn.dataset.index);
      currentRun.team.splice(idx, 1);
      autoSave();
      renderTeam();
      return;
    }
    
    // Edit btn
    const editBtn = e.target.closest('.btn-edit');
    if (editBtn) {
      if (!requirePro()) return;
      const idx = parseInt(editBtn.dataset.index);
      const pkmn = currentRun.team[idx];
      const pId = pkmn.species || 1;
      const sData = getSpeciesData(pId);
      
      const detailsHtml = `
        <div class="edit-stats-grid mb-3">
          <div class="stat-group">
            <label>Livello</label>
            <input type="number" id="edit-level" value="${pkmn.level || 1}" min="1" max="100" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Felicità</label>
            <input type="number" id="edit-happiness" value="${pkmn.happiness || 0}" min="0" max="255" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Natura</label>
            <input type="number" id="edit-nature" value="${pkmn.nature || 0}" min="0" max="24" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Abilità (Indice)</label>
            <input type="number" id="edit-ability" value="${pkmn.abilityIndex || 0}" min="0" max="2" class="form-control form-control-sm">
          </div>
        </div>
        
        <h6>IVs (0-31)</h6>
        <div class="edit-stats-grid mb-3">
          <div class="stat-group"><label>HP</label><input type="number" id="iv-hp" value="${pkmn.ivs?.[0]||0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Atk</label><input type="number" id="iv-atk" value="${pkmn.ivs?.[1]||0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Def</label><input type="number" id="iv-def" value="${pkmn.ivs?.[2]||0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>SpAtk</label><input type="number" id="iv-spa" value="${pkmn.ivs?.[3]||0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>SpDef</label><input type="number" id="iv-spd" value="${pkmn.ivs?.[4]||0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Spd</label><input type="number" id="iv-spe" value="${pkmn.ivs?.[5]||0}" min="0" max="31" class="form-control form-control-sm"></div>
        </div>
        
        <div class="stat-group mt-2">
          <label class="form-check-label d-flex align-items-center gap-2" style="cursor:pointer">
            <input type="checkbox" id="edit-shiny" class="form-check-input" ${pkmn.shiny ? 'checked' : ''}> 
            <span style="color:var(--gold)">Pokèmon Cromatico (Shiny)</span>
          </label>
        </div>
      `;
      
      const modal = document.getElementById('editModal');
      const title = document.getElementById('editModalTitle');
      const body = document.getElementById('editModalBody');
      const saveBtn = document.getElementById('btnSaveEdit');
      
      title.innerHTML = `<img src="${getSprite(pId, pkmn.shiny)}" style="width:32px;height:32px;image-rendering:pixelated"> Modifica Avanzata ${POKEMON_NAMES[pId] || 'Pokémon'}`;
      body.innerHTML = detailsHtml;
      
      // Clear old listeners
      const newSave = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSave, saveBtn);
      
      newSave.addEventListener('click', () => {
        if (!pkmn.ivs) pkmn.ivs = [0,0,0,0,0,0];
        pkmn.level = parseInt(document.getElementById('edit-level').value) || 1;
        pkmn.happiness = parseInt(document.getElementById('edit-happiness').value) || 0;
        pkmn.nature = parseInt(document.getElementById('edit-nature').value) || 0;
        pkmn.abilityIndex = parseInt(document.getElementById('edit-ability').value) || 0;
        
        pkmn.ivs[0] = parseInt(document.getElementById('iv-hp').value) || 0;
        pkmn.ivs[1] = parseInt(document.getElementById('iv-atk').value) || 0;
        pkmn.ivs[2] = parseInt(document.getElementById('iv-def').value) || 0;
        pkmn.ivs[3] = parseInt(document.getElementById('iv-spa').value) || 0;
        pkmn.ivs[4] = parseInt(document.getElementById('iv-spd').value) || 0;
        pkmn.ivs[5] = parseInt(document.getElementById('iv-spe').value) || 0;
        
        pkmn.shiny = document.getElementById('edit-shiny').checked;
        
        modal.classList.remove('active');
        autoSave();
        renderTeam();
      });
      
      modal.classList.add('active');
    }
  });

  document.getElementById('editModalClose')?.addEventListener('click', () => {
    document.getElementById('editModal').classList.remove('active');
  });

  document.getElementById('btnHealTeam')?.addEventListener('click', () => {
    if (!currentRun || !currentRun.team) return;
    currentRun.team.forEach(p => {
      const pId = p.species || 1;
      const sData = getSpeciesData(pId);
      const lvl = p.level || 1;
      const hpIv = p.ivs ? (p.ivs[0] || 0) : 0;
      const baseHp = sData.hp || 50;
      const maxHp = Math.floor(0.01 * (2 * baseHp + hpIv + 0) * lvl) + lvl + 10;
      p.hp = maxHp;
      if (p.status) p.status = 0; // rimuovi paralisi/veleno ecc.
    });
    autoSave();
    renderTeam();
    setStatus('💚 Squadra curata completamente!', 'ok');
  });
}
