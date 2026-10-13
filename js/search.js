import { t } from './i18n.js';

// Ricerca testuale condivisa dalle liste lunghe dell'estensione.
//
// Due requisiti:
//  - deve funzionare in qualsiasi lingua l'utente digiti, non solo in quella
//    scelta per l'interfaccia. Per questo chi costruisce le liste allega a ogni
//    voce un campo `search`: tutti i nomi che quella voce ha nelle lingue che
//    il gioco conosce, piu' il suo id.
//  - deve perdonare accenti e maiuscole: "pokedollari" trova "PokeDollari",
//    "fluegel" no ma "flugel" trova "Flügel", e "Uovo Fortunato" si trova
//    scrivendo "uovo fort" come "lucky egg".

// NFD separa la lettera dal segno diacritico, cosi' i segni si possono togliere
// con una sola regola invece di una tabella di sostituzioni.
export function normalize(value) {
  return String(value == null ? '' : value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // L'apostrofo sparisce invece di diventare spazio: altrimenti "King's Rock"
    // si spezzerebbe in "king s rock" e chi scrive "kings" non lo troverebbe.
    .replace(/['’ʼ´`]/g, '')
    // trattini, due punti, underscore e punteggiatura diventano spazi: cosi'
    // "lucky-egg", "lucky_egg" e "Lucky Egg" si equivalgono.
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function queryTokens(query) {
  const n = normalize(query);
  return n ? n.split(' ') : [];
}

// Ogni parola cercata deve comparire in almeno uno dei testi della voce.
// Parole diverse possono trovarsi in testi diversi: "uovo exp" trova una voce
// che si chiama "Uovo Fortunato" e nella descrizione parla di EXP.
export function matchesQuery(haystack, query) {
  const words = queryTokens(query);
  if (!words.length) return true;
  const texts = (Array.isArray(haystack) ? haystack : [haystack])
    .filter(Boolean)
    .map(normalize)
    .filter(Boolean);
  if (!texts.length) return false;
  return words.every(word => texts.some(text => text.includes(word)));
}

export function filterBySearch(list, query, haystackOf) {
  const words = queryTokens(query);
  if (!words.length) return list;
  return list.filter(item => matchesQuery(haystackOf(item), query));
}

// Unisce i testi cercabili di una voce scartando vuoti e duplicati: tenerla
// corta evita di confrontare venti volte la stessa stringa.
export function searchTerms(...parts) {
  const out = [];
  const seen = new Set();
  const push = (value) => {
    if (value == null) return;
    if (Array.isArray(value)) return value.forEach(push);
    const s = String(value).trim();
    if (!s) return;
    const key = normalize(s);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };
  parts.forEach(push);
  return out;
}

// ── Interfaccia ──────────────────────────────────────────────────────────
// Un unico punto per lo stile e per il comportamento, cosi' le caselle di
// ricerca si somigliano tutte e si comportano allo stesso modo. Il suggerimento
// spiega, passandoci sopra, che si puo' scrivere in qualsiasi lingua.
export function searchBoxHtml(id, placeholder, value = '') {
  const safe = String(value).replace(/"/g, '&quot;');
  const hint = t('search.hint').replace(/"/g, '&quot;');
  return `
    <div style="position:relative; margin-bottom:8px;">
      <span style="position:absolute; left:8px; top:50%; transform:translateY(-50%);
                   font-size:12px; opacity:0.6; pointer-events:none;">🔎</span>
      <input type="search" id="${id}" class="field-input" value="${safe}"
             placeholder="${String(placeholder).replace(/"/g, '&quot;')}" title="${hint}"
             autocomplete="off" spellcheck="false"
             style="width:100%; padding-left:26px; font-size:11px;">
    </div>`;
}

// Il ridisegno della lista non deve far perdere il fuoco ne' la posizione del
// cursore: senza questo, scrivere la seconda lettera rimanderebbe il cursore
// all'inizio a ogni carattere.
export function bindSearchBox(id, onChange) {
  const input = document.getElementById(id);
  if (!input) return null;
  input.addEventListener('input', () => {
    const { selectionStart, selectionEnd } = input;
    onChange(input.value);
    const again = document.getElementById(id);
    if (!again) return;
    again.focus();
    try {
      again.setSelectionRange(selectionStart, selectionEnd);
    } catch (e) {
      // input type=search non sempre espone la selezione: pazienza.
    }
  });
  return input;
}
