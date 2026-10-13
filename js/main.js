import { loadData, currentRun } from './state.js';
import { switchTab, setStatus } from './ui.js';
import { reloadGameTabAndWait, resumeRun } from './page.js';
import { initTeamListeners } from './tabs/team.js';
import { loadForcedTraits } from './tabs/traits.js';
import { initRunListeners } from './tabs/run.js';
import { initBagListeners } from './tabs/bag.js';
import { initMegaListeners } from './tabs/mega.js';
import { initAddListeners } from './tabs/add.js';
import { renderSettings, loadSettings } from './tabs/settings.js';
import { DONATION_URL, storeReviewUrl, isInstalledFromStore } from './constants.js';
import { applyStaticTranslations, t } from './i18n.js';
import { showWhatsNew } from './whatsnew.js';
import { runCompatCheck, showCompatBanner } from './compat.js';

import { renderTeam } from './tabs/team.js';
import { renderAdd } from './tabs/add.js';
import { renderRun } from './tabs/run.js';
import { renderBag } from './tabs/bag.js';
import { renderMega } from './tabs/mega.js';
import { renderVitamins } from './tabs/vitamins.js';

export function renderAll() {
  const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'team';

  if (activeTab === 'team') renderTeam();
  if (activeTab === 'add') renderAdd();
  if (activeTab === 'run') renderRun();
  if (activeTab === 'bag') renderBag();
  if (activeTab === 'mega') renderMega();
  if (activeTab === 'vitamins') renderVitamins();
  if (activeTab === 'settings') renderSettings();
  if (activeTab === 'donate') {/* contenuto statico, niente da renderizzare */}
}

document.addEventListener('DOMContentLoaded', () => {
  applyStaticTranslations();

  // Init listeners
  initTeamListeners();
  initRunListeners();
  initBagListeners();
  initMegaListeners();
  initAddListeners();
  // Stato dei tratti forzati: va letto dalla pagina e dalla registrazione dello
  // script, quindi arriva dopo il primo disegno.
  loadForcedTraits().catch(() => {});
  loadSettings();

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabId = e.currentTarget.dataset.tab;
      switchTab(tabId);
      renderAll();
    });
  });

  // Sincronizza: ricarica prima la pagina del gioco, poi rilegge.
  // Il gioco tiene la partita in memoria e la riscrive nel localStorage: senza
  // ricaricare, le modifiche fatte qui verrebbero sovrascritte al primo
  // salvataggio automatico invece di essere applicate.
  const reloadBtn = document.getElementById('btnReload');
  reloadBtn?.addEventListener('click', async () => {
    if (reloadBtn.disabled) return;
    reloadBtn.disabled = true;
    setStatus(t('status.reloadingGame'), '');

    // La modalita' della run in corso, letta prima del ricaricamento: serve
    // solo a decidere quale pulsante "riprendi" cercare per primo.
    const preferred = currentRun
      ? (currentRun.challengeId ? 'challenge' : (currentRun.isEndlessMode ? 'endless' : 'story'))
      : null;

    let resumed = null;
    try {
      const loaded = await reloadGameTabAndWait();
      if (loaded && preferred) {
        setStatus(t('status.resuming'), '');
        resumed = await resumeRun(preferred).catch(() => null);
      }
    } catch (e) {
      // Nessuna scheda del gioco aperta: si prova comunque a rileggere.
    } finally {
      reloadBtn.disabled = false;
    }

    loadData();
    if (resumed?.ok) setStatus(t('status.resumed'), 'ok');
  });

  // Donazione (apre in una nuova scheda del browser, non nel popup)
  document.getElementById('btnDonate')?.addEventListener('click', () => {
    chrome.tabs.create({ url: DONATION_URL });
  });

  const rateBtn = document.getElementById('btnRate');
  if (rateBtn) {
    if (isInstalledFromStore()) {
      rateBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: storeReviewUrl() });
      });
    } else {
      rateBtn.disabled = true;
      const hint = document.getElementById('rateHint');
      if (hint) {
        hint.dataset.i18n = 'donate.rateHint';
        hint.textContent = t('donate.rateHint');
        hint.hidden = false;
      }
    }
  }

  // Start
  loadData();
  showWhatsNew();
  // Se il gioco e' cambiato, le funzioni colpite si spengono: si ridisegna
  // perche' le schede mostrino l'avviso al posto dei comandi.
  runCompatCheck().then(rep => {
    if (rep && Object.keys(rep.broken).length) {
      showCompatBanner(rep);
      renderAll();
    }
  }).catch(() => {});
});

// Handle image errors globally for CSP
document.addEventListener('error', function(e) {
  if (e.target && e.target.tagName === 'IMG') {
    const fallbackUrl = e.target.getAttribute('data-fallback-url');
    if (fallbackUrl && e.target.src !== fallbackUrl) {
      e.target.src = fallbackUrl;
    }
  }
}, true);
