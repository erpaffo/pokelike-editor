import { isPro } from './api.js';

export function typeClass(t) { return 't-' + t.toLowerCase().replace(/[^a-z]/g, ''); }

export function hpColor(pct) {
  if (pct > 50) return '#00e676';
  if (pct > 25) return '#ffd700';
  return '#ff4d6d';
}

export function setStatus(text, type = '') {
  const el = document.getElementById('statusBar');
  if (!el) return;
  el.textContent = text;
  el.className = 'status ' + type;
}

export function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  
  const tabBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (tabBtn) tabBtn.classList.add('active');
  
  const map = { team: 'contentTeam', run: 'contentRun', bag: 'contentBag', mega: 'contentMega', add: 'contentAdd', pro: 'contentPro' };
  const contentEl = document.getElementById(map[tabId]);
  if (contentEl) contentEl.classList.add('active');
}

export function checkProState() {
  const lockIcons = document.querySelectorAll('.pro-lock-icon');
  const badge = document.getElementById('proStatusBadge');
  
  if (isPro) {
    lockIcons.forEach(el => el.style.display = 'none');
    
    const activeState = document.getElementById('proActiveState');
    const unlockState = document.getElementById('proUnlockState');
    if (activeState) activeState.style.display = 'block';
    if (unlockState) unlockState.style.display = 'none';

    if (badge) {
      badge.textContent = 'Stato: Attivo';
      badge.style.background = 'rgba(0, 230, 118, 0.2)';
      badge.style.color = '#00e676';
      badge.style.border = '1px solid #00e676';
    }
  } else {
    lockIcons.forEach(el => el.style.display = 'inline-block');

    const activeState = document.getElementById('proActiveState');
    const unlockState = document.getElementById('proUnlockState');
    if (activeState) activeState.style.display = 'none';
    if (unlockState) unlockState.style.display = 'block';

    if (badge) {
      badge.textContent = 'Stato: Non Attivo';
      badge.style.background = 'rgba(255, 77, 109, 0.2)';
      badge.style.color = '#ff4d6d';
      badge.style.border = '1px solid #ff4d6d';
    }
  }
}

export function requirePro() {
  if (isPro) return true;
  switchTab('pro');
  setStatus('⭐ Funzionalità riservata agli utenti PRO!', 'err');
  return false;
}

export function unlockProUI() {
  const banner = document.getElementById('proBanner');
  if (banner) banner.innerHTML = '<div class="alert alert-success py-2 mb-3"><i class="fas fa-check-circle me-2"></i>Versione PRO Attiva</div>';
  const proElements = document.querySelectorAll('.pro-feature');
  proElements.forEach(el => {
    el.removeAttribute('disabled');
    const lock = el.querySelector('.fa-lock');
    if (lock) lock.style.display = 'none';
  });
  const overlays = document.querySelectorAll('.pro-overlay');
  overlays.forEach(overlay => overlay.style.display = 'none');
  checkProState();
}
