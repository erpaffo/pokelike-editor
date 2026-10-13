import { currentRun, autoSave, megaStones, extraMegaStones, itemSearchTerms } from '../state.js';
import { buildMegaStoneItem, buildMegaStoneItemFromDef } from '../page.js';
import { setStatus, esc } from '../ui.js';
import { HELD_ITEMS, MAX_BAG_ITEMS, itemName, itemGameName } from '../constants.js';
import { t } from '../i18n.js';
import { filterBySearch, searchBoxHtml, bindSearchBox, searchTerms } from '../search.js';

// Lo zaino accetta solo strumenti "held item" (effetto passivo in squadra).
// Caramella Rara, TM e Pietra Lunare sono stati rimossi: il gioco li tratta
// come oggetti "da assegnare" e non come strumenti utilizzabili, quindi
// iniettarli nello zaino li rendeva inservibili.
const BAG_ITEM_IDS = Object.keys(HELD_ITEMS).filter(k => k !== 'nessuno');

function getItems() {
  if (!currentRun) return [];
  if (!Array.isArray(currentRun.items)) currentRun.items = [];
  return currentRun.items;
}

function makeItem(id) {
  return { id, name: itemGameName(id), desc: "Assegnato dall'Editor", icon: '✨' };
}

// La casella di ricerca dello zaino sta nel markup statico: cosi' non viene
// ricreata a ogni ridisegno e non perde il fuoco mentre si scrive.
let itemQuery = '';

export function renderBag() {
  const list = document.getElementById('bagList');
  if (!list || !currentRun) return;

  const items = getItems();

  const counter = document.getElementById('bagCounter');
  if (counter) counter.textContent = t('bag.slots', { n: items.length, m: MAX_BAG_ITEMS });

  // Il gioco tiene un solo esemplare per tipo: gli id gia' presenti non
  // vanno riproposti nel menu a tendina.
  const sel = document.getElementById('bagItemSelect');
  if (sel) {
    const owned = new Set(items.map(it => it.id));
    // La ricerca guarda il nome nella lingua scelta, quello inglese scritto nel
    // salvataggio e tutti gli altri nomi che il gioco conosce.
    const q = itemQuery;
    const available = filterBySearch(
      BAG_ITEM_IDS.filter(id => !owned.has(id)), q,
      id => searchTerms(itemName(id), id, itemSearchTerms(id)));
    // Nello zaino ogni megapietra puo' stare: e' solo equipaggiandola che
    // conta la specie. Si offrono quindi tutte quelle non gia' possedute.
    const stones = filterBySearch(
      (megaStones || []).filter(s => !owned.has(s.id)), q,
      s => searchTerms(s.name, s.megaName, s.id, itemSearchTerms(s.id)));
    // Anche le forme Mega senza pietra si possono tenere nello zaino.
    const extra = filterBySearch(
      (extraMegaStones || []).filter(s => !owned.has(s.id)), q,
      s => searchTerms(s.name, s.megaName, s.id, itemSearchTerms(s.id)));

    let html = '';
    if (available.length) {
      html += `<optgroup label="${esc(t('team.itemGroup'))}">`
        + available.map(id => `<option value="${id}">${esc(itemName(id))}</option>`).join('')
        + '</optgroup>';
    }
    if (stones.length) {
      html += `<optgroup label="${esc(t('team.megaGroup'))}">`
        + stones.map(s => `<option value="mega:${esc(s.id)}">💠 ${esc(s.name)}</option>`).join('')
        + '</optgroup>';
    }
    if (extra.length) {
      html += `<optgroup label="${esc(t('team.megaExtraGroup'))}">`
        + extra.map(s => `<option value="megax:${esc(s.id)}">💠 ${esc(s.name)}</option>`).join('')
        + '</optgroup>';
    }
    sel.innerHTML = html
      || `<option value="">${q ? t('search.noResults', { q }) : t('bag.noneAvailable')}</option>`;
    sel.disabled = !html;
  }

  const btnAdd = document.getElementById('btnInjectBag');
  if (btnAdd) btnAdd.disabled = items.length >= MAX_BAG_ITEMS;

  if (items.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#888; padding:20px; font-size:11px;">${t('bag.empty')}</div>`;
    return;
  }

  list.innerHTML = items.map((it, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
      <div>
        <div style="font-size:13px; font-weight:600; color:#fff;">${esc(it.icon || '📦')} ${esc(HELD_ITEMS[it.id] ? itemName(it.id) : (it.name || it.id))}</div>
        <div style="font-size:10px; color:#aaa;">ID: ${esc(it.id)}</div>
      </div>
      <button class="btn-remove-bag" data-idx="${idx}" style="background:transparent; border:none; color:var(--red-light); cursor:pointer;">✕</button>
    </div>
  `).join('');

  document.querySelectorAll('.btn-remove-bag').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.dataset.idx);
      getItems().splice(i, 1);
      autoSave();
      renderBag();
    });
  });
}

export function initBagListeners() {
  document.getElementById('bagItemSearch')?.addEventListener('input', (e) => {
    itemQuery = e.target.value;
    renderBag();
  });

  document.getElementById('btnInjectBag')?.addEventListener('click', async () => {
    if (!currentRun) return;
    const value = document.getElementById('bagItemSelect')?.value;
    if (!value) return;

    const synthetic = value.startsWith('megax:');
    const isStone = synthetic || value.startsWith('mega:');
    const itemId = isStone ? value.slice(synthetic ? 6 : 5) : value;
    if (!isStone && !HELD_ITEMS[itemId]) return;

    const items = getItems();
    if (items.length >= MAX_BAG_ITEMS) {
      setStatus(t('bag.full', { n: MAX_BAG_ITEMS }), 'err');
      return;
    }
    if (items.some(it => it.id === itemId)) {
      setStatus(t('bag.already', { item: isStone ? itemId : itemName(itemId) }), 'err');
      return;
    }

    // La megapietra la costruisce il gioco; gli strumenti normali no.
    let entry;
    if (isStone) {
      const def = synthetic ? (extraMegaStones || []).find(x => x.id === itemId) : null;
      entry = synthetic
        ? (def ? await buildMegaStoneItemFromDef(def).catch(() => null) : null)
        : await buildMegaStoneItem(itemId).catch(() => null);
      if (!entry) return setStatus(t('team.megaFailed'), 'err');
    } else {
      entry = makeItem(itemId);
    }

    items.push(entry);
    autoSave();
    renderBag();
    setStatus(t('bag.addedItem', {
      item: isStone ? (entry.name || itemId) : itemName(itemId),
      n: items.length, m: MAX_BAG_ITEMS
    }), 'ok');
  });

  document.getElementById('btnFillBag')?.addEventListener('click', () => {
    if (!currentRun) return;
    const items = getItems();
    const owned = new Set(items.map(it => it.id));

    let added = 0;
    for (const id of BAG_ITEM_IDS) {
      if (items.length >= MAX_BAG_ITEMS) break;
      if (owned.has(id)) continue;
      items.push(makeItem(id));
      owned.add(id);
      added++;
    }

    autoSave();
    renderBag();
    setStatus(added
      ? t('bag.filled', { n: added, m: items.length, t: MAX_BAG_ITEMS })
      : t('bag.alreadyFull', { n: items.length, m: MAX_BAG_ITEMS }), 'ok');
  });

  document.getElementById('btnClearBag')?.addEventListener('click', () => {
    if (!currentRun) return;
    currentRun.items = [];
    autoSave();
    renderBag();
    setStatus(t('bag.cleared'), 'ok');
  });
}
