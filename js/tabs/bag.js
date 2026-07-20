import { currentRun, autoSave } from '../state.js';
import { setStatus } from '../ui.js';
import { HELD_ITEMS } from '../constants.js';

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


export function initBagListeners() {
  document.getElementById('btnInjectBag')?.addEventListener('click', () => {
    if (!currentRun) return;
    if (!currentRun.bag) currentRun.bag = {};
    if (!currentRun.bag.items) currentRun.bag.items = {};
    Object.keys(HELD_ITEMS).forEach(k => {
      if (k !== 'nessuno') currentRun.bag.items[k] = 99;
    });
    autoSave();
    renderBag();
    setStatus('🎒 Tutti gli strumenti competitivi iniettati (x99)!', 'ok');
  });

  document.getElementById('btnClearBag')?.addEventListener('click', () => {
    if (!currentRun) return;
    if (currentRun.bag && currentRun.bag.items) currentRun.bag.items = {};
    autoSave();
    renderBag();
    setStatus('🗑️ Borsa svuotata.', 'ok');
  });
}
