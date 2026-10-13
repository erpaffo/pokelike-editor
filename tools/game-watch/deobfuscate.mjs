// Rende leggibili le stringhe del bundle di pokelike.xyz.
//
// Il bundle e' passato da un offuscatore che sposta tutte le stringhe in un
// array e le richiama per indice (`fEW(0x1720)` -> "poke_current_run"). I nomi
// cambiano a ogni build, la forma no:
//
//   const ALIAS=DEC;(function(f,A){ ...rotazione... }(ARR,0x287e8));
//   function DEC(f,A){ f=f-0xa2; const b=ARR(); ... }
//   function ARR(){ const s=[...]; ARR=function(){return s;}; return ARR(); }
//
// Si eseguono SOLO questi tre pezzi in un contesto vm isolato (niente require,
// niente rete, tempo limitato), poi si sostituisce ogni chiamata con la stringa.
import vm from 'node:vm';

// Fine di un blocco { ... } a partire dalla graffa in `open`, saltando le
// graffe dentro le stringhe.
function blockEnd(src, open) {
  let depth = 0;
  let quote = null;
  for (let k = open; k < src.length; k++) {
    const c = src[k];
    if (quote) {
      if (c === '\\') { k++; continue; }
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === '`') {
      quote = c;
    } else if (c === '{') {
      depth++;
    } else if (c === '}' && --depth === 0) {
      return k + 1;
    }
  }
  return -1;
}

function functionSource(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start < 0) return null;
  const end = blockEnd(src, src.indexOf('{', start));
  return end < 0 ? null : src.slice(start, end);
}

export function deobfuscate(src) {
  const head = /^\s*const ([\w$]+)=([\w$]+);\(function\([\w$]+,[\w$]+\)\{/.exec(src);
  if (!head) throw new Error('intestazione dell\'offuscatore non riconosciuta');
  const [, alias, decoder] = head;

  const decoderSrc = functionSource(src, decoder);
  if (!decoderSrc) throw new Error(`decodificatore ${decoder} non trovato`);
  const arrayName = /const [\w$]+=([\w$]+)\(\)/.exec(decoderSrc)?.[1];
  if (!arrayName) throw new Error('funzione dell\'array di stringhe non trovata');

  const arrayStart = src.indexOf(`function ${arrayName}(){`);
  const arrayEndMark = new RegExp(`${arrayName.replace(/\$/g, '\\$')}=function\\(\\)\\{return [\\w$]+;\\};return ${arrayName.replace(/\$/g, '\\$')}\\(\\);\\}`);
  const arrayEnd = arrayEndMark.exec(src.slice(arrayStart));
  if (arrayStart < 0 || !arrayEnd) throw new Error('array di stringhe non trovato');
  const arraySrc = src.slice(arrayStart, arrayStart + arrayEnd.index + arrayEnd[0].length);

  const rotFrom = src.indexOf('(function(', head.index);
  const rotClose = new RegExp(`\\}\\(${arrayName.replace(/\$/g, '\\$')},0x[0-9a-f]+\\)\\);`).exec(src.slice(rotFrom));
  if (!rotClose) throw new Error('rotazione dell\'array non trovata');
  const rotation = src.slice(rotFrom, rotFrom + rotClose.index + rotClose[0].length);

  const ctx = vm.createContext({});
  vm.runInContext(`${arraySrc}\n${decoderSrc}\nconst ${alias}=${decoder};${rotation}\nthis.decode=${decoder};`,
    ctx, { timeout: 10000 });
  const decode = ctx.decode;

  // Ogni funzione si crea alias locali del decodificatore (const A0O=fEW, e a
  // catena A17=A16): si raccolgono finche' l'insieme smette di crescere.
  const aliases = new Set([alias, decoder]);
  const assignments = [...src.matchAll(/([\w$]+)=([\w$]+)[,;]/g)];
  for (let grew = true; grew;) {
    grew = false;
    for (const m of assignments) {
      if (aliases.has(m[2]) && !aliases.has(m[1])) { aliases.add(m[1]); grew = true; }
    }
  }

  let replaced = 0;
  const code = src.replace(/\b([\w$]+)\((0x[0-9a-f]+)\)/g, (all, id, hex) => {
    if (!aliases.has(id)) return all;
    try {
      const v = decode(parseInt(hex, 16));
      if (typeof v !== 'string') return all;
      replaced++;
      return JSON.stringify(v);
    } catch (e) {
      return all;
    }
  });
  return { code, replaced };
}
