import { currentRun, currentPokedollars, allPokemon, POKEMON_NAMES, autoSave, megaStones, megaStonesFor, itemSearchTerms } from '../state.js';
import { buildMegaStoneItem, buildMegaStoneItemFromDef } from '../page.js';
import { hpColor, setStatus, esc } from '../ui.js';
import { HELD_ITEMS, itemName, itemGameName } from '../constants.js';
import { getBaseStats, getTypes, typeName, ALL_TYPES } from '../pokemonTypes.js';
import { t } from '../i18n.js';
import { filterBySearch, searchTerms } from '../search.js';
import { renderTraits } from './traits.js';
import { isBroken } from '../compat.js';

// I mutanti dell'Endless portano un tipo in piu' rispetto alla forma di
// partenza. Il gioco lo registra in _mutationType e lo accoda a types
// (vedi erApplyMutation), quindi i due campi vanno tenuti allineati.
const MUTATION_PCT = 50;

// Il menu del tier arriva a 2, che il gioco indica come massimo.
const MAX_MOVE_TIER = 2;

// Parte dei PS massimi che dipende dai bonus percentuali, come in _recalcMaxHp
// del gioco: (1 + 5% per vitamina PS + mutazione) x (1 + potenziamento).
// Cambiando uno di questi bonus i PS si riscalano dello stesso rapporto, cosi'
// non serve rifare la formula base e la percentuale di PS resta quella.
function hpFactor(pk) {
  return (1 + 0.05 * (pk.statBuffs?.hp || 0) + (pk._mutationPct || 0) / 100)
    * (1 + (pk._augmentPct || 0) / 100);
}

function rescaleHp(pk, before) {
  const after = hpFactor(pk);
  if (!before || !(pk.maxHp > 0) || after === before) return;
  const ratio = after / before;
  const fainted = pk.currentHp <= 0;
  pk.maxHp = Math.max(1, Math.floor(pk.maxHp * ratio));
  pk.currentHp = fainted ? 0 : Math.min(pk.maxHp, Math.max(1, Math.round(pk.currentHp * ratio)));
}

// Lo sprite shiny e' un percorso diverso: cambiare isShiny senza aggiornarlo
// lascerebbe l'immagine della forma normale.
function spritePath(speciesId, shiny) {
  return shiny
    ? `img/sprites/pokemon/shiny/${speciesId}.png`
    : `img/sprites/pokemon/${speciesId}.png`;
}

// Tipi della forma di partenza, cioe' senza la mutazione gia' applicata.
function baseTypesOf(pk) {
  const types = pk.types?.length ? [...pk.types] : getTypes(pk.speciesId);
  const extra = pk._mutationType;
  if (!extra) return types;
  if (types[types.length - 1] === extra) return types.slice(0, -1);
  return types.filter(t => t !== extra);
}

// Il gioco sorteggia la mutazione fra i tipi che il Pokemon non ha gia'.
function mutationOptionsFor(pk) {
  const base = baseTypesOf(pk);
  return ALL_TYPES.filter(type => !base.includes(type));
}

function typeBadgesHtml(pk) {
  const types = pk.types?.length ? pk.types
    : (getTypes(pk.speciesId).length ? getTypes(pk.speciesId) : ['Normal']);
  // Il parametro non va chiamato `t`: coprirebbe la funzione di traduzione
  // usata qui sotto per il tooltip.
  return types.map(type => {
    const isMutation = pk._mutationType && type === pk._mutationType;
    const style = isMutation
      ? 'background:rgba(204,0,255,0.25); border:1px solid #cc00ff; color:#e9a6ff;'
      : 'background:rgba(255,255,255,0.1);';
    return `<span style="${style} padding:2px 6px; border-radius:4px;" title="${isMutation ? t('team.mutationTitle') : ''}">${isMutation ? '🧬 ' : ''}${esc(typeName(type))}</span>`;
  }).join('');
}

export function setMutationType(idx, newType) {
  const pk = currentRun.team[idx];
  if (!pk) return;
  const base = baseTypesOf(pk);
  const before = hpFactor(pk);

  if (!newType) {
    delete pk._mutated;
    delete pk._mutationType;
    delete pk._mutationPct;
    pk.types = base;
    rescaleHp(pk, before);
    return;
  }

  pk._mutated = true;
  pk._mutationType = newType;
  pk._mutationPct = pk._mutationPct ?? MUTATION_PCT;
  pk.types = [...base, newType];
  rescaleHp(pk, before);
}


// Opzioni del menu strumento/megapietra di un Pokemon, filtrate dal testo
// cercato. La ricerca guarda il nome mostrato, l'id scritto nel salvataggio e
// tutti i nomi che il gioco conosce nelle sue lingue, cosi' funziona comunque
// l'utente scriva.
function itemOptionsHtml(pk, heldItemId, query) {
  const terms = (id, ...extra) => searchTerms(...extra, id, itemSearchTerms(id));
  const items = filterBySearch(Object.keys(HELD_ITEMS), query,
    k => terms(k, itemName(k), HELD_ITEMS[k]?.en, HELD_ITEMS[k]?.it));

  // Una pietra trasforma solo la sua specie (syncMegaForm controlla
  // megaSpecies === speciesId), quindi si offrono solo quelle compatibili.
  const stones = megaStonesFor(pk.speciesId);
  const matching = (list) => filterBySearch(list, query,
    s => terms(s.id, s.name, s.megaName));
  // Le pietre vere e quelle ricostruite dalle forme senza pietra stanno in due
  // gruppi distinti: le seconde funzionano ma non danno l'abilita' Mega, e
  // l'utente deve poterlo vedere prima di sceglierle.
  const realStones = matching(stones.filter(s => !s.synthetic));
  const extraStones = matching(stones.filter(s => s.synthetic));

  let html = '';
  if (items.length) {
    html += `<optgroup label="${esc(t('team.itemGroup'))}">`
      + items
          .map(k => `<option value="${k === 'nessuno' ? '' : k}"${heldItemId === k ? ' selected' : ''}>${esc(itemName(k))}</option>`)
          .join('')
      + '</optgroup>';
  }
  if (realStones.length) {
    html += `<optgroup label="${esc(t('team.megaGroup'))}">`
      + realStones
          .map(s => `<option value="mega:${esc(s.id)}"${heldItemId === s.id ? ' selected' : ''}>💠 ${esc(s.name)}</option>`)
          .join('')
      + '</optgroup>';
  }
  if (extraStones.length) {
    html += `<optgroup label="${esc(t('team.megaExtraGroup'))}">`
      + extraStones
          .map(s => `<option value="megax:${esc(s.id)}"${heldItemId === s.id ? ' selected' : ''}>💠 ${esc(s.name)}</option>`)
          .join('')
      + '</optgroup>';
  }
  return html || `<option value="">${esc(t('search.noResults', { q: query }))}</option>`;
}

// Un testo cercato per ogni slot della squadra. Restano fuori dalla funzione di
// disegno perche' la scheda si ridisegna a ogni modifica.
const itemQueries = {};
// Pannelli di modifica aperti: restano aperti quando la scheda si ridisegna.
const openPanels = new Set();

export function renderTeam() {
  const el = document.getElementById('contentTeam');
  if (!el || !currentRun) return;
  const team = currentRun.team || [];

  if (team.length === 0) {
    el.innerHTML = `<div class="empty"><p>${t('team.empty')}</p></div>`;
    return;
  }

  const notShiny = team.filter(pk => !pk.isShiny).length;
  const notMaxTier = team.filter(pk => (pk.moveTier || 0) < MAX_MOVE_TIER).length;

  let html = `
    <button class="btn btn-primary w-100" id="btnHealTeam" style="background: linear-gradient(135deg, #00c853, #00e676); margin-bottom: 4px;">
      ${t('team.healAll')}
    </button>
    <div class="field-row" style="margin-top:0;">
      <button class="btn btn-accent" id="btnAllShiny" style="flex:1;" ${notShiny ? '' : 'disabled'}>
        ${notShiny ? t('team.makeAllShiny', { n: notShiny }) : t('team.allShinyDone')}
      </button>
      <button class="btn btn-accent" id="btnAllMaxTier" style="flex:1;" ${notMaxTier ? '' : 'disabled'}>
        ${notMaxTier ? t('team.maxAllTier', { n: notMaxTier }) : t('team.allTierDone')}
      </button>
    </div>`;
  team.forEach((pk, idx) => {
    const sd = pk.baseStats || getBaseStats(pk.speciesId) || getSpeciesData(pk.speciesId);
    const hpPct = pk.maxHp > 0 ? Math.round((pk.currentHp / pk.maxHp) * 100) : 0;
    const color = hpColor(hpPct);
    const sprite = resolveGameSprite(pk.spriteUrl) || getSprite(pk.speciesId, pk.isShiny);
    const displayName = pk.nickname || pk.name || POKEMON_NAMES[pk.speciesId] || `#${pk.speciesId}`;

    const held = (pk.heldItem && typeof pk.heldItem === 'object') ? pk.heldItem : null;
    const heldItemId = held ? held.id : (pk.heldItem || '');
    const heldItemDisplay = held?.isMegaStone
      ? `💠 ${esc(held.name || heldItemId)}`
      : (HELD_ITEMS[heldItemId] ? esc(itemName(heldItemId)) : esc(heldItemId || t('common.none')));

    // Strumento e megapietra occupano lo stesso slot (heldItem): un unico menu
    // diviso in gruppi evita di far credere che si possano avere entrambi.
    // Una pietra trasforma solo la sua specie (syncMegaForm controlla
    // megaSpecies === speciesId), quindi si offrono solo quelle compatibili.
    const itemOptions = itemOptionsHtml(pk, heldItemId, itemQueries[idx] || '');
    // Serve anche fuori dal menu, per la nota "nessuna pietra per questa specie".
    const stones = megaStonesFor(pk.speciesId);

    const mutationType = pk._mutationType || '';
    const mutationOptions = `<option value="">${t('common.noneF')}</option>` + mutationOptionsFor(pk)
      .map(type => `<option value="${type}"${type === mutationType ? ' selected' : ''}>${esc(typeName(type))}</option>`)
      .join('');

    html += `
    <div class="poke-card ${pk.isShiny ? 'shiny' : ''}" data-idx="${idx}">
      <button class="btn-remove" data-remove="${idx}" title="${t('team.remove')}">✕</button>
      <button class="btn-edit" data-edit="${idx}" title="${t('team.editStats')}">✏️</button>
      <div class="poke-card-header">
        <div class="poke-sprite-wrapper" style="background: rgba(0,0,0,0.2); padding:4px; border-radius:8px;">
          <img class="poke-sprite" src="${sprite}" alt="${esc(displayName)}" data-fallback-url="${getSprite(pk.speciesId, false)}">
        </div>
        <div class="poke-info">
          <div class="poke-name">#${pk.speciesId} ${esc(displayName)} ${pk.isShiny ? '✨' : ''} <span style="font-size:12px; font-weight:400; color:#aaa;">Lv.${pk.level}</span></div>
          <div style="font-size:10px; margin-top:4px;" id="types_${idx}">${typeBadgesHtml(pk)}</div>
          <div style="font-size:11px; margin-top:4px; color:#ffd700;">${t('team.item')}: ${esc(heldItemDisplay)}</div>
        </div>
      </div>
      
      <div style="font-size:11px; color:#aaa; margin-bottom:4px; display:flex; justify-content:space-between;">
        <span>HP</span><span><span style="color:${color}">${pk.currentHp}</span> / ${pk.maxHp}</span>
      </div>
      <div style="background: rgba(255,255,255,0.1); border-radius:4px; height:6px;">
        <div style="width:${Math.min(100,hpPct)}%; background:${color}; height:100%; border-radius:4px;"></div>
      </div>

      <!-- ADVANCED STATS PANEL -->
      <div class="adv-stats-panel${openPanels.has(idx) ? ' active' : ''}" id="advStats_${idx}">
        <div>
          <div style="font-size:11px; color:var(--gold); margin-bottom:8px; font-weight:700;">${t('team.numericEdit')}</div>
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">Lv.</label>
            <input type="number" class="field-input bind-team" data-field="level" data-idx="${idx}" value="${pk.level}" style="width:60px;">
            <label class="field-label" style="margin-left:auto;">${t('team.shiny')}</label>
            <input type="checkbox" class="bind-team" data-field="isShiny" data-idx="${idx}" ${pk.isShiny ? 'checked' : ''}>
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">HP</label>
            <input type="number" class="field-input bind-team" data-field="currentHp" data-idx="${idx}" value="${pk.currentHp}" style="width:60px;">
            <span style="color:#aaa;">/</span>
            <input type="number" class="field-input bind-team" data-field="maxHp" data-idx="${idx}" value="${pk.maxHp}" style="width:60px;">
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">${t('team.item')}</label>
            <select class="field-input bind-team" data-field="heldItem" data-idx="${idx}"
                    id="itemSelect_${idx}" style="flex:1;">
              ${itemOptions}
            </select>
          </div>
          <div class="field-row" style="margin-top:-2px;">
            <span style="width:50px;"></span>
            <input type="search" class="field-input item-search" data-idx="${idx}"
                   value="${esc(itemQueries[idx] || '')}" autocomplete="off" spellcheck="false"
                   placeholder="${esc(t('search.items'))}"
                   style="flex:1; font-size:10px; padding:4px 6px;">
          </div>
          ${stones.length ? '' : `
          <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">
            ${esc(megaStones === null ? t('team.megaUnavailable') : t('team.megaNoneForSpecies'))}
          </div>`}
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">${t('team.mutation')}</label>
            <select class="field-input bind-team" data-field="_mutationType" data-idx="${idx}" style="flex:1;">
              ${mutationOptions}
            </select>
            <span class="field-label" style="font-size:10px;">${t('team.mutationExtra')}</span>
          </div>
          ${pk._mutationType && !isBroken('endless2') ? `
          <div class="field-row">
            <label class="field-label" style="width:50px;" title="${esc(t('team.mutationPctTitle'))}">${t('team.mutationPct')}</label>
            <input type="number" min="0" class="field-input bind-team" data-field="_mutationPct" data-idx="${idx}" value="${pk._mutationPct || 0}" style="width:60px;">
            <span class="field-label" style="font-size:10px;">${t('team.mutationPctHint')}</span>
          </div>` : ''}
          ${currentRun.isEndlessMode && !isBroken('endless2') ? `
          <div class="field-row">
            <label class="field-label" style="width:50px;" title="${esc(t('team.augmentTitle'))}">${t('team.augment')}</label>
            <input type="number" min="0" class="field-input bind-team" data-field="_augmentPct" data-idx="${idx}" value="${pk._augmentPct || 0}" style="width:60px;">
            <span class="field-label" style="font-size:10px;">${t('team.augmentHint')}</span>
          </div>` : ''}

          <div class="field-row">
            <label class="field-label" style="width:50px;">${t('team.tier')}</label>
            <select class="field-input bind-team" data-field="moveTier" data-idx="${idx}" style="flex:1;">
              <option value="0" ${pk.moveTier===0?'selected':''}>${t('team.tierN', { n: 0 })}</option>
              <option value="1" ${pk.moveTier===1?'selected':''}>${t('team.tierN', { n: 1 })}</option>
              <option value="2" ${pk.moveTier===2?'selected':''}>${t('team.tierMax', { n: 2 })}</option>
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

  html += '<div class="section" id="traitsSection" style="margin-top:16px;"></div>';

  el.innerHTML = html;
  renderTraits();

  // Events
  // Si riscrive solo il menu di quello slot: ridisegnare tutta la squadra
  // toglierebbe il fuoco alla casella a ogni lettera digitata.
  el.querySelectorAll('.item-search').forEach(input => {
    input.addEventListener('input', () => {
      const idx = Number(input.dataset.idx);
      itemQueries[idx] = input.value;
      const pk = currentRun.team[idx];
      const sel = document.getElementById(`itemSelect_${idx}`);
      if (!pk || !sel) return;
      const held = (pk.heldItem && typeof pk.heldItem === 'object') ? pk.heldItem.id : (pk.heldItem || '');
      sel.innerHTML = itemOptionsHtml(pk, held, input.value);
    });
  });

  document.getElementById('btnHealTeam')?.addEventListener('click', () => {
    if (!currentRun || !currentRun.team) return;
    currentRun.team.forEach(p => {
      if (typeof p.maxHp === 'number') p.currentHp = p.maxHp;
      if (p.status) p.status = 0;
    });
    autoSave();
    renderTeam();
    setStatus(t('team.healed'), 'ok');
  });

  document.getElementById('btnAllShiny')?.addEventListener('click', () => {
    if (!currentRun?.team) return;
    let n = 0;
    currentRun.team.forEach(pk => {
      if (pk.isShiny) return;
      pk.isShiny = true;
      pk.spriteUrl = spritePath(pk.speciesId, true);
      n++;
    });
    if (!n) return;
    autoSave();
    renderTeam();
    setStatus(t('team.shinyDone', { n }), 'ok');
  });

  document.getElementById('btnAllMaxTier')?.addEventListener('click', () => {
    if (!currentRun?.team) return;
    let n = 0;
    currentRun.team.forEach(pk => {
      if ((pk.moveTier || 0) >= MAX_MOVE_TIER) return;
      pk.moveTier = MAX_MOVE_TIER;
      n++;
    });
    if (!n) return;
    autoSave();
    renderTeam();
    setStatus(t('team.tierDone', { n }), 'ok');
  });

  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentRun.team.splice(parseInt(e.currentTarget.dataset.remove), 1);
      // Gli indici scalano: i pannelli aperti indicherebbero altri Pokemon.
      openPanels.clear();
      autoSave();
      renderTeam();
    });
  });

  document.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.currentTarget.dataset.edit;
      const panel = document.getElementById(`advStats_${idx}`);
      const open = panel.classList.toggle('active');
      if (open) openPanels.add(Number(idx)); else openPanels.delete(Number(idx));
    });
  });

  document.querySelectorAll('.bind-team').forEach(inp => {
    inp.addEventListener('change', async (e) => {
      const idx = e.currentTarget.dataset.idx;
      const field = e.currentTarget.dataset.field;
      let val = e.currentTarget.value;
      if (e.currentTarget.type === 'number') val = parseInt(val) || 0;
      if (e.currentTarget.type === 'checkbox') val = e.currentTarget.checked;
      // Il tier arriva da una <select>, quindi come stringa: il gioco lo salva
      // come numero e scriverci "2" lascerebbe il salvataggio incoerente.
      if (field === 'moveTier') val = parseInt(val, 10) || 0;

      // Le megapietre arrivano dal menu con il prefisso "mega:": l'oggetto
      // vero lo costruisce il gioco, cosi' ha i campi che syncMegaForm cerca.
      if (field === 'heldItem' && /^megax?:/.test(String(val))) {
        const synthetic = String(val).startsWith('megax:');
        const stoneId = String(val).slice(synthetic ? 6 : 5);
        // Per le forme senza pietra la definizione la mettiamo noi, ma
        // l'oggetto lo costruisce comunque il gioco.
        const def = synthetic
          ? megaStonesFor(currentRun.team[idx].speciesId).find(x => x.id === stoneId)
          : null;
        const item = synthetic
          ? (def ? await buildMegaStoneItemFromDef(def).catch(() => null) : null)
          : await buildMegaStoneItem(stoneId).catch(() => null);
        if (!item) {
          setStatus(t('team.megaFailed'), 'err');
          renderTeam();
          return;
        }
        currentRun.team[idx].heldItem = item;
        autoSave();
        renderTeam();
        setStatus(t('team.megaAssigned', { name: item.megaName || item.name }), 'ok');
        return;
      }

      if (field === 'heldItem') {
        if (val === '') {
          currentRun.team[idx].heldItem = null;
        } else {
          currentRun.team[idx].heldItem = { id: val, name: itemGameName(val), desc: "Assegnato dall'Editor", icon: "✨" };
        }
      } else if (field === '_mutationType') {
        setMutationType(idx, val);
        autoSave();
        renderTeam();
        return;
      } else if (field === '_augmentPct' || field === '_mutationPct') {
        // Bonus percentuali: cambiano i PS massimi, che il gioco ricalcola
        // solo al prossimo aumento di livello. Si riscalano subito.
        const pk = currentRun.team[idx];
        const before = hpFactor(pk);
        pk[field] = Math.max(0, val);
        rescaleHp(pk, before);
        autoSave();
        renderTeam();
        return;
      } else {
        currentRun.team[idx][field] = val;
      }
      
      if (field === 'isShiny') {
        // Il gioco salva il percorso relativo, non l'URL assoluto.
        const id = currentRun.team[idx].speciesId;
        currentRun.team[idx].spriteUrl = val
          ? `img/sprites/pokemon/shiny/${id}.png`
          : `img/sprites/pokemon/${id}.png`;
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
        const id = currentRun.team[idx].speciesId;
        currentRun.team[idx].baseStats = getBaseStats(id) || { ...getSpeciesData(id) };
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
  // Tutti gli handler della scheda Squadra (cura, rimuovi, modifica stat, bind
  // dei campi) vengono agganciati in renderTeam() a ogni render, perché il
  // contenuto è rigenerato dinamicamente. Non serve altro qui.
}
