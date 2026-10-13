# Changelog

Tutte le modifiche rilevanti di Pokélike Editor.

Il formato segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e le
versioni seguono [SemVer](https://semver.org/lang/it/). Le versioni si caricano
sul Chrome Web Store, che accetta solo numeri **strettamente crescenti**.

---

## [2.3.0] — 13 ottobre 2026

### Corretto

- **Sblocco delle Mega**: scriveva gli MVP nella chiave sbagliata. Il gioco non
  legge più `poke_stats` (nel suo codice non compare più) ma
  `poke_challenge_stats.mvpCounts`, sommando gli MVP di **tutta la linea
  evolutiva** (`megaLineMvpCount`). L'editor sceglieva l'ultima chiave che
  conteneva `"mvpCounts"`, e da quando sono due il risultato dipendeva dal caso.
  Ora pietre, tier richiesti (1, 5, 10 o 50) e conteggi vengono letti dal gioco
  (`MEGA_STONES`), e a ogni pietra si aggiunge solo ciò che manca. Il menu
  mostra il conteggio di ciascuna (`26/10`). La lista fissa `MEGA_UNLOCKS` è
  stata rimossa.
- **Mega Bracciale**: senza, il gioco non lascia usare nessuna pietra
  (`ownsMegaStone`). Non è un flag: il gioco lo considera ottenuto quando la
  Hall of Fame contiene una scalata della Torre allo **stadio 6** senza sfida.
  La scheda Sblocchi ora mostra se c'è e, se manca, lo sblocca aggiungendo
  quella voce con la funzione del gioco (`saveHallOfFameEntry`), a squadra
  vuota per non sbloccare altri starter.
- **Run Endless 2.0 in pausa**: quando si passa a un'altra modalità il gioco
  sposta la run in `poke_parked_run:endless2` (run e stato della Torre insieme)
  e `poke_current_run` sparisce, quindi l'editor diceva "nessuna run". Ora la
  carica, la modifica e la salva nella stessa chiave. La run in corso, se c'è,
  ha sempre la precedenza.
- **PokéDollari fuori scala**: oltre `Number.MAX_SAFE_INTEGER` JavaScript perde
  precisione (un salvataggio reale conteneva `99999999999659420`). Il valore
  ora è limitato a 999.999.999.999, e uno già oltre viene riparato alla lettura.
- **Pulsanti ±1.000 / 5.000 / 10.000 ₽** della scheda Run: non avevano alcun
  gestore e non facevano nulla.
- **Slot passivi in Endless 2.0**: senza `erPassiveSlots` nel salvataggio
  l'editor ne contava 5, il gioco parte da 6.

### Aggiunto

- **Endless 2.0** (scheda Run, solo per le run Endless 2.0):
  - **Oggetto Firma**: uno per ciascuna delle 366 linee evolutive (Ossospesso
    per Cubone, Elettropalla per Pikachu…). Si sceglie quale Pokémon della
    squadra lo tiene: il menu offre per ognuno l'oggetto della sua linea,
    risolto dal gioco (`SIG_BY_ROOT`), con la descrizione dell'effetto.
    L'editor scrive `run.erSignature = { id, uid }` come `sigAcquire`.
  - **Slot passivi** (6–10) e **livelli extra alle catture**
    (`erCatchLevelBonus`).
  - **Modalità** (Hardcore o Creativa), solo in lettura: cambia curva e record.
- **Potenziamento dei Pokémon** (scheda Squadra, nelle run Endless): il campo
  `_augmentPct` (bonus su tutte le statistiche) e, per i mutanti, la forza
  della mutazione `_mutationPct`. I PS massimi vengono riscalati come in
  `_recalcMaxHp` del gioco, conservando la percentuale di PS.
- **SpireMon** (scheda Sblocchi): carte possedute e shiny sul totale,
  gettoni, sblocco di tutte le carte, di tutte le shiny e della costruzione del
  mazzo. Catalogo letto dal gioco (`SPIRE_CARDS`); missioni e altri campi di
  `poke_spire_cards` restano invariati.
- **Frammenti leggendari** (scheda Sblocchi): numero di frammenti e uova di
  fila senza shiny, con la probabilità shiny del prossimo uovo leggendario
  (1% + 0,3% per uovo, da `rollLegendaryEggShiny`) e un pulsante per renderlo
  certo.

- **Controllo di compatibilità con il gioco**: all'apertura del popup si
  verifica che esista ancora ciò che ogni funzione usa (globali del gioco e
  forma delle chiavi scritte direttamente, elencate in
  `js/compat-requirements.js`). Una funzione che ha perso qualcosa si
  disattiva, con un avviso tradotto nelle 6 lingue e un pulsante che apre una
  issue già compilata, invece di scrivere dati in un formato che il gioco non
  riconosce più. Se il controllo non si può fare non disattiva nulla.
- **Sentinella giornaliera su GitHub** (`tools/game-watch/`, workflow
  `game-watch.yml`): scarica il gioco, ne decodifica le stringhe offuscate e
  cerca ogni elemento dell'elenco; se qualcosa manca o esce una nuova versione
  apre una issue con il rapporto e le note di patch. Al primo giro ha trovato
  che il gioco non usa più `poke_pokedex`: il Pokédex sta solo in `poke_dex`.

### Modificato

- **Avviso delle novità**: mostra le voci di tutte le versioni uscite dopo
  l'ultima vista, così chi salta un aggiornamento non perde quelle intermedie.
- **Scheda Squadra**: il pannello di modifica di un Pokémon resta aperto
  quando la scheda si ridisegna.

---

## [2.2.1] — 13 ottobre 2026

### Corretto

- **Sblocco starter e leggendari** (scheda Sblocchi) di nuovo funzionante.
  Il gioco non legge più `poke_used_starters` per decidere quali Pokémon si
  possono scegliere come starter, ma `poke_hof_index`, l'indice che ricava da
  Hall of Fame e uova: i non leggendari stanno in `evoLineRoots`, i leggendari
  **solo** in `eggLegendaries`, le varianti shiny in `shinySpecies` /
  `eggLegendaryShinies`. L'editor ora aggiorna quell'indice dentro la pagina,
  partendo da `getHofIndex()` del gioco per non perdere gli sblocchi già
  ricavati dalla Hall of Fame. Anche i contatori del cruscotto leggono da lì.

### Aggiunto

- **Avviso delle novità dopo un aggiornamento**: la prima volta che si apre il
  popup con una versione nuova compare un riquadro con le modifiche, tradotto
  nelle 6 lingue, che si chiude con "Ho capito". Chrome aggiorna l'estensione
  da solo ma non lo comunica. Il popup confronta la versione del manifest con
  l'ultima chiusa (chiave `pkeditor_whatsnew_seen`): nessun permesso né service
  worker in più. Le voci stanno in `js/whatsnew.js`.

### Modificato

- **Completare lo Shiny Dex** (tutto, una regione o "Platino") aggiunge gli
  stessi Pokémon anche a `shinySpecies` di `poke_hof_index`: con l'intero Dex
  la lista contiene tutti i numeri da #1 a #721. Il gioco la usa per offrire la
  versione shiny degli starter e per i segni shiny in Hall of Fame e PC.

---

## [2.2.0] — 21 settembre 2026

### Aggiunto

- **Tratti forzati** (scheda Squadra, sotto ai Tratti della Torre).
  Permette di scegliere il tier di ogni tipo **senza toccare la squadra**, e di
  superare il 12 che il gioco considera il massimo.

  Perché serve un meccanismo diverso dal resto dell'estensione: i tier dei
  tratti **non sono un dato del salvataggio**. Il gioco li ricalcola da squadra
  e passivi con `computeTraitTiers()` prima di ogni lotta — verificato su tutti
  i punti in cui il combattimento li usa, e il bonus piatto che la funzione
  accetta vale sempre `0` per il giocatore. Scriverli nel salvataggio quindi non
  produce alcun effetto. L'unica via è che l'estensione **modifichi quel calcolo
  nella pagina del gioco**: `src/force-traits.js`, incluso nel pacchetto, avvolge
  quella funzione e ne sostituisce il risultato con i valori scelti.

  Dettagli che contano:
  - **Spento di default** e acceso solo dall'utente. Quando si spegne, la
    registrazione dello script viene rimossa e il gioco torna a calcolare i
    tratti dalla squadra.
  - I tipi non elencati restano quelli calcolati dal gioco: forzare Buio non
    azzera gli altri tratti.
  - Si può salire fino a 99, perché `buildTraitsConfig` usa il numero così
    com'è senza ricopiarlo sul massimo. Alcuni tratti hanno però un tetto
    proprio (Acciaio si ferma al 90% di riduzione danni, Spettro al 50% di
    esecuzione) e oltre quello smettono di crescere.
  - I valori stanno in una chiave del `localStorage` della pagina che **non**
    comincia per `poke_` né `pkrl_`: restano quindi fuori dai backup del
    salvataggio e dalla sincronizzazione cloud del gioco.
  - Cambiando i valori dal popup l'effetto è immediato alla lotta successiva,
    senza ricaricare; serve un ricaricamento solo la prima volta che si accende
    o spegne la funzione, perché lo script entra in azione al caricamento.

### Modificato

- **Giustificazione dei permessi aggiornata** in `PRIVACY.md`, `privacy.html`,
  `STORE_LISTING.md` e `DA_COMPILARE.md`: la motivazione di `scripting` ora
  descrive anche questo script, che resta incluso nel pacchetto (nessun codice
  remoto) e registrato solo su richiesta dell'utente. Da rileggere prima di
  reinviare l'elemento allo Store.

---

## [2.1.0] — 18 settembre 2026

Quasi tutte le novità nascono dalla lettura del codice del gioco: le regole qui
sotto sono quelle vere di pokelike.xyz, non ipotesi.

### Aggiunto

- **Tratti della Torre** (nuova sezione nella scheda Squadra).
  I tratti dell'Endless **non sono un dato del salvataggio**: il gioco li
  ricalcola dalla squadra prima di ogni lotta con `computeTraitTiers`, e
  `poke_endless_state.traitTiers` è solo una cache per l'HUD. L'editor replica
  la formula del gioco —
  `peso = 1 + shiny + mutante + team_reroll + (legend_traits e leggendario)`,
  `tier = min(12, punti ÷ 2)` — mostra i tier attuali con l'effetto di ciascuno
  al livello raggiunto, e permette di scegliere **tipo + tier**: l'editor calcola
  le modifiche minime alla squadra (mutazione, shiny), le **elenca prima di
  applicarle** e dichiara il tetto raggiungibile invece di fallire in silenzio.
  Le descrizioni dei tratti sono tradotte dal dizionario del gioco.
- **Riscuoti ricompense degli obiettivi** (scheda Sblocchi).
  Mostra quante ricompense sono in sospeso e quanti PokéDollari valgono, poi le
  incassa. Conteggio e pagamento li fa il gioco (`countClaimableAchRewards`,
  `claimAllAchRewards`): la tabella dei premi non viene duplicata qui dentro.
- **Sfide monotipo, settimanali e giornaliere** (scheda Sblocchi).
  Il cruscotto Platino contava solo le 12 sfide base; ora comprende anche le 18
  monotipo (`monotype:<Tipo>`), le prove della settimanale in corso
  (`weekly:<id>:<prova>`) e le 18 giornaliere (`daily:<Tipo>`). Ogni sfida si
  segna come fatta o si riporta da fare, una per una o a gruppi. Settimanale e
  giornaliera aggiornano anche `poke_weekly` e `poke_daily`, che il gioco legge
  a parte.
- **Obiettivi cliccabili**: la griglia degli achievement ora sblocca o riblocca
  la singola voce.
- **Ricerca multilingua** in ogni elenco lungo: oggetti passivi, starter delle
  vitamine, obiettivi, sfide, megaevoluzioni da sbloccare, strumenti e
  megapietre (sia nello zaino sia per ogni Pokémon della squadra).
  La casella capisce **tutte le lingue che il gioco conosce**, non solo quella
  scelta per l'interfaccia: i lettori allegano a ogni voce i suoi nomi in tutte
  le lingue di `I18N`, quindi cercare "lucky egg" trova l'Uovo Fortunato anche
  con l'interfaccia in italiano. Accenti e maiuscole sono indifferenti
  (`Glücks-Ei` si trova scrivendo `glucks`), l'apostrofo non spezza le parole
  (`kings rock` trova `King's Rock`), e si può cercare per numero (`#129`),
  per id (`lucky_egg`) o con più parole prese da campi diversi.
- **Megapietre ricostruite**: nei dati del gioco ci sono **11 forme Mega che
  nessuna pietra sblocca** (Charizard X, Swampert, Camerupt, Zygarde, Starmie,
  Pyroar, Froslass, Floette, Malamar, Chimecho, Golurk). `syncMegaForm` legge
  tutto dall'oggetto tenuto e non dal catalogo `MEGA_STONES`, quindi una pietra
  costruita dai dati della forma funziona davvero. Compaiono in un gruppo a
  parte del menu, sia nella squadra sia nello zaino, con l'avvertenza che **non
  danno l'abilità Mega** (il gioco la cerca per id della pietra vera).

### Modificato

- **Editor della mappa riscritto.** Da 9 tipi di nodo scritti a mano in italiano
  a **22 tipi tradotti**, con le disponibilità prese dal generatore di mappe del
  gioco:
  - *Torre*: nodi comuni e mutazione; **Poké Mart e squadra cattiva solo dalla
    mappa 31** (terza fascia di `ER_NODE_BANDS`).
  - *Storia*: nessun nodo esclusivo della Torre; Silver solo in gen 2,
    Magma/Aqua in gen 3 (mappe 2-5-7), Sottosuolo (1-3-6) e Mondo Distorto
    (3-5-7) in gen 4, Rivale N in gen 5 (mappe 0-3-5-7).
  - *Sotto-mappe*: solo lì compaiono Ricompensa e Uscita.

  Dei tipi esclusi viene spiegato il motivo, e un nodo con un tipo estraneo alla
  modalità resta visibile con un avviso invece di essere cambiato d'ufficio.
- **Oggetti passivi tradotti.** Nome e descrizione arrivano dal dizionario del
  gioco (`I18N[lingua].items.name/desc`, che copre le stesse sei lingue) invece
  di restare in inglese. Accanto alla traduzione resta il nome di gioco, per
  ritrovare l'oggetto quando la partita è in inglese. Nel salvataggio continua a
  finire la voce originale: le etichette tradotte vivono solo nell'interfaccia.
  Cambiando lingua il catalogo viene riletto.
- Scheda dello Store aggiornata nelle sei lingue con le nuove funzioni.

### Corretto

- Il cruscotto Platino dichiarava «sfide completate» contando solo le 12 base:
  un platino che non lo era.
- Il controllo interno sugli id non riconosceva la scheda con `class="tab active"`
  e segnalava un falso allarme sulla scheda Squadra.
- Il controllo sulle traduzioni non vedeva le chiavi usate dentro un ternario
  annidato e le dava per inutilizzate.

### Note per chi aggiorna

- Il pacchetto è `pokelike-editor-2.1.0.zip` (34 file). La versione deve restare
  **maggiore** di quella già pubblicata sullo Store.
- Nessun permesso nuovo: restano `scripting`, `activeTab`, `storage` e il solo
  host `https://pokelike.xyz/*`.

---

## [2.0.0] — 15 settembre 2026

Prima versione pubblicata sul Chrome Web Store.

### Aggiunto

- **Squadra**: livello, HP, statistiche base, shiny, strumento tenuto, tier
  delle mosse; cura completa; scorciatoie per rendere shiny tutta la squadra e
  portare le mosse al tier massimo.
- **Mutazioni**: modifica del tipo extra dei Pokémon mutanti dell'Endless,
  tenendo allineati `_mutationType` e `types`.
- **Megapietre**: assegnabili dalla squadra o dallo zaino, solo quelle
  compatibili con la specie; l'oggetto lo costruisce il gioco.
- **Aggiungi**: ricerca su tutte le specie Gen 1-6 con filtro generazione e
  **due filtri tipo combinabili in qualsiasi ordine**.
- **Run**: PokéDollari, medaglie, mappa, Nuzlocke ed Endless, editor dei nodi.
- **Oggetti passivi** della run, con gli slot che il gioco concede.
- **Zaino** con i limiti veri: 10 slot, un esemplare per tipo.
- **Vitamine**: massimo dei bonus per un singolo starter o per tutti e 366,
  scritti per capostipite della linea evolutiva come fa il gioco.
- **Sblocchi**: cruscotto Platino con achievement, Pokédex, Shiny Dex,
  megaevoluzioni, starter, leggendari e sfide.
- **Backup e ripristino** del salvataggio, con pausa della sincronizzazione
  cloud del gioco durante il ripristino ed export/import su file.
- **Sei lingue** (italiano, inglese, spagnolo, francese, tedesco, portoghese),
  con nomi degli strumenti in inglese fuori dall'italiano per ritrovarli in
  partita.
- **Sincronizza** ricarica la pagina del gioco e **riapre la run in corso** nella
  modalità giusta (storia, Endless o sfida).

### Sicurezza

- I backup esportati contengono il token di sessione del gioco
  (`poke_save_token`): il file va trattato come un dato personale e non
  condiviso. L'avviso è nell'interfaccia e in `PRIVACY.md`.
