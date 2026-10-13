import { getLanguage } from './i18n.js';

export const DONATION_URL = 'https://ko-fi.com/erpaffo';

// L'id dell'estensione viene assegnato al momento della pubblicazione, quindi
// l'indirizzo della pagina recensioni si costruisce a runtime.
export function storeReviewUrl() {
  return `https://chromewebstore.google.com/detail/${chrome.runtime.id}/reviews`;
}

// Lo Store aggiunge update_url solo alle installazioni che arrivano da lui:
// se manca, l'estensione e' caricata non pacchettizzata e la pagina non esiste.
export function isInstalledFromStore() {
  return Boolean(chrome.runtime.getManifest().update_url);
}

export const POKEMON_NAMES_FALLBACK = {
    1:"Bulbasaur",2:"Ivysaur",3:"Venusaur",4:"Charmander",5:"Charmeleon",6:"Charizard",
    7:"Squirtle",8:"Wartortle",9:"Blastoise",10:"Caterpie",11:"Metapod",12:"Butterfree",
    13:"Weedle",14:"Kakuna",15:"Beedrill",16:"Pidgey",17:"Pidgeotto",18:"Pidgeot",
    19:"Rattata",20:"Raticate",21:"Spearow",22:"Fearow",23:"Ekans",24:"Arbok",
    25:"Pikachu",26:"Raichu",27:"Sandshrew",28:"Sandslash",29:"Nidoran♀",30:"Nidorina",
    31:"Nidoqueen",32:"Nidoran♂",33:"Nidorino",34:"Nidoking",35:"Clefairy",36:"Clefable",
    37:"Vulpix",38:"Ninetales",39:"Jigglypuff",40:"Wigglytuff",41:"Zubat",42:"Golbat",
    43:"Oddish",44:"Gloom",45:"Vileplume",46:"Paras",47:"Parasect",48:"Venonat",
    49:"Venomoth",50:"Diglett",51:"Dugtrio",52:"Meowth",53:"Persian",54:"Psyduck",
    55:"Golduck",56:"Mankey",57:"Primeape",58:"Growlithe",59:"Arcanine",60:"Poliwag",
    61:"Poliwhirl",62:"Poliwrath",63:"Abra",64:"Kadabra",65:"Alakazam",66:"Machop",
    67:"Machoke",68:"Machamp",69:"Bellsprout",70:"Weepinbell",71:"Victreebel",
    72:"Tentacool",73:"Tentacruel",74:"Geodude",75:"Graveler",76:"Golem",77:"Ponyta",
    78:"Rapidash",79:"Slowpoke",80:"Slowbro",81:"Magnemite",82:"Magneton",83:"Farfetch'd",
    84:"Doduo",85:"Dodrio",86:"Seel",87:"Dewgong",88:"Grimer",89:"Muk",90:"Shellder",
    91:"Cloyster",92:"Gastly",93:"Haunter",94:"Gengar",95:"Onix",96:"Drowzee",
    97:"Hypno",98:"Krabby",99:"Kingler",100:"Voltorb",101:"Electrode",102:"Exeggcute",
    103:"Exeggutor",104:"Cubone",105:"Marowak",106:"Hitmonlee",107:"Hitmonchan",
    108:"Lickitung",109:"Koffing",110:"Weezing",111:"Rhyhorn",112:"Rhydon",113:"Chansey",
    114:"Tangela",115:"Kangaskhan",116:"Horsea",117:"Seadra",118:"Goldeen",119:"Seaking",
    120:"Staryu",121:"Starmie",122:"Mr. Mime",123:"Scyther",124:"Jynx",125:"Electabuzz",
    126:"Magmar",127:"Pinsir",128:"Tauros",129:"Magikarp",130:"Gyarados",131:"Lapras",
    132:"Ditto",133:"Eevee",134:"Vaporeon",135:"Jolteon",136:"Flareon",137:"Porygon",
    138:"Omanyte",139:"Omastar",140:"Kabuto",141:"Kabutops",142:"Aerodactyl",
    143:"Snorlax",144:"Articuno",145:"Zapdos",146:"Moltres",147:"Dratini",148:"Dragonair",
    149:"Dragonite",150:"Mewtwo",151:"Mew"
};

// Lo zaino del gioco e' un array (run.items) con una voce per oggetto:
// non esistono quantita' e il limite e' 10 slot.
export const MAX_BAG_ITEMS = 10;

// Strumenti tenuti: nome inglese e nome italiano.
//
// Il gioco memorizza i suoi oggetti con il nome inglese ("Rocky Helmet" nel
// salvataggio), quindi e' quello il nome che l'utente ritrova dentro al gioco.
// Per questo l'italiano ha la traduzione, mentre tutte le altre lingue usano
// l'inglese: cercare lo strumento nel gioco resta immediato.
export const HELD_ITEMS = {
  nessuno:        { en: 'None',           it: 'Nessuno' },
  lucky_egg:      { en: 'Lucky Egg',      it: 'Fortunuovo' },
  choice_band:    { en: 'Choice Band',    it: 'Bendascelta' },
  rocky_helmet:   { en: 'Rocky Helmet',   it: 'Bitorzolelmo' },
  leftovers:      { en: 'Leftovers',      it: 'Avanzi' },
  charcoal:       { en: 'Charcoal',       it: 'Carbonella' },
  miracle_seed:   { en: 'Miracle Seed',   it: 'Miracolseme' },
  hard_stone:     { en: 'Hard Stone',     it: 'Pietradura' },
  silk_scarf:     { en: 'Silk Scarf',     it: 'Sciarpa Seta' },
  pixie_plate:    { en: 'Pixie Plate',    it: 'Lastrafata' },
  mystic_water:   { en: 'Mystic Water',   it: 'Acquamagica' },
  magnet:         { en: 'Magnet',         it: 'Calamita' },
  black_belt:     { en: 'Black Belt',     it: 'Cinturanera' },
  poison_barb:    { en: 'Poison Barb',    it: 'Velenaculeo' },
  soft_sand:      { en: 'Soft Sand',      it: 'Sabbia Soffice' },
  sharp_beak:     { en: 'Sharp Beak',     it: 'Beccaffilato' },
  twisted_spoon:  { en: 'Twisted Spoon',  it: 'Cucchiaio Torto' },
  silver_powder:  { en: 'Silver Powder',  it: 'Argentopolvere' },
  spell_tag:      { en: 'Spell Tag',      it: 'Spettrotarga' },
  dragon_fang:    { en: 'Dragon Fang',    it: 'Dentedidrago' },
  black_glasses:  { en: 'Black Glasses',  it: 'Occhialineri' },
  metal_coat:     { en: 'Metal Coat',     it: 'Metalcoperta' },
  never_melt_ice: { en: 'Never-Melt Ice', it: 'Gelomai' }
};

// Nome da mostrare nell'interfaccia, secondo la lingua scelta.
export function itemName(id) {
  const entry = HELD_ITEMS[id];
  if (!entry) return id || '';
  return getLanguage() === 'it' ? entry.it : entry.en;
}

// Nome da scrivere nel salvataggio: sempre quello inglese, perche' e' la forma
// che il gioco usa per i propri oggetti.
export function itemGameName(id) {
  return HELD_ITEMS[id] ? HELD_ITEMS[id].en : id;
}

export const MEGA_UNLOCKS = {
  "Mega Venusaur": { baseId: 1, req: 1 },
  "Mega Blastoise": { baseId: 7, req: 1 },
  "Mega Charizard": { baseId: 4, req: 1 },
  "Mega Kangaskhan": { baseId: 115, req: 1 },
  "Mega Ampharos": { baseId: 179, req: 1 },
  "Mega Houndoom": { baseId: 228, req: 1 },
  "Mega Blaziken": { baseId: 255, req: 1 },
  "Mega Mawile": { baseId: 303, req: 1 },
  "Mega Aggron": { baseId: 304, req: 1 },
  "Mega Medicham": { baseId: 307, req: 1 },
  "Mega Manectric": { baseId: 309, req: 1 },
  "Mega Banette": { baseId: 353, req: 1 },
  "Mega Abomasnow": { baseId: 459, req: 1 },
  "Mega Pinsir": { baseId: 127, req: 5 },
  "Mega Heracross": { baseId: 214, req: 5 },
  "Mega Lucario": { baseId: 447, req: 5 },
  "Mega Gardevoir": { baseId: 280, req: 5 },
  "Mega Tyranitar": { baseId: 246, req: 5 },
  "Mega Absol": { baseId: 359, req: 10 },
  "Mega Garchomp": { baseId: 443, req: 10 },
  "Mega Scizor": { baseId: 123, req: 10 },
  "Mega Gyarados": { baseId: 129, req: 10 },
  "Mega Gengar": { baseId: 92, req: 10 },
  "Mega Alakazam": { baseId: 63, req: 10 },
  "Mega Aerodactyl": { baseId: 142, req: 10 },
  "Mega Mewtwo": { baseId: 150, req: 50 },
  "Mega Latias": { baseId: 380, req: 50 },
  "Mega Latios": { baseId: 381, req: 50 }
};

export const baseFormStarters = [1,4,7,10,13,16,19,21,23,27,29,32,37,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,77,79,81,83,84,86,88,90,92,95,96,98,100,102,104,108,109,111,114,115,116,118,120,123,127,128,129,131,132,133,137,138,140,142,147,152,155,158,161,163,165,167,170,172,173,174,175,177,179,187,190,191,193,194,198,200,201,203,204,206,207,209,211,213,214,215,216,218,220,222,223,225,227,228,231,234,235,236,238,239,240,241,246,252,255,258,261,263,265,270,273,276,278,280,283,285,287,290,292,293,296,298,299,300,302,303,304,307,309,311,312,313,314,316,318,320,322,324,325,327,328,331,333,335,336,337,338,339,341,343,345,347,349,351,352,353,355,357,359,360,361,363,366,369,370,371,374,387,390,393,396,399,401,403,406,408,410,412,415,417,418,420,422,425,427,431,433,434,436,438,439,440,441,442,443,446,447,449,451,453,455,456,458,459,495,498,501,504,506,509,511,513,515,517,519,522,524,527,529,531,532,535,538,539,540,543,546,548,550,551,554,556,557,559,561,562,564,566,568,570,572,574,577,580,582,585,587,588,590,592,594,595,597,599,602,605,607,610,613,615,616,618,619,621,622,624,626,627,629,631,632,633,636,650,653,656,659,661,664,667,669,672,674,676,677,679,682,684,686,688,690,692,694,696,698,701,702,703,704,707,708,710,712,714];

export const legendaryStarters = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 716, 717, 718, 719, 720, 721];

