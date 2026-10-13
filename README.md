# Pokélike Editor

🇬🇧 English · [🇮🇹 Italiano](README.it.md)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/odjebmffnpbdgbbipanhnabedldeabad?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)
[![Users](https://img.shields.io/chrome-web-store/users/odjebmffnpbdgbbipanhnabedldeabad?label=users)](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**➡️ [Install from the Chrome Web Store](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)**

Chrome extension (Manifest V3) for managing the local save of the browser
fangame **pokelike.xyz**: team, stats, bag, run map, Pokédex and unlocks.
Free, no account required.

> Unofficial project, not affiliated with pokelike.xyz or Nintendo / Game Freak /
> The Pokémon Company. See [LICENSE](LICENSE) and [PRIVACY.md](PRIVACY.md).

## Installation

- **Recommended**: from the [Chrome Web Store](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad), with automatic updates.
- **From source**: clone this repository and load it as an unpacked extension
  (see [Loading locally](#loading-locally)).

Then open `https://pokelike.xyz`, start a run and click the extension icon.

## Features

- **Team**: edit level, HP, IVs, nature, happiness, shiny, held item and move tier; full heal.
  Two shortcuts: make the whole team shiny (sprites included) and raise every move to its top tier.
  In Endless runs also the augment (`_augmentPct`) and mutation strength (`_mutationPct`), with max HP rescaled the way `_recalcMaxHp` does.
- **Mega Stones**: assignable from the team or the bag. Held item and stone share the same slot (`heldItem`), so there is a single menu split into groups. Each Pokémon is only offered the stones of its own species, because `syncMegaForm` only applies the form when `megaSpecies === speciesId`. The item itself is built by the game's `makeMegaStoneItem()`, read at runtime.
- **Mutations**: change, add or remove the extra type of Endless mutant Pokémon (`_mutationType`), keeping it in sync with `types`.
- **Add**: insert any Pokémon (Gen 1–6) with search and type/generation filters.
- **Run**: PokéDollars (up to 999,999,999,999 — beyond that JavaScript loses precision), badges, current map, Nuzlocke/Endless modes, map node editor.
  When no run is in progress, the **paused Endless 2.0 run** is loaded (`poke_parked_run:endless2`, where the game moves it when you switch mode), and edits are written back to that key.
- **Endless 2.0**: Signature Item (one for each of the 366 evolution lines, `run.erSignature = { id, uid }`, resolved by the game via `SIG_BY_ROOT`), passive slots 6–10, extra catch levels (`erCatchLevelBonus`); the Hardcore/Creative mode is shown read-only.
- **Passive items**: choose which passives to keep in the run, read from `PASSIVE_ITEM_POOL`. Slots follow the game's rule: `min(10, run.erPassiveSlots)` in Endless, otherwise `run.challengePassiveCap` or 5.
- **Bag**: add held items while respecting the 10 slots and the one-per-kind limit.
- **Vitamins**: max out stat bonuses (10 per stat, +5% each) for a single starter or all 366. Vitamins are given outside a run, and the game stores them in `poke_stat_buffs` **per evolution-line root**, not per individual: the targets are therefore the selectable first-stage Pokémon (base forms and legendaries), not the team. Attack covers atk and special together, because the game's Protein raises them as a pair and `getTotalBuffPoints` counts them once.
- **Tower traits**: Endless traits are not saved — the game recomputes them from the team before every battle (`computeTraitTiers`), and `poke_endless_state.traitTiers` is just a cache for the HUD. The editor mirrors the formula (`weight = 1 + shiny + mutant + team_reroll + legendary with legend_traits`, `tier = min(12, points ÷ 2)`), shows each trait's effect at the tier reached and, given a type and a target tier, computes the minimal team changes and lists them before applying.
- **Forced traits**: tiers can be set freely, even above 12, **without touching the team**. This does not go through the save because tiers are not stored data: `src/force-traits.js`, registered only when the user turns the feature on, wraps `computeTraitTiers()` in the page and replaces its result. Off by default; turning it off removes the registration. Values live in a `pkeditor_*` key of the page's localStorage, so they stay out of backups and cloud sync.
- **Rebuilt Mega Stones**: 11 Mega forms in the game data have no stone (Charizard X, Swampert, Camerupt, Zygarde, Starmie, Pyroar, Froslass, Floette, Malamar, Chimecho, Golurk). `syncMegaForm` reads everything from the held item rather than from `MEGA_STONES`, so the editor builds them from the form data. They sit in a separate group because they don't grant the Mega ability, which is looked up by the real stone's id.
- **Mode-aware map editor**: 22 node types, offered only where the game can generate them. Poké Mart and villain team only exist in the Tower **from map 31** (`ER_NODE_BANDS`); Silver, Magma/Aqua, Underground, Distortion World and Rival N only outside the Tower and in the right generation; Reward and Exit only in sub-maps. Excluded types come with the reason they're excluded.
- **Unlocks**: completion dashboard ("Platinum"), Mega Evolutions, Pokédex/Shiny Dex by region, starters and legendaries.
  Megas follow the game's rule (`ownsMegaStone`): the Mega Bracelet — a Tower clear of stage 6 without a challenge in the Hall of Fame — and evolution-line MVPs in `poke_challenge_stats.mvpCounts` at least equal to the stone's tier (1/5/10/50). Stones and counts are read from the game.
  Selectable starters and legendaries live in `poke_hof_index`, the index the game derives from the Hall of Fame and eggs: the editor updates it starting from `getHofIndex()`, and completing the Shiny Dex also fills `shinySpecies`.
  Also covers base, monotype, weekly and daily challenges (all in `poke_challenges_done`, each with its own id), achievements that can be toggled one by one, and claiming pending achievement rewards — counting and payout are done by the game via `countClaimableAchRewards` / `claimAllAchRewards`.
- **SpireMon**: owned and shiny cards, tokens, deck building (`poke_spire_cards`), with the `SPIRE_CARDS` catalog read from the game.
- **Legendary shards**: shard count and legendary eggs in a row without a shiny, with the shiny odds of the next legendary egg (1% + 0.3% per egg).
- **Backup**: copy of the save before editing it, with restore, export and import to file. The last 5 are kept in `chrome.storage.local`.
  Restore handles the game's cloud sync (see below); otherwise it would be undone on reload.
- **Languages**: UI in Italian, English, Spanish, French, German and Portuguese, selectable from the settings.
  Item and type names stay in English outside Italian, so they match what you see in the game.
  Passive items and traits, on the other hand, are translated using the game's own dictionary (`I18N[lang].items` and `I18N[lang].traits`), which covers the same six languages: the in-game name is shown next to the translation, and the save always gets the original entry.
- **Multilingual search**: every long list (passives, vitamin starters, achievements, challenges, Mega Evolutions, items and Mega Stones) has a search box that understands all of the game's languages, not just the UI one. The readers in `page.js` attach to each entry its names taken from `I18N[lang]`, so "uovo fortunato" finds the Lucky Egg even in English. Normalization strips accents and apostrophes (`glucks` finds `Glüks-Ei`, `kings rock` finds `King's Rock`), and you can also search by number or id.
- **Settings**: language, themes, data reset.

Version-by-version changes are in [CHANGELOG.md](CHANGELOG.md) (in Italian).

## How it works

The extension has no backend. When you open the popup on a `pokelike.xyz` tab
it reads the `poke_*` / `pkrl_*` keys from the page's `localStorage` through
`chrome.scripting`, lets you edit them and writes them back to the same
`localStorage`. No data leaves your browser.

The achievement and challenge catalog is read **at runtime from the game page**
(`world: "MAIN"`), so it stays in step with pokelike.xyz updates without
duplicating the game's data inside the extension.

The **Sync** button reloads the game page and only then re-reads the save. The
order matters: the game keeps the run in memory and writes it back to
`localStorage` on its first autosave, so without a reload your fresh edits would
be overwritten instead of applied.

Once the reload finishes, the extension **resumes the run on its own**: among
the three buttons `btn-continue-run` / `btn-continue-endless` /
`btn-continue-challenge` it looks for the one the game is actually showing and
clicks it. The mode inferred from the save only sets the search order: a run can
be both endless and a challenge (`challengeId` "endless2"), and in that case the
right button is the challenge one. If no button appears within a few seconds,
nothing is clicked.

### Restore and cloud sync

The game keeps a copy of the save on its own server and compares it with the
local one on startup (`_compareSaves`). The comparison doesn't look at dates but
at 18 progress dimensions, and **keeps the more advanced copy**: a backup is by
definition behind, so it would be overwritten as soon as the page reloads.

That's why restoring registers `src/pause-cloud-sync.js` on the fly at
`document_start` in the MAIN world, which sets `window.__pokeCloudPause` before
the game bundle starts. In "cloud" mode the game's `_push()` function is then
called after the reload to bring the server in line with the restored state. In
"local" mode the server is left untouched and the restore only applies to that
session.

Outgoing network connections:

| Host | Purpose |
|------|---------|
| `pokelike.xyz` | sprite images, the same ones the game page already loads |

No other host is contacted: no external APIs, remote fonts or CDNs.
Base stats and types (#1–#721) are bundled in `js/pokemonTypes.js`.

## Keeping up with game updates

The editor depends on functions, constants and keys of pokelike.xyz that the
developers can rename at any time. Everything it uses is listed, feature by
feature, in [`js/compat-requirements.js`](js/compat-requirements.js), and it is
checked at two points:

- **When the popup opens** ([`js/compat.js`](js/compat.js)): the game's globals
  must still exist and the keys written directly must have the expected shape.
  A feature that lost something is **turned off**, with a notice and a button
  that opens a prefilled issue: the save is never written in a format the game
  no longer recognises.
- **Every day on GitHub** ([`tools/game-watch/`](tools/game-watch/) and the
  [`game-watch.yml`](.github/workflows/game-watch.yml) workflow): the watcher
  downloads the game, decodes its obfuscated strings and looks for every item
  on the list. If something is missing, or a new game version ships, it opens an
  issue labelled `game-watch` with the report and the new patch notes.

It can also be run by hand: `npm run game-watch` (Node 22, no dependencies).
After checking the editor against a new game version, update
`TESTED_GAME_VERSION` in `js/compat-requirements.js`.

## Development

Plain source code, no build step: the popup loads `pokemonData.js` (classic
script) and `js/main.js` (ES module).

```
manifest.json         # MV3
popup.html            # popup UI + CSS
pokemonData.js        # Mega forms + sprite/name helpers (globals, classic script)
js/
  main.js             # entry point, tab routing
  state.js            # shared state + page localStorage I/O
  page.js             # bridge to the game tab (ISOLATED / MAIN worlds)
  backup.js           # save backup/restore + file import/export
  compat.js           # compatibility check when the popup opens
  compat-requirements.js # what the editor uses from the game, per feature
  whatsnew.js         # "what's new" banner after an update
  i18n.js             # 6-language dictionary and t() helper
  modal.js            # multiple-choice dialog
  pokemonTypes.js     # types and base stats #1–#721 (generated from PokeAPI)
  search.js           # multilingual search and normalization
  traits.js           # Tower trait formula
  mapNodes.js         # map node types allowed per mode
  ui.js               # UI helpers
  constants.js        # Pokémon names, held items, megas, starter lists, DONATION_URL
  tabs/               # one view per tab (team, add, run, bag, vitamins, traits, unlocks, collections, settings)
src/
  pause-cloud-sync.js # pauses the game's sync during a restore
  force-traits.js     # forced traits (registered only when enabled)
store_assets/         # icons, screenshots and texts for the Chrome Web Store
tools/game-watch/     # daily watcher (GitHub Actions)
_locales/             # chrome.i18n: package name and description
  it|en|es|fr|de|pt/messages.json
```

### Two translation layers

Both are needed, because they cover different things:

| | `_locales/` + chrome.i18n | `js/i18n.js` |
|---|---|---|
| Translates | package name and description | the whole popup UI |
| Shown in | chrome://extensions, Web Store | inside the extension |
| Language chosen by | the browser | the user, in settings |

`chrome.i18n` can't replace the second layer: `getMessage()` always resolves to the browser language and there is no API to force another one, so it wouldn't allow a language picker. On first open the popup starts from `chrome.i18n.getUILanguage()`, so the two layers agree until the user picks something else.

### Loading locally

1. `git clone` the repository (or download the ZIP from GitHub).
2. `chrome://extensions` → enable **Developer mode**.
3. **Load unpacked** → select the cloned folder.
4. Open `https://pokelike.xyz`, start a run, click the extension icon.

### Before publishing

- See `store_assets/PUBLISHING.md` (in Italian) for the full Chrome Web Store procedure.

### Store package

The ZIP to upload contains only the extension files, without `store_assets/`,
documentation or git files. From Git Bash, in the project folder:

```bash
v=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)
zip -r -X "pokelike-editor-$v.zip" manifest.json popup.html pokemonData.js js src icons _locales
```

Don't use Windows PowerShell 5.1's `Compress-Archive`: it writes paths with
backslashes (`js\main.js`) and Chrome may fail to find files in subfolders.
Details in [store_assets/PUBLISHING.md](store_assets/PUBLISHING.md).

ZIP files are excluded from git (`.gitignore`).

## Contributing

Bug reports and suggestions are welcome in the
[Issues](../../issues), in English or Italian. For pull requests see
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © sassoanarchico
