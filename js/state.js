import { POKEMON_NAMES_FALLBACK } from './constants.js';
import { setStatus } from './ui.js';
import { renderAll } from './main.js';

export let currentRun = null;
export let speciesList = [];
export let allPokemon = [];
export let currentPokedollars = 0;
export let currentStatsKey = null;
export let currentStats = null;
export let selectedAddPokemon = null;

export const POKEMON_NAMES = { ...POKEMON_NAMES_FALLBACK };

export function setCurrentRun(v) { currentRun = v; }
export function setSpeciesList(v) { speciesList = v; }
export function setAllPokemon(v) { allPokemon = v; }
export function setCurrentPokedollars(v) { currentPokedollars = v; }
export function setCurrentStatsKey(v) { currentStatsKey = v; }
export function setCurrentStats(v) { currentStats = v; }
export function setSelectedAddPokemon(v) { selectedAddPokemon = v; }

export function buildAllPokemon() {
  const map = {};
  speciesList.forEach(s => {
    if (!s.id) return;
    const clean = s.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
    map[s.id] = clean;
  });
  Object.keys(POKEMON_NAMES_FALLBACK).forEach(id => {
    if (!map[id]) map[id] = POKEMON_NAMES_FALLBACK[id];
  });
  Object.assign(POKEMON_NAMES, map);
  allPokemon = Object.keys(map)
    .map(id => ({ id: parseInt(id), name: map[id] }))
    .filter(p => !p.name.toLowerCase().includes('-mega'))
    .sort((a, b) => a.id - b.id);
}

export function loadData() {
  setStatus('Sincronizzazione in corso...', '');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('pokelike.xyz')) {
      setStatus('⚠ Apri pokelike.xyz per iniziare', 'err');
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const res = {};
        for(let i=0; i<localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k.startsWith('poke_') || k.startsWith('pkrl_')) {
            res[k] = localStorage.getItem(k);
          }
        }
        return res;
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results?.[0]) {
        setStatus('❌ Impossibile leggere il salvataggio', 'err');
        return;
      }
      const data = results[0].result;
      const run = data['poke_current_run'];
      const species = data['pkrl_species_list'];
      const pokedollars = data['poke_pokedollars'];
      
      currentStatsKey = null;
      currentStats = null;
      for (const k in data) {
        if (data[k] && data[k].includes('"mvpCounts"')) {
          currentStatsKey = k;
          try { currentStats = JSON.parse(data[k]); } catch(e){}
        }
      }
      if (!currentStats) {
        currentStatsKey = 'poke_stats'; // guess a default
        currentStats = { runs: 0, clears: 0, mvpCounts: {} };
      }

      currentPokedollars = pokedollars ? (JSON.parse(pokedollars) || 0) : 0;

      if (!run) {
        currentRun = null;
        setStatus('⚠ Nessuna partita attiva', 'err');
        const teamEl = document.getElementById('contentTeam');
        if (teamEl) teamEl.innerHTML = `<div class="empty"><p>Nessuna partita attiva. Inizia una run su pokelike.xyz!</p></div>`;
        return;
      }
      try {
        currentRun = JSON.parse(run);
        speciesList = species ? JSON.parse(species) : [];
        buildAllPokemon();
        setStatus(`✅ Partita caricata · ${currentRun.team?.length || 0} Pokémon`, 'ok');
        renderAll();
      } catch (e) {
        setStatus('❌ Errore lettura dati: ' + e.message, 'err');
      }
    });
  });
}

let saveTimer = null;
export function autoSave(showMessage = true) {
  clearTimeout(saveTimer);
  if(showMessage && currentRun) setStatus('Salvataggio in corso...', '');
  
  // Save money and stats separately (they exist even without an active run)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pd, statsKey, statsStr) => { 
        localStorage.setItem('poke_pokedollars', JSON.stringify(pd)); 
        if (statsKey && statsStr) localStorage.setItem(statsKey, statsStr);
      },
      args: [currentPokedollars, currentStatsKey, currentStats ? JSON.stringify(currentStats) : null]
    });
  });

  if (!currentRun) return;

  saveTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      currentRun.maxTeamSize = 6;
      const runStr = JSON.stringify(currentRun);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => { localStorage.setItem('poke_current_run', data); return true; },
        args: [runStr]
      }, () => {
        if (!chrome.runtime.lastError && showMessage) {
          setStatus('✅ Modifiche salvate in tempo reale', 'ok');
        }
      });
    });
  }, 300);
}

