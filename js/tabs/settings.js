import { setStatus, esc } from '../ui.js';
import {
  MAX_BACKUPS, listBackups, createBackup, restoreBackup,
  deleteBackup, exportBackupFile, importBackupFile, isCloudSyncActive
} from '../backup.js';
import { readPassivePool } from '../page.js';
import { loadData, setPassivePool } from '../state.js';
import { choiceDialog } from '../modal.js';
import { t, LANGS, LANG_NAMES, getLanguage, setLanguage, applyStaticTranslations } from '../i18n.js';
import { renderAll } from '../main.js';

// Come comportarsi quando la sincronizzazione cloud del gioco e' attiva.
const RESTORE_MODE_KEY = 'poke_editor_restore_mode';

const RESTORE_CHOICES = [
  {
    value: 'cloud',
    get label() { return t('cloud.choiceCloud'); },
    get description() { return t('cloud.choiceCloudDesc'); }
  },
  {
    value: 'local',
    get label() { return t('cloud.choiceLocal'); },
    get description() { return t('cloud.choiceLocalDesc'); }
  }
];

export function getRestoreMode() {
  const v = localStorage.getItem(RESTORE_MODE_KEY);
  return ['ask', 'cloud', 'local'].includes(v) ? v : 'ask';
}

// Sceglie la modalità: se non c'è sincronizzazione attiva non c'è nulla da
// decidere, altrimenti vale la preferenza salvata o si chiede all'utente.
async function resolveRestoreMode() {
  if (!(await isCloudSyncActive())) return { mode: 'local' };

  const saved = getRestoreMode();
  if (saved !== 'ask') return { mode: saved };

  const answer = await choiceDialog({
    title: t('cloud.title'),
    text: t('cloud.text'),
    choices: RESTORE_CHOICES,
    rememberLabel: t('cloud.remember')
  });
  if (!answer) return null;

  if (answer.remember) localStorage.setItem(RESTORE_MODE_KEY, answer.value);
  return { mode: answer.value };
}

function cloudOutcomeMessage(res) {
  if (res.cloud === 'caricato') return t('cloud.uploaded');
  if (res.cloud === 'in pausa') return t('cloud.paused');
  if (res.cloud === 'errore') return t('cloud.failed', { err: res.cloudError });
  return '';
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
    : Math.round(bytes / 1024) + ' KB';
}

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleString(getLanguage(), {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function backupRowHtml(b) {
  return `
    <div class="goal">
      <div class="goal-main">
        <div class="goal-label">💾 ${esc(b.label)}</div>
        <div class="goal-value">${t('settings.backupCount', { date: formatDate(b.createdAt), keys: b.keyCount, size: formatSize(b.bytes) })}</div>
      </div>
      <div class="goal-actions">
        <button class="btn btn-accent btn-sm" data-restore="${b.id}" title="${t('settings.backupRestoreTitle')}">${t('settings.backupRestore')}</button>
        <button class="btn btn-ghost btn-sm" data-export="${b.id}" title="${t('settings.backupExportTitle')}">⬇</button>
        <button class="btn btn-ghost btn-sm" data-delete="${b.id}" title="${t('common.delete')}">✕</button>
      </div>
    </div>`;
}

async function renderBackupList() {
  const host = document.getElementById('backupList');
  if (!host) return;
  const backups = await listBackups();
  host.innerHTML = backups.length
    ? backups.map(backupRowHtml).join('')
    : `<div style="font-size:11px; color:var(--text-muted); padding:8px 0;">${t('settings.backupNone')}</div>`;
  bindBackupRows();
}

function bindBackupRows() {
  document.querySelectorAll('[data-restore]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(t('settings.restoreConfirm'))) return;

      let choice;
      try {
        choice = await resolveRestoreMode();
      } catch (e) {
        return setStatus('❌ ' + e.message, 'err');
      }
      if (!choice) return;

      setStatus(t('unlocks.working'), '');
      try {
        const res = await restoreBackup(btn.dataset.restore, choice.mode);
        loadData();
        setStatus(
          t('settings.backupRestored', { n: res.restored })
            + (res.removed ? t('settings.backupRemoved', { n: res.removed }) : '')
            + cloudOutcomeMessage(res),
          res.cloud === 'errore' ? 'err' : 'ok'
        );
      } catch (e) {
        setStatus('❌ ' + e.message, 'err');
      }
    });
  });

  document.querySelectorAll('[data-export]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await exportBackupFile(btn.dataset.export);
        setStatus(t('settings.backupDownloaded'), 'ok');
      } catch (e) {
        setStatus('❌ ' + e.message, 'err');
      }
    });
  });

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await deleteBackup(btn.dataset.delete);
      await renderBackupList();
      setStatus(t('settings.backupDeleted'), 'ok');
    });
  });
}

export function loadSettings() {
  const theme = localStorage.getItem('poke_editor_theme') || 'midnight';
  document.body.setAttribute('data-theme', theme);
  
  // Applica le variabili CSS correnti se il tema non è il default
  if (theme === 'midnight') {
    document.body.removeAttribute('data-theme');
  }
}

export function renderSettings() {
  const el = document.getElementById('contentSettings');
  if (!el) return;

  const currentTheme = localStorage.getItem('poke_editor_theme') || 'midnight';
  const restoreMode = getRestoreMode();
  const currentLang = getLanguage();

  el.innerHTML = `
    <div style="padding: 16px;">
      <div class="section-title" style="color: var(--gold); border-bottom-color: rgba(255, 215, 0, 0.2); display: flex; align-items: center; gap: 8px;">
        ${t('settings.general')}
      </div>

      <div class="field-row" style="margin-bottom: 20px; flex-direction: column; align-items: flex-start; gap: 6px;">
        <label class="field-label" style="font-size: 13px;">${t('settings.language')}</label>
        <select id="settingLanguage" class="field-input" style="width: 100%;">
          ${LANGS.map(l => `<option value="${l}"${l === currentLang ? ' selected' : ''}>${LANG_NAMES[l]}</option>`).join('')}
        </select>
      </div>

      <div class="field-row" style="margin-bottom: 20px; flex-direction: column; align-items: flex-start; gap: 6px;">
        <label class="field-label" style="font-size: 13px;">${t('settings.theme')}</label>
        <select id="settingTheme" class="field-input" style="width: 100%;">
          <option value="midnight" ${currentTheme === 'midnight' ? 'selected' : ''}>${t('settings.themeMidnight')}</option>
          <option value="solar" ${currentTheme === 'solar' ? 'selected' : ''}>${t('settings.themeSolar')}</option>
          <option value="cyberpunk" ${currentTheme === 'cyberpunk' ? 'selected' : ''}>${t('settings.themeCyber')}</option>
          <option value="gameboy" ${currentTheme === 'gameboy' ? 'selected' : ''}>${t('settings.themeGameboy')}</option>
        </select>
      </div>

      <div style="border-top: 1px solid var(--border); margin-top: 20px; padding-top: 20px;">
        <div class="section-title" style="color: var(--gold); border-bottom: none; margin-bottom: 8px;">
          ${t('settings.backup')}
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
          ${t('settings.backupHint', { n: MAX_BACKUPS })}
        </p>

        <div class="field-row">
          <input class="field-input" id="backupLabel" type="text" placeholder="${t('settings.backupName')}" style="flex:1; min-width:0;">
          <button class="btn btn-accent" id="btnCreateBackup">${t('settings.backupCreate')}</button>
        </div>

        <div id="backupList" style="margin-top: 10px;"></div>

        <div class="field-row" style="flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 14px;">
          <label class="field-label" style="font-size: 12px;">${t('settings.restoreMode')}</label>
          <select id="settingRestoreMode" class="field-input" style="width: 100%;">
            <option value="ask" ${restoreMode === 'ask' ? 'selected' : ''}>${t('settings.restoreModeAsk')}</option>
            <option value="cloud" ${restoreMode === 'cloud' ? 'selected' : ''}>${t('settings.restoreModeCloud')}</option>
            <option value="local" ${restoreMode === 'local' ? 'selected' : ''}>${t('settings.restoreModeLocal')}</option>
          </select>
          <div style="font-size: 10px; color: var(--text-muted); line-height: 1.4;">
            ${t('settings.restoreModeHint')}
          </div>
        </div>

        <div class="field-row" style="margin-top: 12px;">
          <button class="btn btn-ghost" id="btnImportBackup" style="flex:1; font-size:11px;">${t('settings.backupImport')}</button>
          <input type="file" id="backupFile" accept="application/json,.json" style="display:none;">
        </div>
        <p style="font-size: 10px; color: var(--text-muted); margin-top: 8px; line-height: 1.4;">
          ${t('settings.backupNote')}
        </p>
      </div>

      <div style="border-top: 1px solid var(--border); margin-top: 20px; padding-top: 20px;">
        <div class="section-title" style="color: var(--red-light); border-bottom: none; margin-bottom: 8px;">
          ${t('settings.danger')}
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; line-height: 1.4;">
          ${t('settings.dangerHint')}
        </p>
        <button class="btn btn-danger w-100" id="btnResetData">
          ${t('settings.reset')}
        </button>
      </div>
    </div>
  `;

  renderBackupList();

  document.getElementById('btnCreateBackup')?.addEventListener('click', async () => {
    const labelInput = document.getElementById('backupLabel');
    setStatus(t('settings.backupCreating'), '');
    try {
      const { entry, dropped } = await createBackup(labelInput?.value);
      if (labelInput) labelInput.value = '';
      await renderBackupList();
      setStatus(t('settings.backupCreated', { keys: entry.keyCount, size: formatSize(entry.bytes) })
        + (dropped ? t('settings.backupDropped', { n: dropped }) : ''), 'ok');
    } catch (e) {
      setStatus('❌ ' + e.message, 'err');
    }
  });

  document.getElementById('settingLanguage')?.addEventListener('change', (e) => {
    setLanguage(e.target.value);
    // Ridisegna tutto: il markup statico e la scheda attiva sono gia' stampati.
    applyStaticTranslations();
    renderAll();
    setStatus(t('settings.languageChanged'), 'ok');
    // I nomi degli oggetti passivi arrivano tradotti dal gioco: vanno richiesti
    // di nuovo nella lingua appena scelta.
    readPassivePool(getLanguage())
      .then(pool => { if (pool) { setPassivePool(pool); renderAll(); } })
      .catch(() => {});
  });

  document.getElementById('settingRestoreMode')?.addEventListener('change', (e) => {
    localStorage.setItem(RESTORE_MODE_KEY, e.target.value);
    setStatus(t('settings.restoreModeChanged'), 'ok');
  });

  const fileInput = document.getElementById('backupFile');
  document.getElementById('btnImportBackup')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    setStatus(t('settings.backupImporting'), '');
    try {
      const entry = await importBackupFile(file);
      await renderBackupList();
      setStatus(t('settings.backupImported', { keys: entry.keyCount }), 'ok');
    } catch (e) {
      setStatus('❌ ' + e.message, 'err');
    }
    fileInput.value = '';
  });

  // Listeners
  document.getElementById('settingTheme')?.addEventListener('change', (e) => {
    localStorage.setItem('poke_editor_theme', e.target.value);
    loadSettings(); // Applica subito il tema
    setStatus(t('settings.themeChanged'), 'ok');
  });

  document.getElementById('btnResetData')?.addEventListener('click', () => {
    if (confirm(t('settings.resetConfirm'))) {
      chrome.storage.local.clear(() => {
        localStorage.clear();
        alert(t('settings.resetDone'));
        window.location.reload();
      });
    }
  });
}
