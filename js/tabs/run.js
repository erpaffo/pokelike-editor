import {
  currentRun, currentPokedollars, setCurrentPokedollars, autoSave, passivePool, endlessState,
  POKEMON_NAMES, MAX_POKEDOLLARS
} from '../state.js';
import { readSignatureItems } from '../page.js';
import { isBroken, disabledHtml } from '../compat.js';
import {
  NODE_IDS, NODE_INFO, availableNodeTypes, unavailableReason, isSubMap, towerMapIndex
} from '../mapNodes.js';
import { renderAll } from '../main.js';
import { setStatus, esc } from '../ui.js';
import { t } from '../i18n.js';
import { filterBySearch, searchBoxHtml, bindSearchBox, searchTerms } from '../search.js';

// Quanti passivi puo' tenere la run. Il gioco decide cosi':
//   endless  -> min(ER_PASSIVE_SLOTS_MAX, run.erPassiveSlots ?? 6)
//   altrimenti -> run.challengePassiveCap || MAX_PASSIVES
const ER_PASSIVE_SLOTS_MAX = 10;
const ER_PASSIVE_SLOTS_START = 6;
const MAX_PASSIVES = 5;

export function passiveSlots(run) {
  if (!run) return MAX_PASSIVES;
  if (run.challengeEndless2 || (run.isEndlessMode && run.erPassiveSlots != null)) {
    return Math.min(ER_PASSIVE_SLOTS_MAX, run.erPassiveSlots ?? ER_PASSIVE_SLOTS_START);
  }
  return run.challengePassiveCap || MAX_PASSIVES;
}

// Il testo cercato vive fuori dalla funzione di disegno: la lista si ridisegna
// a ogni carattere e altrimenti si azzererebbe da sola.
let passiveQuery = '';

function renderPassives() {
  const host = document.getElementById('passivesSection');
  if (!host) return;

  if (!currentRun) { host.innerHTML = ''; return; }

  const active = Array.isArray(currentRun.passives) ? currentRun.passives : [];
  const slots = passiveSlots(currentRun);
  const chosen = new Set(active.map(p => p.id));

  if (!passivePool) {
    host.innerHTML = `
      <div class="section-title">✨ ${t('run.passives')}</div>
      <div style="font-size:11px; color:var(--text-muted);">${t('run.passivesUnavailable')}</div>`;
    return;
  }

  // La ricerca guarda anche i nomi nelle altre lingue (campo `search`), cosi'
  // "uovo fortunato" e "lucky egg" trovano la stessa voce.
  const shown = filterBySearch(passivePool, passiveQuery,
    p => searchTerms(p.label, p.labelDesc, p.name, p.desc, p.id, p.search));

  host.innerHTML = `
    <div class="section-title" style="display:flex; align-items:center; justify-content:space-between;">
      <span>✨ ${t('run.passives')}</span>
      <span style="font-size:11px; font-weight:500; color:${chosen.size > slots ? 'var(--red-light)' : 'var(--text-muted)'};">
        ${t('run.passiveSlots', { n: chosen.size, m: slots })}
      </span>
    </div>
    <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px; line-height:1.45;">
      ${t('run.passivesHint')}
    </p>
    ${searchBoxHtml('passiveSearch', t('search.passives'), passiveQuery)}
    ${shown.length ? '' : `<p style="font-size:11px; color:var(--text-muted);">${t('search.noResults', { q: passiveQuery })}</p>`}
    <div style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto; padding-right:4px;">
      ${shown.map(p => {
        const on = chosen.has(p.id);
        const full = !on && chosen.size >= slots;
        // Il nome di gioco resta visibile sotto la traduzione quando i due
        // differiscono: serve a ritrovare l'oggetto se il gioco e' in inglese.
        const label = p.label || p.name;
        const hint = label !== p.name ? `<span style="opacity:0.7;"> · ${esc(p.name)}</span>` : '';
        return `
        <label style="display:flex; gap:8px; align-items:flex-start; background:rgba(0,0,0,0.2);
                      border:1px solid ${on ? 'var(--gold-dark)' : 'var(--border)'};
                      border-radius:8px; padding:8px 10px; cursor:${full ? 'not-allowed' : 'pointer'};
                      opacity:${full ? '0.45' : '1'};">
          <input type="checkbox" class="passive-toggle" data-id="${esc(p.id)}"
                 ${on ? 'checked' : ''} ${full ? 'disabled' : ''} style="margin-top:2px;">
          <span style="min-width:0;">
            <span style="font-size:12px; font-weight:600; color:${on ? 'var(--gold)' : 'var(--text)'};">
              ${esc(p.icon || '✨')} ${esc(label)}${hint}
            </span>
            <span style="display:block; font-size:10px; color:var(--text-muted); line-height:1.4;">${esc(p.labelDesc || p.desc)}</span>
          </span>
        </label>`;
      }).join('')}
    </div>`;

  host.querySelectorAll('.passive-toggle').forEach(cb => {
    cb.addEventListener('change', () => togglePassive(cb.dataset.id, cb.checked));
  });

  bindSearchBox('passiveSearch', (value) => {
    passiveQuery = value;
    renderPassives();
  });
}

function togglePassive(id, on) {
  if (!currentRun) return;
  if (!Array.isArray(currentRun.passives)) currentRun.passives = [];

  if (!on) {
    currentRun.passives = currentRun.passives.filter(p => p.id !== id);
  } else {
    if (currentRun.passives.length >= passiveSlots(currentRun)) {
      setStatus(t('run.passivesFull', { m: passiveSlots(currentRun) }), 'err');
      renderPassives();
      return;
    }
    const def = (passivePool || []).find(p => p.id === id);
    if (!def) return;
    // Stessa forma con cui il gioco li memorizza, piu' il flag enabled.
    // label/labelDesc servono solo alla UI: nel salvataggio va la voce del gioco.
    const { label, labelDesc, ...entry } = def;
    currentRun.passives.push({ ...entry, enabled: true });
  }

  autoSave();
  renderPassives();
  const def = (passivePool || []).find(p => p.id === id);
  setStatus(t(on ? 'run.passiveAdded' : 'run.passiveRemoved', { name: def?.label || def?.name || id }), 'ok');
}

// ── Endless 2.0 ──────────────────────────────────────────────────────────
// Campi propri della Torre 2.0 (run.challengeEndless2), tutti nel salvataggio
// della run:
//   erPassiveSlots    slot passivi, da 6 a 10 (erPassiveSlots del gioco)
//   erCatchLevelBonus livelli aggiunti ai Pokemon catturati (doCatchNode)
//   erMode            "challenge" (Hardcore) o "creative": cambia curva e
//                     record, quindi qui si mostra soltanto
//   erSignature       { id, uid }: l'Oggetto Firma e il _uid di chi lo tiene
//
// Oggetti Firma risolti dal gioco per le specie in squadra; la chiave evita di
// richiederli a ogni ridisegno.
let sigBySpecies;
let sigKey = null;

function isEndless2(run) {
  return !!(run && run.challengeEndless2);
}

function memberName(pk) {
  return pk.nickname || pk.name || POKEMON_NAMES[pk.speciesId] || `#${pk.speciesId}`;
}

function renderEndless2() {
  const host = document.getElementById('endless2Section');
  if (!host) return;
  if (!isEndless2(currentRun)) { host.innerHTML = ''; host.style.display = 'none'; return; }
  host.style.display = '';
  if (isBroken('endless2')) {
    host.innerHTML = `<div class="section-title">🗼 ${t('er.title')}</div>${disabledHtml('endless2')}`;
    return;
  }

  const team = (currentRun.team || []).filter(pk => pk && pk.speciesId);
  const key = team.map(pk => pk.speciesId).join(',');
  if (key !== sigKey) {
    sigKey = key;
    sigBySpecies = undefined;
    readSignatureItems(team.map(pk => pk.speciesId))
      .catch(() => null)
      .then(res => { if (sigKey === key) { sigBySpecies = res; renderEndless2(); } });
  }

  const slots = currentRun.erPassiveSlots ?? ER_PASSIVE_SLOTS_START;
  const mode = currentRun.erMode === 'creative' ? t('er.modeCreative')
    : currentRun.erMode ? t('er.modeHardcore') : t('er.modeUnset');
  const holder = currentRun.erSignature?.uid;

  let sigHtml;
  if (isBroken('signature')) {
    sigHtml = disabledHtml('signature');
  } else if (sigBySpecies === undefined) {
    sigHtml = `<p style="font-size:11px; color:var(--text-muted);">${t('er.sigLoading')}</p>`;
  } else if (!sigBySpecies) {
    sigHtml = `<p style="font-size:11px; color:var(--red-light);">${t('er.sigUnavailable')}</p>`;
  } else {
    const options = team.map(pk => {
      const sig = sigBySpecies[pk.speciesId];
      if (!sig || pk._uid == null) return '';
      return `<option value="${esc(String(pk._uid))}"${holder === pk._uid ? ' selected' : ''}>${esc(memberName(pk))} — ${esc(sig.name)}</option>`;
    }).join('');
    const current = team.find(pk => pk._uid === holder);
    const currentSig = current && sigBySpecies[current.speciesId];
    sigHtml = `
      <div class="field-row">
        <select id="erSignatureSelect" class="field-input" style="flex:1; min-width:0;">
          <option value="">${t('er.sigNone')}</option>${options}
        </select>
      </div>
      ${currentSig ? `<p style="font-size:10px; color:var(--text-muted); margin-top:4px; line-height:1.4;">${esc(currentSig.desc)}</p>` : ''}`;
  }

  host.innerHTML = `
    <div class="section-title">🗼 ${t('er.title')}</div>
    <div class="field-row">
      <label class="field-label" style="width:150px;">${t('er.passiveSlots')}</label>
      <input type="number" id="erPassiveSlots" class="field-input" min="${ER_PASSIVE_SLOTS_START}" max="${ER_PASSIVE_SLOTS_MAX}" value="${slots}" style="flex:1;">
    </div>
    <div class="field-row">
      <label class="field-label" style="width:150px;">${t('er.catchBonus')}</label>
      <input type="number" id="erCatchLevelBonus" class="field-input" min="0" value="${currentRun.erCatchLevelBonus || 0}" style="flex:1;">
    </div>
    <div class="field-row">
      <span class="field-label" style="width:150px;">${t('er.mode')}</span>
      <span style="font-size:12px;">${esc(mode)}</span>
    </div>
    <div class="section-title" style="margin-top:12px; font-size:12px;">${t('er.sigTitle')}</div>
    <p style="font-size:11px; color:var(--text-muted); margin-bottom:6px; line-height:1.45;">${t('er.sigHint')}</p>
    ${sigHtml}`;

  host.querySelector('#erPassiveSlots')?.addEventListener('change', (e) => {
    const n = parseInt(e.target.value, 10) || ER_PASSIVE_SLOTS_START;
    currentRun.erPassiveSlots = Math.min(ER_PASSIVE_SLOTS_MAX, Math.max(ER_PASSIVE_SLOTS_START, n));
    autoSave();
    renderEndless2();
    renderPassives();
  });
  host.querySelector('#erCatchLevelBonus')?.addEventListener('change', (e) => {
    currentRun.erCatchLevelBonus = Math.max(0, parseInt(e.target.value, 10) || 0);
    autoSave();
    renderEndless2();
  });
  host.querySelector('#erSignatureSelect')?.addEventListener('change', (e) => {
    const pk = team.find(p => String(p._uid) === e.target.value);
    const sig = pk && sigBySpecies?.[pk.speciesId];
    if (!sig) {
      delete currentRun.erSignature;
      setStatus(t('er.sigRemoved'), 'ok');
    } else {
      currentRun.erSignature = { id: sig.id, uid: pk._uid };
      setStatus(t('er.sigAssigned', { item: sig.name, name: memberName(pk) }), 'ok');
    }
    autoSave(false);
    renderEndless2();
  });
}

export function renderRun() {
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

  renderEndless2();
  renderPassives();

  renderMapEditor();
}

// ── Editor della mappa ────────────────────────────────────────────────────
// I tipi di nodo non sono tutti uguali fra le modalita': il Pokemart e la
// squadra cattiva esistono solo nella Torre dalla mappa 31, mentre Silver,
// Magma/Aqua, Sottosuolo, Distorsione e Rivale N sono posati a mano nelle run
// storia della generazione giusta. Offrire un tipo fuori dal suo contesto
// darebbe un nodo che il gioco non sa gestire, quindi il menu mostra solo
// quelli leciti e spiega perche' gli altri non ci sono.
export function renderMapEditor() {
  const host = document.getElementById('mapEditorContainer');
  if (!host) return;

  const map = currentRun && currentRun.map;
  if (!currentRun || !map || !map.layers) {
    host.innerHTML = `<div style="color:var(--text-muted); font-size:12px; text-align:center; padding:20px;">${t('run.noMap')}</div>`;
    return;
  }

  const available = availableNodeTypes(currentRun, endlessState, map);
  const availableSet = new Set(available);
  const submap = isSubMap(map);
  const groups = ['common', 'structural', 'tower', 'story', 'submap'];

  const optionsFor = (current) => {
    // Un nodo puo' avere un tipo che qui non sarebbe proponibile (mappa
    // generata prima, o modalita' diversa): va comunque mostrato, altrimenti
    // il menu lo cambierebbe da solo al primo ridisegno.
    const ids = availableSet.has(current) || !current ? available : [current, ...available];
    return groups.map(group => {
      const inGroup = ids.filter(id => (NODE_INFO[id]?.group || 'common') === group);
      if (!inGroup.length) return '';
      const opts = inGroup.map(id =>
        `<option value="${id}"${id === current ? ' selected' : ''}>${esc(t('node.' + id))}</option>`).join('');
      return `<optgroup label="${esc(t('nodeGroup.' + group))}">${opts}</optgroup>`;
    }).join('');
  };

  const layers = map.layers;
  let html = `
    <p style="font-size:10px; color:var(--text-muted); margin:0 0 8px;">
      ${t(submap ? 'map.contextSubmap' : (currentRun.isEndlessMode ? 'map.contextTower' : 'map.contextStory'),
          { n: currentRun.isEndlessMode ? towerMapIndex(endlessState, currentRun) : (currentRun.currentMap ?? 0) })}
    </p>`;

  layers.forEach((layer, layerIdx) => {
    const fixed = layerIdx === 0 || layerIdx === layers.length - 1;
    if (fixed) {
      html += `<div style="margin-bottom:8px;">
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">${t('map.layerFixed', { n: layerIdx })}</div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">`;
      (layer || []).forEach(node => {
        html += `<div style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px; font-size:11px;">${esc(node.id)} [${esc(t('node.' + node.type))}]</div>`;
      });
      html += '</div></div>';
      return;
    }

    html += `<div style="margin-bottom:12px; background:rgba(0,0,0,0.2); padding:8px; border-radius:8px;">
      <div style="font-size:11px; color:var(--gold); margin-bottom:6px;">${t('map.layer', { n: layerIdx })}</div>
      <div style="display:flex; flex-direction:column; gap:6px;">`;

    (layer || []).forEach((node, colIdx) => {
      const foreign = node.type && !availableSet.has(node.type);
      html += `
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="font-size:11px; width:44px; color:var(--text-muted);">${esc(node.id)}</div>
          <select class="field-input bind-map-node" data-layer="${layerIdx}" data-col="${colIdx}"
                  data-id="${esc(node.id)}" style="flex:1; min-width:0; padding:4px; font-size:11px;">
            ${optionsFor(node.type)}
          </select>
          ${foreign ? `<span title="${esc(t('map.foreignNode'))}" style="font-size:12px;">⚠️</span>` : ''}
        </div>`;
    });
    html += '</div></div>';
  });

  const hidden = NODE_IDS.filter(id => !availableSet.has(id));
  if (hidden.length) {
    const reasons = hidden.map(id => {
      const why = unavailableReason(id, currentRun, endlessState, map);
      return `${t('node.' + id)} — ${t('map.why.' + (why || 'unknown'))}`;
    });
    html += `<details style="margin-top:6px;">
      <summary style="font-size:10px; color:var(--text-muted); cursor:pointer;">${t('map.hiddenTypes', { n: hidden.length })}</summary>
      <div style="font-size:10px; color:var(--text-muted); line-height:1.6; margin-top:4px;">
        ${reasons.map(r => '• ' + esc(r)).join('<br>')}
      </div>
    </details>`;
  }

  host.innerHTML = html;

  host.querySelectorAll('.bind-map-node').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const l = parseInt(e.target.dataset.layer, 10);
      const c = parseInt(e.target.dataset.col, 10);
      const id = e.target.dataset.id;
      const newType = e.target.value;

      const node = currentRun.map.layers[l]?.[c];
      if (!node) return;
      node.type = newType;
      // La mappa tiene gli stessi nodi in due posti: layers per il disegno e
      // nodes per la logica. Cambiarne uno solo lascerebbe i due disallineati.
      if (currentRun.map.nodes && currentRun.map.nodes[id]) {
        currentRun.map.nodes[id].type = newType;
      }
      autoSave();
      renderMapEditor();
      setStatus(t('map.nodeChanged', { id, type: t('node.' + newType) }), 'ok');
    });
  });
}

export function initRunListeners() {
  const moneyInput = document.getElementById('runMoney');
  if (moneyInput) moneyInput.max = String(MAX_POKEDOLLARS);

  // Il valore mostrato torna quello effettivo, cioe' dopo il tetto.
  document.querySelectorAll('.btn-money').forEach(btn => {
    btn.addEventListener('click', () => {
      setCurrentPokedollars(currentPokedollars + (Number(btn.dataset.amt) || 0));
      if (moneyInput) moneyInput.value = currentPokedollars;
      autoSave();
    });
  });

  ['runMoney','runBadges','runMap','runEndlessStage'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', (e) => {
      const val = parseInt(e.currentTarget.value) || 0;
      if (id === 'runMoney') {
        setCurrentPokedollars(val);
        e.currentTarget.value = currentPokedollars;
        autoSave();
        return;
      }
      if (!currentRun) return;
      if(id === 'runBadges') currentRun.badges = val;
      if(id === 'runMap') currentRun.currentMap = val;
      if(id === 'runEndlessStage') currentRun.endlessStage = val;
      autoSave();
    });
  });
  
  ['runNuzlocke','runEndless'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', (e) => {
      const val = e.currentTarget.checked;
      if(id === 'runNuzlocke') currentRun.nuzlockeMode = val;
      if(id === 'runEndless') {
        currentRun.isEndlessMode = val;
        renderRun();
      }
      autoSave();
    });
  });
}
