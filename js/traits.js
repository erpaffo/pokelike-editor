// Tratti della Torre Infinita.
//
// Non sono un dato del salvataggio: il gioco li ricalcola dalla squadra prima
// di ogni lotta (computeTraitTiers), e endlessState.traitTiers e' solo una
// cache per l'HUD. Qui si replica la formula del gioco, alla lettera:
//
//   peso(pkmn) = 1
//              + 1 se shiny
//              + 1 se mutante (_mutated)
//              + 1 se il passivo team_reroll e' attivo
//              + 1 se il passivo legend_traits e' attivo e il Pokemon e' leggendario
//   punti[tipo] = somma dei pesi dei membri che hanno quel tipo
//   tier[tipo]  = min(TRAIT_MAX_TIER, floor(punti / 2))
//
// Di conseguenza per cambiare un tratto bisogna cambiare la squadra: i tipi
// (cioe' la mutazione), lo stato shiny e i due passivi. E' quello che fa
// planForTier().

export const MAX_TIER = 12;

// I due passivi che entrano nel peso. Gli id sono quelli del gioco.
export const TEAM_REROLL = 'team_reroll';
export const LEGEND_TRAITS = 'legend_traits';

function passiveOn(passives, id) {
  return Array.isArray(passives) && passives.some(p => p && p.id === id && p.enabled !== false);
}

export function memberWeight(pk, passives, isLegendary) {
  if (!pk) return 0;
  return 1
    + (pk.isShiny ? 1 : 0)
    + (pk._mutated ? 1 : 0)
    + (passiveOn(passives, TEAM_REROLL) ? 1 : 0)
    + (passiveOn(passives, LEGEND_TRAITS) && isLegendary && isLegendary(pk.speciesId) ? 1 : 0);
}

export function computeTraitPoints(team, passives, isLegendary) {
  const points = {};
  (team || []).forEach(pk => {
    const w = memberWeight(pk, passives, isLegendary);
    (pk.types || []).forEach(type => { points[type] = (points[type] || 0) + w; });
  });
  return points;
}

export function tierFromPoints(points) {
  return Math.min(MAX_TIER, Math.floor((points || 0) / 2));
}

export function computeTraitTiers(team, passives, isLegendary) {
  const points = computeTraitPoints(team, passives, isLegendary);
  const tiers = {};
  Object.keys(points).forEach(type => {
    const tier = tierFromPoints(points[type]);
    if (tier > 0) tiers[type] = tier;
  });
  return tiers;
}

// Il tetto raggiungibile per un tipo con la squadra attuale, cioe' con tutti i
// membri portati a shiny + mutati su quel tipo. Serve a non proporre all'utente
// un tier che nessuna modifica potrebbe dare.
export function maxReachableTier(team, passives, isLegendary) {
  const size = (team || []).length;
  if (!size) return 0;
  let points = 0;
  (team || []).forEach(pk => {
    // Shiny e mutazione si possono sempre attivare; gli altri due addendi
    // dipendono dai passivi, che qui restano come sono.
    points += 1 + 1 + 1
      + (passiveOn(passives, TEAM_REROLL) ? 1 : 0)
      + (passiveOn(passives, LEGEND_TRAITS) && isLegendary && isLegendary(pk.speciesId) ? 1 : 0);
  });
  return tierFromPoints(points);
}

// Calcola le modifiche minime alla squadra per portare `type` a `targetTier`.
//
// Ordine di intervento, dal meno invasivo al piu' invasivo:
//   1. mutare sul tipo voluto chi non ce l'ha (e non e' gia' mutante)
//   2. rendere shiny chi non lo e'
//   3. marcare mutante chi quel tipo ce l'ha gia' (non aggiunge tipi)
//   4. sostituire la mutazione di chi e' gia' mutante su un altro tipo
//
// Restituisce sempre un piano: `reached` dice se il bersaglio e' stato
// centrato, cosi' la UI puo' spiegare perche' no.
export function planForTier(team, passives, type, targetTier, isLegendary) {
  const members = team || [];
  const want = Math.max(0, Math.min(MAX_TIER, targetTier)) * 2;
  const changes = [];

  // Stato di lavoro: una copia leggera di cio' che conta per il calcolo.
  const work = members.map((pk, idx) => ({
    idx,
    name: pk.nickname || pk.name,
    hasType: (pk.types || []).includes(type),
    isShiny: !!pk.isShiny,
    mutated: !!pk._mutated,
    mutationType: pk._mutationType || null,
    legendary: !!(isLegendary && isLegendary(pk.speciesId))
  }));

  const weightOf = (m) => 1
    + (m.isShiny ? 1 : 0)
    + (m.mutated ? 1 : 0)
    + (passiveOn(passives, TEAM_REROLL) ? 1 : 0)
    + (passiveOn(passives, LEGEND_TRAITS) && m.legendary ? 1 : 0);

  const points = () => work.reduce((sum, m) => sum + (m.hasType ? weightOf(m) : 0), 0);

  // 1. mutazione sul tipo voluto per chi non lo ha e non e' gia' mutante
  for (const m of work) {
    if (points() >= want) break;
    if (m.hasType || m.mutated) continue;
    m.hasType = true;
    m.mutated = true;
    m.mutationType = type;
    changes.push({ idx: m.idx, name: m.name, kind: 'mutate', type });
  }

  // 2. shiny per chi ha il tipo ma non e' shiny
  for (const m of work) {
    if (points() >= want) break;
    if (!m.hasType || m.isShiny) continue;
    m.isShiny = true;
    changes.push({ idx: m.idx, name: m.name, kind: 'shiny' });
  }

  // 3. chi ha gia' il tipo ma non e' marcato mutante: marcarlo vale +1 e non
  //    aggiunge nessun tipo nuovo, perche' la mutazione e' su un tipo che ha
  //    gia'. E' il passo che permette di arrivare davvero al tetto dichiarato.
  for (const m of work) {
    if (points() >= want) break;
    if (!m.hasType || m.mutated) continue;
    m.mutated = true;
    m.mutationType = type;
    changes.push({ idx: m.idx, name: m.name, kind: 'markMutant', type });
  }

  // 4. mutanti gia' impegnati su un altro tipo: si sposta la mutazione
  for (const m of work) {
    if (points() >= want) break;
    if (m.hasType || !m.mutated) continue;
    const from = m.mutationType;
    m.hasType = true;
    m.mutationType = type;
    changes.push({ idx: m.idx, name: m.name, kind: 'remutate', type, from });
  }

  // 5. restano i membri senza il tipo e non shiny
  for (const m of work) {
    if (points() >= want) break;
    if (m.isShiny) continue;
    m.isShiny = true;
    changes.push({ idx: m.idx, name: m.name, kind: 'shiny' });
  }

  const finalPoints = points();
  return {
    changes,
    points: finalPoints,
    tier: tierFromPoints(finalPoints),
    reached: tierFromPoints(finalPoints) >= Math.min(MAX_TIER, targetTier)
  };
}
