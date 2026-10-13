# Chrome Web Store — scheda completa

Tutto ciò che va incollato nella Developer Dashboard, campo per campo.
Versione del pacchetto: **2.3.0**.

---

## 1. Scheda del prodotto (tab "Store listing")

### Nome (max 75 caratteri)

```
Pokélike Editor — Save Manager per pokelike.xyz
```

> ⚠️ Per ridurre il rischio marchio puoi usare un nome senza "Poké/Pokémon",
> es. `PKL Save Editor` o `Nuzlocke Save Manager (pokelike.xyz)`.
> Il nome nel `manifest.json` va tenuto coerente con questo.

### Descrizione breve / Summary (max 132 caratteri)

```
Modifica il salvataggio locale di pokelike.xyz: squadra, zaino, Pokédex, sblocchi e backup. Gratis, senza account.
```

### Descrizione completa (max 16.000 caratteri)

```
Pokélike Editor è uno strumento non ufficiale per chi gioca al fangame browser
pokelike.xyz. Apre un pannello che legge il salvataggio che il gioco tiene nel
localStorage del tuo browser e ti permette di modificarlo comodamente, senza
smanettare con la console degli sviluppatori.

FUNZIONI

• Squadra — livello, HP correnti e massimi, statistiche base, stato shiny,
  strumento tenuto, pietra Mega e tier delle mosse per ogni Pokémon, più un
  pulsante per curare l'intera squadra. Due scorciatoie rendono shiny tutti i
  Pokémon che non lo sono ancora e portano al tier massimo le mosse di tutta la
  squadra.

• Mutazioni — i Pokémon mutanti della modalità Endless hanno un tipo extra
  oltre a quelli della forma base. Puoi cambiarlo, aggiungerlo o rimuoverlo;
  il tipo mutato è evidenziato fra i badge del Pokémon.

• Aggiungi — inserisci qualsiasi Pokémon dalla Gen 1 alla Gen 6, con ricerca
  per nome o numero, filtro per generazione e due filtri tipo combinabili in
  qualsiasi ordine: cercando Volante + Buio trovi anche i Buio/Volante.

• Run — PokéDollari, numero di medaglie, mappa corrente, modalità Nuzlocke ed
  Endless, più un editor dei nodi della mappa. Nelle sfide e in Endless puoi
  anche scegliere gli oggetti passivi attivi, entro il numero di slot che la
  modalità concede.

• Megapietre — assegna una pietra Mega compatibile a un membro della squadra
  oppure mettila nello zaino per usarla più avanti; l'elenco delle pietre viene
  letto dal gioco, quindi resta sempre aggiornato. Ci sono anche le forme Mega
  che nel gioco nessuna pietra sblocca, come la X di Charizard: l’editor
  ricostruisce la pietra dai dati del gioco (senza l’abilità Mega, che non
  esiste per quelle forme).

• Zaino — aggiungi gli strumenti tenuti (held item) rispettando i limiti veri
  del gioco: 10 slot e un solo esemplare per tipo.

• Tratti della Torre — nella Torre Infinita i tratti dipendono dalla squadra:
  tipi, shiny e mutazione. L’editor li calcola con la formula del gioco,
  mostra l’effetto di ogni tratto al livello raggiunto e, scelto un tipo e un
  tier, modifica la squadra per arrivarci, elencando prima cosa cambierà.

• Ricompense e sfide — riscuoti in un colpo i premi degli obiettivi rimasti in
  sospeso, e segna come fatte le sfide base, monotipo, settimanali e
  giornaliere, una per una o a gruppi. Gli obiettivi si sbloccano anche a mano,
  cliccandoli.

• Editor della mappa — cambia il tipo di ogni nodo proponendo solo quelli che
  la modalità in corso può davvero generare: il Poké Mart della Torre non
  compare in una run storia, e i nodi di Silver o del Mondo Distorto non
  compaiono nella Torre. Di quelli esclusi viene spiegato il perché.

• Vitamine — assegna il massimo delle vitamine a un singolo Pokémon o a tutti
  gli starter selezionabili, per una sola statistica o per tutte, rispettando i
  tetti veri del gioco. Le vitamine seguono la linea evolutiva, come nel gioco.

• Sblocchi — un cruscotto "Platino" con lo stato di completamento di ogni area
  (achievement, Pokédex, Shiny Dex, megaevoluzioni, starter, leggendari,
  sfide) e i pulsanti per completare ciò che manca, singolarmente o tutto
  insieme.

• Backup — crea una copia del salvataggio prima di modificarlo e ripristinala
  quando vuoi tornare indietro. Il ripristino ricarica la pagina del gioco per
  evitare che la partita in corso sovrascriva i dati appena recuperati. Se
  giochi con un account sincronizzato, ti viene chiesto se riportare indietro
  anche la copia sul server o limitare il ripristino a questo browser. Puoi
  anche esportare un backup su file e reimportarlo.

• Ricerca in ogni elenco — passivi, starter, obiettivi, sfide, strumenti e
  megapietre hanno una casella di ricerca che capisce tutte le lingue del
  gioco: scrivendo "lucky egg" trovi l’Uovo Fortunato anche con l’interfaccia
  in italiano. Accenti e maiuscole non contano, e si cerca anche per numero.

• Lingue — interfaccia disponibile in italiano, inglese, spagnolo, francese,
  tedesco e portoghese, con cambio immediato dalle impostazioni.

• Impostazioni — lingua, quattro temi per l'interfaccia e reset dei dati
  dell'estensione.

COME FUNZIONA

L'estensione non ha alcun server. Quando apri il popup mentre sei su una
scheda pokelike.xyz, legge le chiavi di salvataggio del gioco (poke_*, pkrl_*)
dal localStorage della pagina, ti mostra i valori e riscrive le tue modifiche
nello stesso localStorage. Nessun dato lascia il tuo browser: nessun account,
nessun tracciamento, nessuna pubblicità.

Il pulsante Sincronizza ricarica la pagina del gioco perché le modifiche
vengano lette subito e, se avevi una run in corso, riapre da solo la run nella
modalità giusta (storia, Endless o sfida), così riprendi da dove eri.

L'elenco degli obiettivi mostrato nella scheda Sblocchi viene letto dalla
pagina del gioco al momento, in sola lettura, così resta allineato agli
aggiornamenti di pokelike.xyz.

CONNESSIONI DI RETE

L'unico host contattato è pokelike.xyz, e solo per mostrare le immagini degli
sprite: le stesse che la pagina del gioco sta già caricando. Nessuna API
esterna, nessun font remoto, nessuna CDN, nessun dato personale trasmesso.

NOTE

Progetto gratuito e open source (licenza MIT), non affiliato né approvato da
pokelike.xyz né da Nintendo, Game Freak o The Pokémon Company. "Pokémon" e i
relativi nomi e immagini appartengono ai rispettivi proprietari.

Usa lo strumento sul tuo salvataggio personale e a tuo rischio: modificare un
salvataggio può renderlo incompatibile con aggiornamenti futuri del gioco. Per
questo l'estensione include una funzione di backup: usala prima di fare
modifiche importanti.
```

### Categoria

`Strumenti` (Tools). In alternativa `Divertimento` (Entertainment).

### Lingua principale

Italiano. L'interfaccia dell'estensione è tradotta anche in inglese, spagnolo,
francese, tedesco e portoghese: se pubblichi la scheda anche in quelle lingue,
traduci i testi qui sopra.

---

## 2. Asset grafici

| Asset | Dimensioni richieste | File | Stato |
|-------|---------------------|------|-------|
| Icona Store | 128×128 PNG | `icon128.png` | ✅ pronto |
| Icone estensione | 16/32/48/128 PNG | `icons/` nel pacchetto | ✅ pronto |
| Small promo tile (opz.) | 440×280 PNG | `small_promo_tile_440x280.png` | ✅ pronto |
| Marquee (opz.) | 1400×560 PNG | `marquee_1400x560.png` | ✅ pronto |
| Screenshot (1–5) | 1280×800 o 640×400 PNG | `screenshot_1_team.png`, `screenshot_2_run_map.png`, `screenshot_3_donate.png` | ⚠️ **da rifare** |

Tutti gli asset grafici sono stati rigenerati: marchio "P" con stella su fondo
scuro, senza alcun elemento riconducibile a Pokémon (niente Poké Ball, niente
sprite, nessun personaggio). Le icone 16 e 32 px usano un disegno dedicato,
senza anello né aloni, perché a quella scala sparirebbero.

### Screenshot — l'unica cosa che manca

Gli attuali sono obsoleti: mostrano una scheda "PRO" che non esiste più e non
mostrano "Aggiungi" né "Impostazioni". Le policy richiedono immagini che
rappresentino la funzionalità reale, quindi vanno rifatti dalla versione 2.2.0
caricata in `chrome://extensions`.

Per comporli c'è uno script pronto: cattura il popup (480×600) e poi

```bash
python store_assets/make_screenshot.py cattura.png "Titolo dello screenshot" screenshot_1.png
```

Produce un 1280×800 con lo sfondo coordinato e il titolo in alto. Serve Pillow
(`pip install Pillow`).

Soggetti consigliati, uno per screenshot:
1. **Squadra** — una squadra reale con i badge dei tipi.
2. **Aggiungi** — i due filtri tipo in azione (es. Volante + Buio).
3. **Sblocchi** — il cruscotto Platino con le barre di completamento.
4. **Impostazioni** — la sezione Backup con qualche copia salvata.

Almeno 1 screenshot è obbligatorio; le dimensioni devono essere esatte.

---

## 3. Privacy (tab "Privacy practices")

### Scopo unico (single purpose)

```
Consentire ai giocatori di pokelike.xyz di visualizzare, modificare e salvare
una copia di backup del proprio salvataggio di gioco, memorizzato nel
localStorage del browser sul sito pokelike.xyz.
```

### Giustificazione dei permessi

| Permesso | Testo da incollare |
|----------|--------------------|
| `activeTab` | Serve ad accedere alla scheda pokelike.xyz attiva quando l'utente apre il popup, per leggere e scrivere il salvataggio di gioco solo su azione esplicita dell'utente. |
| `scripting` | Serve a iniettare uno script nella scheda pokelike.xyz per leggere e riscrivere le chiavi di salvataggio nel localStorage della pagina: è l'unico modo per accedere a quei dati. Una seconda iniezione, in world MAIN, legge in sola lettura l'elenco degli obiettivi definito dal gioco, per mostrarne lo stato di completamento senza duplicare quei dati nell'estensione, e mette in pausa la sincronizzazione cloud del gioco durante il ripristino di un backup. Infine, solo se l'utente attiva esplicitamente la funzione «Tratti forzati», l'estensione registra uno script incluso nel pacchetto (src/force-traits.js) che nella pagina del gioco sostituisce il risultato del calcolo dei tratti con i valori scelti dall'utente: quei valori non sono memorizzati nel salvataggio e non esiste altro modo di impostarli. La registrazione viene rimossa appena l'utente spegne la funzione, che è disattivata per impostazione predefinita. |
| `storage` | Serve a memorizzare localmente le preferenze dell'estensione (lingua, tema) e i backup del salvataggio che l'utente crea volontariamente, così da poter annullare una modifica. Restano sul dispositivo e non vengono trasmessi. |
| `host_permissions` (`https://pokelike.xyz/*`) | L'estensione funziona esclusivamente sul sito del gioco; il permesso è limitato a quel dominio per rispettare il principio del minimo privilegio. |

### Remote code

**No.** Tutto il JavaScript è incluso nel pacchetto. Dalla rete arrivano
soltanto immagini (gli sprite serviti da pokelike.xyz). Nessun `eval`, nessuno
script caricato da remoto, nessun bundle offuscato.

Anche lo script dei «Tratti forzati» (`src/force-traits.js`) è incluso nel
pacchetto: viene registrato solo su richiesta dell'utente e non scarica nulla.

### Uso dei dati (Data usage)

**Non selezionare nessuna categoria.** L'estensione non raccoglie e non
trasmette dati: tutto ciò che tocca resta nel browser dell'utente. Il
salvataggio viene letto e riscritto in locale; i backup restano in
`chrome.storage.local` sul dispositivo.

Spunta le tre dichiarazioni obbligatorie:

- [x] Non vendo né cedo i dati a terze parti.
- [x] Non uso né trasferisco i dati per scopi estranei alla funzione principale.
- [x] Non uso né trasferisco i dati per valutare solvibilità o per prestiti.

### URL informativa sulla privacy (obbligatorio)

Pubblica `PRIVACY.md` a un indirizzo pubblico e incolla il link, per esempio:

```
https://github.com/<tuo-utente>/pokelike-editor/blob/main/PRIVACY.md
```

Va bene anche una GitHub Pages o un Gist pubblico.

### Email di contatto / assistenza

```
paffetto@gmail.com
```

Stessa indicata in `PRIVACY.md`. **Va verificata nella Dashboard** (Account →
Contact email) prima di poter inviare l'elemento.

---

## 4. Licenze e attribuzioni

| Cosa | Licenza / origine |
|------|-------------------|
| Codice dell'estensione | MIT — vedi `LICENSE`, © 2026 sassoanarchico |
| Tipi e statistiche base (`js/pokemonTypes.js`) | Dati fattuali generati da [PokeAPI](https://pokeapi.co) |
| Sprite dei Pokémon | Non inclusi nel pacchetto: mostrati da `pokelike.xyz`, la stessa pagina già aperta dall'utente |
| Cataloghi del gioco (achievement, sfide) | Non inclusi: letti a runtime dalla pagina |
| Font | Nessuno incorporato: si usano i font di sistema |

Nessuna libreria di terze parti è inclusa nel pacchetto.

**Disclaimer da tenere nella descrizione:** progetto non ufficiale, non
affiliato né approvato da pokelike.xyz né da Nintendo, Game Freak o
The Pokémon Company.

---

## 5. Distribuzione

- **Pubblico**: visibile e cercabile nello Store.
- **Non in elenco (unlisted)**: raggiungibile solo tramite link. Consigliato per
  i primi test o se il rischio marchio ti preoccupa.
- **Privato**: solo utenti specifici o il tuo dominio.

Aree geografiche: tutte, salvo esigenze particolari.

---

## 6. Dopo la pubblicazione

Il pulsante **⭐ Valuta sul Chrome Web Store** nella scheda "Dona" costruisce da
solo l'indirizzo delle recensioni a partire da `chrome.runtime.id`, quindi non
va configurato nulla: funziona appena l'estensione è installata dallo Store.
Finché la carichi non pacchettizzata resta disabilitato, perché quella pagina
non esiste ancora.
