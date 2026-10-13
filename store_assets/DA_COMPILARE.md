# Come sbloccare la pubblicazione — campo per campo

Segue l'ordine degli errori mostrati dalla Dashboard. Gli asset grafici sono
tutti pronti in `store_assets/`; il resto sono campi da compilare.

---

## Scheda «Scheda di Google Play» / Store listing

### ❌ «Manca l'immagine dell'icona»

L'icona **non** viene presa dallo ZIP: va caricata a parte.

> Carica `store_assets/icon128.png` (128×128).

### ❌ «È necessario almeno uno screenshot o un video»

Ne servono da 1 a 5, in 1280×800 esatti. Sono pronti:

| File | Mostra |
|------|--------|
| `screenshot_1_squadra.png` | Squadra, badge dei tipi e mutazione |
| `screenshot_2_ricerca.png` | Ricerca con due filtri tipo |
| `screenshot_3_zaino.png` | Zaino e limite di 10 slot |
| `screenshot_4_backup.png` | Backup, lingue e temi |

> Caricali tutti e quattro.

Facoltativi, ma consigliati perché la scheda appaia curata:
`small_promo_tile_440x280.png` e `marquee_1400x560.png`.

### ❌ «La descrizione dettagliata è troppo breve o non è presente»

Incolla la **Descrizione completa** che trovi in `STORE_LISTING.md`, sezione 1.
È lunga 5.639 caratteri, ben oltre i 25 richiesti.

### ❌ «Seleziona una categoria»

> **Strumenti**

### ❌ «Lingua non selezionata»

> **Italiano**

È la lingua principale della scheda. Le altre cinque vengono riconosciute
da Chrome grazie a `_locales/`, quindi l'estensione risulta tradotta in
italiano, inglese, spagnolo, francese, tedesco e portoghese.

### Schede tradotte

**Titolo e riepilogo non si scrivono qui**: Chrome li prende dal pacchetto
(`_locales/<lingua>/messages.json`) e sono già tradotti in tutte e sei le
lingue. Non devi digitare nulla.

Nel Dashboard si incolla solo la **descrizione dettagliata**, una per lingua:
**Store listing → selettore di lingua in alto** → scegli la lingua → incolla.
Senza, gli utenti stranieri vedono la descrizione italiana.

Tutti i testi sono pronti in **`LISTING_TRADUZIONI.md`**, verificati entro i
limiti (titolo ≤ 75, riepilogo ≤ 132, dettagliata ≤ 16.000):

| Lingua | Titolo | Riepilogo | Dettagliata |
|--------|-------:|----------:|------------:|
| Italiano | 35 | 114 | 5.639 |
| English | 30 | 100 | 5.165 |
| Español | 36 | 107 | 5.675 |
| Français | 44 | 105 | 5.975 |
| Deutsch | 36 | 101 | 5.718 |
| Português | 33 | 97 | 5.420 |

Gli screenshot possono restare gli stessi per tutte le lingue. Small tile e
Marquee **non sono localizzabili**: valgono per tutte.

---

## Scheda «Norme di tutela della privacy»

### ❌ «Descrizione del singolo scopo obbligatoria»

```
Consentire ai giocatori di pokelike.xyz di visualizzare, modificare e salvare una copia di backup del proprio salvataggio di gioco, memorizzato nel localStorage del browser sul sito pokelike.xyz.
```

### ❌ «Motivazione per activeTab»

```
Serve ad accedere alla scheda pokelike.xyz attiva quando l'utente apre il popup, per leggere e scrivere il salvataggio di gioco solo su azione esplicita dell'utente.
```

### ❌ «Motivazione per scripting»

```
Serve a iniettare uno script nella scheda pokelike.xyz per leggere e riscrivere le chiavi di salvataggio nel localStorage della pagina: è l'unico modo per accedere a quei dati. Una seconda iniezione, in world MAIN, legge in sola lettura l'elenco degli obiettivi definito dal gioco, per mostrarne lo stato di completamento senza duplicare quei dati nell'estensione, e mette in pausa la sincronizzazione cloud del gioco durante il ripristino di un backup. Infine, solo se l'utente attiva esplicitamente la funzione «Tratti forzati», l'estensione registra uno script incluso nel pacchetto (src/force-traits.js) che nella pagina del gioco sostituisce il risultato del calcolo dei tratti con i valori scelti dall'utente: quei valori non sono memorizzati nel salvataggio e non esiste altro modo di impostarli. La registrazione viene rimossa appena l'utente spegne la funzione, che è disattivata per impostazione predefinita.
```

### ❌ «Motivazione per storage»

```
Serve a memorizzare localmente le preferenze dell'estensione (lingua, tema) e i backup del salvataggio che l'utente crea volontariamente, così da poter annullare una modifica. Restano sul dispositivo e non vengono trasmessi.
```

### ❌ «Motivazione per l'utilizzo dell'autorizzazione host»

```
L'estensione funziona esclusivamente sul sito del gioco, quindi l'autorizzazione è limitata a https://pokelike.xyz/*. Serve per leggere e riscrivere il salvataggio nella pagina del gioco e per mostrare le immagini degli sprite che la pagina sta già caricando. Nessun altro dominio viene contattato.
```

### ❌ «Motivazione per l'utilizzo del codice remoto»

Alla domanda **«Stai usando codice remoto?»** rispondi **No**.
Se il campo di motivazione resta obbligatorio, incolla:

```
L'estensione non esegue codice remoto. Tutto il JavaScript è incluso nel pacchetto: nessun eval, nessuno script caricato da remoto, nessun bundle offuscato. Dalla rete arrivano soltanto immagini (gli sprite serviti da pokelike.xyz).
```

### ❌ «Devi certificare che il tuo utilizzo dei dati sia conforme»

In **Utilizzo dei dati** non selezionare **nessuna** categoria: l'estensione non
raccoglie né trasmette dati. Poi spunta le tre dichiarazioni:

- [x] Non vendo né cedo i dati a terze parti.
- [x] Non uso né trasferisco i dati per scopi estranei alla funzione principale.
- [x] Non uso né trasferisco i dati per valutare solvibilità o per prestiti.

### Informativa privacy (obbligatoria, anche se non compare fra gli errori)

Serve un **URL pubblico**, e deve descrivere *questa* estensione.

> ⚠️ **Non riciclare l'informativa di un'altra estensione.** Una policy generata
> per un altro prodotto dichiara tipicamente di raccogliere dati di utilizzo,
> indirizzo IP e identificativi del dispositivo, e di condividerli con fornitori
> terzi. Qui saresti in **contraddizione diretta** con la certificazione «non
> raccolgo dati» che firmi nella stessa scheda: è un motivo di rifiuto, e la
> certificazione è una dichiarazione formale.

Due modi, entrambi rapidi:

**A — Gist pubblico (più veloce).** Vai su <https://gist.github.com>, incolla il
contenuto di `PRIVACY.md`, chiamalo `privacy.md`, scegli *Create public gist*.
GitHub lo renderizza e l'URL del gist è quello da incollare.

**B — Pagina HTML.** In `store_assets/privacy.html` trovi la stessa informativa
già impaginata e autonoma (nessun file esterno, tema chiaro e scuro). Caricala
su GitHub Pages, Netlify Drop o qualsiasi hosting statico.

Senza questo URL l'invio verrà bloccato più avanti.

---

## Ordine consigliato

1. Carica lo ZIP `pokelike-editor-2.3.0.zip` (se non l'hai già fatto).
2. Store listing: icona, 4 screenshot, descrizione, categoria, lingua.
3. Pubblica `PRIVACY.md` da qualche parte e copia l'URL.
4. Privacy: scopo unico, le 5 motivazioni, uso dei dati, URL informativa.
5. **Salva bozza** → **Invia per la revisione**.
