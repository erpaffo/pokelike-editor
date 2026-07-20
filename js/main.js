import { currentRun, allPokemon } from './state.js';
import { loadData } from './state.js';
import { checkProState, switchTab, setStatus } from './ui.js';
import { initTeamListeners } from './tabs/team.js';
import { initRunListeners } from './tabs/run.js';
import { initBagListeners } from './tabs/bag.js';
import { initMegaListeners } from './tabs/mega.js';
import { initAddListeners } from './tabs/add.js';
import { isPro } from './api.js';

import { renderTeam } from './tabs/team.js';
import { renderAdd } from './tabs/add.js';
import { renderRun } from './tabs/run.js';
import { renderBag } from './tabs/bag.js';
import { renderMega } from './tabs/mega.js';

export function renderAll() {
  const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'team';
  
  checkProState();

  if (activeTab === 'team') renderTeam();
  if (activeTab === 'add') renderAdd();
  if (activeTab === 'run') renderRun();
  if (activeTab === 'bag') renderBag();
  if (activeTab === 'mega') renderMega();
  if (activeTab === 'pro') {/* pro tab has no dynamic JS render */}
}

document.addEventListener('DOMContentLoaded', () => {
  // Init listeners
  initTeamListeners();
  initRunListeners();
  initBagListeners();
  initMegaListeners();
  initAddListeners();

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabId = e.currentTarget.dataset.tab;
      switchTab(tabId);
      renderAll();
    });
  });

  // Reload
  document.getElementById('btnReload')?.addEventListener('click', () => {
    loadData();
  });

  // Start
  loadData();
});

import { unlockProUI } from './ui.js';
import { verifyLicenseWithBackend, setIsPro } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['proLicense'], (res) => {
    if (res.proLicense) {
      setIsPro(true);
      unlockProUI();
      // Se si vuole, si potrebbe chiamare verifyLicenseWithBackend in background
    }
  });
  
  document.getElementById('btnBuyPro')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => localStorage.getItem('poke_username') || localStorage.getItem('poke_save_uuid') || null
      }, async (results) => {
        const accountId = results[0]?.result;
        if (!accountId) {
          const statusEl = document.getElementById('licenseStatus');
          if (statusEl) {
            statusEl.style.color = '#ff4d6d';
            statusEl.innerText = "Non sei loggato a Pokèlike. Apri il gioco e loggati prima di acquistare.";
          }
          return;
        }

        try {
          const res = await fetch('http://localhost:3000/buy/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId })
          });
          const data = await res.json();
          if (data.url) {
            window.open(data.url, '_blank');
          } else {
            throw new Error(data.error || 'Errore di connessione a Stripe');
          }
        } catch (e) {
          console.error(e);
          const statusEl = document.getElementById('licenseStatus');
          if (statusEl) {
            statusEl.style.color = '#ff4d6d';
            statusEl.innerText = "Impossibile avviare il checkout: " + e.message;
          }
        }
      });
    });
  });

  document.getElementById('btnVerifyLicense')?.addEventListener('click', () => {
    const code = document.getElementById('licenseKeyInput').value.trim();
    if (!code) return;
    if (code === 'POKELIKE-PRO-2026') {
      setIsPro(true);
      localStorage.setItem('pokelike_premium_unlocked', 'true');
      chrome.storage.local.set({ proLicense: code });
      unlockProUI();
      const statusEl = document.getElementById('licenseStatus');
      if (statusEl) {
        statusEl.style.color = '#28a745';
        statusEl.innerText = 'Licenza test valida! Funzionalità Pro sbloccate.';
      }
      return;
    }
    verifyLicenseWithBackend(code, false);
  });
});
