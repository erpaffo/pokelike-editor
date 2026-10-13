import { POKEMON_NAMES_FALLBACK } from './constants.js';
import { setStatus } from './ui.js';
import { t, getLanguage } from './i18n.js';
import { renderAll } from './main.js';
import {
  readMegaStones, readPassivePool, readTraitCatalog,
  readEndlessState, readExtraMegaForms, readItemAliases, readSpeciesAliases
} from './page.js';

export let currentRun = null;
export let speciesList = [];
export let allPokemon = [];
export let currentPokedollars = 0;
export let currentStatsKey = null;
export let currentStats = null;
export let selectedAddPokemon = null;

// Catalogo delle megapietre letto dal gioco: null finche' non e' disponibile
// (pagina non aperta o gioco aggiornato), cosi' l'interfaccia puo' dirlo.
export let megaStones = null;
export function setMegaStones(v) { megaStones = v; }

// Catalogo degli oggetti passivi della run, stessa logica.
export let passivePool = null;
export function setPassivePool(v) { passivePool = v; }

// Descrizioni dei tratti della Torre, tier per tier, tradotte dal gioco.
export let traitCatalog = null;
export function setTraitCatalog(v) { traitCatalog = v; }

// Stato della Torre (regione, mappa nella regione): serve all'editor della
// mappa per sapere quali nodi sono leciti a questo punto della scalata.
export let endlessState = null;
export function setEndlessState(v) { endlessState = v; }

// Forme Mega che nei dati del gioco non hanno una pietra (la X di Charizard
// e compagnia): l'editor le offre costruendo l'oggetto al volo.
export let extraMegaStones = null;
export function setExtraMegaStones(v) { extraMegaStones = v; }

// Nomi di strumenti e specie in tutte le lingue del gioco: li usano le caselle
// di ricerca, che devono trovare una voce comunque la scriva l'utente.
export let itemAliases = null;
export function setItemAliases(v) { itemAliases = v; }
export let speciesAliases = null;
export function setSpeciesAliases(v) { speciesAliases = v; }

// Tutti i nomi noti di uno strumento (o megapietra), per la ricerca.
export function itemSearchTerms(id) {
  return itemAliases && itemAliases[id] ? itemAliases[id] : [];
}

// Idem per una specie: il dizionario del gioco e' indicizzato per nome
// inglese, quindi si passa per POKEMON_NAMES.
export function speciesSearchTerms(speciesId) {
  const en = POKEMON_NAMES[speciesId];
  if (!en || !speciesAliases) return en ? [en] : [];
  return [en, ...(speciesAliases[en] || [])];
}
export function megaStonesFor(speciesId) {
  const real = megaStones ? megaStones.filter(s => s.species === speciesId) : [];
  const extra = extraMegaStones
    ? extraMegaStones.filter(s => s.species === speciesId).map(s => ({ ...s, synthetic: true }))
    : [];
  return [...real, ...extra];
}

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
    .filter(p => !p.name.toLowerCase().includes('-mega') && p.id <= 721)
    .sort((a, b) => a.id - b.id);
}

// Alcuni campi numerici erano finiti nel salvataggio come stringhe, perche'
// il valore di una <select> e' sempre testo. Il gioco li scrive come numeri:
// si riallineano alla lettura, cosi' il prossimo salvataggio li ripara.
function normalizeRun(run) {
  (run?.team || []).forEach(pk => {
    if (typeof pk.moveTier === 'string') pk.moveTier = parseInt(pk.moveTier, 10) || 0;
    if (typeof pk.level === 'string') pk.level = parseInt(pk.level, 10) || 1;
  });
}

export function loadData() {
  setStatus(t('status.syncing'), '');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes('pokelike.xyz')) {
      setStatus(t('status.openSite'), 'err');
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
        setStatus(t('status.readFail'), 'err');
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
        setStatus(t('status.noRun'), 'err');
        const teamEl = document.getElementById('contentTeam');
        if (teamEl) teamEl.innerHTML = `<div class="empty"><p>${t('status.noRun')}</p></div>`;
        return;
      }
      try {
        currentRun = JSON.parse(run);
        normalizeRun(currentRun);
        speciesList = species ? JSON.parse(species) : [];
        buildAllPokemon();
        setStatus(t('status.loaded', { n: currentRun.team?.length || 0 }), 'ok');
        renderAll();
        // I cataloghi letti dal gioco arrivano dopo: si ridisegna quando ci sono.
        Promise.all([
          readMegaStones().catch(() => null),
          readPassivePool(getLanguage()).catch(() => null),
          readTraitCatalog(getLanguage()).catch(() => null),
          readEndlessState().catch(() => null),
          readExtraMegaForms().catch(() => null),
          readItemAliases().catch(() => null),
          readSpeciesAliases().catch(() => null)
        ]).then(([stones, passives, traits, endless, extraMegas, items, species]) => {
          setMegaStones(stones);
          setPassivePool(passives);
          setTraitCatalog(traits);
          setEndlessState(endless);
          setExtraMegaStones(extraMegas);
          setItemAliases(items);
          setSpeciesAliases(species);
          renderAll();
        });
      } catch (e) {
        setStatus(t('status.readErr', { msg: e.message }), 'err');
      }
    });
  });
}

let saveTimer = null;
export function autoSave(showMessage = true) {
  clearTimeout(saveTimer);
  if(showMessage && currentRun) setStatus(t('status.saving'), '');
  
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
          setStatus(t('status.saved'), 'ok');
        }
      });
    });
  }, 300);
}

