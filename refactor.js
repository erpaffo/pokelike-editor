const fs = require('fs');

const popupJs = fs.readFileSync('popup.js', 'utf8').replace(/\r\n/g, '\n');

// Estrai POKEMON_NAMES_FALLBACK
let constantsContent = `export const POKEMON_NAMES_FALLBACK = {\n` + popupJs.match(/const POKEMON_NAMES_FALLBACK = \{([\s\S]*?)\n\};\n/)[1] + `\n};\n\n`;
constantsContent += `export const HELD_ITEMS = {\n` + popupJs.match(/const HELD_ITEMS = \{([\s\S]*?)\n\};\n/)[1] + `\n};\n\n`;
constantsContent += `export const MEGA_UNLOCKS = {\n` + popupJs.match(/const MEGA_UNLOCKS = \{([\s\S]*?)\n\};\n/)[1] + `\n};\n\n`;
constantsContent += `export const baseFormStarters = [` + popupJs.match(/const baseFormStarters = \[([\s\S]*?)\];/)[1] + `];\n\n`;
constantsContent += `export const legendaryStarters = [` + popupJs.match(/const legendaryStarters = \[([\s\S]*?)\];/)[1] + `];\n\n`;
fs.writeFileSync('js/constants.js', constantsContent);

let stateContent = `export let currentRun = null;
export let speciesList = [];
export let allPokemon = [];
export let currentPokedollars = 0;
export let currentStatsKey = null;
export let currentStats = null;
export const POKEMON_NAMES = {};
import { POKEMON_NAMES_FALLBACK } from './constants.js';
import { setStatus } from './ui.js';
import { renderAll } from './main.js';

export function setCurrentRun(v) { currentRun = v; }
export function setSpeciesList(v) { speciesList = v; }
export function setAllPokemon(v) { allPokemon = v; }
export function setCurrentPokedollars(v) { currentPokedollars = v; }
export function setCurrentStatsKey(v) { currentStatsKey = v; }
export function setCurrentStats(v) { currentStats = v; }

` + popupJs.match(/function buildAllPokemon\(\) \{[\s\S]*?\n\}\n/)[0] + `\n`;

// loadData
stateContent += popupJs.match(/function loadData\(\) \{[\s\S]*?\n\}\n/)[0] + `\n`;

// autoSave
let autoSaveSrc = popupJs.match(/let saveTimer = null;\nfunction autoSave[\s\S]*?\n\}\n/)[0];
stateContent += autoSaveSrc + `\n`;

fs.writeFileSync('js/state.js', stateContent);

// UI module
let uiContent = `import { isPro } from './api.js';

export function typeClass(t) { return 't-' + t.toLowerCase().replace(/[^a-z]/g, ''); }

export function hpColor(pct) {
  if (pct > 50) return '#00e676';
  if (pct > 25) return '#ffd700';
  return '#ff4d6d';
}

export function setStatus(text, type = '') {
  const el = document.getElementById('statusBar');
  if (!el) return;
  el.textContent = text;
  el.className = 'status ' + type;
}

export function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  
  const tabBtn = document.querySelector(\`.tab[data-tab="\${tabId}"]\`);
  if (tabBtn) tabBtn.classList.add('active');
  
  const map = { team: 'contentTeam', run: 'contentRun', bag: 'contentBag', mega: 'contentMega', add: 'contentAdd', pro: 'contentPro' };
  const contentEl = document.getElementById(map[tabId]);
  if (contentEl) contentEl.classList.add('active');
}

` + popupJs.match(/function checkProState\(\) \{[\s\S]*?\n\}\n/)[0] + `\n`;
uiContent += popupJs.match(/function requirePro\(\) \{[\s\S]*?\n\}\n/)[0] + `\n`;
uiContent += popupJs.match(/function unlockProUI\(\) \{[\s\S]*?\n\}\n/)[0] + `\n`;
fs.writeFileSync('js/ui.js', uiContent);

// API module
let apiContent = `import { unlockProUI } from './ui.js';
export let isPro = false;
export function setIsPro(v) { isPro = v; }

` + popupJs.match(/function verifyLicenseWithBackend[\s\S]*?\n\}\n/)[0] + `\n`;
fs.writeFileSync('js/api.js', apiContent);

console.log('Script ran successfully');
