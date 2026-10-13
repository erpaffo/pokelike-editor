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
export let selectedAddPokemon = null;

// Da dove viene la run mostrata: 'poke_current_run' per quella in corso, o la
// chiave "poke_parked_run:<modo>" in cui il gioco parcheggia una run Endless
// 2.0 quando si passa a un'altra modalita'. Il salvataggio torna li'.
export let runSource = null;
const LIVE_RUN_KEY = 'poke_current_run';
const PARKED_RUN_PREFIX = 'poke_parked_run:';

// Tetto dei PokeDollari. Oltre Number.MAX_SAFE_INTEGER JavaScript perde le
// unita' (99999999999999999 diventa 100000000000000000) e ogni somma del gioco
// sarebbe approssimata: si resta molto sotto, con margine per i guadagni.
export const MAX_POKEDOLLARS = 999999999999;
export function clampPokedollars(v) {
  const n = Math.floor(Number(v) || 0);
  return Math.min(MAX_POKEDOLLARS, Math.max(0, n));
}

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
export function setCurrentPokedollars(v) { currentPokedollars = clampPokedollars(v); }
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
      const species = data['pkrl_species_list'];
      const pokedollars = data['poke_pokedollars'];

      // La run in corso ha la precedenza; altrimenti quella parcheggiata, che
      // il gioco riprende dalla sua scheda (oggi solo Endless 2.0).
      let run = data[LIVE_RUN_KEY];
      runSource = run ? LIVE_RUN_KEY : null;
      if (!run) {
        const parkedKey = Object.keys(data).filter(k => k.startsWith(PARKED_RUN_PREFIX)).sort()[0];
        try {
          const parked = parkedKey ? JSON.parse(data[parkedKey]) : null;
          if (parked && parked.run) { run = parked.run; runSource = parkedKey; }
        } catch (e) { /* chiave parcheggiata illeggibile: come se non ci fosse */ }
      }

      const storedMoney = pokedollars ? (Number(pokedollars) || 0) : 0;
      currentPokedollars = clampPokedollars(storedMoney);
      // Un valore oltre il tetto e' gia' impreciso: lo si ripara subito.
      if (storedMoney > MAX_POKEDOLLARS) saveMoney();

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
        setStatus(t(runSource === LIVE_RUN_KEY ? 'status.loaded' : 'status.loadedParked',
          { n: currentRun.team?.length || 0 }), 'ok');
        renderAll();
        // I cataloghi letti dal gioco arrivano dopo: si ridisegna quando ci sono.
        Promise.all([
          readMegaStones().catch(() => null),
          readPassivePool(getLanguage()).catch(() => null),
          readTraitCatalog(getLanguage()).catch(() => null),
          readEndlessState(runSource).catch(() => null),
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

// I PokeDollari esistono anche senza una run: si salvano a parte.
function saveMoney() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pd) => { localStorage.setItem('poke_pokedollars', JSON.stringify(pd)); },
      args: [clampPokedollars(currentPokedollars)]
    });
  });
}

let saveTimer = null;
export function autoSave(showMessage = true) {
  clearTimeout(saveTimer);
  if(showMessage && currentRun) setStatus(t('status.saving'), '');
  saveMoney();

  if (!currentRun) return;

  saveTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      currentRun.maxTeamSize = 6;
      const runStr = JSON.stringify(currentRun);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        // Una run parcheggiata e' { run, endless } in un'unica chiave: si
        // sostituisce solo `run`, lasciando lo stato della Torre com'e'.
        func: (data, source) => {
          if (source && source.startsWith('poke_parked_run:')) {
            const parked = JSON.parse(localStorage.getItem(source) || 'null');
            if (!parked) return false;
            parked.run = data;
            localStorage.setItem(source, JSON.stringify(parked));
            return true;
          }
          localStorage.setItem('poke_current_run', data);
          return true;
        },
        args: [runStr, runSource || LIVE_RUN_KEY]
      }, () => {
        if (!chrome.runtime.lastError && showMessage) {
          setStatus(t('status.saved'), 'ok');
        }
      });
    });
  }, 300);
}

