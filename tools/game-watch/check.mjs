// Sentinella di compatibilita' con pokelike.xyz.
//
// Scarica il gioco, ne decodifica le stringhe e controlla che ci sia ancora
// tutto cio' che l'editor usa (js/compat-requirements.js). Scrive un rapporto
// in markdown e, su GitHub Actions, gli output `problem`, `title` e `version`
// che il workflow usa per aprire una issue.
//
//   node tools/game-watch/check.mjs                  # dal sito
//   node tools/game-watch/check.mjs --bundle f.js    # da un bundle salvato
import fs from 'node:fs';
import { deobfuscate } from './deobfuscate.mjs';
import { FEATURES, TESTED_GAME_VERSION } from '../../js/compat-requirements.js';

const GAME_URL = process.env.GAME_URL || 'https://pokelike.xyz/';
const REPORT_PATH = process.env.REPORT_PATH || 'game-watch-report.md';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function loadBundle() {
  const i = process.argv.indexOf('--bundle');
  if (i > 0) return { source: process.argv[i + 1], code: fs.readFileSync(process.argv[i + 1], 'utf8') };
  const html = await (await fetch(GAME_URL)).text();
  const src = /<script[^>]+src="([^"]*bundle[^"]*\.js)"/.exec(html)?.[1];
  if (!src) throw new Error('nessuno script "bundle" nella pagina del gioco');
  const url = new URL(src, GAME_URL).href;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download del bundle fallito (${res.status})`);
  return { source: url, code: await res.text() };
}

// Funzione dichiarata, oppure costante/variabile globale (anche come secondo
// dichiaratore di una `const A=..,B=..`) o proprieta' di window.
function hasGlobal(code, name) {
  const n = esc(name);
  return new RegExp(`\\bfunction\\s+${n}\\(`).test(code)
    || new RegExp(`(?:\\b(?:const|let|var)\\s+|,)${n}\\s*=(?!=)`).test(code)
    || new RegExp(`window(?:\\.${n}|\\[["']${n}["']\\])\\s*=(?!=)`).test(code);
}

// Chiave o campo: come stringa, come proprieta' (.x) o come chiave letterale (x:).
function hasString(code, value) {
  const n = esc(value);
  return new RegExp(`["'\`]${n}["'\`]`).test(code)
    || (/^[\w$]+$/.test(value) && new RegExp(`\\.${n}\\b|[{,]${n}:`).test(code));
}

function gameVersion(code) {
  const first = /PATCH_NOTES=\[([\w$]+)/.exec(code)?.[1];
  if (first) {
    const v = new RegExp(`${esc(first)}\\[["']version["']\\]=["']([^"']+)["']`).exec(code)?.[1];
    if (v) return v;
  }
  return /\[["']version["']\]=["'](\d+(?:\.\d+)+)["']/.exec(code)?.[1] || null;
}

// Frasi in inglese delle note di patch uscite dopo la versione verificata.
function newPatchNotes(code, version) {
  const from = code.indexOf(`["version"]="${version}"`);
  const to = code.indexOf(`["version"]="${TESTED_GAME_VERSION}"`);
  if (from < 0 || to < 0 || from === to) return [];
  const seg = code.slice(Math.min(from, to), Math.max(from, to));
  const seen = new Set();
  for (const m of seg.matchAll(/"((?:[^"\\]|\\.){40,600})"|'((?:[^'\\]|\\.){40,600})'/g)) {
    const text = (m[1] ?? m[2]).replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\(["'])/g, '$1');
    if (text.includes('<') || !/^[\x20-\x7e—–’…]+$/.test(text)) continue;
    seen.add(text);
    if (seen.size >= 25) break;
  }
  return [...seen];
}

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<__EOF__\n${value}\n__EOF__\n`);
}

async function main() {
  const lines = [];
  let version = null;
  let missing = [];
  let fatal = null;

  try {
    const { source, code: raw } = await loadBundle();
    const { code, replaced } = deobfuscate(raw);
    version = gameVersion(code);
    lines.push(`Bundle: \`${source}\` · stringhe decodificate: ${replaced}`);
    lines.push(`Versione del gioco: **${version ?? 'sconosciuta'}** · verificata dall'editor: **${TESTED_GAME_VERSION}**`, '');

    for (const [feature, req] of Object.entries(FEATURES)) {
      const lost = [
        ...req.globals.filter(g => !hasGlobal(code, g)).map(g => `globale \`${g}\``),
        ...req.strings.filter(s => !hasString(code, s)).map(s => `chiave/campo \`${s}\``)
      ];
      if (lost.length) missing.push({ feature, lost });
    }

    if (missing.length) {
      lines.push('## Elementi non più trovati', '',
        'Le funzioni elencate qui sotto si disattivano da sole nel popup finché il codice non viene aggiornato.', '');
      missing.forEach(m => lines.push(`- **${m.feature}**: ${m.lost.join(', ')}`));
      lines.push('');
    } else {
      lines.push('Tutti gli elementi usati dall\'editor sono ancora presenti.', '');
    }

    if (version && version !== TESTED_GAME_VERSION) {
      const notes = newPatchNotes(code, version);
      lines.push(`## Note di patch dopo la ${TESTED_GAME_VERSION}`, '');
      lines.push(...(notes.length ? notes.map(n => `- ${n}`) : ['_Non estratte automaticamente._']));
      lines.push('', 'Dopo aver verificato l\'editor con la nuova versione, aggiorna `TESTED_GAME_VERSION` in `js/compat-requirements.js`.', '');
    }
  } catch (e) {
    fatal = e.message;
    lines.push(`**Controllo non riuscito:** ${fatal}`, '',
      'Il gioco potrebbe aver cambiato il modo in cui viene pubblicato o offuscato: va verificato a mano.');
  }

  const changed = version && version !== TESTED_GAME_VERSION;
  const problem = Boolean(fatal || missing.length || changed);
  const title = fatal
    ? '⚠️ pokelike.xyz: controllo di compatibilità non riuscito'
    : missing.length
      ? `⚠️ pokelike.xyz ${version ?? ''}: ${missing.length} funzioni dell'editor a rischio`
      : `ℹ️ pokelike.xyz aggiornato a ${version}`;

  const report = lines.join('\n');
  fs.writeFileSync(REPORT_PATH, report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  setOutput('problem', String(problem));
  setOutput('title', title);
  setOutput('version', version ?? '');

  console.log(report);
  console.log(problem ? `\n=> ${title}` : '\n=> nessun problema');
}

main();
