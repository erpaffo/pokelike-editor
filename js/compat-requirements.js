// Cosa l'editor si aspetta di trovare in pokelike.xyz, funzione per funzione.
// E' l'unico elenco da aggiornare quando il gioco cambia, e lo leggono in due:
//   - js/compat.js, all'apertura del popup: controlla le `globals` nella pagina
//     e disattiva le funzioni che hanno perso qualcosa;
//   - tools/game-watch/check.mjs, ogni giorno su GitHub: cerca `globals` e
//     `strings` nel codice del gioco e apre una issue se qualcosa sparisce.
//
// globals: funzioni e costanti globali del gioco che l'editor chiama o legge.
// strings: chiavi del localStorage e nomi di campo che l'editor scrive o legge
//          direttamente, senza passare da una funzione del gioco.

// Versione del gioco su cui l'editor e' stato verificato l'ultima volta. Va
// aggiornata dopo aver controllato che una nuova versione non rompa nulla.
export const TESTED_GAME_VERSION = '3.4.1';

export const ISSUES_URL = 'https://github.com/erpaffo/pokelike-editor/issues';

export const FEATURES = {
  starters: {
    globals: ['getHofIndex', 'getEvoLineRoot', 'recordEggHatch', 'LEGENDARY_ID_SET'],
    strings: ['poke_hof_index', 'evoLineRoots', 'starterRuns', 'shinySpecies', 'eggLegendaries', 'eggLegendaryShinies']
  },
  megas: {
    globals: ['MEGA_STONES', 'megaLineMvpCount', '_megaLineSpecies', 'isMegaBraceletUnlocked',
      'saveHallOfFameEntry', 'getChallengeStats'],
    strings: ['poke_challenge_stats', 'mvpCounts']
  },
  megaItems: {
    globals: ['MEGA_STONE_BY_ID', 'makeMegaStoneItem', 'syncMegaForm'],
    strings: ['megaSpecies', 'isMegaStone']
  },
  parkedRun: {
    globals: ['getParkedRun', 'restoreParkedRun'],
    strings: ['poke_parked_run:endless2', 'poke_current_run', 'poke_endless_state']
  },
  endless2: {
    globals: ['erPassiveSlots', 'augMult', 'mutPct'],
    strings: ['challengeEndless2', 'erPassiveSlots', 'erCatchLevelBonus', 'erMode', '_augmentPct', '_mutationPct']
  },
  signature: {
    globals: ['SIG_BY_ROOT', 'SIG_BY_ID', 'sigEffectsFor'],
    strings: ['erSignature']
  },
  spire: {
    globals: ['SPIRE_CARDS', 'SP_PACK_TOKENS', 'spLoadCollection'],
    strings: ['poke_spire_cards']
  },
  shards: {
    globals: ['getLegendaryShards', 'getLegendaryShinyPity', 'rollLegendaryEggShiny'],
    strings: ['poke_legendary_shards', 'poke_legendary_shiny_pity']
  },
  passives: {
    globals: ['PASSIVE_ITEM_POOL'],
    strings: ['passives']
  },
  traits: {
    globals: ['computeTraitTiers', 'TRAIT_MAX_TIER', 'TRAIT_DESCRIPTIONS'],
    strings: ['traitTiers']
  },
  vitamins: {
    globals: ['getEvoLineRoot'],
    strings: ['poke_stat_buffs']
  },
  achievements: {
    globals: ['ACHIEVEMENTS', 'CHALLENGES', 'STORY_COUNTERS', 'I18N', 'countClaimableAchRewards', 'claimAllAchRewards'],
    strings: ['poke_achievements', 'poke_challenges_done', 'poke_ach_rewards_claimed']
  },
  dailyWeekly: {
    globals: ['getDailyChallengeType', 'getCurrentWeeklyChallenge', '_dailyDayNumber'],
    strings: ['poke_daily', 'poke_weekly']
  },
  backupSync: {
    globals: ['_push'],
    strings: ['__pokeCloudPause']
  },
  saveBasics: {
    globals: [],
    strings: ['poke_pokedollars', 'poke_dex', 'poke_shiny_dex']
  }
};
