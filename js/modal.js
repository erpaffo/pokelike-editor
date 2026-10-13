import { esc } from './ui.js';
import { t } from './i18n.js';

// Dialogo a scelta multipla con casella "ricorda". confirm() non basta: servono
// piu' di due risposte e una spiegazione per ciascuna.
// Risolve { value, remember } oppure null se l'utente annulla.
export function choiceDialog({ title, text, choices, rememberLabel, cancelLabel }) {
  cancelLabel = cancelLabel || t('common.cancel');
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true">
        <div class="modal-title">${esc(title)}</div>
        <div class="modal-text">${esc(text)}</div>
        ${choices.map((c, i) => `
          <button class="modal-choice" data-choice="${i}">
            <b>${esc(c.label)}</b>
            <span>${esc(c.description)}</span>
          </button>`).join('')}
        ${rememberLabel ? `
          <label class="modal-foot">
            <input type="checkbox" id="modalRemember">
            ${esc(rememberLabel)}
          </label>` : ''}
        <button class="btn btn-ghost w-100" data-cancel style="margin-top:12px;">${esc(cancelLabel)}</button>
      </div>`;

    const close = (result) => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      resolve(result);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(null); };

    overlay.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        close({
          value: choices[Number(btn.dataset.choice)].value,
          remember: Boolean(overlay.querySelector('#modalRemember')?.checked)
        });
      });
    });
    overlay.querySelector('[data-cancel]').addEventListener('click', () => close(null));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
  });
}
