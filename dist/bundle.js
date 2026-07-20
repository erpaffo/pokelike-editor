// js/constants.js
var POKEMON_NAMES_FALLBACK = {
  1: "Bulbasaur",
  2: "Ivysaur",
  3: "Venusaur",
  4: "Charmander",
  5: "Charmeleon",
  6: "Charizard",
  7: "Squirtle",
  8: "Wartortle",
  9: "Blastoise",
  10: "Caterpie",
  11: "Metapod",
  12: "Butterfree",
  13: "Weedle",
  14: "Kakuna",
  15: "Beedrill",
  16: "Pidgey",
  17: "Pidgeotto",
  18: "Pidgeot",
  19: "Rattata",
  20: "Raticate",
  21: "Spearow",
  22: "Fearow",
  23: "Ekans",
  24: "Arbok",
  25: "Pikachu",
  26: "Raichu",
  27: "Sandshrew",
  28: "Sandslash",
  29: "Nidoran\u2640",
  30: "Nidorina",
  31: "Nidoqueen",
  32: "Nidoran\u2642",
  33: "Nidorino",
  34: "Nidoking",
  35: "Clefairy",
  36: "Clefable",
  37: "Vulpix",
  38: "Ninetales",
  39: "Jigglypuff",
  40: "Wigglytuff",
  41: "Zubat",
  42: "Golbat",
  43: "Oddish",
  44: "Gloom",
  45: "Vileplume",
  46: "Paras",
  47: "Parasect",
  48: "Venonat",
  49: "Venomoth",
  50: "Diglett",
  51: "Dugtrio",
  52: "Meowth",
  53: "Persian",
  54: "Psyduck",
  55: "Golduck",
  56: "Mankey",
  57: "Primeape",
  58: "Growlithe",
  59: "Arcanine",
  60: "Poliwag",
  61: "Poliwhirl",
  62: "Poliwrath",
  63: "Abra",
  64: "Kadabra",
  65: "Alakazam",
  66: "Machop",
  67: "Machoke",
  68: "Machamp",
  69: "Bellsprout",
  70: "Weepinbell",
  71: "Victreebel",
  72: "Tentacool",
  73: "Tentacruel",
  74: "Geodude",
  75: "Graveler",
  76: "Golem",
  77: "Ponyta",
  78: "Rapidash",
  79: "Slowpoke",
  80: "Slowbro",
  81: "Magnemite",
  82: "Magneton",
  83: "Farfetch'd",
  84: "Doduo",
  85: "Dodrio",
  86: "Seel",
  87: "Dewgong",
  88: "Grimer",
  89: "Muk",
  90: "Shellder",
  91: "Cloyster",
  92: "Gastly",
  93: "Haunter",
  94: "Gengar",
  95: "Onix",
  96: "Drowzee",
  97: "Hypno",
  98: "Krabby",
  99: "Kingler",
  100: "Voltorb",
  101: "Electrode",
  102: "Exeggcute",
  103: "Exeggutor",
  104: "Cubone",
  105: "Marowak",
  106: "Hitmonlee",
  107: "Hitmonchan",
  108: "Lickitung",
  109: "Koffing",
  110: "Weezing",
  111: "Rhyhorn",
  112: "Rhydon",
  113: "Chansey",
  114: "Tangela",
  115: "Kangaskhan",
  116: "Horsea",
  117: "Seadra",
  118: "Goldeen",
  119: "Seaking",
  120: "Staryu",
  121: "Starmie",
  122: "Mr. Mime",
  123: "Scyther",
  124: "Jynx",
  125: "Electabuzz",
  126: "Magmar",
  127: "Pinsir",
  128: "Tauros",
  129: "Magikarp",
  130: "Gyarados",
  131: "Lapras",
  132: "Ditto",
  133: "Eevee",
  134: "Vaporeon",
  135: "Jolteon",
  136: "Flareon",
  137: "Porygon",
  138: "Omanyte",
  139: "Omastar",
  140: "Kabuto",
  141: "Kabutops",
  142: "Aerodactyl",
  143: "Snorlax",
  144: "Articuno",
  145: "Zapdos",
  146: "Moltres",
  147: "Dratini",
  148: "Dragonair",
  149: "Dragonite",
  150: "Mewtwo",
  151: "Mew"
};
var HELD_ITEMS = {
  "nessuno": "Nessuno",
  "lucky_egg": "Fortunuovo",
  "choice_band": "Bendascelta",
  "rocky_helmet": "Bitorzolelmo",
  "leftovers": "Avanzi",
  "charcoal": "Carbonella",
  "miracle_seed": "Miracolseme",
  "hard_stone": "Pietradura",
  "silk_scarf": "Sciarpa Seta",
  "pixie_plate": "Lastrafata",
  "mystic_water": "Acquamagica",
  "magnet": "Calamita",
  "black_belt": "Cinturanera",
  "poison_barb": "Velenaculeo",
  "soft_sand": "Sabbia Soffice",
  "sharp_beak": "Beccaffilato",
  "twisted_spoon": "Cucchiaio Torto",
  "silver_powder": "Argentopolvere",
  "spell_tag": "Spettrotarga",
  "dragon_fang": "Dentedidrago",
  "black_glasses": "Occhialineri",
  "metal_coat": "Metalcoperta",
  "never_melt_ice": "Gelomai"
};
var MEGA_UNLOCKS = {
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
  "Mega Pinsir": { baseId: 127, req: 10 },
  "Mega Heracross": { baseId: 214, req: 10 },
  "Mega Lucario": { baseId: 447, req: 10 },
  "Mega Gardevoir": { baseId: 280, req: 10 },
  "Mega Tyranitar": { baseId: 246, req: 10 },
  "Mega Absol": { baseId: 359, req: 25 },
  "Mega Garchomp": { baseId: 443, req: 25 },
  "Mega Scizor": { baseId: 123, req: 25 },
  "Mega Gyarados": { baseId: 129, req: 25 },
  "Mega Gengar": { baseId: 92, req: 25 },
  "Mega Alakazam": { baseId: 63, req: 25 },
  "Mega Aerodactyl": { baseId: 142, req: 25 },
  "Mega Mewtwo": { baseId: 150, req: 100 },
  "Mega Latias": { baseId: 380, req: 100 },
  "Mega Latios": { baseId: 381, req: 100 }
};
var baseFormStarters = [1, 4, 7, 10, 13, 16, 19, 21, 23, 27, 29, 32, 37, 41, 43, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 83, 84, 86, 88, 90, 92, 95, 96, 98, 100, 102, 104, 108, 109, 111, 114, 115, 116, 118, 120, 123, 127, 128, 129, 131, 132, 133, 137, 138, 140, 142, 147, 152, 155, 158, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 187, 190, 191, 193, 194, 198, 200, 201, 203, 204, 206, 207, 209, 211, 213, 214, 215, 216, 218, 220, 222, 223, 225, 227, 228, 231, 234, 235, 236, 238, 239, 240, 241, 246, 252, 255, 258, 261, 263, 265, 270, 273, 276, 278, 280, 283, 285, 287, 290, 292, 293, 296, 298, 299, 300, 302, 303, 304, 307, 309, 311, 312, 313, 314, 316, 318, 320, 322, 324, 325, 327, 328, 331, 333, 335, 336, 337, 338, 339, 341, 343, 345, 347, 349, 351, 352, 353, 355, 357, 359, 360, 361, 363, 366, 369, 370, 371, 374, 387, 390, 393, 396, 399, 401, 403, 406, 408, 410, 412, 415, 417, 418, 420, 422, 425, 427, 431, 433, 434, 436, 438, 439, 440, 441, 442, 443, 446, 447, 449, 451, 453, 455, 456, 458, 459, 495, 498, 501, 504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531, 532, 535, 538, 539, 540, 543, 546, 548, 550, 551, 554, 556, 557, 559, 561, 562, 564, 566, 568, 570, 572, 574, 577, 580, 582, 585, 587, 588, 590, 592, 594, 595, 597, 599, 602, 605, 607, 610, 613, 615, 616, 618, 619, 621, 622, 624, 626, 627, 629, 631, 632, 633, 636, 650, 653, 656, 659, 661, 664, 667, 669, 672, 674, 676, 677, 679, 682, 684, 686, 688, 690, 692, 694, 696, 698, 701, 702, 703, 704, 707, 708, 710, 712, 714];
var legendaryStarters = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 716, 717, 718, 719, 720, 721];

// js/api.js
var isPro = false;
function setIsPro(val) {
  isPro = val;
}
function verifyLicenseWithBackend(code, isSilent) {
  const statusEl = document.getElementById("licenseStatus");
  if (!isSilent && statusEl) {
    statusEl.style.display = "block";
    statusEl.style.color = "#ffc107";
    statusEl.innerText = "Verifica in corso...";
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => localStorage.getItem("poke_username") || localStorage.getItem("poke_save_uuid") || "unknown_user"
    }, (results) => {
      const accountId = results[0]?.result || "unknown_user";
      fetch("http://localhost:3000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, accountId })
      }).then((r) => r.json()).then((data) => {
        if (data.success && data.pro) {
          isPro = true;
          chrome.storage.local.set({ proLicense: code });
          localStorage.setItem("pokelike_premium_unlocked", "true");
          unlockProUI();
          if (!isSilent && statusEl) {
            statusEl.style.color = "#28a745";
            statusEl.innerText = "Licenza valida! Funzionalit\xE0 Pro sbloccate.";
          }
        } else {
          isPro = false;
          if (!isSilent && statusEl) {
            statusEl.style.color = "#dc3545";
            statusEl.innerText = data.error || "Codice non valido.";
          }
          chrome.storage.local.remove("proLicense");
        }
      }).catch((err) => {
        if (!isSilent && statusEl) {
          statusEl.style.color = "#dc3545";
          statusEl.innerText = "Errore di connessione al server.";
        }
      });
    });
  });
}

// js/ui.js
function hpColor(pct) {
  if (pct > 50) return "#00e676";
  if (pct > 25) return "#ffd700";
  return "#ff4d6d";
}
function setStatus(text, type = "") {
  const el = document.getElementById("statusBar");
  if (!el) return;
  el.textContent = text;
  el.className = "status " + type;
}
function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".content").forEach((c) => c.classList.remove("active"));
  const tabBtn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (tabBtn) tabBtn.classList.add("active");
  const map = { team: "contentTeam", run: "contentRun", bag: "contentBag", mega: "contentMega", add: "contentAdd", pro: "contentPro" };
  const contentEl = document.getElementById(map[tabId]);
  if (contentEl) contentEl.classList.add("active");
}
function checkProState() {
  const lockIcons = document.querySelectorAll(".pro-lock-icon");
  const badge = document.getElementById("proStatusBadge");
  if (isPro) {
    lockIcons.forEach((el) => el.style.display = "none");
    const activeState = document.getElementById("proActiveState");
    const unlockState = document.getElementById("proUnlockState");
    if (activeState) activeState.style.display = "block";
    if (unlockState) unlockState.style.display = "none";
    if (badge) {
      badge.textContent = "Stato: Attivo";
      badge.style.background = "rgba(0, 230, 118, 0.2)";
      badge.style.color = "#00e676";
      badge.style.border = "1px solid #00e676";
    }
  } else {
    lockIcons.forEach((el) => el.style.display = "inline-block");
    const activeState = document.getElementById("proActiveState");
    const unlockState = document.getElementById("proUnlockState");
    if (activeState) activeState.style.display = "none";
    if (unlockState) unlockState.style.display = "block";
    if (badge) {
      badge.textContent = "Stato: Non Attivo";
      badge.style.background = "rgba(255, 77, 109, 0.2)";
      badge.style.color = "#ff4d6d";
      badge.style.border = "1px solid #ff4d6d";
    }
  }
}
function requirePro() {
  if (isPro) return true;
  switchTab("pro");
  setStatus("\u2B50 Funzionalit\xE0 riservata agli utenti PRO!", "err");
  return false;
}
function unlockProUI() {
  const banner = document.getElementById("proBanner");
  if (banner) banner.innerHTML = '<div class="alert alert-success py-2 mb-3"><i class="fas fa-check-circle me-2"></i>Versione PRO Attiva</div>';
  const proElements = document.querySelectorAll(".pro-feature");
  proElements.forEach((el) => {
    el.removeAttribute("disabled");
    const lock = el.querySelector(".fa-lock");
    if (lock) lock.style.display = "none";
  });
  const overlays = document.querySelectorAll(".pro-overlay");
  overlays.forEach((overlay) => overlay.style.display = "none");
  checkProState();
}

// js/state.js
var currentRun = null;
var speciesList = [];
var allPokemon = [];
var currentPokedollars = 0;
var currentStatsKey = null;
var currentStats = null;
var selectedAddPokemon = null;
var POKEMON_NAMES = { ...POKEMON_NAMES_FALLBACK };
function setCurrentPokedollars(v) {
  currentPokedollars = v;
}
function setSelectedAddPokemon(v) {
  selectedAddPokemon = v;
}
function buildAllPokemon() {
  const map = {};
  speciesList.forEach((s) => {
    if (!s.id) return;
    const clean = s.name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
    map[s.id] = clean;
  });
  Object.keys(POKEMON_NAMES_FALLBACK).forEach((id) => {
    if (!map[id]) map[id] = POKEMON_NAMES_FALLBACK[id];
  });
  Object.assign(POKEMON_NAMES, map);
  allPokemon = Object.keys(map).map((id) => ({ id: parseInt(id), name: map[id] })).filter((p) => !p.name.toLowerCase().includes("-mega")).sort((a, b) => a.id - b.id);
}
function loadData() {
  setStatus("Sincronizzazione in corso...", "");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url || !tab.url.includes("pokelike.xyz")) {
      setStatus("\u26A0 Apri pokelike.xyz per iniziare", "err");
      return;
    }
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const res = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k.startsWith("poke_") || k.startsWith("pkrl_")) {
            res[k] = localStorage.getItem(k);
          }
        }
        return res;
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results?.[0]) {
        setStatus("\u274C Impossibile leggere il salvataggio", "err");
        return;
      }
      const data = results[0].result;
      const run = data["poke_current_run"];
      const species = data["pkrl_species_list"];
      const pokedollars = data["poke_pokedollars"];
      currentStatsKey = null;
      currentStats = null;
      for (const k in data) {
        if (data[k] && data[k].includes('"mvpCounts"')) {
          currentStatsKey = k;
          try {
            currentStats = JSON.parse(data[k]);
          } catch (e) {
          }
        }
      }
      if (!currentStats) {
        currentStatsKey = "poke_stats";
        currentStats = { runs: 0, clears: 0, mvpCounts: {} };
      }
      currentPokedollars = pokedollars ? JSON.parse(pokedollars) || 0 : 0;
      if (!run) {
        currentRun = null;
        setStatus("\u26A0 Nessuna partita attiva", "err");
        const teamEl = document.getElementById("contentTeam");
        if (teamEl) teamEl.innerHTML = `<div class="empty"><p>Nessuna partita attiva. Inizia una run su pokelike.xyz!</p></div>`;
        return;
      }
      try {
        currentRun = JSON.parse(run);
        speciesList = species ? JSON.parse(species) : [];
        buildAllPokemon();
        setStatus(`\u2705 Partita caricata \xB7 ${currentRun.team?.length || 0} Pok\xE9mon`, "ok");
        renderAll();
      } catch (e) {
        setStatus("\u274C Errore lettura dati: " + e.message, "err");
      }
    });
  });
}
var saveTimer = null;
function autoSave(showMessage = true) {
  clearTimeout(saveTimer);
  if (showMessage && currentRun) setStatus("Salvataggio in corso...", "");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (pd, statsKey, statsStr) => {
        localStorage.setItem("poke_pokedollars", JSON.stringify(pd));
        if (statsKey && statsStr) localStorage.setItem(statsKey, statsStr);
      },
      args: [currentPokedollars, currentStatsKey, currentStats ? JSON.stringify(currentStats) : null]
    });
  });
  if (!currentRun) return;
  saveTimer = setTimeout(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      currentRun.maxTeamSize = 6;
      const runStr = JSON.stringify(currentRun);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (data) => {
          localStorage.setItem("poke_current_run", data);
          return true;
        },
        args: [runStr]
      }, () => {
        if (!chrome.runtime.lastError && showMessage) {
          setStatus("\u2705 Modifiche salvate in tempo reale", "ok");
        }
      });
    });
  }, 300);
}

// js/tabs/team.js
function renderTeam() {
  const el = document.getElementById("contentTeam");
  if (!el || !currentRun) return;
  const team = currentRun.team || [];
  if (team.length === 0) {
    el.innerHTML = `<div class="empty"><p>La tua squadra \xE8 vuota<br>Aggiungi dei Pok\xE9mon dalla scheda \u2795</p></div>`;
    return;
  }
  let html = "";
  team.forEach((pk, idx) => {
    const sd = pk.baseStats || getSpeciesData(pk.speciesId);
    const types = pk.types || ["Normal"];
    const hpPct = pk.maxHp > 0 ? Math.round(pk.currentHp / pk.maxHp * 100) : 0;
    const color = hpColor(hpPct);
    const sprite = pk.spriteUrl || getSprite(pk.speciesId, pk.isShiny);
    const displayName = pk.nickname || pk.name || POKEMON_NAMES[pk.speciesId] || `#${pk.speciesId}`;
    const heldItemId = pk.heldItem && typeof pk.heldItem === "object" ? pk.heldItem.id : pk.heldItem || "";
    const heldItemDisplay = HELD_ITEMS[heldItemId] || heldItemId || "Nessuno";
    let itemOptions = Object.keys(HELD_ITEMS).map((k) => `<option value="${k === "nessuno" ? "" : k}" ${heldItemId === k ? "selected" : ""}>${HELD_ITEMS[k]}</option>`).join("");
    html += `
    <div class="poke-card ${pk.isShiny ? "shiny" : ""}" data-idx="${idx}">
      <button class="btn-remove" data-remove="${idx}" title="Rimuovi">\u2715</button>
      <button class="btn-edit" data-edit="${idx}" title="Modifica Stats">\u270F\uFE0F</button>
      <div class="poke-card-header">
        <div class="poke-sprite-wrapper" style="background: rgba(0,0,0,0.2); padding:4px; border-radius:8px;">
          <img class="poke-sprite" src="${sprite}" alt="${displayName}" data-fallback="${getSprite(pk.speciesId, false)}">
        </div>
        <div class="poke-info">
          <div class="poke-name">#${pk.speciesId} ${displayName} ${pk.isShiny ? "\u2728" : ""} <span style="font-size:12px; font-weight:400; color:#aaa;">Lv.${pk.level}</span></div>
          <div style="font-size:10px; margin-top:4px;">
            ${types.map((t) => `<span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${t}</span>`).join("")}
          </div>
          <div style="font-size:11px; margin-top:4px; color:#ffd700;">Item: ${heldItemDisplay}</div>
        </div>
      </div>
      
      <div style="font-size:11px; color:#aaa; margin-bottom:4px; display:flex; justify-content:space-between;">
        <span>HP</span><span><span style="color:${color}">${pk.currentHp}</span> / ${pk.maxHp}</span>
      </div>
      <div style="background: rgba(255,255,255,0.1); border-radius:4px; height:6px;">
        <div style="width:${Math.min(100, hpPct)}%; background:${color}; height:100%; border-radius:4px;"></div>
      </div>

      <!-- ADVANCED STATS PANEL (PRO) -->
      <div class="adv-stats-panel" id="advStats_${idx}">
        <div class="pro-lockable">
          <div style="font-size:11px; color:var(--gold); margin-bottom:8px; font-weight:700;">Modifica Numerica (PRO)</div>
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">Lv.</label>
            <input type="number" class="field-input bind-team" data-field="level" data-idx="${idx}" value="${pk.level}" style="width:60px;">
            <label class="field-label" style="margin-left:auto;">\u2728 Shiny</label>
            <input type="checkbox" class="bind-team" data-field="isShiny" data-idx="${idx}" ${pk.isShiny ? "checked" : ""}>
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">HP</label>
            <input type="number" class="field-input bind-team" data-field="currentHp" data-idx="${idx}" value="${pk.currentHp}" style="width:60px;">
            <span style="color:#aaa;">/</span>
            <input type="number" class="field-input bind-team" data-field="maxHp" data-idx="${idx}" value="${pk.maxHp}" style="width:60px;">
          </div>

          <div class="field-row">
            <label class="field-label" style="width:50px;">Item</label>
            <select class="field-input bind-team" data-field="heldItem" data-idx="${idx}" style="flex:1;">
              ${itemOptions}
            </select>
            <label class="field-label" style="margin-left:8px;">Mega:</label>
            <input type="text" class="field-input bind-team" data-field="megaStone" data-idx="${idx}" value="${pk.megaStone || ""}" placeholder="es. mawilite" style="width:80px;">
          </div>
          
          <div class="field-row">
            <label class="field-label" style="width:50px;">Tier</label>
            <select class="field-input bind-team" data-field="moveTier" data-idx="${idx}" style="flex:1;">
              <option value="0" ${pk.moveTier === 0 ? "selected" : ""}>Tier 0</option>
              <option value="1" ${pk.moveTier === 1 ? "selected" : ""}>Tier 1</option>
              <option value="2" ${pk.moveTier === 2 ? "selected" : ""}>Tier 2 (Max)</option>
            </select>
          </div>

          <div class="stats-grid">
            <div class="stat-group"><label>Atk</label><input type="number" class="field-input bind-stats" data-field="atk" data-idx="${idx}" value="${sd.atk}"></div>
            <div class="stat-group"><label>Def</label><input type="number" class="field-input bind-stats" data-field="def" data-idx="${idx}" value="${sd.def}"></div>
            <div class="stat-group"><label>Spd</label><input type="number" class="field-input bind-stats" data-field="speed" data-idx="${idx}" value="${sd.speed}"></div>
            <div class="stat-group"><label>Sp.Atk</label><input type="number" class="field-input bind-stats" data-field="special" data-idx="${idx}" value="${sd.special}"></div>
            <div class="stat-group"><label>Sp.Def</label><input type="number" class="field-input bind-stats" data-field="spdef" data-idx="${idx}" value="${sd.spdef}"></div>
            <div class="stat-group"><label>Hp.Base</label><input type="number" class="field-input bind-stats" data-field="hp" data-idx="${idx}" value="${sd.hp}"></div>
          </div>
        </div>
      </div>
    </div>`;
  });
  el.innerHTML = html;
  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentRun.team.splice(parseInt(e.currentTarget.dataset.remove), 1);
      autoSave();
      renderTeam();
    });
  });
  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!requirePro()) return;
      const idx = e.currentTarget.dataset.edit;
      const panel = document.getElementById(`advStats_${idx}`);
      panel.classList.toggle("active");
    });
  });
  document.querySelectorAll(".bind-team").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const idx = e.currentTarget.dataset.idx;
      const field = e.currentTarget.dataset.field;
      let val = e.currentTarget.value;
      if (e.currentTarget.type === "number") val = parseInt(val) || 0;
      if (e.currentTarget.type === "checkbox") val = e.currentTarget.checked;
      if (field === "heldItem") {
        if (val === "") {
          currentRun.team[idx].heldItem = null;
        } else {
          currentRun.team[idx].heldItem = { id: val, name: HELD_ITEMS[val], desc: "Assegnato da PRO Editor", icon: "\u2728" };
        }
      } else {
        currentRun.team[idx][field] = val;
      }
      if (field === "isShiny") {
        currentRun.team[idx].spriteUrl = getSprite(currentRun.team[idx].speciesId, val);
      }
      autoSave();
    });
  });
  document.querySelectorAll(".bind-stats").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const idx = e.currentTarget.dataset.idx;
      const field = e.currentTarget.dataset.field;
      const val = parseInt(e.currentTarget.value) || 0;
      if (!currentRun.team[idx].baseStats) {
        currentRun.team[idx].baseStats = Object.assign({}, getSpeciesData(currentRun.team[idx].speciesId));
      }
      currentRun.team[idx].baseStats[field] = val;
      autoSave();
    });
  });
  document.querySelectorAll(".poke-sprite").forEach((img) => {
    img.addEventListener("error", function() {
      if (this.dataset.fallback && this.src !== this.dataset.fallback) {
        this.src = this.dataset.fallback;
      }
    });
  });
}
function initTeamListeners() {
  document.getElementById("contentTeam")?.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".btn-delete");
    if (delBtn) {
      const idx = parseInt(delBtn.dataset.index);
      currentRun.team.splice(idx, 1);
      autoSave();
      renderTeam();
      return;
    }
    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      if (!requirePro()) return;
      const idx = parseInt(editBtn.dataset.index);
      const pkmn = currentRun.team[idx];
      const pId = pkmn.species || 1;
      const sData = getSpeciesData(pId);
      const detailsHtml = `
        <div class="edit-stats-grid mb-3">
          <div class="stat-group">
            <label>Livello</label>
            <input type="number" id="edit-level" value="${pkmn.level || 1}" min="1" max="100" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Felicit\xE0</label>
            <input type="number" id="edit-happiness" value="${pkmn.happiness || 0}" min="0" max="255" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Natura</label>
            <input type="number" id="edit-nature" value="${pkmn.nature || 0}" min="0" max="24" class="form-control form-control-sm">
          </div>
          <div class="stat-group">
            <label>Abilit\xE0 (Indice)</label>
            <input type="number" id="edit-ability" value="${pkmn.abilityIndex || 0}" min="0" max="2" class="form-control form-control-sm">
          </div>
        </div>
        
        <h6>IVs (0-31)</h6>
        <div class="edit-stats-grid mb-3">
          <div class="stat-group"><label>HP</label><input type="number" id="iv-hp" value="${pkmn.ivs?.[0] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Atk</label><input type="number" id="iv-atk" value="${pkmn.ivs?.[1] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Def</label><input type="number" id="iv-def" value="${pkmn.ivs?.[2] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>SpAtk</label><input type="number" id="iv-spa" value="${pkmn.ivs?.[3] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>SpDef</label><input type="number" id="iv-spd" value="${pkmn.ivs?.[4] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
          <div class="stat-group"><label>Spd</label><input type="number" id="iv-spe" value="${pkmn.ivs?.[5] || 0}" min="0" max="31" class="form-control form-control-sm"></div>
        </div>
        
        <div class="stat-group mt-2">
          <label class="form-check-label d-flex align-items-center gap-2" style="cursor:pointer">
            <input type="checkbox" id="edit-shiny" class="form-check-input" ${pkmn.shiny ? "checked" : ""}> 
            <span style="color:var(--gold)">Pok\xE8mon Cromatico (Shiny)</span>
          </label>
        </div>
      `;
      const modal = document.getElementById("editModal");
      const title = document.getElementById("editModalTitle");
      const body = document.getElementById("editModalBody");
      const saveBtn = document.getElementById("btnSaveEdit");
      title.innerHTML = `<img src="${getSprite(pId, pkmn.shiny)}" style="width:32px;height:32px;image-rendering:pixelated"> Modifica Avanzata ${POKEMON_NAMES[pId] || "Pok\xE9mon"}`;
      body.innerHTML = detailsHtml;
      const newSave = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSave, saveBtn);
      newSave.addEventListener("click", () => {
        if (!pkmn.ivs) pkmn.ivs = [0, 0, 0, 0, 0, 0];
        pkmn.level = parseInt(document.getElementById("edit-level").value) || 1;
        pkmn.happiness = parseInt(document.getElementById("edit-happiness").value) || 0;
        pkmn.nature = parseInt(document.getElementById("edit-nature").value) || 0;
        pkmn.abilityIndex = parseInt(document.getElementById("edit-ability").value) || 0;
        pkmn.ivs[0] = parseInt(document.getElementById("iv-hp").value) || 0;
        pkmn.ivs[1] = parseInt(document.getElementById("iv-atk").value) || 0;
        pkmn.ivs[2] = parseInt(document.getElementById("iv-def").value) || 0;
        pkmn.ivs[3] = parseInt(document.getElementById("iv-spa").value) || 0;
        pkmn.ivs[4] = parseInt(document.getElementById("iv-spd").value) || 0;
        pkmn.ivs[5] = parseInt(document.getElementById("iv-spe").value) || 0;
        pkmn.shiny = document.getElementById("edit-shiny").checked;
        modal.classList.remove("active");
        autoSave();
        renderTeam();
      });
      modal.classList.add("active");
    }
  });
  document.getElementById("editModalClose")?.addEventListener("click", () => {
    document.getElementById("editModal").classList.remove("active");
  });
  document.getElementById("btnHealTeam")?.addEventListener("click", () => {
    if (!currentRun || !currentRun.team) return;
    currentRun.team.forEach((p) => {
      const pId = p.species || 1;
      const sData = getSpeciesData(pId);
      const lvl = p.level || 1;
      const hpIv = p.ivs ? p.ivs[0] || 0 : 0;
      const baseHp = sData.hp || 50;
      const maxHp = Math.floor(0.01 * (2 * baseHp + hpIv + 0) * lvl) + lvl + 10;
      p.hp = maxHp;
      if (p.status) p.status = 0;
    });
    autoSave();
    renderTeam();
    setStatus("\u{1F49A} Squadra curata completamente!", "ok");
  });
}

// js/tabs/run.js
function renderRun() {
  document.getElementById("runMoney").value = currentPokedollars;
  if (!currentRun) return;
  document.getElementById("runMoney").value = currentPokedollars;
  document.getElementById("runBadges").value = currentRun.badges || 0;
  document.getElementById("runMap").value = currentRun.currentMap || 0;
  document.getElementById("runNuzlocke").checked = !!currentRun.nuzlockeMode;
  document.getElementById("runEndless").checked = !!currentRun.isEndlessMode;
  const stageRow = document.getElementById("endlessStageRow");
  if (currentRun.isEndlessMode) {
    stageRow.style.display = "flex";
    document.getElementById("runEndlessStage").value = currentRun.endlessStage || 0;
  } else {
    stageRow.style.display = "none";
  }
}
function initRunListeners() {
  ["runMoney", "runBadges", "runMap", "runEndlessStage"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", (e) => {
      if (id !== "runMoney" && !requirePro()) {
        renderRun();
        return;
      }
      const val = parseInt(e.currentTarget.value) || 0;
      if (id === "runMoney") setCurrentPokedollars(val);
      if (id === "runBadges") currentRun.badges = val;
      if (id === "runMap") currentRun.currentMap = val;
      if (id === "runEndlessStage") currentRun.endlessStage = val;
      autoSave();
    });
  });
  ["runNuzlocke", "runEndless"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", (e) => {
      if (id !== "runNuzlocke" && !requirePro()) {
        e.currentTarget.checked = !e.currentTarget.checked;
        return;
      }
      const val = e.currentTarget.checked;
      if (id === "runNuzlocke") currentRun.nuzlockeMode = val;
      if (id === "runEndless") {
        currentRun.isEndlessMode = val;
        renderRun();
      }
      autoSave();
    });
  });
}

// js/tabs/bag.js
function renderBag() {
  const list = document.getElementById("bagList");
  if (!list || !currentRun) return;
  if (!currentRun.items || currentRun.items.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#888; padding:20px; font-size:11px;">Lo zaino \xE8 vuoto.</div>`;
    return;
  }
  list.innerHTML = currentRun.items.map((it, idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
      <div>
        <div style="font-size:13px; font-weight:600; color:#fff;">${it.icon || "\u{1F4E6}"} ${it.name}</div>
        <div style="font-size:10px; color:#aaa;">ID: ${it.id}</div>
      </div>
      <button class="btn-remove-bag" data-idx="${idx}" style="background:transparent; border:none; color:var(--red-light); cursor:pointer;">\u2715</button>
    </div>
  `).join("");
  document.querySelectorAll(".btn-remove-bag").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const i = parseInt(e.currentTarget.dataset.idx);
      currentRun.items.splice(i, 1);
      autoSave();
      renderBag();
    });
  });
}
function initBagListeners() {
  document.getElementById("btnInjectBag")?.addEventListener("click", () => {
    if (!currentRun) return;
    if (!currentRun.bag) currentRun.bag = {};
    if (!currentRun.bag.items) currentRun.bag.items = {};
    Object.keys(HELD_ITEMS).forEach((k) => {
      if (k !== "nessuno") currentRun.bag.items[k] = 99;
    });
    autoSave();
    renderBag();
    setStatus("\u{1F392} Tutti gli strumenti competitivi iniettati (x99)!", "ok");
  });
  document.getElementById("btnClearBag")?.addEventListener("click", () => {
    if (!currentRun) return;
    if (currentRun.bag && currentRun.bag.items) currentRun.bag.items = {};
    autoSave();
    renderBag();
    setStatus("\u{1F5D1}\uFE0F Borsa svuotata.", "ok");
  });
}

// js/tabs/mega.js
function renderMega() {
  const sel = document.getElementById("megaUnlockSelect");
  if (!sel) return;
  if (sel.children.length === 0) {
    sel.innerHTML = Object.keys(MEGA_UNLOCKS).map((k) => `<option value="${k}">${k} (Richiede ${MEGA_UNLOCKS[k].req} MVP)</option>`).join("");
  }
}
function initMegaListeners() {
  document.getElementById("btnUnlockSingleMega")?.addEventListener("click", () => {
    if (!requirePro() || !currentStats) return;
    const megaName = document.getElementById("megaUnlockSelect").value;
    const megaData = MEGA_UNLOCKS[megaName];
    if (!megaData) return;
    if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
    currentStats.mvpCounts[megaData.baseId] = megaData.req;
    autoSave();
    setStatus(`\u2728 Sbloccata Megaevoluzione: ${megaName}`, "ok");
  });
  document.getElementById("btnUnlockAllMegas")?.addEventListener("click", () => {
    if (!requirePro() || !currentStats) return;
    if (!currentStats.mvpCounts) currentStats.mvpCounts = {};
    Object.keys(MEGA_UNLOCKS).forEach((megaName) => {
      const megaData = MEGA_UNLOCKS[megaName];
      currentStats.mvpCounts[megaData.baseId] = megaData.req;
    });
    autoSave();
    setStatus("\u{1F31F} Tutte le Megaevoluzioni sbloccate!", "ok");
  });
  document.getElementById("btnUnlockDex")?.addEventListener("click", () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let dex = {};
          for (let i = 1; i <= 721; i++) {
            dex[i] = { caught: true, seen: true, caughtShiny: true, seenShiny: true };
          }
          localStorage.setItem("poke_pokedex", JSON.stringify(dex));
        }
      }, () => {
        setStatus("\u{1F4DA} Pok\xE9dex Nazionale Completato!", "ok");
      });
    });
  });
  document.getElementById("btnUnlockAllStarters")?.addEventListener("click", () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (baseFormStarters2) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem("poke_used_starters")) || [];
          } catch (e) {
          }
          baseFormStarters2.forEach((id) => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          localStorage.setItem("poke_used_starters", JSON.stringify(usedStarters));
        },
        args: [baseFormStarters]
      }, () => {
        setStatus("\u{1F95A} Tutti gli starter base aggiunti (Come uovo)! Ricarica il gioco.", "ok");
      });
    });
  });
  document.getElementById("btnUnlockLegendaries")?.addEventListener("click", () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (legendaryStarters2) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem("poke_used_starters")) || [];
          } catch (e) {
          }
          legendaryStarters2.forEach((id) => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          localStorage.setItem("poke_used_starters", JSON.stringify(usedStarters));
        },
        args: [legendaryStarters]
      }, () => {
        setStatus("\u{1F451} LEGGENDARI AGGIUNTI (Come uovo)! Ricarica il gioco.", "ok");
      });
    });
  });
  document.getElementById("btnUnlockLegendariesShiny")?.addEventListener("click", () => {
    if (!requirePro()) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (legendaryStarters2) => {
          let usedStarters = [];
          try {
            usedStarters = JSON.parse(localStorage.getItem("poke_used_starters")) || [];
          } catch (e) {
          }
          legendaryStarters2.forEach((id) => {
            if (!usedStarters.includes(id)) usedStarters.push(id);
          });
          let dex = {};
          try {
            dex = JSON.parse(localStorage.getItem("poke_pokedex")) || {};
          } catch (e) {
          }
          legendaryStarters2.forEach((id) => {
            if (!dex[id]) dex[id] = {};
            dex[id].caughtShiny = true;
          });
          localStorage.setItem("poke_pokedex", JSON.stringify(dex));
          localStorage.setItem("poke_used_starters", JSON.stringify(usedStarters));
        },
        args: [legendaryStarters]
      }, () => {
        setStatus("\u2728 LEGGENDARI SHINY AGGIUNTI (Come uovo)! Ricarica il gioco.", "ok");
      });
    });
  });
}

// js/tabs/add.js
var searchQuery = "";
var filterType = "";
var filterGen = "";
function getGen(id) {
  if (id <= 151) return "1";
  if (id <= 251) return "2";
  if (id <= 386) return "3";
  if (id <= 493) return "4";
  if (id <= 649) return "5";
  if (id <= 721) return "6";
  return "Unknown";
}
function renderPokeGrid() {
  const grid = document.getElementById("pokeGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const q = searchQuery.toLowerCase();
  const filtered = allPokemon.filter((p) => {
    const matchText = p.name.toLowerCase().includes(q) || p.id.toString() === q;
    let matchGen = true;
    if (filterGen) {
      matchGen = getGen(p.id) === filterGen;
    }
    let matchType = true;
    if (filterType) {
      const sData = window.getSpeciesData ? window.getSpeciesData(p.id) : null;
      if (sData && sData.types) {
        matchType = sData.types.map((t) => t.toLowerCase()).includes(filterType.toLowerCase());
      } else {
        matchType = false;
      }
    }
    return matchText && matchGen && matchType;
  }).slice(0, 50);
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="color:#8b92a5; grid-column:1/-1; text-align:center; padding: 20px;">Nessun Pok\xE9mon trovato</div>`;
    return;
  }
  filtered.forEach((p) => {
    const isSelected = selectedAddPokemon === p.id;
    const div = document.createElement("div");
    div.className = "pokemon-option";
    if (isSelected) div.style.border = "1px solid var(--gold)";
    div.dataset.id = p.id;
    const sprite = window.getSprite ? window.getSprite(p.id) : "";
    div.innerHTML = `
      <img src="${sprite}" style="width:40px; height:40px; image-rendering:pixelated; margin-bottom:4px;">
      <div style="font-size:10px; color:#8b92a5">#${p.id}</div>
      <div style="font-size:11px; font-weight:600">${p.name}</div>
    `;
    grid.appendChild(div);
  });
}
function renderAdd() {
  const el = document.getElementById("contentAdd");
  if (!el) return;
  const maxLevel = currentRun?.team?.length ? Math.max(...currentRun.team.map((p) => p.level || 1)) : 5;
  let addFormHtml = "";
  if (selectedAddPokemon) {
    const pName = allPokemon.find((p) => p.id === selectedAddPokemon)?.name || "Pok\xE9mon";
    addFormHtml = `
      <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; margin-top:auto;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--gold);">
          Aggiungi ${pName} (#${selectedAddPokemon})
        </div>
        <div class="field-row" style="margin-bottom: 16px;">
          <label class="field-label">Livello</label>
          <input class="field-input" type="number" id="addLevel" min="1" max="100" value="${maxLevel}" style="width:70px">
          <label style="margin-left:12px; display:flex; align-items:center; gap:6px;">
            <input type="checkbox" id="addShiny"> \u2728 Shiny
          </label>
        </div>
        <div class="field-row">
          <button class="btn btn-primary" id="btnConfirmAdd" style="flex:1">\u2795 Alla Squadra</button>
          <button class="btn btn-ghost" id="btnCancelAdd">Annulla</button>
        </div>
      </div>`;
  }
  el.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; height:100%;">
      
      <!-- Barra di ricerca e filtri -->
      <div style="display:flex; gap:8px;">
        <input class="search-input" id="searchPoke" type="text" placeholder="Cerca..." value="${searchQuery}" style="flex:1">
        
        <select id="filterType" class="field-input" style="width:100px;">
          <option value="">Tutti i Tipi</option>
          <option value="Normal">Normale</option><option value="Fire">Fuoco</option><option value="Water">Acqua</option>
          <option value="Grass">Erba</option><option value="Electric">Elettro</option><option value="Ice">Ghiaccio</option>
          <option value="Fighting">Lotta</option><option value="Poison">Veleno</option><option value="Ground">Terra</option>
          <option value="Flying">Volante</option><option value="Psychic">Psico</option><option value="Bug">Coleottero</option>
          <option value="Rock">Roccia</option><option value="Ghost">Spettro</option><option value="Dragon">Drago</option>
          <option value="Dark">Buio</option><option value="Steel">Acciaio</option><option value="Fairy">Folletto</option>
        </select>
        
        <select id="filterGen" class="field-input" style="width:100px;">
          <option value="">Tutte le Gen</option>
          <option value="1">Gen 1</option><option value="2">Gen 2</option><option value="3">Gen 3</option>
          <option value="4">Gen 4</option><option value="5">Gen 5</option><option value="6">Gen 6</option>
        </select>
      </div>

      <div class="pokemon-grid" id="pokeGrid" style="flex:1; overflow-y:auto;"></div>
      ${addFormHtml}
    </div>`;
  const typeSelect = document.getElementById("filterType");
  const genSelect = document.getElementById("filterGen");
  if (typeSelect) typeSelect.value = filterType;
  if (genSelect) genSelect.value = filterGen;
  renderPokeGrid();
  document.getElementById("searchPoke")?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderPokeGrid();
  });
  document.getElementById("filterType")?.addEventListener("change", (e) => {
    filterType = e.target.value;
    renderPokeGrid();
  });
  document.getElementById("filterGen")?.addEventListener("change", (e) => {
    filterGen = e.target.value;
    renderPokeGrid();
  });
  if (selectedAddPokemon) {
    document.getElementById("btnConfirmAdd")?.addEventListener("click", () => {
      if (!selectedAddPokemon || !currentRun) return;
      if (currentRun.team && currentRun.team.length >= 6) {
        setStatus("\u274C Squadra piena (Max 6)", "err");
        return;
      }
      const level = Math.max(1, Math.min(100, parseInt(document.getElementById("addLevel")?.value) || 5));
      const shiny = document.getElementById("addShiny")?.checked || false;
      const sd = window.getSpeciesData ? window.getSpeciesData(selectedAddPokemon) : { hp: 60, atk: 60, def: 60, speed: 60, special: 60, spdef: 60, types: ["Normal"] };
      const maxHp = Math.floor(2 * sd.hp * level / 100 + level + 10);
      currentRun.maxTeamSize = 6;
      if (!currentRun.team) currentRun.team = [];
      currentRun.team.push({
        species: selectedAddPokemon,
        level,
        ivs: [31, 31, 31, 31, 31, 31],
        moves: [],
        nature: 0,
        abilityIndex: 0,
        shiny,
        hp: maxHp
      });
      setSelectedAddPokemon(null);
      searchQuery = "";
      autoSave();
      setStatus("\u2705 Pok\xE9mon aggiunto!", "ok");
      document.querySelector('.tab[data-tab="team"]')?.click();
    });
    document.getElementById("btnCancelAdd")?.addEventListener("click", () => {
      setSelectedAddPokemon(null);
      renderAdd();
    });
  }
}
function initAddListeners() {
  document.getElementById("contentAdd")?.addEventListener("click", (e) => {
    const opt = e.target.closest(".pokemon-option");
    if (opt) {
      document.querySelectorAll(".pokemon-option").forEach((el) => el.style.border = "1px solid transparent");
      opt.style.border = "1px solid var(--gold)";
      setSelectedAddPokemon(parseInt(opt.dataset.id));
      renderAdd();
    }
  });
}

// js/main.js
function renderAll() {
  const activeTab = document.querySelector(".tab.active")?.dataset.tab || "team";
  checkProState();
  if (activeTab === "team") renderTeam();
  if (activeTab === "add") renderAdd();
  if (activeTab === "run") renderRun();
  if (activeTab === "bag") renderBag();
  if (activeTab === "mega") renderMega();
  if (activeTab === "pro") {
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initTeamListeners();
  initRunListeners();
  initBagListeners();
  initMegaListeners();
  initAddListeners();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const tabId = e.currentTarget.dataset.tab;
      switchTab(tabId);
      renderAll();
    });
  });
  document.getElementById("btnReload")?.addEventListener("click", () => {
    loadData();
  });
  loadData();
});
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["proLicense"], (res) => {
    if (res.proLicense) {
      setIsPro(true);
      unlockProUI();
    }
  });
  document.getElementById("btnBuyPro")?.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => localStorage.getItem("poke_username") || localStorage.getItem("poke_save_uuid") || null
      }, async (results) => {
        const accountId = results[0]?.result;
        if (!accountId) {
          const statusEl = document.getElementById("licenseStatus");
          if (statusEl) {
            statusEl.style.color = "#ff4d6d";
            statusEl.innerText = "Non sei loggato a Pok\xE8like. Apri il gioco e loggati prima di acquistare.";
          }
          return;
        }
        try {
          const res = await fetch("http://localhost:3000/buy/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId })
          });
          const data = await res.json();
          if (data.url) {
            window.open(data.url, "_blank");
          } else {
            throw new Error(data.error || "Errore di connessione a Stripe");
          }
        } catch (e) {
          console.error(e);
          const statusEl = document.getElementById("licenseStatus");
          if (statusEl) {
            statusEl.style.color = "#ff4d6d";
            statusEl.innerText = "Impossibile avviare il checkout: " + e.message;
          }
        }
      });
    });
  });
  document.getElementById("btnVerifyLicense")?.addEventListener("click", () => {
    const code = document.getElementById("licenseKeyInput").value.trim();
    if (!code) return;
    if (code === "POKELIKE-PRO-2026") {
      setIsPro(true);
      localStorage.setItem("pokelike_premium_unlocked", "true");
      chrome.storage.local.set({ proLicense: code });
      unlockProUI();
      const statusEl = document.getElementById("licenseStatus");
      if (statusEl) {
        statusEl.style.color = "#28a745";
        statusEl.innerText = "Licenza test valida! Funzionalit\xE0 Pro sbloccate.";
      }
      return;
    }
    verifyLicenseWithBackend(code, false);
  });
});
export {
  renderAll
};
