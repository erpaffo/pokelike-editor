import { esc } from '../ui.js';
import { t } from '../i18n.js';
import { readSpire, writeSpire, readSaveKeys, writeSaveKeys } from '../page.js';
import { isBroken, assertFeature, disabledHtml } from '../compat.js';

// Collezioni fuori dalla run, mostrate in fondo alla scheda Sblocchi:
// SpireMon (il gioco di carte) e i frammenti per le uova leggendarie.

// Probabilita' shiny di un uovo leggendario, da rollLegendaryEggShiny:
// LEGENDARY_EGG_SHINY_BASE + pity * 0.003, con la pity azzerata a ogni shiny.
const SHINY_BASE = 0.01;
const SHINY_PITY_STEP = 0.003;
const PITY_GUARANTEED = Math.ceil((1 - SHINY_BASE) / SHINY_PITY_STEP);

let spire;              // undefined = in lettura, null = non disponibile
let shards = 0;
let pity = 0;

const intOf = (raw) => {
  const n = parseInt(raw || '0', 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export async function loadCollections() {
  const [sp, keys] = await Promise.all([
    readSpire().catch(() => null),
    readSaveKeys(['poke_legendary_shards', 'poke_legendary_shiny_pity']).catch(() => ({}))
  ]);
  spire = sp;
  shards = intOf(keys.poke_legendary_shards);
  pity = intOf(keys.poke_legendary_shiny_pity);
}

function shinyChancePct(p) {
  return Math.min(100, (SHINY_BASE + p * SHINY_PITY_STEP) * 100);
}

function spireHtml() {
  if (isBroken('spire')) return disabledHtml('spire');
  if (spire === undefined) return `<p style="font-size:11px; color:var(--text-muted);">${t('spire.loading')}</p>`;
  if (!spire) return `<p style="font-size:11px; color:var(--red-light);">${t('spire.unavailable')}</p>`;
  const allCards = spire.owned >= spire.total;
  const allShiny = spire.shiny >= spire.total;
  return `
    <p style="font-size:12px; margin-bottom:6px;">
      ${t('spire.summary', { n: spire.owned, m: spire.total, s: spire.shiny })}
    </p>
    <p style="font-size:11px; color:${spire.deckUnlocked ? 'var(--green)' : 'var(--text-muted)'}; margin-bottom:8px;">
      ${spire.deckUnlocked ? t('spire.deckOk') : t('spire.deckLocked')}
    </p>
    <div class="field-row">
      <button class="btn btn-accent" id="btnSpireCards" style="flex:1;" ${allCards ? 'disabled' : ''}>${t('spire.allCards')}</button>
      <button class="btn btn-accent" id="btnSpireShiny" style="flex:1;" ${allShiny ? 'disabled' : ''}>${t('spire.allShiny')}</button>
    </div>
    ${spire.deckUnlocked ? '' : `<button class="btn btn-primary w-100" id="btnSpireDeck" style="margin-top:8px;">${t('spire.unlockDeck')}</button>`}
    <div class="field-row" style="margin-top:10px;">
      <label class="field-label" style="width:150px;">${t('spire.tokens', { n: spire.packCost })}</label>
      <input type="number" id="spireTokens" class="field-input" min="0" value="${spire.tokens}" style="flex:1;">
      <button class="btn btn-accent" id="btnSpireTokens">${t('common.apply')}</button>
    </div>`;
}

function shardsHtml() {
  if (isBroken('shards')) return disabledHtml('shards');
  return `
    <div class="field-row">
      <label class="field-label" style="width:150px;">${t('shards.count')}</label>
      <input type="number" id="legendShards" class="field-input" min="0" value="${shards}" style="flex:1;">
    </div>
    <div class="field-row">
      <label class="field-label" style="width:150px;">${t('shards.pity')}</label>
      <input type="number" id="legendPity" class="field-input" min="0" value="${pity}" style="flex:1;">
    </div>
    <p style="font-size:11px; color:var(--text-muted); margin:6px 0 8px;">
      ${t('shards.chance', { p: shinyChancePct(pity).toFixed(1) })}
    </p>
    <div class="field-row">
      <button class="btn btn-accent" id="btnShardsSave" style="flex:1;">${t('common.apply')}</button>
      <button class="btn btn-accent" id="btnShardsGuarantee" style="flex:1;" ${shinyChancePct(pity) >= 100 ? 'disabled' : ''}>${t('shards.guarantee')}</button>
    </div>`;
}

export function collectionsHtml() {
  return `
    <div class="section">
      <div class="section-title">🃏 ${t('spire.title')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px; line-height:1.45;">${t('spire.hint')}</p>
      ${spireHtml()}
    </div>
    <div class="section">
      <div class="section-title">💎 ${t('shards.title')}</div>
      <p style="font-size:11px; color:var(--text-muted); margin-bottom:8px; line-height:1.45;">${t('shards.hint')}</p>
      ${shardsHtml()}
    </div>`;
}

// runAction viene dalla scheda Sblocchi: mostra lo stato e poi ridisegna,
// rileggendo anche queste collezioni.
export function bindCollections(runAction) {
  const spireOp = (op, value, msgKey) => runAction(async () => {
    assertFeature('spire');
    if (!await writeSpire(op, value)) throw new Error(t('spire.unavailable'));
    return t(msgKey);
  }, t('unlocks.working'));

  document.getElementById('btnSpireCards')?.addEventListener('click', () => spireOp('cards', null, 'spire.cardsDone'));
  document.getElementById('btnSpireShiny')?.addEventListener('click', () => spireOp('shiny', null, 'spire.shinyDone'));
  document.getElementById('btnSpireDeck')?.addEventListener('click', () => spireOp('deck', null, 'spire.deckDone'));
  document.getElementById('btnSpireTokens')?.addEventListener('click', () => {
    const n = Math.max(0, parseInt(document.getElementById('spireTokens')?.value, 10) || 0);
    spireOp('tokens', n, 'spire.tokensDone');
  });

  const saveShards = (newPity) => runAction(async () => {
    assertFeature('shards');
    const n = Math.max(0, parseInt(document.getElementById('legendShards')?.value, 10) || 0);
    const p = newPity ?? Math.max(0, parseInt(document.getElementById('legendPity')?.value, 10) || 0);
    await writeSaveKeys({
      poke_legendary_shards: String(n),
      poke_legendary_shiny_pity: String(p)
    });
    return t('shards.saved');
  }, t('unlocks.working'));

  document.getElementById('btnShardsSave')?.addEventListener('click', () => saveShards());
  document.getElementById('btnShardsGuarantee')?.addEventListener('click', () => saveShards(PITY_GUARANTEED));
}
