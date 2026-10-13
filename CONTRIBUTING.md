# Contribuire a Pokélike Editor

Grazie dell'interesse! Qualche indicazione per tenere il progetto coerente.

## Ambiente

Nessuna build e nessuna dipendenza: è codice sorgente caricato così com'è.
Per provarlo carica la cartella da `chrome://extensions` → **Modalità
sviluppatore** → **Carica estensione non pacchettizzata**, poi ricarica
l'estensione dopo ogni modifica.

## Linee guida

- **Niente rete**: l'estensione contatta solo `pokelike.xyz` per gli sprite.
  Non aggiungere API esterne, CDN, font remoti o analytics (vedi `PRIVACY.md`).
- **Leggere dal gioco, non duplicare**: quando un dato esiste nella pagina
  (cataloghi, traduzioni, funzioni come `makeMegaStoneItem`), va letto a runtime
  tramite `js/page.js` invece di copiarlo nell'estensione.
- **Traduzioni**: ogni nuova stringa dell'interfaccia va aggiunta in tutte e sei
  le lingue di `js/i18n.js` (it, en, es, fr, de, pt).
- **Permessi**: non ampliare `permissions` / `host_permissions` nel manifest senza
  discuterne prima in una issue — rallenta la revisione sul Chrome Web Store.
- **Salvataggi**: non committare dump reali (`*_DATA.json`): contengono
  `poke_save_token` e il nome utente. Sono già esclusi dal `.gitignore`.

## Pull request

1. Una PR per argomento, con una descrizione di cosa cambia e perché.
2. Prova la modifica su una run reale, comprese **Sincronizza** e un
   backup/ripristino se tocchi il salvataggio.
3. Aggiungi una voce in `CHANGELOG.md` sotto una sezione `[Non rilasciato]`.

Le versioni in `manifest.json` le aggiorna il maintainer al momento della
pubblicazione sullo Store.
