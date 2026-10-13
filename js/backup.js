import {
  readFullSave, writeFullSave, reloadGameTab, reloadGameTabAndWait,
  isCloudSyncActive, pauseCloudSyncOnNextLoad, unpauseCloudSync,
  pushSaveToCloud, writeSaveKeys
} from './page.js';
import { t } from './i18n.js';

export { isCloudSyncActive };

// I backup vivono in chrome.storage.local, separati uno per chiave: cosi' un
// ripristino ne carica uno solo invece di tutti.
const INDEX_KEY = 'bk_index';
const ITEM_PREFIX = 'bk_';

// chrome.storage.local ha una quota di circa 10 MB e un salvataggio pesa
// qualche centinaio di KB: oltre questo numero i piu' vecchi vengono scartati.
export const MAX_BACKUPS = 5;

const local = chrome.storage.local;

function get(keys) {
  return new Promise(resolve => local.get(keys, resolve));
}

function set(entries) {
  return new Promise((resolve, reject) => {
    local.set(entries, () => {
      const err = chrome.runtime.lastError;
      err ? reject(new Error(err.message)) : resolve();
    });
  });
}

function remove(keys) {
  return new Promise(resolve => local.remove(keys, resolve));
}

export async function listBackups() {
  const stored = await get(INDEX_KEY);
  const index = stored[INDEX_KEY];
  return Array.isArray(index) ? index : [];
}

async function saveIndex(index) {
  await set({ [INDEX_KEY]: index });
}

// Inserisce il backup in cima e scarta i piu' vecchi oltre MAX_BACKUPS.
async function addToIndex(entry) {
  const index = [entry, ...(await listBackups())];
  const kept = index.slice(0, MAX_BACKUPS);
  const dropped = index.slice(MAX_BACKUPS);
  if (dropped.length) await remove(dropped.map(b => ITEM_PREFIX + b.id));
  await saveIndex(kept);
  return dropped.length;
}

function describe(data, label, createdAt) {
  return {
    id: `${Date.now()}`,
    createdAt: createdAt || new Date().toISOString(),
    label,
    keyCount: Object.keys(data).length,
    bytes: JSON.stringify(data).length
  };
}

export async function createBackup(label) {
  const data = await readFullSave();
  const keys = Object.keys(data);
  if (!keys.length) throw new Error(t('backup.noData'));

  const entry = describe(data, (label || '').trim() || t('backup.manual'));

  try {
    await set({ [ITEM_PREFIX + entry.id]: data });
  } catch (e) {
    throw new Error(t('backup.noSpace', { err: e.message }));
  }

  return { entry, dropped: await addToIndex(entry) };
}

export async function getBackupData(id) {
  const stored = await get(ITEM_PREFIX + id);
  const data = stored[ITEM_PREFIX + id];
  if (!data) throw new Error(t('backup.notFound'));
  return data;
}

// Il gioco confronta il salvataggio locale con quello sul server guardando il
// progresso, non le date, e in caso di dubbio tiene quello piu' avanzato. Un
// backup e' per definizione piu' indietro, quindi senza contromisure verrebbe
// sovrascritto appena la pagina si ricarica.
//
//  'cloud' → mette in pausa la sync per il caricamento del ripristino e poi
//            carica lo stato ripristinato sul server: il rollback e' definitivo.
//  'local' → mette in pausa la sync e basta: il server resta intatto e alla
//            prossima ricarica normale il ripristino viene annullato.
export async function restoreBackup(id, mode = 'local') {
  const data = await getBackupData(id);
  const result = await writeFullSave(data);

  // Il ripristino e' a tutti gli effetti una modifica: senza aggiornare questo
  // marcatore il server potrebbe ignorare il caricamento come gia' visto.
  await writeSaveKeys({ poke_save_modified_at: String(Date.now()) });

  if (!(await isCloudSyncActive())) {
    await reloadGameTab();
    return { ...result, cloud: 'assente' };
  }

  try {
    await pauseCloudSyncOnNextLoad();
    const loaded = await reloadGameTabAndWait();
    await unpauseCloudSync();

    if (mode !== 'cloud') return { ...result, cloud: 'in pausa' };
    if (!loaded) return { ...result, cloud: 'errore', cloudError: t('backup.pageNotLoaded') };

    const pushed = await pushSaveToCloud();
    return pushed.ok
      ? { ...result, cloud: 'caricato' }
      : { ...result, cloud: 'errore', cloudError: pushed.reason };
  } finally {
    await unpauseCloudSync();
  }
}

export async function deleteBackup(id) {
  await remove(ITEM_PREFIX + id);
  await saveIndex((await listBackups()).filter(b => b.id !== id));
}

// ── Import / export su file ──────────────────────────────────────────────
// Utile perche' chrome.storage.local sparisce se l'estensione viene
// disinstallata o i dati del browser vengono ripuliti.

const FILE_FORMAT = 'pokelike-editor-backup';

export async function exportBackupFile(id) {
  const meta = (await listBackups()).find(b => b.id === id);
  const payload = {
    format: FILE_FORMAT,
    version: 1,
    createdAt: meta?.createdAt || new Date().toISOString(),
    label: meta?.label || 'Backup',
    data: await getBackupData(id)
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = (payload.createdAt || '').replace(/[:.]/g, '-').slice(0, 19);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pokelike-save-${stamp}.json`;
  a.click();
  // Il popup puo' chiudersi subito dopo: si revoca con un minimo di ritardo.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function importBackupFile(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    throw new Error(t('backup.badJson'));
  }
  if (!payload || payload.format !== FILE_FORMAT || !payload.data || typeof payload.data !== 'object') {
    throw new Error(t('backup.badFormat'));
  }
  const keys = Object.keys(payload.data);
  if (!keys.length) throw new Error(t('backup.emptyFile'));
  if (keys.some(k => !k.startsWith('poke_') && !k.startsWith('pkrl_'))) {
    throw new Error(t('backup.badKeys'));
  }

  const entry = describe(payload.data, t('backup.imported', { label: payload.label || 'Backup' }), payload.createdAt);

  await set({ [ITEM_PREFIX + entry.id]: payload.data });
  await addToIndex(entry);
  return entry;
}
