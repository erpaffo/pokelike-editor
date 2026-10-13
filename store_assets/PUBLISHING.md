# Come pubblicare sul Chrome Web Store

## 0. Prerequisiti

- Un account Google.
- **Account sviluppatore Chrome Web Store**: quota una tantum di **5 USD**
  (pagamento con carta) su <https://chrome.google.com/webstore/devconsole>.
- Informativa privacy raggiungibile a un URL pubblico (vedi sotto).

## 1. Prepara il codice

1. ~~Imposta il link donazioni reale in `js/constants.js`~~ — fatto:
   `https://ko-fi.com/erpaffo`.
2. ~~Inserisci la tua email in `PRIVACY.md` e in `store_assets/STORE_LISTING.md`~~
   — fatto: `paffetto@gmail.com`.
3. Controlla `manifest.json`: `version` va **aumentata a ogni nuovo caricamento**
   (ora `2.3.0`). Aggiungi anche la voce della stessa versione in
   `js/whatsnew.js`: è il riquadro «novità» che gli utenti vedono dopo
   l'aggiornamento (senza voce non compare nulla).
4. Carica l'estensione non pacchettizzata in `chrome://extensions` e prova ogni
   scheda su `pokelike.xyz` con una run attiva.

## 2. Pubblica l'informativa privacy

Il Web Store richiede un URL pubblico. Opzioni rapide:

- Repo GitHub pubblico → link a `PRIVACY.md`.
- GitHub Pages o un Gist pubblico.

Copia quell'URL: va incollato nella Dashboard.

## 3. Crea lo ZIP

Lo ZIP deve contenere il `manifest.json` **alla radice** (non dentro una
sottocartella). Dalla cartella del progetto:

```bash
zip -r -X pokelike-editor-2.3.0.zip manifest.json popup.html pokemonData.js js icons src _locales
```

> ⚠️ **Non usare `Compress-Archive` di Windows PowerShell 5.1.** Scrive i
> percorsi interni con il backslash (`js\main.js`) invece della barra
> richiesta dallo standard ZIP, e i file nelle sottocartelle possono risultare
> irraggiungibili. Usa `zip` (Info-ZIP, incluso in Git Bash) o 7-Zip.
>
> Per controllare uno ZIP già creato: `unzip -l nomefile.zip` — i percorsi
> devono apparire come `js/main.js`, mai `js\main.js`.

Lo ZIP della versione 2.3.0 è già stato creato e verificato:
`pokelike-editor-2.3.0.zip`.

> Due cartelle sono obbligatorie nel pacchetto:
> `src/pause-cloud-sync.js`, senza cui il ripristino di un backup viene
> annullato dalla sincronizzazione del gioco, e `_locales/`, senza cui il
> manifest non riesce a risolvere `__MSG_extName__` e Chrome rifiuta lo ZIP.

Non includere: `store_assets/`, `.git/`, `node_modules/`, `README.md`,
`*.md` di sviluppo. (Non danno errore, ma è inutile peso.)

## 4. Carica nella Developer Dashboard

1. <https://chrome.google.com/webstore/devconsole> → **Aggiungi nuovo elemento**.
2. Carica lo ZIP.
3. Compila la scheda con i testi di `store_assets/STORE_LISTING.md`:
   - Nome, descrizione breve, descrizione completa
   - Categoria: *Strumenti* — Lingua: *Italiano*
   - Icona 128×128 e almeno 1 screenshot (1280×800 o 640×400)
4. Tab **Privacy**:
   - Scopo unico (testo pronto nel file listing)
   - Giustificazione di ogni permesso (tabella pronta)
   - "Remote code": **No**
   - Data usage: non selezionare nessuna categoria + spunta le 3 dichiarazioni
   - URL informativa privacy (dal passo 2)
5. **Distribuzione**: Pubblico o "Non in elenco" (unlisted) se vuoi condividere
   solo tramite link durante i test.
6. **Salva bozza** → **Invia per la revisione**.

## 5. Revisione

- Prima pubblicazione: di solito da poche ore a qualche giorno.
- Un'estensione che usa `scripting` + `host_permissions` viene spesso sottoposta
  a revisione manuale: metti giustificazioni chiare e descrizione coerente con
  ciò che il codice fa davvero.
- Se viene rifiutata ricevi il motivo via email: correggi, alza `version`,
  ricarica.

## 6. Aggiornamenti futuri

Alza `version` in `manifest.json`, crea un nuovo ZIP, caricalo sullo stesso
elemento, reinvia. Gli utenti ricevono l'update automaticamente.

---

## ⚠️ Rischi da valutare prima di pubblicare (non è consulenza legale)

Non posso garantirti che la pubblicazione non violi alcuna norma: la decisione
finale è tua. I punti concreti da considerare:

1. **Marchi e IP di Nintendo / The Pokémon Company.**
   Il nome "Pokélike", la parola "Pokémon" e i nomi dei Pokémon sono proprietà
   di terzi. Nintendo fa spesso rimuovere fan-tool e fangame.

   *Stato attuale delle sprite:* l'estensione **non impacchetta né ridistribuisce
   alcuna immagine**. Le sprite vengono mostrate direttamente da
   `pokelike.xyz`, cioè dalla stessa pagina che l'utente ha già aperto e che
   sta già caricando quelle immagini. Le dipendenze da
   `play.pokemonshowdown.com` e da PokeAPI/GitHub sono state rimosse: non c'è
   più ridistribuzione di asset altrui da parte tua.

   Mitigazioni ulteriori, se il rischio marchio ti preoccupa:
   - Nome neutro senza "Poké/Pokémon".
   - Disclaimer "non ufficiale / non affiliato" ben visibile (già in README,
     LICENSE, PRIVACY e nella descrizione Store).
   - Nessuna monetizzazione diretta (il modello "gratis + donazione" aiuta ma
     non elimina il rischio).

   Resta il fatto che le sprite servite da pokelike.xyz sono a loro volta
   opere derivate: il rischio si sposta sul gioco, non si azzera.

2. **Rapporto con pokelike.xyz.**
   L'estensione modifica il salvataggio di un gioco altrui. È buona norma
   chiedere al gestore del sito se acconsente a uno strumento di terze parti;
   in caso di obiezione, potrebbe segnalarla a Google. Un tool di "save
   editing/cheat" non viola di per sé le policy del Web Store, ma dev'essere
   descritto onestamente come tale.

3. **Policy del Chrome Web Store.**
   - Codice **non offuscato**: ok, la pipeline di offuscamento è stata rimossa e
     l'estensione ora spedisce i moduli sorgente leggibili.
   - Scopo unico e permessi minimi: ok (`activeTab`, `scripting`, `storage`,
     host limitato a pokelike.xyz).
   - Informativa privacy obbligatoria: fornita (`PRIVACY.md`).
   - Nessun codice remoto: rispettato.

4. **Plagio del codice e dei dati.**
   Il codice sorgente dell'estensione è originale del progetto. I dati numerici
   in `js/pokemonTypes.js` (tipi e base stat) provengono da
   [PokeAPI](https://pokeapi.co), che pubblica dati fattuali sotto licenza
   aperta: i fatti non sono tutelati dal diritto d'autore.

   **Scelta deliberata:** i cataloghi propri del gioco (achievement, sfide,
   contatori) **non** sono stati copiati dentro l'estensione. Vengono letti a
   runtime dalla pagina (`world: "MAIN"` in `js/page.js`), così non viene
   ridistribuito né codice né testo di pokelike.xyz, e il catalogo resta
   aggiornato da solo. Nessun testo o descrizione del gioco è incluso nel
   pacchetto.

   Il rischio residuo non è "plagio" ma **uso di marchi** (punto 1). La licenza
   MIT copre solo il tuo codice.

Se il rischio marchio ti preoccupa, l'alternativa a basso rischio è distribuire
l'estensione **come repo GitHub** ("carica non pacchettizzata") invece che sul
Web Store pubblico, oppure pubblicarla come **unlisted**.
