# Pokélike Editor

[🇬🇧 English](README.md) · 🇮🇹 Italiano

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/odjebmffnpbdgbbipanhnabedldeabad?label=Chrome%20Web%20Store&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)
[![Utenti](https://img.shields.io/chrome-web-store/users/odjebmffnpbdgbbipanhnabedldeabad?label=utenti)](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)
[![Licenza: MIT](https://img.shields.io/badge/licenza-MIT-blue.svg)](LICENSE)

**➡️ [Installa dal Chrome Web Store](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad)**

Estensione Chrome (Manifest V3) per gestire il salvataggio locale del fangame
browser **pokelike.xyz**: squadra, statistiche, zaino, mappa della run, Pokédex e
sblocchi. Gratuita e senza account.

> Progetto non ufficiale, non affiliato a pokelike.xyz né a Nintendo / Game Freak /
> The Pokémon Company. Vedi [LICENSE](LICENSE) e [PRIVACY.md](PRIVACY.md).

## Installazione

- **Consigliata**: dal [Chrome Web Store](https://chromewebstore.google.com/detail/pok%C3%A9like-editor-%E2%80%94-editor/odjebmffnpbdgbbipanhnabedldeabad), con aggiornamenti automatici.
- **Dal sorgente**: clona questa repository e caricala come estensione non
  pacchettizzata (vedi [Caricare in locale](#caricare-in-locale)).

Poi apri `https://pokelike.xyz`, avvia una run e clicca l'icona dell'estensione.

## Funzionalità

- **Squadra**: modifica livello, HP, IV, natura, felicità, shiny, strumento tenuto, tier mosse; cura completa.
  Due scorciatoie: rendere shiny tutta la squadra (aggiornando anche gli sprite) e portare tutte le mosse al tier massimo.
  Nelle run Endless anche il potenziamento (`_augmentPct`) e la forza della mutazione (`_mutationPct`), con i PS massimi riscalati come in `_recalcMaxHp`.
- **Megapietre**: assegnabili dalla squadra o dallo zaino. Strumento e pietra condividono lo stesso slot (`heldItem`), quindi il menu è unico e diviso in gruppi. Per ogni Pokémon si offrono solo le pietre della sua specie, perché `syncMegaForm` applica la forma solo se `megaSpecies === speciesId`. L'oggetto lo costruisce il gioco con `makeMegaStoneItem()`, letto a runtime.
- **Mutazioni**: cambia, aggiungi o rimuovi il tipo extra dei Pokémon mutanti dell'Endless (`_mutationType`), tenendolo allineato con `types`.
- **Aggiungi**: inserisci qualsiasi Pokémon (Gen 1–6) con ricerca e filtri per tipo/generazione.
- **Run**: PokéDollari (fino a 999.999.999.999, oltre JavaScript perde precisione), medaglie, mappa corrente, modalità Nuzlocke/Endless, editor dei nodi mappa.
  Se non c'è una run in corso viene caricata quella **Endless 2.0 in pausa** (`poke_parked_run:endless2`, dove il gioco la sposta quando si cambia modalità), e le modifiche tornano in quella chiave.
- **Endless 2.0**: Oggetto Firma (uno per ognuna delle 366 linee evolutive, `run.erSignature = { id, uid }`, risolto dal gioco con `SIG_BY_ROOT`), slot passivi 6–10, livelli extra alle catture (`erCatchLevelBonus`); la modalità Hardcore/Creativa è mostrata in sola lettura.
- **Oggetti passivi**: scegli quali passivi tenere nella run, letti da `PASSIVE_ITEM_POOL`. Gli slot seguono la regola del gioco: in Endless `min(10, run.erPassiveSlots)`, altrimenti `run.challengePassiveCap` o 5.
- **Zaino**: aggiunge strumenti tenuti (held item) rispettando i 10 slot e il limite di un esemplare per tipo.
- **Vitamine**: porta al massimo i bonus statistica (10 per statistica, +5% ciascuno) per un singolo starter o per tutti e 366. Le vitamine si danno fuori dalla run e il gioco le conserva in `poke_stat_buffs` **per capostipite della linea evolutiva**, non per esemplare: il bersaglio sono quindi i Pokémon di primo stadio selezionabili (forme base e leggendari), non la squadra. Attacco copre atk e special insieme, perché la Proteina del gioco li alza in coppia e `getTotalBuffPoints` li conta una volta sola.
- **Tratti della Torre**: i tratti dell'Endless non si salvano, il gioco li ricalcola dalla squadra prima di ogni lotta (`computeTraitTiers`) e `poke_endless_state.traitTiers` è solo una cache per l'HUD. L'editor replica la formula (`peso = 1 + shiny + mutante + team_reroll + legendario con legend_traits`, `tier = min(12, punti ÷ 2)`), mostra l'effetto di ogni tratto al livello raggiunto e, scelti tipo e tier, calcola le modifiche minime alla squadra elencandole prima di applicarle.
- **Tratti forzati**: i tier si possono imporre a piacere, anche oltre il 12, **senza toccare la squadra**. Non passa dal salvataggio perché i tier non sono un dato: `src/force-traits.js`, registrato solo quando l'utente accende la funzione, avvolge `computeTraitTiers()` nella pagina e ne sostituisce il risultato. Spento di default; spegnendolo la registrazione viene rimossa. I valori vivono in una chiave `pkeditor_*` del localStorage della pagina, quindi restano fuori da backup e sincronizzazione.
- **Megapietre ricostruite**: 11 forme Mega dei dati del gioco non hanno una pietra (Charizard X, Swampert, Camerupt, Zygarde, Starmie, Pyroar, Froslass, Floette, Malamar, Chimecho, Golurk). `syncMegaForm` legge tutto dall'oggetto tenuto e non da `MEGA_STONES`, quindi l'editor le costruisce dai dati della forma. Stanno in un gruppo a parte perché non danno l'abilità Mega, cercata per id della pietra vera.
- **Editor mappa per modalità**: 22 tipi di nodo, offerti solo dove il gioco può generarli. Poke Mart e squadra cattiva esistono solo nella Torre **dalla mappa 31** (`ER_NODE_BANDS`); Silver, Magma/Aqua, Sottosuolo, Mondo Distorto e Rivale N solo fuori dalla Torre e nella generazione giusta; Ricompensa e Uscita solo nelle sotto-mappe. Dei tipi esclusi viene spiegato il motivo.
- **Sblocchi**: cruscotto di completamento ("Platino"), megaevoluzioni, Pokédex/Shiny Dex per regione, starter e leggendari.
  Le Mega seguono la regola del gioco (`ownsMegaStone`): Mega Bracciale, cioè una scalata della Torre allo stadio 6 senza sfida in Hall of Fame, e MVP della linea evolutiva in `poke_challenge_stats.mvpCounts` almeno pari al tier della pietra (1/5/10/50). Pietre e conteggi si leggono dal gioco.
  Starter e leggendari selezionabili stanno in `poke_hof_index`, l'indice che il gioco ricava da Hall of Fame e uova: l'editor lo aggiorna partendo da `getHofIndex()`, e completare lo Shiny Dex riempie anche `shinySpecies`.
  Comprende le sfide base, monotipo, settimanali e giornaliere (tutte in `poke_challenges_done`, ognuna con il suo id), gli obiettivi attivabili uno per uno, e la riscossione delle ricompense obiettivo rimaste in sospeso — conteggio e pagamento li fa il gioco con `countClaimableAchRewards` / `claimAllAchRewards`.
- **SpireMon**: carte possedute e shiny, gettoni, costruzione del mazzo (`poke_spire_cards`), con il catalogo `SPIRE_CARDS` letto dal gioco.
- **Frammenti leggendari**: frammenti e uova di fila senza shiny, con la probabilità shiny del prossimo uovo leggendario (1% + 0,3% per uovo).
- **Backup**: copia del salvataggio prima di modificarlo, con ripristino, export e import su file. Ultimi 5 conservati in `chrome.storage.local`.
  Il ripristino gestisce la sincronizzazione cloud del gioco (vedi sotto), altrimenti verrebbe annullato al ricaricamento.
- **Lingue**: interfaccia in italiano, inglese, spagnolo, francese, tedesco e portoghese, selezionabile dalle impostazioni.
  Nomi di strumenti e tipi restano in inglese fuori dall'italiano, per ritrovarli identici dentro al gioco.
  Gli oggetti passivi e i tratti, invece, sono tradotti leggendo il dizionario del gioco stesso (`I18N[lingua].items` e `I18N[lingua].traits`), che copre le stesse sei lingue: accanto alla traduzione resta il nome di gioco, e nel salvataggio finisce comunque la voce originale.
- **Ricerca multilingua**: ogni elenco lungo (passivi, starter delle vitamine, obiettivi, sfide, megaevoluzioni, strumenti e megapietre) ha una casella di ricerca che capisce tutte le lingue del gioco, non solo quella dell'interfaccia. I lettori in `page.js` allegano a ogni voce i suoi nomi presi da `I18N[lingua]`, quindi "lucky egg" trova l'Uovo Fortunato anche in italiano. La normalizzazione toglie accenti e apostrofi (`glucks` trova `Glüks-Ei`, `kings rock` trova `King's Rock`) e si cerca anche per numero o per id.
- **Impostazioni**: lingua, temi, reset dati.

Le modifiche versione per versione sono in [CHANGELOG.md](CHANGELOG.md).

## Come funziona

L'estensione non ha backend. Quando apri il popup su una scheda `pokelike.xyz`
legge le chiavi `poke_*` / `pkrl_*` dal `localStorage` della pagina tramite
`chrome.scripting`, ti permette di modificarle e le riscrive nello stesso
`localStorage`. Nessun dato lascia il tuo browser.

Il catalogo degli achievement e delle sfide viene letto **a runtime dalla pagina
del gioco** (`world: "MAIN"`), così resta allineato agli aggiornamenti di
pokelike.xyz senza duplicarne i dati dentro l'estensione.

Il pulsante **Sincronizza** ricarica la pagina del gioco e solo dopo rilegge il
salvataggio. L'ordine conta: il gioco tiene la partita in memoria e la riscrive
nel `localStorage` al primo salvataggio automatico, quindi senza ricaricare le
modifiche appena fatte verrebbero sovrascritte invece di essere applicate.

Finito il ricaricamento, l'estensione **riprende da sola la run**: cerca fra i
tre pulsanti `btn-continue-run` / `btn-continue-endless` /
`btn-continue-challenge` quello che il gioco sta effettivamente mostrando e lo
preme. La modalita' dedotta dal salvataggio serve solo a stabilire l'ordine di
ricerca: una run puo' essere insieme endless e sfida (`challengeId`
"endless2"), e in quel caso il pulsante giusto e' quello della sfida. Se nessun
pulsante compare entro pochi secondi, non viene premuto nulla.

### Ripristino e sincronizzazione cloud

Il gioco tiene una copia del salvataggio sul proprio server e all'avvio la
confronta con quella locale (`_compareSaves`). Il confronto non guarda le date
ma 18 dimensioni di progresso e **conserva la copia più avanzata**: un backup è
per definizione più indietro, quindi verrebbe sovrascritto appena la pagina si
ricarica.

Per questo il ripristino registra al volo `src/pause-cloud-sync.js` a
`document_start` nel mondo MAIN, che imposta `window.__pokeCloudPause` prima che
il bundle del gioco parta. In modalità “cloud”, dopo il reload viene poi
chiamata la funzione `_push()` del gioco per allineare il server allo stato
ripristinato. In modalità “locale” il server resta intatto e il ripristino vale
solo per quella sessione.

Connessioni di rete in uscita:

| Host | Uso |
|------|-----|
| `pokelike.xyz` | immagini sprite, le stesse già caricate dalla pagina del gioco |

Nessun altro host viene contattato: niente API esterne, font remoti o CDN.
Statistiche base e tipi (#1–#721) sono inclusi in `js/pokemonTypes.js`.

## Compatibilità con gli aggiornamenti del gioco

L'editor dipende da funzioni, costanti e chiavi di pokelike.xyz che gli
sviluppatori possono rinominare in qualsiasi momento. Tutto ciò che usa è
elencato, funzione per funzione, in [`js/compat-requirements.js`](js/compat-requirements.js),
e viene controllato in due momenti:

- **All'apertura del popup** ([`js/compat.js`](js/compat.js)): si verifica che
  le globali del gioco esistano ancora e che le chiavi scritte direttamente
  abbiano la forma attesa. Una funzione che ha perso qualcosa si **disattiva**,
  con un avviso e un pulsante che apre una issue già compilata: il salvataggio
  non viene mai scritto in un formato che il gioco non riconosce.
- **Ogni giorno su GitHub** ([`tools/game-watch/`](tools/game-watch/) e il
  workflow [`game-watch.yml`](.github/workflows/game-watch.yml)): la sentinella
  scarica il gioco, ne decodifica le stringhe offuscate e cerca ogni elemento
  dell'elenco. Se qualcosa manca, o se esce una nuova versione del gioco, apre
  una issue con l'etichetta `game-watch`, il rapporto e le note di patch nuove.

Si può lanciare anche a mano: `npm run game-watch` (Node 22, nessuna dipendenza).
Dopo aver verificato l'editor con una nuova versione del gioco va aggiornato
`TESTED_GAME_VERSION` in `js/compat-requirements.js`.

## Sviluppo

Codice sorgente diretto, nessun passaggio di build: il popup carica
`pokemonData.js` (script classico) e `js/main.js` (modulo ES).

```
manifest.json         # MV3
popup.html            # UI + CSS del popup
pokemonData.js        # forme Mega + helper sprite/nomi (globali, script classico)
js/
  main.js             # entrypoint, routing tab
  state.js            # stato condiviso + I/O localStorage della pagina
  page.js             # ponte verso la scheda del gioco (mondi ISOLATED / MAIN)
  backup.js           # backup/ripristino del salvataggio + import/export file
  compat.js           # controllo di compatibilità all'apertura del popup
  compat-requirements.js # cosa l'editor usa del gioco, funzione per funzione
  whatsnew.js         # riquadro delle novità dopo un aggiornamento
  i18n.js             # dizionario a 6 lingue e helper t()
  modal.js            # dialogo a scelta multipla
  pokemonTypes.js     # tipi e base stats #1–#721 (generati da PokeAPI)
  search.js           # ricerca multilingua e normalizzazione
  traits.js           # formula dei tratti della Torre
  mapNodes.js         # tipi di nodo mappa ammessi per modalità
  ui.js               # helper UI
  constants.js        # nomi Pokémon, held item, mega, liste starter, DONATION_URL
  tabs/               # una vista per scheda (squadra, aggiungi, run, zaino, vitamine, tratti, sblocchi, collezioni, opzioni)
src/
  pause-cloud-sync.js # mette in pausa la sync del gioco durante un ripristino
  force-traits.js     # tratti forzati (registrato solo se attivato)
store_assets/         # icone, screenshot e testi per il Chrome Web Store
tools/game-watch/     # sentinella giornaliera (GitHub Actions)
_locales/             # chrome.i18n: nome e descrizione del pacchetto
  it|en|es|fr|de|pt/messages.json
```

### Due livelli di traduzione

Servono entrambi, perché coprono cose diverse:

| | `_locales/` + chrome.i18n | `js/i18n.js` |
|---|---|---|
| Cosa traduce | nome e descrizione del pacchetto | tutta l'interfaccia del popup |
| Dove si vede | chrome://extensions, Web Store | dentro l'estensione |
| Lingua scelta da | il browser | l'utente, dalle impostazioni |

`chrome.i18n` non può sostituire il secondo livello: `getMessage()` risolve sempre nella lingua del browser e non esiste alcuna API per forzarne un'altra, quindi non permetterebbe il selettore di lingua. Alla prima apertura il popup parte da `chrome.i18n.getUILanguage()`, così i due livelli concordano finché l'utente non sceglie diversamente.

### Caricare in locale

1. `git clone` della repository (o download dello ZIP da GitHub).
2. `chrome://extensions` → attiva **Modalità sviluppatore**.
3. **Carica estensione non pacchettizzata** → seleziona la cartella clonata.
4. Apri `https://pokelike.xyz`, avvia una run, clicca l'icona dell'estensione.

### Prima della pubblicazione

- Vedi `store_assets/PUBLISHING.md` per la procedura completa sul Chrome Web Store.

### Pacchetto per lo Store

Lo ZIP da caricare contiene solo i file dell'estensione, senza `store_assets/`,
documentazione e file git. Da Git Bash, nella cartella del progetto:

```bash
v=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json)
zip -r -X "pokelike-editor-$v.zip" manifest.json popup.html pokemonData.js js src icons _locales
```

Non usare `Compress-Archive` di Windows PowerShell 5.1: scrive i percorsi con il
backslash (`js\main.js`) e Chrome può non trovare i file nelle sottocartelle.
Dettagli in [store_assets/PUBLISHING.md](store_assets/PUBLISHING.md).

Gli ZIP sono esclusi da git (`.gitignore`).

## Contribuire

Segnalazioni e proposte sono benvenute nelle
[Issues](../../issues). Per le pull request vedi [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenza

[MIT](LICENSE) © sassoanarchico
