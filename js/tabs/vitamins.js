import { currentRun, autoSave, POKEMON_NAMES, speciesSearchTerms } from '../state.js';
import { setStatus, esc } from '../ui.js';
import { t } from '../i18n.js';
import { filterBySearch, searchBoxHtml, bindSearchBox, searchTerms } from '../search.js';
import { baseFormStarters, legendaryStarters } from '../constants.js';
import { readSaveKeys, writeSaveKeys, evoLineRoots } from '../page.js';

// Le vitamine non si danno durante una run ma prima, scegliendo lo starter:
// il gioco le conserva in poke_stat_buffs indicizzate per capostipite della
// linea evolutiva (getLineTotalBuff usa getEvoLineRoot). L'unita' di lavoro
// e' quindi lo starter selezionabile, non il Pokemon che si ha in squadra.
//
// Il gioco vende cinque vitamine, una per statistica, ognuna fino a 10
// (buyVitamin: Math.min(10, ...)), e ogni punto vale +5%.
//
// L'attacco fa eccezione: la Proteina alza insieme atk e special, e
// getTotalBuffPoints li conta come uno solo prendendone il massimo. Vanno
// quindi trattati come un'unica categoria.
export const MAX_BUFF = 10;

export const VITAMINS = [
  { id: 'hp',    item: 'HP Up',   stats: ['hp'] },
  { id: 'atk',   item: 'Protein', stats: ['atk', 'special'] },
  { id: 'def',   item: 'Iron',    stats: ['def'] },
  { id: 'spdef', item: 'Zinc',    stats: ['spdef'] },
  { id: 'speed', item: 'Carbos',  stats: ['speed'] }
];

export const MAX_TOTAL = VITAMINS.length * MAX_BUFF;

const BUFFS_KEY = 'poke_stat_buffs';

// Tutti i Pokemon di primo stadio selezionabili: forme base piu' leggendari,
// cioe' esattamente i capostipiti delle linee evolutive.
export const STARTER_LINES = [...baseFormStarters, ...legendaryStarters]
  .sort((a, b) => a - b);

let buffs = {};
let loadError = '';
let selectedTarget = 'all';
// 366 starter in un menu: senza filtro trovarne uno e' una caccia.
let targetQuery = '';
let selectedVitamin = 'all';

const vitaminLabel = (v) => t('vit.' + v.id);
const lineName = (id) => `#${id} ${POKEMON_NAMES[id] || ''}`.trim();

// Totale come lo calcola il gioco: atk e special contano una volta sola.
export function totalBuffPoints(b) {
  if (!b) return 0;
  return Math.max(b.atk || 0, b.special || 0)
    + (b.hp || 0) + (b.def || 0) + (b.spdef || 0) + (b.speed || 0);
}

function statsToFill() {
  return selectedVitamin === 'all'
    ? VITAMINS.flatMap(v => v.stats)
    : (VITAMINS.find(v => v.id === selectedVitamin)?.stats || []);
}

function applyTo(current, stats) {
  const out = { ...(current || {}) };
  stats.forEach(s => { out[s] = MAX_BUFF; });
  return out;
}

function paint() {
  const el = document.getElementById('contentVitamins');
  if (!el) return;

  const maxed = STARTER_LINES.filter(id => totalBuffPoints(buffs[id]) >= MAX_TOTAL).length;
  const pct = Math.round((maxed / STARTER_LINES.length) * 100);

  let detail = '';
  if (selectedTarget !== 'all') {
    const id = Number(selectedTarget);
    const b = buffs[id];
    const total = totalBuffPoints(b);
    detail = `
      <div class="goal ${total >= MAX_TOTAL ? 'done' : ''}">
        <div class="goal-main">
          <div class="goal-label">${total >= MAX_TOTAL ? '⭐ ' : ''}${esc(lineName(id))}</div>
          <div class="goal-value">${total} / ${MAX_TOTAL} — ${VITAMINS.map(v =>
            `${esc(vitaminLabel(v))} ${Math.max(...v.stats.map(s => b?.[s] || 0))}/${MAX_BUFF}`
          ).join(' · ')}</div>
          <div class="goal-bar"><i style="width:${Math.round((total / MAX_TOTAL) * 100)}%"></i></div>
        </div>
      </div>`;
  }

  // Si cerca per numero ("#130", "130") e per nome in qualsiasi lingua che il
  // gioco conosca, non solo in quella dell'interfaccia.
  const shownTargets = filterBySearch(STARTER_LINES, targetQuery,
    id => searchTerms(String(id), POKEMON_NAMES[id], speciesSearchTerms(id)));

  el.innerHTML = `
    <div class="section">
      <div class="section-title" style="color: var(--gold);">💊 ${t('vit.title')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:10px; line-height:1.45;">
        ${t('vit.intro', { max: MAX_BUFF })}
      </p>
      ${loadError ? `<p style="font-size:11px; color:var(--red-light);">${esc(loadError)}</p>` : ''}

      <div class="field-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
        <label class="field-label" style="font-size:12px;">${t('vit.who')}</label>
        ${searchBoxHtml('vitSearch', t('search.starters'), targetQuery)}
        <select id="vitTarget" class="field-input" style="width:100%;" size="${shownTargets.length > 8 ? 8 : 0}">
          <option value="all"${selectedTarget === 'all' ? ' selected' : ''}>${t('vit.allStarters', { n: STARTER_LINES.length })}</option>
          ${shownTargets.map(id => {
            const done = totalBuffPoints(buffs[id]) >= MAX_TOTAL;
            return `<option value="${id}"${String(selectedTarget) === String(id) ? ' selected' : ''}>${done ? '⭐ ' : ''}${esc(lineName(id))}</option>`;
          }).join('')}
        </select>
        ${shownTargets.length ? '' : `<p style="font-size:10px; color:var(--text-muted);">${t('search.noResults', { q: targetQuery })}</p>`}
      </div>

      <div class="field-row" style="flex-direction:column; align-items:flex-start; gap:6px; margin-top:12px;">
        <label class="field-label" style="font-size:12px;">${t('vit.which')}</label>
        <select id="vitKind" class="field-input" style="width:100%;">
          <option value="all"${selectedVitamin === 'all' ? ' selected' : ''}>${t('vit.allStats')}</option>
          ${VITAMINS.map(v =>
            `<option value="${v.id}"${selectedVitamin === v.id ? ' selected' : ''}>${esc(vitaminLabel(v))} — ${esc(v.item)}</option>`
          ).join('')}
        </select>
      </div>

      <button class="btn btn-gold w-100" id="btnMaxVitamins" style="margin-top:14px;">
        💊 ${t('vit.apply')}
      </button>
      <p style="font-size:10px; color:var(--text-muted); margin-top:8px; line-height:1.45;">
        ${t('vit.persistNote')}
      </p>
    </div>

    <div class="section">
      <div class="section-title">📊 ${t('vit.current')}</div>
      <div class="goal ${maxed === STARTER_LINES.length ? 'done' : ''}">
        <div class="goal-main">
          <div class="goal-label">🧬 ${t('vit.lines')}</div>
          <div class="goal-value">${t('vit.linesMaxed', { n: maxed, m: STARTER_LINES.length })}</div>
          <div class="goal-bar"><i style="width:${pct}%"></i></div>
        </div>
      </div>
      ${detail}
    </div>`;

  // Solo ridisegno: renderVitamins() rileggerebbe il salvataggio a ogni
  // carattere digitato, e i bonus non cambiano mentre si cerca.
  bindSearchBox('vitSearch', (value) => {
    targetQuery = value;
    paint();
  });

  document.getElementById('vitTarget')?.addEventListener('change', (e) => {
    selectedTarget = e.target.value;
    paint();
  });
  document.getElementById('vitKind')?.addEventListener('change', (e) => {
    selectedVitamin = e.target.value;
  });
  document.getElementById('btnMaxVitamins')?.addEventListener('click', applyVitamins);
}

export async function renderVitamins() {
  paint();
  try {
    const stored = await readSaveKeys([BUFFS_KEY]);
    try { buffs = JSON.parse(stored[BUFFS_KEY]) || {}; } catch (e) { buffs = {}; }
    loadError = '';
  } catch (e) {
    loadError = e.message;
  }
  paint();
}

async function applyVitamins() {
  const stats = statsToFill();
  if (!stats.length) return;

  const targets = selectedTarget === 'all' ? STARTER_LINES : [Number(selectedTarget)];
  setStatus(t('vit.working'), '');

  try {
    // Le forme base dovrebbero gia' essere radici, ma la conferma viene dal
    // gioco: e' quella chiave che legge.
    const teamSpecies = (currentRun?.team || []).map(p => p.speciesId);
    const roots = await evoLineRoots([...new Set([...targets, ...teamSpecies])]).catch(() => null);
    const rootOf = (id) => roots?.[id] ?? id;

    const stored = await readSaveKeys([BUFFS_KEY]);
    let all = {};
    try { all = JSON.parse(stored[BUFFS_KEY]) || {}; } catch (e) { all = {}; }

    const touched = new Set();
    targets.forEach(id => {
      const key = rootOf(id);
      all[key] = applyTo(all[key], stats);
      touched.add(key);
    });
    await writeSaveKeys({ [BUFFS_KEY]: JSON.stringify(all) });

    // I Pokemon gia' in squadra portano una copia dei bonus fatta quando sono
    // stati scelti: senza aggiornarli, la run in corso non vedrebbe nulla.
    let inRun = 0;
    (currentRun?.team || []).forEach(pk => {
      if (!touched.has(rootOf(pk.speciesId))) return;
      pk.statBuffs = applyTo(pk.statBuffs, stats);
      inRun++;
    });
    if (inRun) autoSave(false);

    await renderVitamins();
    setStatus(t('vit.done', {
      n: targets.length,
      what: selectedVitamin === 'all'
        ? t('vit.allStats')
        : vitaminLabel(VITAMINS.find(v => v.id === selectedVitamin))
    }), 'ok');
  } catch (e) {
    setStatus('❌ ' + e.message, 'err');
  }
}
