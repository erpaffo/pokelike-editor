# Scheda dello Store — testi per lingua

## Cosa si incolla dove

| Campo | Da dove arriva |
|-------|----------------|
| **Titolo** dell'elemento | dal pacchetto: `_locales/<lingua>/messages.json` → `extName` |
| **Riepilogo** (summary) | dal pacchetto: `_locales/<lingua>/messages.json` → `extDescription` |
| **Descrizione dettagliata** | si incolla nel Dashboard, una per lingua |
| Screenshot | si caricano nel Dashboard, localizzabili |
| Small tile e Marquee | **non** localizzabili: valgono per tutte le lingue |

Quindi titolo e riepilogo sono **già tradotti dentro lo ZIP**: non c'è nulla da
digitare, li prende Chrome in automatico secondo la lingua dell'utente. Qui
sotto sono riportati solo come riferimento, per sapere cosa vedrà il pubblico.

Nel Dashboard, **Store listing → selettore di lingua in alto**, scegli ogni
lingua e incolla la sua descrizione dettagliata.

Limiti: titolo 75 caratteri, riepilogo 132, descrizione dettagliata 16.000.

---


# 🇮🇹 Italiano

**Titolo** (dal pacchetto, 35 caratteri)

> Pokélike Editor — Editor salvataggi

**Riepilogo** (dal pacchetto, 114 caratteri)

> Modifica il salvataggio locale di pokelike.xyz: squadra, zaino, Pokédex, sblocchi e backup. Gratis, senza account.

### Descrizione dettagliata — da incollare nel Dashboard (5639 caratteri)

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

---


# 🇬🇧 English

**Titolo** (dal pacchetto, 30 caratteri)

> Pokélike Editor — Save Manager

**Riepilogo** (dal pacchetto, 100 caratteri)

> Edit your local pokelike.xyz save: team, bag, Pokédex, unlocks and backups. Free, no account needed.

### Descrizione dettagliata — da incollare nel Dashboard (5165 caratteri)

```
Pokélike Editor is an unofficial tool for players of the browser fangame
pokelike.xyz. It opens a panel that reads the save the game keeps in your
browser's localStorage and lets you edit it comfortably, without touching the
developer console.

FEATURES

• Team — level, current and max HP, base stats, shiny status, held item, Mega
  stone and move tier for each Pokémon, plus a button to heal the whole team.
  Two shortcuts turn every non-shiny Pokémon shiny and push the whole team's
  moves to the highest tier.

• Mutations — mutant Pokémon in Endless mode carry an extra type beyond their
  base form. You can change it, add one or remove it; the mutated type is
  highlighted among the Pokémon's badges.

• Add — insert any Pokémon from Gen 1 to Gen 6, with search by name or number,
  a generation filter and two type filters that combine in any order: searching
  Flying + Dark also finds the Dark/Flying ones.

• Run — PokéDollars, badge count, current map, Nuzlocke and Endless modes, plus
  a map node editor. In challenges and Endless you can also pick which passive
  items are active, within the slots that mode allows.

• Mega stones — give a compatible Mega stone to a team member or drop it in the
  bag for later; the list of stones is read from the game, so it stays up to
  date. That includes the Mega forms no stone unlocks in game, such as
  Charizard X: the editor rebuilds the stone from the game’s own data (without
  the Mega ability, which does not exist for those forms).

• Bag — add held items while respecting the game's real limits: 10 slots and a
  single copy of each item.

• Tower traits — in the Endless Tower traits come from your team: types, shiny
  status and mutation. The editor computes them with the game’s own formula,
  shows what each trait does at the tier you have reached and, once you pick a
  type and a tier, changes the team to get there — listing what it will change
  first.

• Rewards and challenges — claim every pending achievement reward at once, and
  mark base, monotype, weekly and daily challenges as cleared, one by one or by
  group. Achievements can also be toggled by hand.

• Map editor — change any node’s type, offered from only the types the current
  mode can actually generate: the Tower’s Poké Mart never shows up in a story
  run, and Silver or Distortion World nodes never show up in the Tower. The
  ones left out come with the reason why.

• Vitamins — give the maximum vitamins to a single Pokémon or to every
  selectable starter, for one stat or all of them, respecting the game's real
  caps. Vitamins follow the evolution line, exactly as in game.

• Unlocks — a "Platinum" dashboard showing how complete each area is
  (achievements, Pokédex, Shiny Dex, Mega Evolutions, starters, legendaries,
  challenges) with buttons to finish what's missing, one by one or all at once.

• Backup — make a copy of your save before editing it and restore it whenever
  you want to go back. Restoring reloads the game page so the running session
  can't overwrite the data you just recovered. If you play with a synced
  account, you're asked whether to roll back the server copy too or keep the
  restore to this browser only. You can also export a backup to a file and
  import it again.

• Search in every list — passives, starters, achievements, challenges, items
  and Mega Stones all have a search box that understands every language the
  game knows: typing "uovo fortunato" finds the Lucky Egg even with the
  interface in English. Accents and case do not matter, and you can search by
  number too.

• Languages — interface available in Italian, English, Spanish, French, German
  and Portuguese, switchable instantly from the settings.

• Settings — language, four interface themes and a reset of the extension's
  data.

HOW IT WORKS

The extension has no server of any kind. When you open the popup while on a
pokelike.xyz tab, it reads the game's save keys (poke_*, pkrl_*) from the
page's localStorage, shows you the values and writes your changes back to that
same localStorage. No data leaves your browser: no account, no tracking, no
ads.

The Sync button reloads the game page so your changes are picked up right away
and, if you had a run going, it reopens that run in the right mode (story,
Endless or challenge) so you carry on where you left off.

The list of objectives shown in the Unlocks tab is read from the game page at
that moment, read-only, so it stays in step with pokelike.xyz updates.

NETWORK CONNECTIONS

The only host contacted is pokelike.xyz, and only to display sprite images —
the very same ones the game page is already loading. No external API, no remote
fonts, no CDN, no personal data transmitted.

NOTES

Free and open source project (MIT licence), not affiliated with or endorsed by
pokelike.xyz, Nintendo, Game Freak or The Pokémon Company. "Pokémon" and the
related names and images belong to their respective owners.

Use the tool on your own save and at your own risk: editing a save can make it
incompatible with future updates of the game. That's why the extension includes
a backup feature — use it before making significant changes.
```

---


# 🇪🇸 Español

**Titolo** (dal pacchetto, 36 caratteri)

> Pokélike Editor — Gestor de guardado

**Riepilogo** (dal pacchetto, 107 caratteri)

> Edita tu partida local de pokelike.xyz: equipo, mochila, Pokédex, desbloqueos y copias. Gratis, sin cuenta.

### Descrizione dettagliata — da incollare nel Dashboard (5675 caratteri)

```
Pokélike Editor es una herramienta no oficial para quienes juegan al fangame de
navegador pokelike.xyz. Abre un panel que lee la partida que el juego guarda en
el localStorage de tu navegador y te permite editarla cómodamente, sin pelearte
con la consola de desarrollador.

FUNCIONES

• Equipo — nivel, PS actuales y máximos, estadísticas base, estado variocolor,
  objeto equipado, piedra Mega y nivel de movimientos de cada Pokémon, además de
  un botón para curar al equipo entero. Dos atajos vuelven variocolor a todos
  los Pokémon que aún no lo son y suben al nivel máximo los movimientos de todo
  el equipo.

• Mutaciones — los Pokémon mutantes del modo infinito llevan un tipo extra
  además de los de su forma base. Puedes cambiarlo, añadirlo o quitarlo; el tipo
  mutado aparece destacado entre las etiquetas del Pokémon.

• Añadir — inserta cualquier Pokémon de la Gen 1 a la Gen 6, con búsqueda por
  nombre o número, filtro por generación y dos filtros de tipo combinables en
  cualquier orden: buscar Volador + Siniestro también encuentra los
  Siniestro/Volador.

• Partida — Pokédólares, número de medallas, mapa actual, modos Nuzlocke e
  infinito, y un editor de los nodos del mapa. En los desafíos y en el modo
  infinito también puedes elegir qué objetos pasivos están activos, dentro de
  los espacios que permite el modo.

• Piedras Mega — asigna una piedra Mega compatible a un miembro del equipo o
  guárdala en la mochila para más adelante; la lista de piedras se lee del
  juego, así que siempre está al día. También están las formas Mega que ninguna
  piedra desbloquea en el juego, como la X de Charizard: el editor reconstruye
  la piedra con los datos del juego (sin la habilidad Mega, que no existe para
  esas formas).

• Mochila — añade objetos equipados respetando los límites reales del juego: 10
  espacios y un solo ejemplar de cada objeto.

• Rasgos de la Torre — en la Torre Infinita los rasgos dependen del equipo:
  tipos, variocolor y mutación. El editor los calcula con la fórmula del juego,
  muestra el efecto de cada rasgo en el nivel alcanzado y, elegido un tipo y un
  nivel, modifica el equipo para llegar, enumerando antes qué va a cambiar.

• Recompensas y desafíos — reclama de una vez los premios de logros
  pendientes y marca como superados los desafíos base, monotipo, semanales y
  diarios, uno a uno o por grupos. Los logros también se activan a mano.

• Editor del mapa — cambia el tipo de cada nodo ofreciendo solo los que el modo
  en curso puede generar de verdad: el Poké Mart de la Torre no aparece en una
  partida historia, y los nodos de Silver o del Mundo Distorsión no aparecen en
  la Torre. De los excluidos se explica el motivo.

• Vitaminas — da el máximo de vitaminas a un solo Pokémon o a todos los
  iniciales seleccionables, para una sola estadística o para todas, respetando
  los topes reales del juego. Las vitaminas siguen la línea evolutiva, igual que
  en el juego.

• Desbloqueos — un panel "Platino" con el estado de finalización de cada área
  (logros, Pokédex, Dex variocolor, Megaevoluciones, iniciales, legendarios,
  desafíos) y botones para completar lo que falta, uno a uno o todo de golpe.

• Copias de seguridad — crea una copia de la partida antes de editarla y
  restáurala cuando quieras volver atrás. La restauración recarga la página del
  juego para que la sesión en curso no sobrescriba los datos recuperados. Si
  juegas con una cuenta sincronizada, se te pregunta si quieres revertir también
  la copia del servidor o limitar la restauración a este navegador. También
  puedes exportar una copia a un archivo y volver a importarla.

• Búsqueda en cada lista — pasivos, iniciales, logros, desafíos, objetos y
  megapiedras tienen una caja de búsqueda que entiende todos los idiomas del
  juego: escribiendo "lucky egg" encuentras el Huevo Suerte aunque la interfaz
  esté en español. Tildes y mayúsculas dan igual, y también se busca por
  número.

• Idiomas — interfaz disponible en italiano, inglés, español, francés, alemán y
  portugués, con cambio inmediato desde los ajustes.

• Ajustes — idioma, cuatro temas de interfaz y restablecimiento de los datos de
  la extensión.

CÓMO FUNCIONA

La extensión no tiene ningún servidor. Cuando abres la ventana emergente estando
en una pestaña de pokelike.xyz, lee las claves de guardado del juego (poke_*,
pkrl_*) del localStorage de la página, te muestra los valores y reescribe tus
cambios en ese mismo localStorage. El botón Sincronizar recarga la página del
juego para que los cambios se apliquen enseguida y, si tenías una partida en
curso, la reabre en el modo correcto (historia, infinito o desafío).
Ningún dato sale de tu navegador: sin cuenta,
sin rastreo, sin publicidad.

La lista de objetivos que se ve en la pestaña Desbloqueos se lee de la página
del juego en ese momento, en modo solo lectura, de modo que sigue al día con las
actualizaciones de pokelike.xyz.

CONEXIONES DE RED

El único host contactado es pokelike.xyz, y solo para mostrar las imágenes de
los sprites: las mismas que la página del juego ya está cargando. Sin API
externas, sin fuentes remotas, sin CDN, sin datos personales transmitidos.

NOTAS

Proyecto gratuito y de código abierto (licencia MIT), no afiliado ni aprobado
por pokelike.xyz, Nintendo, Game Freak o The Pokémon Company. "Pokémon" y los
nombres e imágenes relacionados pertenecen a sus respectivos propietarios.

Usa la herramienta en tu propia partida y bajo tu responsabilidad: editar un
guardado puede hacerlo incompatible con futuras actualizaciones del juego. Por
eso la extensión incluye una función de copia de seguridad: úsala antes de hacer
cambios importantes.
```

---


# 🇫🇷 Français

**Titolo** (dal pacchetto, 44 caratteri)

> Pokélike Editor — Gestionnaire de sauvegarde

**Riepilogo** (dal pacchetto, 105 caratteri)

> Modifiez votre sauvegarde locale pokelike.xyz : équipe, sac, Pokédex, déblocages et sauvegardes. Gratuit.

### Descrizione dettagliata — da incollare nel Dashboard (5975 caratteri)

```
Pokélike Editor est un outil non officiel destiné aux joueurs du fangame
navigateur pokelike.xyz. Il ouvre un panneau qui lit la sauvegarde que le jeu
conserve dans le localStorage de votre navigateur et vous permet de la modifier
confortablement, sans passer par la console de développement.

FONCTIONNALITÉS

• Équipe — niveau, PV actuels et maximum, statistiques de base, état
  chromatique, objet tenu, Méga-Gemme et palier d'attaques pour chaque Pokémon,
  ainsi qu'un bouton pour soigner toute l'équipe. Deux raccourcis rendent
  chromatiques tous les Pokémon qui ne le sont pas encore et portent au palier
  maximal les attaques de toute l'équipe.

• Mutations — les Pokémon mutants du mode infini portent un type supplémentaire
  en plus de ceux de leur forme de base. Vous pouvez le changer, en ajouter un
  ou le retirer ; le type muté est mis en évidence parmi les badges du Pokémon.

• Ajouter — insérez n'importe quel Pokémon de la Gén 1 à la Gén 6, avec
  recherche par nom ou par numéro, filtre par génération et deux filtres de type
  combinables dans n'importe quel ordre : chercher Vol + Ténèbres trouve aussi
  les Ténèbres/Vol.

• Partie — Pokédollars, nombre de badges, carte actuelle, modes Nuzlocke et
  infini, plus un éditeur des nœuds de la carte. Dans les défis et en mode
  infini, vous pouvez aussi choisir les objets passifs actifs, dans la limite
  des emplacements accordés par le mode.

• Méga-Gemmes — attribuez une Méga-Gemme compatible à un membre de l'équipe ou
  rangez-la dans le sac pour plus tard ; la liste des gemmes est lue depuis le
  jeu, elle reste donc toujours à jour. Y compris les formes Méga qu’aucune
  gemme ne débloque dans le jeu, comme le X de Dracaufeu : l’éditeur
  reconstitue la gemme à partir des données du jeu (sans le talent Méga, qui
  n’existe pas pour ces formes).

• Sac — ajoutez des objets tenus en respectant les vraies limites du jeu : 10
  emplacements et un seul exemplaire par objet.

• Traits de la Tour — dans la Tour Infinie les traits dépendent de l’équipe :
  types, état chromatique et mutation. L’éditeur les calcule avec la formule du
  jeu, montre l’effet de chaque trait au palier atteint puis, une fois un type
  et un palier choisis, modifie l’équipe pour y arriver, en listant d’abord ce
  qui va changer.

• Récompenses et défis — réclamez d’un coup les récompenses de succès en
  attente, et marquez comme terminés les défis de base, mono-type,
  hebdomadaires et quotidiens, un par un ou par groupe. Les succès se
  basculent aussi à la main.

• Éditeur de carte — changez le type de chaque nœud, avec seulement les types
  que le mode en cours peut réellement produire : le Poké Mart de la Tour
  n’apparaît pas dans une partie histoire, et les nœuds de Silver ou du Monde
  Distorsion n’apparaissent pas dans la Tour. Pour les autres, la raison est
  donnée.

• Vitamines — donnez le maximum de vitamines à un seul Pokémon ou à tous les
  starters sélectionnables, pour une seule statistique ou pour toutes, dans le
  respect des plafonds réels du jeu. Les vitamines suivent la lignée évolutive,
  comme dans le jeu.

• Déblocages — un tableau de bord « Platine » indiquant l'avancement de chaque
  domaine (succès, Pokédex, Dex chromatique, Méga-Évolutions, starters,
  légendaires, défis), avec des boutons pour compléter ce qui manque, un par un
  ou d'un seul coup.

• Sauvegardes — créez une copie de votre sauvegarde avant de la modifier et
  restaurez-la quand vous voulez revenir en arrière. La restauration recharge la
  page du jeu afin que la session en cours n'écrase pas les données que vous
  venez de récupérer. Si vous jouez avec un compte synchronisé, il vous est
  demandé si vous souhaitez aussi revenir en arrière côté serveur ou limiter la
  restauration à ce navigateur. Vous pouvez également exporter une sauvegarde
  dans un fichier et la réimporter.

• Recherche dans chaque liste — passifs, starters, succès, défis, objets et
  Méga-Gemmes disposent d’un champ de recherche qui comprend toutes les langues
  du jeu : taper « lucky egg » trouve l’Œuf Chance même avec l’interface en
  français. Accents et majuscules sont ignorés, et l’on peut chercher par
  numéro.

• Langues — interface disponible en italien, anglais, espagnol, français,
  allemand et portugais, changeable instantanément depuis les réglages.

• Réglages — langue, quatre thèmes d'interface et réinitialisation des données
  de l'extension.

FONCTIONNEMENT

L'extension n'a aucun serveur. Lorsque vous ouvrez la fenêtre alors que vous
êtes sur un onglet pokelike.xyz, elle lit les clés de sauvegarde du jeu (poke_*,
pkrl_*) dans le localStorage de la page, vous montre les valeurs et réécrit vos
modifications dans ce même localStorage. Aucune donnée ne quitte votre
navigateur : pas de compte, pas de suivi, pas de publicité.

Le bouton Synchroniser recharge la page du jeu pour que vos modifications
soient prises en compte immédiatement et, si une partie était en cours, il la
rouvre dans le bon mode (histoire, infini ou défi).

La liste des objectifs affichée dans l'onglet Déblocages est lue sur la page du
jeu à cet instant, en lecture seule, afin de rester alignée sur les mises à jour
de pokelike.xyz.

CONNEXIONS RÉSEAU

Le seul hôte contacté est pokelike.xyz, et uniquement pour afficher les images
des sprites : exactement celles que la page du jeu charge déjà. Aucune API
externe, aucune police distante, aucun CDN, aucune donnée personnelle transmise.

REMARQUES

Projet gratuit et open source (licence MIT), non affilié à pokelike.xyz,
Nintendo, Game Freak ou The Pokémon Company, ni approuvé par eux. « Pokémon »
ainsi que les noms et images associés appartiennent à leurs propriétaires
respectifs.

Utilisez l'outil sur votre propre sauvegarde et à vos risques : modifier une
sauvegarde peut la rendre incompatible avec de futures mises à jour du jeu.
C'est pourquoi l'extension intègre une fonction de sauvegarde : utilisez-la
avant toute modification importante.
```

---


# 🇩🇪 Deutsch

**Titolo** (dal pacchetto, 36 caratteri)

> Pokélike Editor — Spielstand-Manager

**Riepilogo** (dal pacchetto, 101 caratteri)

> Bearbeite deinen lokalen pokelike.xyz-Spielstand: Team, Beutel, Pokédex, Freischaltungen und Backups.

### Descrizione dettagliata — da incollare nel Dashboard (5718 caratteri)

```
Pokélike Editor ist ein inoffizielles Werkzeug für Spieler des Browser-Fangames
pokelike.xyz. Es öffnet ein Fenster, das den Spielstand liest, den das Spiel im
localStorage deines Browsers ablegt, und lässt dich ihn bequem bearbeiten – ohne
Umweg über die Entwicklerkonsole.

FUNKTIONEN

• Team — Level, aktuelle und maximale KP, Basiswerte, Schillernd-Status,
  getragenes Item, Mega-Stein und Attacken-Stufe für jedes Pokémon, dazu eine
  Schaltfläche, um das ganze Team zu heilen. Zwei Schnellaktionen machen alle
  noch nicht schillernden Pokémon schillernd und heben die Attacken des ganzen
  Teams auf die höchste Stufe.

• Mutationen — mutierte Pokémon im Endlos-Modus tragen einen zusätzlichen Typ
  über ihre Grundform hinaus. Du kannst ihn ändern, hinzufügen oder entfernen;
  der mutierte Typ wird unter den Abzeichen des Pokémon hervorgehoben.

• Hinzufügen — füge jedes Pokémon von Gen 1 bis Gen 6 ein, mit Suche nach Name
  oder Nummer, Generationsfilter und zwei Typfiltern, die sich in beliebiger
  Reihenfolge kombinieren lassen: Flug + Unlicht findet auch die
  Unlicht/Flug-Pokémon.

• Run — Pokédollar, Anzahl der Orden, aktuelle Karte, Nuzlocke- und
  Endlos-Modus sowie ein Editor für die Kartenknoten. In Herausforderungen und
  im Endlos-Modus kannst du außerdem festlegen, welche passiven Items aktiv
  sind – im Rahmen der Plätze, die der Modus erlaubt.

• Mega-Steine — gib einem Teammitglied einen passenden Mega-Stein oder lege ihn
  für später in den Beutel; die Liste der Steine wird aus dem Spiel gelesen und
  bleibt damit aktuell. Dazu die Mega-Formen, die im Spiel kein Stein
  freischaltet, etwa Glurak X: Der Editor baut den Stein aus den Daten des
  Spiels nach (ohne Mega-Fähigkeit, die es für diese Formen nicht gibt).

• Beutel — füge getragene Items hinzu und halte dabei die echten Grenzen des
  Spiels ein: 10 Plätze und nur ein Exemplar pro Item.

• Turm-Talente — im Endlos-Turm hängen die Talente vom Team ab: Typen,
  Schillernd-Status und Mutation. Der Editor berechnet sie mit der Formel des
  Spiels, zeigt die Wirkung jedes Talents auf der erreichten Stufe und ändert
  das Team, sobald du Typ und Stufe wählst — vorher aufgelistet, was sich
  ändern wird.

• Belohnungen und Herausforderungen — hole alle offenen Erfolgs-Belohnungen
  auf einmal ab und markiere Basis-, Monotyp-, Wochen- und Tages-Heraus­forderungen
  als geschafft, einzeln oder gruppenweise. Erfolge lassen sich auch von Hand
  umschalten.

• Karten-Editor — ändere den Typ jedes Knotens, angeboten werden nur die
  Typen, die der aktuelle Modus wirklich erzeugen kann: der Poké Mart des Turms
  taucht in einem Story-Run nicht auf, und Silver- oder Zerrwelt-Knoten nicht im
  Turm. Bei den ausgelassenen steht der Grund dabei.

• Vitamine — gib einem einzelnen Pokémon oder allen wählbaren Startern die
  maximale Menge Vitamine, für einen Wert oder für alle, im Rahmen der echten
  Obergrenzen des Spiels. Vitamine gelten für die gesamte Entwicklungsreihe,
  genau wie im Spiel.

• Freischaltungen — eine „Platin"-Übersicht mit dem Fortschritt jedes Bereichs
  (Erfolge, Pokédex, Schillernd-Dex, Mega-Entwicklungen, Starter, Legendäre,
  Herausforderungen) und Schaltflächen, um Fehlendes zu ergänzen – einzeln oder
  alles auf einmal.

• Backup — lege vor dem Bearbeiten eine Kopie deines Spielstands an und stelle
  sie wieder her, wann immer du zurück willst. Beim Wiederherstellen wird die
  Spielseite neu geladen, damit die laufende Sitzung die gerade
  zurückgeholten Daten nicht überschreibt. Spielst du mit einem
  synchronisierten Konto, wirst du gefragt, ob auch die Kopie auf dem Server
  zurückgesetzt werden soll oder ob die Wiederherstellung nur für diesen
  Browser gilt. Backups lassen sich außerdem als Datei exportieren und wieder
  importieren.

• Suche in jeder Liste — Passive, Starter, Erfolge, Herausforderungen, Items
  und Mega-Steine haben ein Suchfeld, das jede Sprache des Spiels versteht:
  „lucky egg“ findet das Glücks-Ei auch bei deutscher Oberfläche. Akzente und
  Großschreibung spielen keine Rolle, und auch die Nummer funktioniert.

• Sprachen — Oberfläche verfügbar auf Italienisch, Englisch, Spanisch,
  Französisch, Deutsch und Portugiesisch, sofort umschaltbar in den
  Einstellungen.

• Einstellungen — Sprache, vier Oberflächen-Designs und ein Zurücksetzen der
  Daten der Erweiterung.

SO FUNKTIONIERT ES

Die Erweiterung hat keinerlei Server. Wenn du das Fenster öffnest, während du
auf einem pokelike.xyz-Tab bist, liest sie die Spielstand-Schlüssel des Spiels
(poke_*, pkrl_*) aus dem localStorage der Seite, zeigt dir die Werte und
schreibt deine Änderungen in genau dieses localStorage zurück. Keine Daten
verlassen deinen Browser: kein Konto, kein Tracking, keine Werbung.

Die Liste der Ziele im Tab „Freischaltungen" wird in diesem Moment von der
Spielseite gelesen, nur lesend, damit sie mit den Aktualisierungen von
pokelike.xyz Schritt hält.

NETZWERKVERBINDUNGEN

Der einzige kontaktierte Host ist pokelike.xyz, und das ausschließlich, um die
Sprite-Bilder anzuzeigen – genau jene, die die Spielseite ohnehin schon lädt.
Keine externe API, keine entfernten Schriftarten, kein CDN, keine
personenbezogenen Daten übertragen.

HINWEISE

Kostenloses Open-Source-Projekt (MIT-Lizenz), weder mit pokelike.xyz, Nintendo,
Game Freak noch The Pokémon Company verbunden oder von ihnen unterstützt.
„Pokémon" sowie die zugehörigen Namen und Bilder gehören ihren jeweiligen
Eigentümern.

Nutze das Werkzeug für deinen eigenen Spielstand und auf eigene Gefahr: Das
Bearbeiten eines Spielstands kann ihn mit künftigen Updates des Spiels
unverträglich machen. Genau dafür hat die Erweiterung eine Backup-Funktion –
nutze sie vor größeren Änderungen.
```

---


# 🇵🇹 Português

**Titolo** (dal pacchetto, 33 caratteri)

> Pokélike Editor — Gestor de saves

**Riepilogo** (dal pacchetto, 97 caratteri)

> Edita o teu save local de pokelike.xyz: equipa, mochila, Pokédex, desbloqueios e backups. Grátis.

### Descrizione dettagliata — da incollare nel Dashboard (5420 caratteri)

```
O Pokélike Editor é uma ferramenta não oficial para quem joga o fangame de
navegador pokelike.xyz. Abre um painel que lê o save que o jogo guarda no
localStorage do teu navegador e permite editá-lo comodamente, sem teres de
mexer na consola de programador.

FUNCIONALIDADES

• Equipa — nível, PS atuais e máximos, estatísticas base, estado shiny, item
  equipado, pedra Mega e nível dos ataques de cada Pokémon, além de um botão
  para curar a equipa inteira. Dois atalhos tornam shiny todos os Pokémon que
  ainda não o são e levam ao nível máximo os ataques de toda a equipa.

• Mutações — os Pokémon mutantes do modo infinito têm um tipo extra além dos da
  forma base. Podes alterá-lo, acrescentá-lo ou removê-lo; o tipo mutado aparece
  destacado entre as etiquetas do Pokémon.

• Adicionar — insere qualquer Pokémon da Ger 1 à Ger 6, com pesquisa por nome ou
  número, filtro por geração e dois filtros de tipo combináveis em qualquer
  ordem: procurar Voador + Sombrio encontra também os Sombrio/Voador.

• Partida — Pokédólares, número de medalhas, mapa atual, modos Nuzlocke e
  infinito, mais um editor dos nós do mapa. Nos desafios e no modo infinito
  podes também escolher que itens passivos estão ativos, dentro dos espaços que
  o modo permite.

• Pedras Mega — atribui uma pedra Mega compatível a um membro da equipa ou
  guarda-a na mochila para mais tarde; a lista de pedras é lida do jogo, por
  isso está sempre atualizada. Incluindo as formas Mega que nenhuma pedra
  desbloqueia no jogo, como a X do Charizard: o editor reconstrói a pedra a
  partir dos dados do jogo (sem a habilidade Mega, que não existe para essas
  formas).

• Mochila — adiciona itens equipados respeitando os limites reais do jogo: 10
  espaços e um só exemplar de cada item.

• Traços da Torre — na Torre Infinita os traços dependem da equipa: tipos,
  estado shiny e mutação. O editor calcula-os com a fórmula do jogo, mostra o
  efeito de cada traço no nível alcançado e, escolhido um tipo e um nível,
  altera a equipa para lá chegar, listando primeiro o que vai mudar.

• Recompensas e desafios — resgata de uma vez os prémios de conquistas
  pendentes e marca como concluídos os desafios base, monotipo, semanais e
  diários, um a um ou por grupos. As conquistas também se alternam à mão.

• Editor do mapa — muda o tipo de cada nó, oferecendo apenas os que o modo em
  curso consegue mesmo gerar: o Poké Mart da Torre não aparece numa partida
  história, e os nós do Silver ou do Mundo Distorcido não aparecem na Torre.
  Dos excluídos é explicado o porquê.

• Vitaminas — dá o máximo de vitaminas a um só Pokémon ou a todos os iniciais
  selecionáveis, para uma estatística ou para todas, respeitando os limites
  reais do jogo. As vitaminas seguem a linha evolutiva, tal como no jogo.

• Desbloqueios — um painel "Platina" com o estado de conclusão de cada área
  (conquistas, Pokédex, Shiny Dex, Megaevoluções, iniciais, lendários, desafios)
  e botões para completar o que falta, um a um ou tudo de uma vez.

• Backups — cria uma cópia do save antes de o editares e restaura-a sempre que
  quiseres voltar atrás. O restauro recarrega a página do jogo para que a sessão
  em curso não sobrescreva os dados acabados de recuperar. Se jogas com uma
  conta sincronizada, é-te perguntado se queres reverter também a cópia no
  servidor ou limitar o restauro a este navegador. Também podes exportar um
  backup para ficheiro e voltar a importá-lo.

• Pesquisa em cada lista — passivos, iniciais, conquistas, desafios, itens e
  pedras Mega têm uma caixa de pesquisa que percebe todas as línguas do jogo:
  escrever "lucky egg" encontra o Ovo da Sorte mesmo com a interface em
  português. Acentos e maiúsculas não contam, e também se procura por número.

• Idiomas — interface disponível em italiano, inglês, espanhol, francês, alemão
  e português, com mudança imediata a partir das definições.

• Definições — idioma, quatro temas de interface e reposição dos dados da
  extensão.

COMO FUNCIONA

A extensão não tem servidor nenhum. Quando abres a janela estando num separador
de pokelike.xyz, lê as chaves de save do jogo (poke_*, pkrl_*) do localStorage
da página, mostra-te os valores e reescreve as tuas alterações nesse mesmo
localStorage. Nenhum dado sai do teu navegador: sem conta, sem rastreio, sem
publicidade.

O botão Sincronizar recarrega a página do jogo para que as alterações sejam
lidas de imediato e, se tinhas uma partida em curso, reabre-a no modo certo
(história, infinito ou desafio).

A lista de objetivos mostrada no separador Desbloqueios é lida da página do jogo
nesse momento, apenas para leitura, para se manter alinhada com as atualizações
de pokelike.xyz.

LIGAÇÕES DE REDE

O único host contactado é pokelike.xyz, e apenas para mostrar as imagens dos
sprites: exatamente as mesmas que a página do jogo já está a carregar. Sem API
externas, sem tipos de letra remotos, sem CDN, sem dados pessoais transmitidos.

NOTAS

Projeto gratuito e de código aberto (licença MIT), não afiliado nem aprovado por
pokelike.xyz, Nintendo, Game Freak ou The Pokémon Company. "Pokémon" e os nomes
e imagens relacionados pertencem aos respetivos proprietários.

Usa a ferramenta no teu próprio save e por tua conta e risco: editar um save
pode torná-lo incompatível com futuras atualizações do jogo. É por isso que a
extensão inclui uma função de backup — usa-a antes de fazeres alterações
importantes.
```

---
