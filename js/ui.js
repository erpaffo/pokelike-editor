export function typeClass(t) { return 't-' + t.toLowerCase().replace(/[^a-z]/g, ''); }

// Soprannomi e dati del salvataggio sono testo libero controllato dall'utente:
// vanno neutralizzati prima di finire nell'HTML del popup.
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

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
  
  const map = { team: 'contentTeam', run: 'contentRun', bag: 'contentBag', mega: 'contentMega', add: 'contentAdd', vitamins: 'contentVitamins', donate: 'contentDonate', settings: 'contentSettings' };
  const contentEl = document.getElementById(map[tabId]);
  if (contentEl) contentEl.classList.add('active');
}
