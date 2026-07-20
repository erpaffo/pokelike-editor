import { unlockProUI } from './ui.js';
import { setStatus } from './ui.js';

export let isPro = false;
export function setIsPro(val) { isPro = val; }

export function verifyLicenseWithBackend(code, isSilent) {
  const statusEl = document.getElementById('licenseStatus');
  if (!isSilent && statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = '#ffc107';
    statusEl.innerText = 'Verifica in corso...';
  }
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => localStorage.getItem('poke_username') || localStorage.getItem('poke_save_uuid') || 'unknown_user'
    }, (results) => {
      const accountId = results[0]?.result || 'unknown_user';
      
      fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, accountId })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.pro) {
          isPro = true;
          chrome.storage.local.set({ proLicense: code });
          localStorage.setItem('pokelike_premium_unlocked', 'true');
          unlockProUI();
          if (!isSilent && statusEl) {
            statusEl.style.color = '#28a745';
            statusEl.innerText = 'Licenza valida! Funzionalità Pro sbloccate.';
          }
        } else {
          isPro = false;
          if (!isSilent && statusEl) {
            statusEl.style.color = '#dc3545';
            statusEl.innerText = data.error || 'Codice non valido.';
          }
          chrome.storage.local.remove('proLicense');
        }
      })
      .catch(err => {
        if (!isSilent && statusEl) {
          statusEl.style.color = '#dc3545';
          statusEl.innerText = 'Errore di connessione al server.';
        }
      });
    });
  });
}
