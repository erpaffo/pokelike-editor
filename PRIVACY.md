# Informativa sulla privacy — Pokélike Editor

_Ultimo aggiornamento: 21 settembre 2026 — versione 2.2.0_

## In breve

Pokélike Editor **non raccoglie, non trasmette e non memorizza su server alcun
dato personale**. Non ci sono account, analytics, tracker o pubblicità.
L'estensione non ha un server: tutto avviene nel tuo browser.

## Quali dati vengono trattati e dove

| Dato | Dove sta | Chi vi accede |
|------|----------|---------------|
| Salvataggio di gioco (`localStorage` di `pokelike.xyz`: squadra, zaino, run, Pokédex, PokéDollari, statistiche) | Solo nel tuo browser, sul sito pokelike.xyz | Solo tu, quando apri il popup dell'estensione |
| Preferenze dell'estensione (lingua, tema) | `localStorage` locale dell'estensione | Solo tu |
| Backup del salvataggio che crei tu | `chrome.storage.local`, cioè sul tuo computer | Solo tu |

L'estensione legge queste chiavi **solo** quando apri il suo popup su una scheda
`https://pokelike.xyz/*` e **solo** per mostrartele e permetterti di modificarle.
Le modifiche vengono riscritte nello stesso `localStorage`. Nessuna copia viene
inviata altrove.

## Connessioni di rete

L'unico host contattato è **`pokelike.xyz`**, e solo per mostrare le immagini
degli sprite — le stesse che la pagina del gioco sta già caricando. Nessuna
richiesta viene inviata, nessun dato identificativo viene trasmesso.

Non vengono usati servizi di terze parti: nessuna API esterna, nessun font
remoto, nessuna CDN. Statistiche base e tipi dei Pokémon sono inclusi
nell'estensione (`js/pokemonTypes.js`) e funzionano anche offline.

## Backup

I backup che crei restano su questo computer, dentro l'archivio locale
dell'estensione: non vengono caricati da nessuna parte. Vengono conservati gli
ultimi 5 e spariscono se disinstalli l'estensione o usi "Reset Completo Dati".

Se esporti un backup su file, quel file contiene una copia integrale del
salvataggio, **incluso il token del tuo account di gioco** (`poke_save_token`):
conservalo come un dato personale e non condividerlo.

## Permessi richiesti e motivo

- **`activeTab` / `scripting`** — leggere e scrivere il `localStorage` della
  scheda pokelike.xyz attualmente aperta, solo su tua azione. Se accendi i
  «Tratti forzati», lo stesso permesso registra uno script incluso nel
  pacchetto che, nella pagina del gioco, sostituisce il risultato del calcolo
  dei tratti con i valori che hai scelto. Resta attivo finché non spegni la
  funzione, non raccoglie nulla e non contatta nessun server.
- **`storage`** — conservare localmente le tue preferenze e i backup del
  salvataggio che crei tu.
- **`host_permissions: https://pokelike.xyz/*`** — limitare l'accesso al solo
  sito del gioco.

## Dati venduti o condivisi con terzi

Nessuno. I dati non vengono mai venduti, ceduti o usati per scopi diversi dalla
funzione principale dell'estensione.

## Cancellazione dei dati

Impostazioni → "Reset Completo Dati" rimuove tutte le preferenze locali.
Disinstallando l'estensione si elimina tutto ciò che essa memorizza. Il
salvataggio di gioco resta di proprietà del sito pokelike.xyz.

## Contatti

Per domande sulla privacy: <paffetto@gmail.com>.
