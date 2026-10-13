import { FEATURES, ISSUES_URL } from './compat-requirements.js';
import { execInMain, readSaveKeys } from './page.js';
import { t } from './i18n.js';

// Controllo di compatibilita' con la versione del gioco aperta nella scheda.
//
// All'apertura del popup si verifica che esista ancora cio' che ogni funzione
// dell'editor usa: le globali del gioco (js/compat-requirements.js) e la forma
// delle chiavi che l'editor scrive direttamente. Una funzione che ha perso
// qualcosa viene disattivata: meglio un pulsante spento e un avviso che un
// salvataggio scritto in un formato che il gioco non riconosce piu'.
//
// Se il controllo non si puo' fare (scheda del gioco chiusa, pagina che vieta
// eval) non si disattiva nulla: si torna alle protezioni delle singole funzioni.

// Forma attesa delle chiavi scritte senza passare dal gioco. Una chiave
// assente va bene: il gioco la crea al primo uso.
const SHAPES = {
  starters: ['poke_hof_index', v => Array.isArray(v?.evoLineRoots) && Array.isArray(v?.starterRuns)],
  megas: ['poke_challenge_stats', v => v && typeof v === 'object' && (v.mvpCounts == null || typeof v.mvpCounts === 'object')],
  spire: ['poke_spire_cards', v => v && typeof v === 'object' && (v.owned == null || typeof v.owned === 'object')],
  parkedRun: ['poke_parked_run:endless2', v => typeof v?.run === 'string'],
  shards: ['poke_legendary_shards', v => Number.isFinite(v)]
};

let report = null;      // { version, broken: { feature: [motivi] } }

// Quali globali mancano nella pagina. Le costanti dichiarate con const non
// stanno su window: si chiede il loro typeof per nome con un eval indiretto,
// che vede lo scope globale. Un nome che non e' un identificatore non si valuta.
function probeGlobals(names) {
  return execInMain((names) => {
    let ev;
    try { ev = (0, eval); ev('0'); } catch (e) { return null; }
    const missing = names.filter(n => {
      if (!/^[A-Za-z_$][\w$]*$/.test(n)) return true;
      try { return ev('typeof ' + n) === 'undefined'; } catch (e) { return true; }
    });
    let version = null;
    try { version = ev('PATCH_NOTES')[0].version || null; } catch (e) { /* facoltativa */ }
    return { missing, version };
  }, [names]);
}

export async function runCompatCheck() {
  const names = [...new Set(Object.values(FEATURES).flatMap(f => f.globals))];
  const keys = Object.values(SHAPES).map(([key]) => key);
  const [probe, save] = await Promise.all([
    probeGlobals(names).catch(() => null),
    readSaveKeys(keys).catch(() => null)
  ]);
  if (!probe && !save) return null;

  const broken = {};
  const flag = (feature, reason) => { (broken[feature] ||= []).push(reason); };

  if (probe) {
    const missing = new Set(probe.missing);
    Object.entries(FEATURES).forEach(([feature, req]) => {
      req.globals.filter(g => missing.has(g)).forEach(g => flag(feature, g));
    });
  }
  if (save) {
    Object.entries(SHAPES).forEach(([feature, [key, ok]]) => {
      const raw = save[key];
      if (raw == null) return;
      let value;
      try { value = JSON.parse(raw); } catch (e) { value = undefined; }
      if (!ok(value)) flag(feature, key);
    });
  }

  report = { version: probe?.version || null, broken };
  return report;
}

export function isBroken(feature) {
  return !!report?.broken[feature];
}

export function featureLabel(feature) {
  return t('compat.f.' + feature);
}

// Da chiamare prima di ogni scrittura che dipende dal formato del gioco.
export function assertFeature(feature) {
  if (isBroken(feature)) throw new Error(t('compat.featureOff', { name: featureLabel(feature) }));
}

// Testo da mostrare al posto di una sezione disattivata.
export function disabledHtml(feature) {
  return `<p style="font-size:11px; color:var(--red-light); line-height:1.45;">${t('compat.featureOff', { name: featureLabel(feature) })}</p>`;
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Avviso in cima al popup, con un pulsante che apre una issue gia' compilata.
export function showCompatBanner(rep = report) {
  const features = Object.keys(rep?.broken || {});
  if (!features.length || document.querySelector('.compat-warning')) return;

  const list = features.map(featureLabel).join(', ');
  const version = rep.version ? ` (v${rep.version})` : '';
  const details = features.map(f => `- ${f}: ${rep.broken[f].join(', ')}`).join('\n');
  const issueUrl = `${ISSUES_URL}/new?title=${encodeURIComponent(`Incompatibilità con pokelike.xyz${version}`)}`
    + `&body=${encodeURIComponent(`Versione dell'estensione: ${chrome.runtime.getManifest().version}\nVersione del gioco: ${rep.version || '?'}\n\nNon trovati:\n${details}`)}`;

  const banner = document.createElement('div');
  banner.className = 'compat-warning';
  banner.innerHTML = `
    <div class="compat-warning-body">
      <strong>⚠️ ${escHtml(t('compat.title', { v: version }))}</strong>
      <div>${escHtml(t('compat.body', { list }))}</div>
    </div>
    <button class="btn btn-accent compat-report">${escHtml(t('compat.report'))}</button>`;
  banner.querySelector('.compat-report').addEventListener('click', () => {
    chrome.tabs.create({ url: issueUrl });
  });
  document.querySelector('.tabs')?.after(banner);
}
