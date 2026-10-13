// Tipi di nodo della mappa e in quali modalita' possono comparire.
//
// Le regole sono quelle del gioco, ricavate dal suo generatore di mappe:
//
//  - i pesi della Torre (ER_NODE_BANDS) cambiano per fascia di mappa:
//      fino alla 10  -> nessun pokemart, nessun evilteam
//      fino alla 30  -> idem, piu' mutation e legendary
//      dalla 31      -> si aggiungono pokemart (scambia strumenti per caramelle
//                       rare) ed evilteam
//  - i nodi speciali della storia sono posati a mano sul livello 4 e solo
//    fuori dalla Torre (ogni blocco e' dentro `!state.isEndlessMode`), ognuno
//    legato alla generazione della run e a certe mappe:
//      silver               gen2Mode
//      magma / aqua         gen3Mode, mappe 2-5-7
//      underground          gen4Mode, mappe 1-3-6
//      distortion           gen4Mode, mappe 3-5-7
//      rival_n              gen5Mode, mappe 0-3-5-7
//  - reward e subexit esistono solo nelle sotto-mappe.
//
// Di conseguenza offrire "pokemart" in una run storia, o "distortion" nella
// Torre, darebbe un nodo che il gioco non sa gestire in quel contesto.

export const NODE_IDS = [
  'start', 'battle', 'trainer', 'catch', 'item', 'question', 'pokecenter',
  'move_tutor', 'trade', 'boss', 'legendary', 'mutation', 'pokemart',
  'evilteam', 'silver', 'magma', 'aqua', 'underground', 'distortion',
  'rival_n', 'reward', 'subexit'
];

// Da quale mappa della Torre compaiono pokemart ed evilteam (ER_NODE_BANDS:
// la terza fascia parte dopo la trentesima).
export const ER_LATE_BAND_FROM_MAP = 31;

// group: serve solo a raggruppare il menu.
export const NODE_INFO = {
  start:       { group: 'structural' },
  boss:        { group: 'structural' },
  pokecenter:  { group: 'structural' },
  battle:      { group: 'common' },
  trainer:     { group: 'common' },
  catch:       { group: 'common' },
  item:        { group: 'common' },
  question:    { group: 'common' },
  move_tutor:  { group: 'common' },
  trade:       { group: 'common' },
  legendary:   { group: 'common' },
  mutation:    { group: 'tower', towerOnly: true },
  pokemart:    { group: 'tower', towerOnly: true, fromMap: ER_LATE_BAND_FROM_MAP },
  evilteam:    { group: 'tower', towerOnly: true, fromMap: ER_LATE_BAND_FROM_MAP },
  silver:      { group: 'story', storyOnly: true, genFlag: 'gen2Mode' },
  magma:       { group: 'story', storyOnly: true, genFlag: 'gen3Mode', maps: [2, 5, 7] },
  aqua:        { group: 'story', storyOnly: true, genFlag: 'gen3Mode', maps: [2, 5, 7] },
  underground: { group: 'story', storyOnly: true, genFlag: 'gen4Mode', maps: [1, 3, 6] },
  distortion:  { group: 'story', storyOnly: true, genFlag: 'gen4Mode', maps: [3, 5, 7] },
  rival_n:     { group: 'story', storyOnly: true, genFlag: 'gen5Mode', maps: [0, 3, 5, 7] },
  reward:      { group: 'submap', submapOnly: true },
  subexit:     { group: 'submap', submapOnly: true }
};

// Indice globale della mappa nella Torre: il gioco lo ricava dalla regione e
// dalla posizione dentro la regione (tre mappe per regione).
export function towerMapIndex(endlessState, run) {
  if (endlessState && endlessState.regionNumber != null) {
    return (endlessState.regionNumber - 1) * 3 + (endlessState.mapIndexInRegion || 0) + 1;
  }
  if (run && run.endlessStage != null) return run.endlessStage;
  return 1;
}

// Una sotto-mappa si riconosce dai suoi stessi nodi: e' l'unico posto dove il
// gioco genera reward/subexit.
export function isSubMap(map) {
  if (!map || !map.layers) return false;
  return map.layers.some(layer =>
    (layer || []).some(node => node && (node.type === 'reward' || node.type === 'subexit')));
}

// I tipi che l'utente puo' scegliere in questa run, in questa mappa.
export function availableNodeTypes(run, endlessState, map) {
  const endless = !!(run && run.isEndlessMode);
  const submap = isSubMap(map);
  const mapIndex = endless ? towerMapIndex(endlessState, run) : (run?.currentMap ?? 0);

  return NODE_IDS.filter(id => {
    const info = NODE_INFO[id];
    if (!info) return false;
    if (info.submapOnly) return submap;
    if (info.towerOnly) {
      if (!endless) return false;
      return info.fromMap == null || mapIndex >= info.fromMap;
    }
    if (info.storyOnly) {
      if (endless) return false;
      if (info.genFlag && !(run && run[info.genFlag])) return false;
      if (info.maps && !info.maps.includes(mapIndex)) return false;
      return true;
    }
    return true;
  });
}

// Perche' un tipo non e' disponibile: serve a spiegarlo invece di far sparire
// la voce e basta.
export function unavailableReason(id, run, endlessState, map) {
  const info = NODE_INFO[id];
  if (!info) return 'unknown';
  const endless = !!(run && run.isEndlessMode);
  if (info.submapOnly && !isSubMap(map)) return 'submapOnly';
  if (info.towerOnly) {
    if (!endless) return 'towerOnly';
    if (info.fromMap != null && towerMapIndex(endlessState, run) < info.fromMap) return 'lateTower';
  }
  if (info.storyOnly) {
    if (endless) return 'storyOnly';
    if (info.genFlag && !(run && run[info.genFlag])) return 'wrongGen';
    if (info.maps && !info.maps.includes(run?.currentMap ?? 0)) return 'wrongMap';
  }
  return '';
}
