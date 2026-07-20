import { currentStats, autoSave } from '../state.js';
import { requirePro } from '../ui.js';
import { setStatus } from '../ui.js';
import { MEGA_UNLOCKS, baseFormStarters, legendaryStarters } from '../constants.js';

export function renderMega() {
  const sel = document.getElementById('megaUnlockSelect');
  if (!sel) return;
  if (sel.children.length === 0) {
    sel.innerHTML = Object.keys(MEGA_UNLOCKS).map(k => `<option value="${k}">${k} (Richiede ${MEGA_UNLOCKS[k].req} MVP)</option>`).join('');
  }
}


export function initMegaListeners() {
  document.getElementById('btnUnlockSingleMega')?.addEventListener('click', () => {
    if (!requirePro() || !currentStats) return;
    const megaName = document.getElementById('megaUnlockSelect').value;
    const megaData = MEGA_UNLOCKS[megaName];
    if (!megaData) return;
    
    if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
    currentStats.mvpCounts[megaData.baseId] = megaData.req;
    
    autoSave();
    setStatus(`✨ Sbloccata Megaevoluzione: ${megaName}`, 'ok');
  });

  document.getElementById('btnUnlockAllMegas')?.addEventListener('click', () => {
    if (!requirePro() || !currentStats) return;
    if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
    
    Object.keys(MEGA_UNLOCKS).forEach(megaName => {
      const megaData = MEGA_UNLOCKS[megaName];
      currentStats.mvpCounts[megaData.baseId] = megaData.req;
    });
    
    autoSave();
    setStatus('🌟 Tutte le Megaevoluzioni sbloccate!', 'ok');
  });

  document.getElementById('btnUnlockDex')?.addEventListener('click', () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let dex = {};
          for (let i = 1; i <= 721; i++) {
            dex[i] = { caught: true, seen: true, caughtShiny: true, seenShiny: true };
          }
          localStorage.setItem('poke_pokedex', JSON.stringify(dex));
        }
      }, () => {
        setStatus('📚 Pokédex Nazionale Completato!', 'ok');
      });
    });
  });

  document.getElementById('btnUnlockAllStarters')?.addEventListener('click', () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (baseFormStarters) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem('poke_used_starters')) || [];
          } catch(e){}
          
          baseFormStarters.forEach(id => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          
          localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
        },
        args: [baseFormStarters]
      }, () => {
        setStatus('🥚 Tutti gli starter base aggiunti (Come uovo)! Ricarica il gioco.', 'ok');
      });
    });
  });

  document.getElementById('btnUnlockLegendaries')?.addEventListener('click', () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (legendaryStarters) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem('poke_used_starters')) || [];
          } catch(e){}
          
          legendaryStarters.forEach(id => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          
          localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
        },
        args: [legendaryStarters]
      }, () => {
        setStatus('👑 LEGGENDARI AGGIUNTI (Come uovo)! Ricarica il gioco.', 'ok');
      });
    });
  });

  document.getElementById('btnUnlockLegendariesShiny')?.addEventListener('click', () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (legendaryStarters) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem('poke_used_starters')) || [];
          } catch(e){}
          
          legendaryStarters.forEach(id => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          
          let dex = {};
          try { dex = JSON.parse(localStorage.getItem('poke_pokedex')) || {}; } catch(e){}
          legendaryStarters.forEach(id => {
            if (!dex[id]) dex[id] = {};
            dex[id].caughtShiny = true;
          });
          
          localStorage.setItem('poke_pokedex', JSON.stringify(dex));
          localStorage.setItem('poke_used_starters', JSON.stringify(usedStarters));
        },
        args: [legendaryStarters]
      }, () => {
        setStatus('✨ LEGGENDARI SHINY AGGIUNTI (Come uovo)! Ricarica il gioco.', 'ok');
      });
    });
  });
}
