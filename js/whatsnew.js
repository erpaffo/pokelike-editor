import { LANGS, getLanguage } from './i18n.js';

// Avviso "novita'" mostrato una sola volta dopo un aggiornamento. Chrome
// aggiorna da solo l'estensione ma non lo dice all'utente: il popup confronta
// la versione del manifest con l'ultima che l'utente ha chiuso. Niente service
// worker e nessun permesso in piu'.
//
// Per ogni nuova versione aggiungere qui una voce (ordine lingue = LANGS:
// it, en, es, fr, de, pt). Si mostrano tutte le versioni uscite dopo l'ultima
// vista, cosi' chi salta un aggiornamento non perde le novita' intermedie.
const SEEN_KEY = 'pkeditor_whatsnew_seen';

// Oltre questo numero di voci il riquadro diventerebbe piu' alto del popup.
const MAX_ITEMS = 8;

const NOTES = {
  '2.3.0': [
    [
      'Mega: lo sblocco scrive dove il gioco legge davvero, e mostra anche il Mega Bracciale',
      'La run Endless 2.0 in pausa ora si può modificare',
      'Endless 2.0: Oggetto Firma, slot passivi, livelli extra di cattura, potenziamento dei Pokémon',
      'Nuove sezioni SpireMon (carte, shiny, gettoni) e frammenti leggendari',
      'Pulsanti ±₽ funzionanti e PokéDollari limitati a un valore che il gioco gestisce'
    ],
    [
      'Megas: unlocking now writes where the game actually reads, and shows the Mega Bracelet too',
      'The paused Endless 2.0 run can now be edited',
      'Endless 2.0: Signature Item, passive slots, extra catch levels, Pokémon augments',
      'New SpireMon (cards, shiny, tokens) and legendary shards sections',
      '±₽ buttons now work and PokéDollars are capped to a value the game can handle'
    ],
    [
      'Megas: el desbloqueo escribe donde el juego lee de verdad y muestra también la Megapulsera',
      'La partida Endless 2.0 en pausa ya se puede editar',
      'Endless 2.0: Objeto Firma, huecos de pasivos, niveles extra de captura, potenciación de Pokémon',
      'Nuevas secciones SpireMon (cartas, shiny, fichas) y fragmentos legendarios',
      'Botones ±₽ funcionando y PokéDólares limitados a un valor que el juego maneja'
    ],
    [
      "Mégas : le déblocage écrit là où le jeu lit vraiment, et affiche aussi le Méga-Bracelet",
      'La partie Endless 2.0 en pause est désormais modifiable',
      'Endless 2.0 : Objet Signature, emplacements passifs, niveaux de capture bonus, amélioration des Pokémon',
      'Nouvelles sections SpireMon (cartes, shiny, jetons) et fragments légendaires',
      'Boutons ±₽ fonctionnels et PokéDollars plafonnés à une valeur que le jeu gère'
    ],
    [
      'Megas: Freischalten schreibt dorthin, wo das Spiel wirklich liest, und zeigt auch das Mega-Armband',
      'Der pausierte Endless-2.0-Run ist jetzt bearbeitbar',
      'Endless 2.0: Signatur-Item, Passiv-Plätze, Extra-Fanglevel, Pokémon-Verstärkung',
      'Neue Bereiche SpireMon (Karten, Shiny, Tokens) und legendäre Splitter',
      '±₽-Knöpfe funktionieren und PokéDollar sind auf einen Wert begrenzt, den das Spiel verarbeitet'
    ],
    [
      'Megas: o desbloqueio escreve onde o jogo realmente lê e mostra também a Megapulseira',
      'A partida Endless 2.0 em pausa agora pode ser editada',
      'Endless 2.0: Item Assinatura, espaços de passivos, níveis extra de captura, aprimoramento de Pokémon',
      'Novas secções SpireMon (cartas, shiny, fichas) e fragmentos lendários',
      'Botões ±₽ a funcionar e PokéDólares limitados a um valor que o jogo suporta'
    ]
  ],
  '2.2.1': [
    [
      'Sblocco di starter e leggendari di nuovo funzionante',
      'Completare lo Shiny Dex ora riempie anche le specie shiny degli starter'
    ],
    [
      'Unlocking starters and legendaries works again',
      'Completing the Shiny Dex now also fills the shiny starter species'
    ],
    [
      'El desbloqueo de iniciales y legendarios vuelve a funcionar',
      'Completar el Shiny Dex ahora también rellena las especies shiny de los iniciales'
    ],
    [
      'Le déblocage des starters et légendaires refonctionne',
      'Compléter le Shiny Dex remplit désormais aussi les espèces shiny des starters'
    ],
    [
      'Freischalten von Startern und Legendären funktioniert wieder',
      'Das Vervollständigen des Shiny-Dex füllt jetzt auch die Shiny-Arten der Starter'
    ],
    [
      'O desbloqueio de iniciais e lendários voltou a funcionar',
      'Completar a Shiny Dex agora também preenche as espécies shiny dos iniciais'
    ]
  ]
};

const TEXT = {
  title: [
    'Aggiornato alla versione {v}', 'Updated to version {v}', 'Actualizado a la versión {v}',
    'Mis à jour vers la version {v}', 'Aktualisiert auf Version {v}', 'Atualizado para a versão {v}'
  ],
  dismiss: ['Ho capito', 'Got it', 'Entendido', 'Compris', 'Verstanden', 'Entendi']
};

function readSeen() {
  try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; }
}

function writeSeen(version) {
  try { localStorage.setItem(SEEN_KEY, version); } catch (e) { /* storage non disponibile */ }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Confronto numerico fra versioni "x.y.z".
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let k = 0; k < Math.max(pa.length, pb.length); k++) {
    const d = (pa[k] || 0) - (pb[k] || 0);
    if (d) return d;
  }
  return 0;
}

export function showWhatsNew() {
  const version = chrome.runtime.getManifest().version;
  const seen = readSeen();
  if (seen === version) return;

  // Dalla piu' recente: versioni uscite dopo l'ultima vista e non oltre quella
  // installata. Senza una versione vista (prima di 2.2.1 non si registrava)
  // valgono tutte quelle elencate.
  const versions = Object.keys(NOTES)
    .filter(v => compareVersions(v, version) <= 0 && (!seen || compareVersions(v, seen) > 0))
    .sort((a, b) => compareVersions(b, a));
  if (!versions.length) { writeSeen(version); return; }

  const i = Math.max(0, LANGS.indexOf(getLanguage()));
  const items = versions.flatMap(v => NOTES[v][i] || NOTES[v][0]).slice(0, MAX_ITEMS);
  const banner = document.createElement('div');
  banner.className = 'whatsnew';
  banner.innerHTML = `
    <div class="whatsnew-body">
      <strong>🎉 ${esc(TEXT.title[i].replace('{v}', version))}</strong>
      <ul>${items.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
    </div>
    <button class="btn btn-accent whatsnew-close">${esc(TEXT.dismiss[i])}</button>`;
  banner.querySelector('.whatsnew-close').addEventListener('click', () => {
    writeSeen(version);
    banner.remove();
  });
  document.querySelector('.tabs')?.after(banner);
}
