import { loadData, currentRun, allPokemon } from './state.js';
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
