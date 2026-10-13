import { currentRun, autoSave, traitCatalog, runSource } from '../state.js';
import { setStatus, esc } from '../ui.js';
import { t } from '../i18n.js';
import { typeName, ALL_TYPES } from '../pokemonTypes.js';
import { legendaryStarters } from '../constants.js';
import {
  writeTraitTiersCache, readForcedTraits, writeForcedTraits,
  isForceTraitsRegistered, registerForceTraits, unregisterForceTraits
} from '../page.js';
import {
  MAX_TIER, computeTraitPoints, tierFromPoints, computeTraitTiers,
  maxReachableTier, planForTier
} from '../traits.js';

const LEGENDARY_SET = new Set(legendaryStarters);
const isLegendary = (speciesId) => LEGENDARY_SET.has(speciesId);

// Lo sprite shiny sta su un percorso diverso: come in team.js, cambiare
// isShiny senza aggiornarlo lascerebbe l'immagine della forma normale.
function spritePath(speciesId, shiny) {
  return shiny
    ? `img/sprites/pokemon/shiny/${speciesId}.png`
    : `img/sprites/pokemon/${speciesId}.png`;
}

function baseTypesOf(pk) {
  const types = pk.types || [];
  const extra = pk._mutationType;
  if (!extra) return types;
  if (types[types.length - 1] === extra) return types.slice(0, -1);
  return types.filter(type => type !== extra);
}

function traitText(type, tier) {
  if (!traitCatalog || !traitCatalog.types) return '';
  const list = traitCatalog.types[type];
  if (!Array.isArray(list) || tier < 1) return '';
  return list[tier - 1] || '';
}

// Il tipo scelto nel menu sopravvive al ridisegno: senza, ogni "applica"
// riporterebbe la tendina al primo tipo.
let selectedType = '';

// ── Tratti forzati ───────────────────────────────────────────────────────
// I tier non si possono imporre dal salvataggio, perche' il gioco li ricalcola
// dalla squadra prima di ogni lotta. Con questa funzione l'estensione registra
// uno script che avvolge quel calcolo nella pagina e ne sostituisce il
// risultato: e' l'unico modo per avere valori scelti, anche oltre il tetto
// del gioco, senza toccare la squadra.
//
// Il limite del gioco e' 12; qui si arriva piu' in alto perche' le formule di
// combattimento (buildTraitsConfig) usano il numero cosi' com'e', senza
// ricopiarlo sul massimo. Alcuni effetti hanno pero' un tetto proprio
// (Acciaio si ferma al 90% di riduzione, Spettro al 50% di esecuzione), quindi
// oltre una certa soglia quei tratti smettono di crescere.
const FORCED_MAX = 99;
// `hud` descrive il riquadro che lo script mostra nella pagina del gioco:
// se e' visibile, dove l'utente lo ha trascinato, e le etichette gia' tradotte
// (lo script gira nella pagina e non vede il dizionario dell'estensione).
let forced = { enabled: false, tiers: {}, hud: { visible: true } };
let forcedActive = false;   // lo script e' davvero registrato
let forcedLoaded = false;

export async function loadForcedTraits() {
  const [cfg, active] = await Promise.all([
    readForcedTraits().catch(() => null),
    isForceTraitsRegistered().catch(() => false)
  ]);
  forced = (cfg && typeof cfg === 'object')
    ? {
        enabled: !!cfg.enabled,
        tiers: cfg.tiers && typeof cfg.tiers === 'object' ? cfg.tiers : {},
        hud: cfg.hud && typeof cfg.hud === 'object' ? cfg.hud : { visible: true }
      }
    : { enabled: false, tiers: {}, hud: { visible: true } };
  if (forced.hud.visible === undefined) forced.hud.visible = true;
  forcedActive = !!active;
  forcedLoaded = true;
  renderTraits();
}

async function persistForced() {
  // Le etichette viaggiano con la configurazione: cosi' il riquadro nel gioco
  // parla la lingua scelta nell'estensione senza doverne conoscere il
  // dizionario, e cambia lingua appena si salva di nuovo.
  forced.hud = Object.assign({}, forced.hud, {
    labels: {
      title: t('forced.hudTitle'),
      empty: t('forced.none'),
      hide: t('forced.hudHide'),
      drag: t('forced.hudDrag')
    }
  });
  await writeForcedTraits(forced.enabled
    ? forced
    : { enabled: false, tiers: forced.tiers, hud: forced.hud });
  // Lo script serve solo quando la funzione e' accesa: spegnendola va tolto,
  // altrimenti resterebbe a girare sulla pagina del gioco per sempre.
  if (forced.enabled) {
    await registerForceTraits();
    forcedActive = true;
  } else {
    await unregisterForceTraits();
    forcedActive = false;
  }
}

function forcedRowsHtml() {
  const rows = Object.keys(forced.tiers)
    .filter(type => Number(forced.tiers[type]) > 0)
    .sort((a, b) => Number(forced.tiers[b]) - Number(forced.tiers[a]));
  if (!rows.length) {
    return `<p style="font-size:10px; color:var(--text-muted);">${t('forced.none')}</p>`;
  }
  return rows.map(type => `
    <div style="display:flex; gap:6px; align-items:center; padding:3px 0;">
      <span style="min-width:74px; font-size:11px; color:var(--gold);">${esc(typeName(type))}</span>
      <span style="flex:1; font-size:11px;">${t('traits.tierN', { n: forced.tiers[type], m: MAX_TIER })}${
        Number(forced.tiers[type]) > MAX_TIER ? ` <span style="color:var(--red-light);">${t('forced.beyond')}</span>` : ''
      }</span>
      <button class="btn btn-sm" data-forced-del="${type}" title="${esc(t('common.delete'))}">✕</button>
    </div>`).join('');
}

function forcedSectionHtml() {
  const typeOptions = ALL_TYPES
    .map(type => `<option value="${type}">${esc(typeName(type))}</option>`).join('');
  return `
    <div class="section" style="margin-top:14px;">
      <div class="section-title" style="display:flex; align-items:center; justify-content:space-between;">
        <span>🧪 ${t('forced.title')}</span>
        <span style="font-size:10px; font-weight:500; color:${forced.enabled && forcedActive ? 'var(--gold)' : 'var(--text-muted)'};">
          ${forced.enabled && forcedActive ? t('forced.on') : t('forced.off')}
        </span>
      </div>
      <p style="font-size:11px; color:var(--text-muted); line-height:1.45; margin-bottom:8px;">
        ${t('forced.hint')}
      </p>
      <label style="display:flex; gap:8px; align-items:flex-start; font-size:11px; margin-bottom:10px; cursor:pointer;">
        <input type="checkbox" id="forcedEnabled" ${forced.enabled ? 'checked' : ''} style="margin-top:2px;">
        <span>${t('forced.enable')}</span>
      </label>
      <div class="field-row">
        <select id="forcedType" class="field-input" style="flex:1; min-width:0;">${typeOptions}</select>
        <input type="number" id="forcedTier" class="field-input" min="0" max="${FORCED_MAX}"
               value="${MAX_TIER}" style="width:70px;">
        <button class="btn btn-accent" id="btnForcedSet">${t('common.apply')}</button>
      </div>
      <div style="margin-top:8px;">${forcedRowsHtml()}</div>
      ${Object.keys(forced.tiers).length
        ? `<button class="btn w-100" id="btnForcedClear" style="margin-top:8px;">${t('forced.clear')}</button>`
        : ''}
      <label style="display:flex; gap:8px; align-items:flex-start; font-size:11px; margin-top:10px; cursor:pointer;">
        <input type="checkbox" id="forcedHud" ${forced.hud.visible !== false ? 'checked' : ''}
               ${forced.enabled ? '' : 'disabled'} style="margin-top:2px;">
        <span>${t('forced.hudShow')}</span>
      </label>
      ${forced.hud.x != null || forced.hud.y != null
        ? `<button class="btn w-100" id="btnForcedHudReset" style="margin-top:6px;">${t('forced.hudReset')}</button>`
        : ''}
      <p style="font-size:10px; color:var(--text-muted); margin-top:8px; line-height:1.45;">
        ${t('forced.reloadNote')}
      </p>
    </div>`;
}

export function renderTraits() {
  const host = document.getElementById('traitsSection');
  if (!host) return;
  if (!currentRun) { host.innerHTML = ''; return; }

  const team = currentRun.team || [];
  const passives = currentRun.passives || [];
  const points = computeTraitPoints(team, passives, isLegendary);
  const active = Object.keys(points)
    .map(type => ({ type, points: points[type], tier: tierFromPoints(points[type]) }))
    .filter(row => row.tier > 0)
    .sort((a, b) => b.points - a.points);

  const ceiling = maxReachableTier(team, passives, isLegendary);
  if (!selectedType || !ALL_TYPES.includes(selectedType)) {
    selectedType = active[0]?.type || ALL_TYPES[0];
  }

  const rows = active.length
    ? active.map(row => `
        <div style="display:flex; gap:8px; align-items:flex-start; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="min-width:74px; font-size:11px; font-weight:600; color:var(--gold);">
            ${esc(typeName(row.type))}
          </span>
          <span style="min-width:58px; font-size:11px; color:var(--text);">
            ${t('traits.tierN', { n: row.tier, m: MAX_TIER })}
          </span>
          <span style="min-width:44px; font-size:10px; color:var(--text-muted);">
            ${t('traits.points', { n: row.points })}
          </span>
          <span style="flex:1; min-width:0; font-size:10px; color:var(--text-muted); line-height:1.4;">
            ${esc(traitText(row.type, row.tier))}
          </span>
        </div>`).join('')
    : `<p style="font-size:11px; color:var(--text-muted);">${t('traits.none')}</p>`;

  const tierOptions = Array.from({ length: MAX_TIER + 1 }, (_, i) => i)
    .map(n => `<option value="${n}"${n === Math.min(ceiling, MAX_TIER) ? ' selected' : ''}>${
      n === 0 ? t('traits.tierZero') : t('traits.tierN', { n, m: MAX_TIER })
    }${n > ceiling ? ' ' + t('traits.outOfReach') : ''}</option>`).join('');

  const typeOptions = ALL_TYPES
    .map(type => `<option value="${type}"${type === selectedType ? ' selected' : ''}>${esc(typeName(type))}</option>`)
    .join('');

  host.innerHTML = `
    <div class="section-title">🧬 ${t('traits.title')}</div>
    <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px; line-height:1.45;">
      ${t('traits.hint')}
    </p>
    ${currentRun.isEndlessMode ? '' : `
      <p style="font-size:11px; color:var(--red-light); margin-bottom:8px;">${t('traits.notEndless')}</p>`}
    <div style="margin-bottom:10px;">${rows}</div>
    <div class="field-row">
      <select id="traitType" class="field-input" style="flex:1; min-width:0;">${typeOptions}</select>
      <select id="traitTier" class="field-input" style="width:110px;">${tierOptions}</select>
      <button class="btn btn-accent" id="btnTraitApply">${t('common.apply')}</button>
    </div>
    <p style="font-size:10px; color:var(--text-muted); margin-top:6px;">
      ${t('traits.ceiling', { n: ceiling, m: MAX_TIER })}
    </p>
    <div id="traitPreview" style="font-size:10px; color:var(--text-muted); margin-top:6px; line-height:1.5;"></div>
    ${forcedLoaded ? forcedSectionHtml() : ''}`;

  document.getElementById('traitType')?.addEventListener('change', (e) => {
    selectedType = e.target.value;
    previewPlan();
  });
  document.getElementById('traitTier')?.addEventListener('change', previewPlan);
  document.getElementById('btnTraitApply')?.addEventListener('click', applyPlan);
  bindForced();
  previewPlan();
}

function bindForced() {
  document.getElementById('forcedEnabled')?.addEventListener('change', async (e) => {
    forced.enabled = e.target.checked;
    try {
      await persistForced();
      setStatus(t(forced.enabled ? 'forced.turnedOn' : 'forced.turnedOff'), 'ok');
    } catch (err) {
      forced.enabled = !forced.enabled;
      setStatus('❌ ' + err.message, 'err');
    }
    renderTraits();
  });

  document.getElementById('btnForcedSet')?.addEventListener('click', async () => {
    const type = document.getElementById('forcedType')?.value;
    const raw = parseInt(document.getElementById('forcedTier')?.value, 10);
    if (!type || !Number.isFinite(raw)) return;
    const value = Math.max(0, Math.min(FORCED_MAX, raw));
    if (value > 0) forced.tiers[type] = value;
    else delete forced.tiers[type];
    await persistForced();
    renderTraits();
    setStatus(value > 0
      ? t('forced.set', { type: typeName(type), n: value })
      : t('forced.removed', { type: typeName(type) }), 'ok');
  });

  document.querySelectorAll('[data-forced-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.forcedDel;
      delete forced.tiers[type];
      await persistForced();
      renderTraits();
      setStatus(t('forced.removed', { type: typeName(type) }), 'ok');
    });
  });

  document.getElementById('forcedHud')?.addEventListener('change', async (e) => {
    forced.hud = Object.assign({}, forced.hud, { visible: e.target.checked });
    await persistForced();
    renderTraits();
    setStatus(t(e.target.checked ? 'forced.hudShown' : 'forced.hudHidden'), 'ok');
  });

  document.getElementById('btnForcedHudReset')?.addEventListener('click', async () => {
    // Si tolgono le coordinate: lo script rimette il riquadro in alto a destra.
    const { x, y, ...rest } = forced.hud;
    forced.hud = rest;
    await persistForced();
    renderTraits();
    setStatus(t('forced.hudMoved'), 'ok');
  });

  document.getElementById('btnForcedClear')?.addEventListener('click', async () => {
    forced.tiers = {};
    await persistForced();
    renderTraits();
    setStatus(t('forced.cleared'), 'ok');
  });
}

function currentPlan() {
  const type = document.getElementById('traitType')?.value;
  const tier = parseInt(document.getElementById('traitTier')?.value, 10);
  if (!type || !Number.isFinite(tier)) return null;
  return {
    type,
    tier,
    plan: planForTier(currentRun.team || [], currentRun.passives || [], type, tier, isLegendary)
  };
}

function describeChange(c) {
  if (c.kind === 'shiny') return t('traits.changeShiny', { name: c.name });
  if (c.kind === 'mutate') return t('traits.changeMutate', { name: c.name, type: typeName(c.type) });
  if (c.kind === 'markMutant') return t('traits.changeMark', { name: c.name, type: typeName(c.type) });
  return t('traits.changeRemutate', {
    name: c.name, type: typeName(c.type), from: typeName(c.from)
  });
}

function previewPlan() {
  const box = document.getElementById('traitPreview');
  if (!box) return;
  const cur = currentPlan();
  if (!cur) { box.innerHTML = ''; return; }

  const { plan, tier, type } = cur;
  if (!plan.changes.length) {
    box.innerHTML = `<span style="color:var(--green, #00e676);">${t('traits.alreadyThere')}</span>`;
    return;
  }
  const list = plan.changes.map(c => `• ${esc(describeChange(c))}`).join('<br>');
  const head = plan.reached
    ? t('traits.planHead', { n: plan.changes.length })
    : `<span style="color:var(--red-light);">${esc(t('traits.planShort', { n: plan.tier, m: tier }))}</span>`;
  const effect = traitText(type, Math.min(plan.tier, MAX_TIER));
  box.innerHTML = `${head}<br>${list}${effect ? `<br><em>${esc(effect)}</em>` : ''}`;
}

async function applyPlan() {
  const cur = currentPlan();
  if (!cur || !currentRun?.team) return;
  const { plan, type } = cur;
  if (!plan.changes.length) return setStatus(t('traits.alreadyThere'), 'ok');

  plan.changes.forEach(c => {
    const pk = currentRun.team[c.idx];
    if (!pk) return;
    if (c.kind === 'shiny') {
      pk.isShiny = true;
      pk.spriteUrl = spritePath(pk.speciesId, true);
      return;
    }
    // mutate / remutate / markMutant: il tipo extra va tenuto allineato fra
    // types e _mutationType, e messo in fondo come fa erApplyMutation.
    const base = baseTypesOf(pk);
    pk._mutated = true;
    pk._mutationType = type;
    pk._mutationPct = pk._mutationPct ?? 50;
    pk.types = [...base.filter(x => x !== type), type];
  });

  autoSave();

  // La cache dell'HUD viene riallineata subito: il gioco la ricalcolera'
  // comunque alla lotta seguente, ma cosi' i numeri coincidono da subito.
  const tiers = computeTraitTiers(currentRun.team, currentRun.passives || [], isLegendary);
  writeTraitTiersCache(tiers, runSource).catch(() => {});

  renderTraits();
  setStatus(t('traits.applied', {
    type: typeName(type), n: tierFromPoints(computeTraitPoints(
      currentRun.team, currentRun.passives || [], isLegendary)[type] || 0)
  }), 'ok');
}
