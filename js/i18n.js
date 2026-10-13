// Traduzioni dell'interfaccia.
//
// Non si usa chrome.i18n perche' segue la lingua del browser e non permette
// all'utente di sceglierne un'altra dalle impostazioni dell'estensione.
//
// Ogni voce e' un array nell'ordine di LANGS: cosi' le sei lingue restano
// allineate e una traduzione mancante si vede a colpo d'occhio.

export const LANGS = ['it', 'en', 'es', 'fr', 'de', 'pt'];

export const LANG_NAMES = {
  it: 'Italiano',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português'
};

const LANG_KEY = 'poke_editor_lang';

//                                        it, en, es, fr, de, pt
const DICT = {
  // ── Intestazione e schede ──
  'app.subtitle': ['Gestore salvataggi', 'Save manager', 'Gestor de guardado', 'Gestionnaire de sauvegarde', 'Spielstand-Manager', 'Gestor de saves'],
  'header.sync': ['🔄 Sincronizza', '🔄 Sync', '🔄 Sincronizar', '🔄 Synchroniser', '🔄 Sync', '🔄 Sincronizar'],
  'tab.team': ['Squadra', 'Team', 'Equipo', 'Équipe', 'Team', 'Equipa'],
  'tab.add': ['Aggiungi', 'Add', 'Añadir', 'Ajouter', 'Neu', 'Adicionar'],
  'tab.run': ['Run', 'Run', 'Partida', 'Partie', 'Run', 'Partida'],
  'tab.bag': ['Zaino', 'Bag', 'Mochila', 'Sac', 'Beutel', 'Mochila'],
  'tab.vitamins': ['Vitamine', 'Vitamins', 'Vitaminas', 'Vitamines', 'Vitamine', 'Vitaminas'],
  'tab.unlocks': ['Sblocchi', 'Unlocks', 'Extras', 'Extras', 'Extras', 'Extras'],
  'tab.donate': ['Dona', 'Donate', 'Donar', 'Don', 'Spenden', 'Doar'],
  'tab.settings': ['Opzioni', 'Settings', 'Ajustes', 'Réglages', 'Optionen', 'Opções'],

  // ── Stato ──
  'status.waiting': ['In attesa di connessione...', 'Waiting for connection...', 'Esperando conexión...', 'En attente de connexion...', 'Warte auf Verbindung...', 'A aguardar ligação...'],
  'status.syncing': ['Sincronizzazione in corso...', 'Syncing...', 'Sincronizando...', 'Synchronisation...', 'Synchronisierung...', 'A sincronizar...'],
  'status.reloadingGame': ['Ricaricamento del gioco...', 'Reloading the game...', 'Recargando el juego...', 'Rechargement du jeu...', 'Spiel wird neu geladen...', 'A recarregar o jogo...'],
  'status.resuming': ['Ripresa della run...', 'Resuming the run...', 'Reanudando la partida...', 'Reprise de la partie...', 'Run wird fortgesetzt...', 'A retomar a partida...'],
  'status.resumed': ['✅ Run ripresa: puoi continuare a giocare', '✅ Run resumed: you can keep playing', '✅ Partida reanudada: puedes seguir jugando', '✅ Partie reprise : vous pouvez continuer à jouer', '✅ Run fortgesetzt: du kannst weiterspielen', '✅ Partida retomada: podes continuar a jogar'],
  'header.syncTitle': [
    'Ricarica la pagina del gioco e rilegge il salvataggio, così le modifiche fatte qui vengono applicate',
    'Reloads the game page and re-reads the save, so the changes made here take effect',
    'Recarga la página del juego y vuelve a leer la partida, para que los cambios hechos aquí se apliquen',
    'Recharge la page du jeu et relit la sauvegarde, pour que les modifications faites ici prennent effet',
    'Lädt die Spielseite neu und liest den Spielstand erneut, damit die hier gemachten Änderungen wirksam werden',
    'Recarrega a página do jogo e relê o save, para que as alterações feitas aqui sejam aplicadas'
  ],
  'status.openSite': ['⚠ Apri pokelike.xyz per iniziare', '⚠ Open pokelike.xyz to start', '⚠ Abre pokelike.xyz para empezar', '⚠ Ouvrez pokelike.xyz pour commencer', '⚠ Öffne pokelike.xyz zum Starten', '⚠ Abre pokelike.xyz para começar'],
  'status.openSiteAction': ['Apri pokelike.xyz per continuare', 'Open pokelike.xyz to continue', 'Abre pokelike.xyz para continuar', 'Ouvrez pokelike.xyz pour continuer', 'Öffne pokelike.xyz, um fortzufahren', 'Abre pokelike.xyz para continuar'],
  'status.readFail': ['❌ Impossibile leggere il salvataggio', '❌ Could not read the save', '❌ No se pudo leer la partida guardada', '❌ Impossible de lire la sauvegarde', '❌ Spielstand konnte nicht gelesen werden', '❌ Não foi possível ler o save'],
  'status.noRun': ['⚠ Nessuna partita attiva', '⚠ No active run', '⚠ No hay partida activa', '⚠ Aucune partie en cours', '⚠ Kein aktiver Run', '⚠ Nenhuma partida ativa'],
  'status.loaded': ['✅ Partita caricata · {n} Pokémon', '✅ Run loaded · {n} Pokémon', '✅ Partida cargada · {n} Pokémon', '✅ Partie chargée · {n} Pokémon', '✅ Run geladen · {n} Pokémon', '✅ Partida carregada · {n} Pokémon'],
  'status.readErr': ['❌ Errore lettura dati: {msg}', '❌ Error reading data: {msg}', '❌ Error al leer los datos: {msg}', '❌ Erreur de lecture des données : {msg}', '❌ Fehler beim Lesen der Daten: {msg}', '❌ Erro ao ler os dados: {msg}'],
  'status.saving': ['Salvataggio in corso...', 'Saving...', 'Guardando...', 'Enregistrement...', 'Speichern...', 'A guardar...'],
  'status.saved': ['✅ Modifiche salvate in tempo reale', '✅ Changes saved live', '✅ Cambios guardados al instante', '✅ Modifications enregistrées en direct', '✅ Änderungen live gespeichert', '✅ Alterações guardadas em tempo real'],
  'status.noResponse': ['Nessuna risposta dalla pagina', 'No response from the page', 'Sin respuesta de la página', 'Aucune réponse de la page', 'Keine Antwort von der Seite', 'Sem resposta da página'],

  // ── Comuni ──
  'common.cancel': ['Annulla', 'Cancel', 'Cancelar', 'Annuler', 'Abbrechen', 'Cancelar'],
  'common.delete': ['Elimina', 'Delete', 'Eliminar', 'Supprimer', 'Löschen', 'Eliminar'],
  'common.add': ['Aggiungi', 'Add', 'Añadir', 'Ajouter', 'Hinzufügen', 'Adicionar'],
  'common.none': ['Nessuno', 'None', 'Ninguno', 'Aucun', 'Keins', 'Nenhum'],
  'common.noneF': ['Nessuna', 'None', 'Ninguna', 'Aucune', 'Keine', 'Nenhuma'],
  'common.unlock': ['Sblocca', 'Unlock', 'Desbloquear', 'Débloquer', 'Freischalten', 'Desbloquear'],
  'common.complete': ['Completa', 'Complete', 'Completar', 'Compléter', 'Abschließen', 'Completar'],
  'common.apply': ['Applica', 'Apply', 'Aplicar', 'Appliquer', 'Anwenden', 'Aplicar'],

  // ── Tratti forzati ──
  'forced.title': ['Tratti forzati', 'Forced traits', 'Rasgos forzados', 'Traits forcés', 'Erzwungene Talente', 'Traços forçados'],
  'forced.hint': [
    'I tier dei tratti non stanno nel salvataggio: il gioco li ricalcola dalla squadra prima di ogni lotta. Per imporli senza toccare la squadra, l’estensione modifica quel calcolo nella pagina del gioco finché questa funzione resta accesa. Si possono superare i 12, ma alcuni tratti hanno un tetto proprio e oltre quello smettono di crescere.',
    'Trait tiers are not in the save: the game recomputes them from your team before every fight. To force them without touching your team, the extension changes that computation inside the game page for as long as this is on. You can go past 12, but some traits have their own cap and stop growing beyond it.',
    'Los niveles de rasgo no están en la partida: el juego los recalcula desde tu equipo antes de cada combate. Para imponerlos sin tocar el equipo, la extensión modifica ese cálculo dentro de la página del juego mientras esto esté activo. Se puede pasar de 12, pero algunos rasgos tienen su propio tope.',
    'Les paliers de traits ne sont pas dans la sauvegarde : le jeu les recalcule depuis votre équipe avant chaque combat. Pour les imposer sans toucher à l’équipe, l’extension modifie ce calcul dans la page du jeu tant que ceci est activé. On peut dépasser 12, mais certains traits ont leur propre plafond.',
    'Talentstufen stehen nicht im Spielstand: Das Spiel berechnet sie vor jedem Kampf neu aus deinem Team. Um sie ohne Änderung am Team zu erzwingen, verändert die Erweiterung diese Berechnung in der Spielseite, solange dies aktiv ist. Über 12 ist möglich, doch manche Talente haben eine eigene Obergrenze.',
    'Os níveis dos traços não estão no save: o jogo recalcula-os a partir da equipa antes de cada luta. Para os impor sem mexer na equipa, a extensão altera esse cálculo dentro da página do jogo enquanto isto estiver ligado. Dá para passar dos 12, mas alguns traços têm limite próprio.'
  ],
  'forced.enable': [
    'Attiva i tratti forzati (modifica il gioco nella pagina, finché resta acceso)',
    'Turn on forced traits (changes the game in the page, while it stays on)',
    'Activar los rasgos forzados (modifica el juego en la página mientras esté activo)',
    'Activer les traits forcés (modifie le jeu dans la page tant que c’est actif)',
    'Erzwungene Talente einschalten (ändert das Spiel in der Seite, solange aktiv)',
    'Ligar os traços forçados (altera o jogo na página enquanto estiver ligado)'
  ],
  'forced.on': ['Attivi', 'On', 'Activos', 'Actifs', 'Aktiv', 'Ativos'],
  'forced.off': ['Spenti', 'Off', 'Apagados', 'Inactifs', 'Aus', 'Desligados'],
  'forced.none': ['Nessun tratto forzato.', 'No forced traits.', 'Sin rasgos forzados.', 'Aucun trait forcé.', 'Keine erzwungenen Talente.', 'Sem traços forçados.'],
  'forced.beyond': ['oltre il limite del gioco', 'beyond the game’s cap', 'por encima del tope del juego', 'au-delà du plafond du jeu', 'über der Grenze des Spiels', 'acima do limite do jogo'],
  'forced.clear': ['Togli tutti i tratti forzati', 'Clear all forced traits', 'Quitar todos los rasgos forzados', 'Tout effacer', 'Alle erzwungenen Talente löschen', 'Limpar todos os traços forçados'],
  'forced.reloadNote': [
    'Dopo aver acceso o spento questa funzione ricarica la pagina del gioco (o usa Sincronizza): lo script entra in azione al caricamento.',
    'After turning this on or off, reload the game page (or use Sync): the script takes effect on page load.',
    'Tras activarlo o desactivarlo, recarga la página del juego (o usa Sincronizar): el script actúa al cargar.',
    'Après l’activation ou la désactivation, rechargez la page du jeu (ou utilisez Synchroniser) : le script agit au chargement.',
    'Nach dem Ein- oder Ausschalten die Spielseite neu laden (oder Sync benutzen): Das Skript greift beim Laden.',
    'Depois de ligares ou desligares, recarrega a página do jogo (ou usa Sincronizar): o script atua no carregamento.'
  ],
  'forced.turnedOn': [
    'Tratti forzati attivi. Ricarica la pagina del gioco.',
    'Forced traits on. Reload the game page.',
    'Rasgos forzados activos. Recarga la página del juego.',
    'Traits forcés activés. Rechargez la page du jeu.',
    'Erzwungene Talente aktiv. Lade die Spielseite neu.',
    'Traços forçados ativos. Recarrega a página do jogo.'
  ],
  'forced.turnedOff': [
    'Tratti forzati spenti: il gioco torna a calcolarli dalla squadra.',
    'Forced traits off: the game goes back to computing them from your team.',
    'Rasgos forzados apagados: el juego vuelve a calcularlos desde el equipo.',
    'Traits forcés désactivés : le jeu les recalcule depuis l’équipe.',
    'Erzwungene Talente aus: Das Spiel berechnet sie wieder aus dem Team.',
    'Traços forçados desligados: o jogo volta a calculá-los pela equipa.'
  ],
  'forced.set': ['{type} forzato al tier {n}.', '{type} forced to tier {n}.', '{type} forzado al nivel {n}.', '{type} forcé au palier {n}.', '{type} auf Stufe {n} erzwungen.', '{type} forçado ao nível {n}.'],
  'forced.removed': ['{type} non è più forzato.', '{type} is no longer forced.', '{type} ya no está forzado.', '{type} n’est plus forcé.', '{type} wird nicht mehr erzwungen.', '{type} já não está forçado.'],
  'forced.cleared': ['Tratti forzati rimossi.', 'Forced traits cleared.', 'Rasgos forzados eliminados.', 'Traits forcés effacés.', 'Erzwungene Talente entfernt.', 'Traços forçados removidos.'],
  'forced.hudTitle': ['Tratti forzati', 'Forced traits', 'Rasgos forzados', 'Traits forcés', 'Erzwungene Talente', 'Traços forçados'],
  'forced.hudShow': [
    'Mostra il riquadro nella pagina del gioco (trascinabile)',
    'Show the panel in the game page (draggable)',
    'Mostrar el recuadro en la página del juego (arrastrable)',
    'Afficher l’encart dans la page du jeu (déplaçable)',
    'Das Feld in der Spielseite anzeigen (verschiebbar)',
    'Mostrar o quadro na página do jogo (arrastável)'
  ],
  'forced.hudHide': ['Nascondi', 'Hide', 'Ocultar', 'Masquer', 'Ausblenden', 'Ocultar'],
  'forced.hudDrag': ['Trascina per spostare', 'Drag to move', 'Arrastra para mover', 'Glisser pour déplacer', 'Zum Verschieben ziehen', 'Arrasta para mover'],
  'forced.hudShown': [
    'Riquadro mostrato nella pagina del gioco.', 'Panel shown in the game page.',
    'Recuadro mostrado en la página del juego.', 'Encart affiché dans la page du jeu.',
    'Feld in der Spielseite angezeigt.', 'Quadro mostrado na página do jogo.'
  ],
  'forced.hudHidden': [
    'Riquadro nascosto. Puoi rimostrarlo da qui.', 'Panel hidden. You can show it again from here.',
    'Recuadro oculto. Puedes volver a mostrarlo desde aquí.', 'Encart masqué. Vous pouvez le réafficher d’ici.',
    'Feld ausgeblendet. Du kannst es hier wieder einblenden.', 'Quadro oculto. Podes voltar a mostrá-lo daqui.'
  ],
  'forced.hudReset': [
    'Riporta il riquadro in alto a destra', 'Move the panel back to the top right',
    'Devolver el recuadro arriba a la derecha', 'Remettre l’encart en haut à droite',
    'Feld zurück nach oben rechts', 'Repor o quadro no canto superior direito'
  ],
  'forced.hudMoved': [
    'Riquadro riportato in alto a destra.', 'Panel moved back to the top right.',
    'Recuadro devuelto arriba a la derecha.', 'Encart remis en haut à droite.',
    'Feld nach oben rechts zurückgesetzt.', 'Quadro reposto no canto superior direito.'
  ],

  // ── Caselle di ricerca ──
  'search.passives': [
    'Cerca un oggetto passivo...', 'Search a passive item...', 'Busca un objeto pasivo...',
    'Rechercher un objet passif...', 'Passives Item suchen...', 'Procura um item passivo...'
  ],
  'search.items': [
    'Cerca uno strumento o una megapietra...', 'Search an item or Mega Stone...',
    'Busca un objeto o megapiedra...', 'Rechercher un objet ou une Méga-Gemme...',
    'Item oder Mega-Stein suchen...', 'Procura um item ou pedra Mega...'
  ],
  'search.starters': [
    'Cerca per nome o numero...', 'Search by name or number...', 'Busca por nombre o número...',
    'Rechercher par nom ou numéro...', 'Nach Name oder Nummer suchen...', 'Procura por nome ou número...'
  ],
  'search.achievements': [
    'Cerca un obiettivo...', 'Search an achievement...', 'Busca un logro...',
    'Rechercher un succès...', 'Erfolg suchen...', 'Procura uma conquista...'
  ],
  'search.challenges': [
    'Cerca una sfida...', 'Search a challenge...', 'Busca un desafío...',
    'Rechercher un défi...', 'Herausforderung suchen...', 'Procura um desafio...'
  ],
  'search.megas': [
    'Cerca una megaevoluzione...', 'Search a Mega Evolution...', 'Busca una megaevolución...',
    'Rechercher une Méga-Évolution...', 'Mega-Entwicklung suchen...', 'Procura uma Megaevolução...'
  ],
  'search.noResults': [
    'Nessun risultato per «{q}».', 'No results for “{q}”.', 'Sin resultados para «{q}».',
    'Aucun résultat pour « {q} ».', 'Keine Treffer für „{q}“.', 'Sem resultados para «{q}».'
  ],
  'search.hint': [
    'La ricerca capisce ogni lingua che il gioco conosce: scrivi il nome in italiano, in inglese o come lo vedi in partita.',
    'Search understands every language the game knows: type the name in English or as you see it in game.',
    'La búsqueda entiende todos los idiomas que el juego conoce: escribe el nombre en español, en inglés o como lo ves en la partida.',
    'La recherche comprend toutes les langues que le jeu connaît : tapez le nom en français, en anglais ou tel qu’il apparaît dans le jeu.',
    'Die Suche versteht jede Sprache, die das Spiel kennt: Tippe den Namen auf Deutsch, auf Englisch oder so, wie er im Spiel steht.',
    'A pesquisa percebe todas as línguas que o jogo conhece: escreve o nome em português, em inglês ou como o vê no jogo.'
  ],

  // ── Nodi della mappa ──
  'node.start': ['Partenza', 'Start', 'Inicio', 'Départ', 'Start', 'Início'],
  'node.battle': ['Lotta', 'Battle', 'Combate', 'Combat', 'Kampf', 'Luta'],
  'node.trainer': ['Allenatore', 'Trainer', 'Entrenador', 'Dresseur', 'Trainer', 'Treinador'],
  'node.catch': ['Cattura', 'Catch', 'Captura', 'Capture', 'Fangen', 'Captura'],
  'node.item': ['Strumento', 'Item', 'Objeto', 'Objet', 'Item', 'Item'],
  'node.question': ['Domanda', 'Question', 'Pregunta', 'Question', 'Frage', 'Pergunta'],
  'node.pokecenter': ['Centro Pokémon', 'Poké Center', 'Centro Pokémon', 'Centre Pokémon', 'Pokémon-Center', 'Centro Pokémon'],
  'node.move_tutor': ['Insegnamosse', 'Move Tutor', 'Maestro de Movimientos', 'Maître des Capacités', 'Attacken-Lehrer', 'Mestre de Ataques'],
  'node.trade': ['Scambio', 'Trade', 'Intercambio', 'Échange', 'Tausch', 'Troca'],
  'node.boss': ['Capopalestra', 'Boss', 'Líder', 'Champion', 'Arenaleiter', 'Líder'],
  'node.legendary': ['Leggendario', 'Legendary', 'Legendario', 'Légendaire', 'Legendär', 'Lendário'],
  'node.mutation': ['Mutazione', 'Mutation', 'Mutación', 'Mutation', 'Mutation', 'Mutação'],
  'node.pokemart': ['Poké Mart', 'Poké Mart', 'Poké Mart', 'Poké Mart', 'Poké Mart', 'Poké Mart'],
  'node.evilteam': ['Squadra cattiva', 'Evil Team', 'Equipo malvado', 'Équipe ennemie', 'Böses Team', 'Equipa vilã'],
  'node.silver': ['Silver', 'Silver', 'Silver', 'Silver', 'Silver', 'Silver'],
  'node.magma': ['Team Magma', 'Team Magma', 'Equipo Magma', 'Team Magma', 'Team Magma', 'Equipa Magma'],
  'node.aqua': ['Team Aqua', 'Team Aqua', 'Equipo Aqua', 'Team Aqua', 'Team Aqua', 'Equipa Aqua'],
  'node.underground': ['Sottosuolo', 'Underground', 'Subsuelo', 'Souterrain', 'Untergrund', 'Subsolo'],
  'node.distortion': ['Mondo Distorto', 'Distortion World', 'Mundo Distorsión', 'Monde Distorsion', 'Zerrwelt', 'Mundo Distorcido'],
  'node.rival_n': ['Rivale N', 'Rival N', 'Rival N', 'Rival N', 'Rivale N', 'Rival N'],
  'node.reward': ['Ricompensa', 'Reward', 'Recompensa', 'Récompense', 'Belohnung', 'Recompensa'],
  'node.subexit': ['Uscita', 'Exit', 'Salida', 'Sortie', 'Ausgang', 'Saída'],

  'nodeGroup.common': ['Nodi comuni', 'Common nodes', 'Nodos comunes', 'Nœuds communs', 'Normale Knoten', 'Nós comuns'],
  'nodeGroup.structural': ['Struttura', 'Structure', 'Estructura', 'Structure', 'Struktur', 'Estrutura'],
  'nodeGroup.tower': ['Solo Torre', 'Tower only', 'Solo Torre', 'Tour uniquement', 'Nur Turm', 'Só Torre'],
  'nodeGroup.story': ['Solo storia', 'Story only', 'Solo historia', 'Histoire uniquement', 'Nur Story', 'Só história'],
  'nodeGroup.submap': ['Sotto-mappa', 'Sub-map', 'Submapa', 'Sous-carte', 'Unterkarte', 'Submapa'],

  'map.layer': ['Livello {n}', 'Layer {n}', 'Nivel {n}', 'Niveau {n}', 'Ebene {n}', 'Nível {n}'],
  'map.layerFixed': ['Livello {n} (fisso)', 'Layer {n} (fixed)', 'Nivel {n} (fijo)', 'Niveau {n} (fixe)', 'Ebene {n} (fest)', 'Nível {n} (fixo)'],
  'map.contextTower': [
    'Torre, mappa {n}. Sono elencati solo i nodi che la Torre può generare a questo punto.',
    'Tower, map {n}. Only the nodes the Tower can generate at this point are listed.',
    'Torre, mapa {n}. Solo se listan los nodos que la Torre puede generar en este punto.',
    'Tour, carte {n}. Seuls les nœuds que la Tour peut générer à ce stade sont listés.',
    'Turm, Karte {n}. Aufgelistet sind nur die Knoten, die der Turm hier erzeugen kann.',
    'Torre, mapa {n}. Só se listam os nós que a Torre pode gerar neste ponto.'
  ],
  'map.contextStory': [
    'Run storia, mappa {n}. I nodi esclusivi della Torre non compaiono.',
    'Story run, map {n}. Tower-only nodes are not listed.',
    'Partida historia, mapa {n}. Los nodos exclusivos de la Torre no aparecen.',
    'Partie histoire, carte {n}. Les nœuds propres à la Tour n’apparaissent pas.',
    'Story-Run, Karte {n}. Turm-exklusive Knoten erscheinen nicht.',
    'Partida história, mapa {n}. Os nós exclusivos da Torre não aparecem.'
  ],
  'map.contextSubmap': [
    'Sotto-mappa: qui vivono i nodi ricompensa e l’uscita.',
    'Sub-map: this is where reward nodes and the exit live.',
    'Submapa: aquí están los nodos de recompensa y la salida.',
    'Sous-carte : c’est ici que vivent les nœuds récompense et la sortie.',
    'Unterkarte: Hier liegen die Belohnungsknoten und der Ausgang.',
    'Submapa: é aqui que vivem os nós de recompensa e a saída.'
  ],
  'map.foreignNode': [
    'Questo nodo ha un tipo che la modalità attuale non genera.',
    'This node has a type the current mode does not generate.',
    'Este nodo tiene un tipo que el modo actual no genera.',
    'Ce nœud a un type que le mode actuel ne génère pas.',
    'Dieser Knoten hat einen Typ, den der aktuelle Modus nicht erzeugt.',
    'Este nó tem um tipo que o modo atual não gera.'
  ],
  'map.hiddenTypes': [
    '{n} tipi non disponibili qui — perché?', '{n} types not available here — why?',
    '{n} tipos no disponibles aquí — ¿por qué?', '{n} types indisponibles ici — pourquoi ?',
    '{n} Typen hier nicht verfügbar — warum?', '{n} tipos indisponíveis aqui — porquê?'
  ],
  'map.why.towerOnly': ['solo nella Torre', 'Tower only', 'solo en la Torre', 'Tour uniquement', 'nur im Turm', 'só na Torre'],
  'map.why.lateTower': [
    'nella Torre solo dalla mappa 31', 'in the Tower only from map 31 on',
    'en la Torre solo desde el mapa 31', 'dans la Tour à partir de la carte 31',
    'im Turm erst ab Karte 31', 'na Torre só a partir do mapa 31'
  ],
  'map.why.storyOnly': ['solo fuori dalla Torre', 'outside the Tower only', 'solo fuera de la Torre', 'hors de la Tour uniquement', 'nur außerhalb des Turms', 'só fora da Torre'],
  'map.why.wrongGen': [
    'solo nelle run di un’altra generazione', 'only in runs of another generation',
    'solo en partidas de otra generación', 'seulement dans les parties d’une autre génération',
    'nur in Runs einer anderen Generation', 'só em partidas de outra geração'
  ],
  'map.why.wrongMap': ['su altre mappe', 'on other maps', 'en otros mapas', 'sur d’autres cartes', 'auf anderen Karten', 'noutros mapas'],
  'map.why.submapOnly': ['solo nelle sotto-mappe', 'in sub-maps only', 'solo en submapas', 'dans les sous-cartes uniquement', 'nur in Unterkarten', 'só em submapas'],
  'map.why.unknown': ['non disponibile qui', 'not available here', 'no disponible aquí', 'indisponible ici', 'hier nicht verfügbar', 'indisponível aqui'],
  'map.nodeChanged': ['{id} → {type}', '{id} → {type}', '{id} → {type}', '{id} → {type}', '{id} → {type}', '{id} → {type}'],

  // ── Ricompense degli obiettivi ──
  'rewards.title': ['Ricompense degli obiettivi', 'Achievement rewards', 'Recompensas de logros', 'Récompenses des succès', 'Erfolgs-Belohnungen', 'Recompensas de conquistas'],
  'rewards.hint': [
    'Gli obiettivi già sbloccati pagano in PokéDollari, ma il premio resta in sospeso finché non lo riscuoti. Il conto lo fa il gioco.',
    'Achievements you have already unlocked pay out PokéDollars, but the reward stays pending until you claim it. The game does the maths.',
    'Los logros ya desbloqueados pagan PokéDólares, pero el premio queda pendiente hasta que lo reclamas. La cuenta la hace el juego.',
    'Les succès déjà débloqués rapportent des Pokédollars, mais la récompense reste en attente tant que vous ne la réclamez pas. C’est le jeu qui calcule.',
    'Bereits freigeschaltete Erfolge zahlen Pokédollar aus, doch die Belohnung bleibt offen, bis du sie abholst. Das Rechnen übernimmt das Spiel.',
    'As conquistas já desbloqueadas pagam PokéDólares, mas o prémio fica pendente até o reclamares. As contas fá-las o jogo.'
  ],
  'rewards.pending': ['Da riscuotere', 'Pending', 'Por reclamar', 'À réclamer', 'Offen', 'Por reclamar'],
  'rewards.nothing': ['Niente in sospeso', 'Nothing pending', 'Nada pendiente', 'Rien en attente', 'Nichts offen', 'Nada pendente'],
  'rewards.amount': ['{n} obiettivi · {m} PokéDollari', '{n} achievements · {m} PokéDollars', '{n} logros · {m} PokéDólares', '{n} succès · {m} Pokédollars', '{n} Erfolge · {m} Pokédollar', '{n} conquistas · {m} PokéDólares'],
  'rewards.claim': ['Riscuoti', 'Claim', 'Reclamar', 'Réclamer', 'Abholen', 'Reclamar'],
  'rewards.claimed': ['Riscossi {n} PokéDollari.', 'Claimed {n} PokéDollars.', 'Reclamados {n} PokéDólares.', '{n} Pokédollars réclamés.', '{n} Pokédollar abgeholt.', 'Reclamados {n} PokéDólares.'],
  'rewards.unavailable': [
    'Il gioco non espone la riscossione: apri pokelike.xyz e riprova.',
    'The game does not expose claiming: open pokelike.xyz and try again.',
    'El juego no expone el cobro: abre pokelike.xyz e inténtalo de nuevo.',
    'Le jeu n’expose pas la collecte : ouvrez pokelike.xyz et réessayez.',
    'Das Spiel bietet das Abholen nicht an: Öffne pokelike.xyz und versuche es erneut.',
    'O jogo não expõe o resgate: abre pokelike.xyz e tenta de novo.'
  ],

  // ── Sfide ──
  'chal.title': ['Sfide', 'Challenges', 'Desafíos', 'Défis', 'Herausforderungen', 'Desafios'],
  'chal.hint': [
    'Clicca una sfida per segnarla come completata o riportarla da fare. Settimanale e giornaliera aggiornano anche i contatori che il gioco tiene a parte.',
    'Click a challenge to mark it cleared or set it back to pending. Weekly and daily also update the counters the game keeps separately.',
    'Haz clic en un desafío para marcarlo completado o volver a dejarlo pendiente. El semanal y el diario también actualizan los contadores que el juego lleva aparte.',
    'Cliquez sur un défi pour le marquer terminé ou le remettre à faire. L’hebdomadaire et le quotidien mettent aussi à jour les compteurs que le jeu tient à part.',
    'Klicke eine Herausforderung an, um sie als geschafft zu markieren oder wieder offen zu setzen. Wöchentlich und täglich aktualisieren auch die Zähler, die das Spiel getrennt führt.',
    'Clica num desafio para o marcares como concluído ou voltares a deixá-lo por fazer. O semanal e o diário atualizam também os contadores que o jogo guarda à parte.'
  ],
  'chal.base': ['Sfide base', 'Base challenges', 'Desafíos base', 'Défis de base', 'Basis-Herausforderungen', 'Desafios base'],
  'chal.monotype': ['Monotipo', 'Monotype', 'Monotipo', 'Mono-type', 'Monotyp', 'Monotipo'],
  'chal.weekly': ['Settimanale: {name}', 'Weekly: {name}', 'Semanal: {name}', 'Hebdomadaire : {name}', 'Wöchentlich: {name}', 'Semanal: {name}'],
  'chal.daily': ['Giornaliere', 'Daily', 'Diarios', 'Quotidiens', 'Täglich', 'Diários'],
  'chal.completeGroup': ['Completa {n}', 'Complete {n}', 'Completar {n}', 'Compléter {n}', '{n} abschließen', 'Completar {n}'],
  'chal.groupDone': ['Completo', 'Done', 'Completo', 'Terminé', 'Fertig', 'Completo'],
  'chal.groupCompleted': ['{name}: {n} sfide completate.', '{name}: {n} challenges completed.', '{name}: {n} desafíos completados.', '{name} : {n} défis terminés.', '{name}: {n} Herausforderungen abgeschlossen.', '{name}: {n} desafios concluídos.'],
  'chal.marked': ['{name} segnata come completata.', '{name} marked as cleared.', '{name} marcado como completado.', '{name} marqué comme terminé.', '{name} als geschafft markiert.', '{name} marcado como concluído.'],
  'chal.unmarked': ['{name} riportata da fare.', '{name} set back to pending.', '{name} vuelve a estar pendiente.', '{name} remis à faire.', '{name} wieder auf offen gesetzt.', '{name} voltou a ficar por fazer.'],

  // ── Tratti della Torre ──
  'traits.title': ['Tratti della Torre', 'Tower traits', 'Rasgos de la Torre', 'Traits de la Tour', 'Turm-Talente', 'Traços da Torre'],
  'traits.hint': [
    'I tratti non si salvano: il gioco li ricalcola dalla squadra prima di ogni lotta. Contano i tipi dei tuoi Pokémon, lo stato shiny e la mutazione. Scegli un tipo e un tier: l’editor cambia la squadra di conseguenza.',
    'Traits are not stored: the game recomputes them from your team before every fight. What counts is your Pokémon’s types, shiny status and mutation. Pick a type and a tier and the editor changes the team accordingly.',
    'Los rasgos no se guardan: el juego los recalcula desde tu equipo antes de cada combate. Cuentan los tipos de tus Pokémon, el estado variocolor y la mutación. Elige un tipo y un nivel y el editor ajusta el equipo.',
    'Les traits ne sont pas sauvegardés : le jeu les recalcule depuis votre équipe avant chaque combat. Ce qui compte, ce sont les types de vos Pokémon, leur état chromatique et leur mutation. Choisissez un type et un palier, l’éditeur ajuste l’équipe.',
    'Talente werden nicht gespeichert: Das Spiel berechnet sie vor jedem Kampf neu aus deinem Team. Es zählen die Typen deiner Pokémon, der Schillernd-Status und die Mutation. Wähle Typ und Stufe, der Editor passt das Team an.',
    'Os traços não são guardados: o jogo recalcula-os a partir da tua equipa antes de cada luta. Contam os tipos dos teus Pokémon, o estado shiny e a mutação. Escolhe um tipo e um nível e o editor ajusta a equipa.'
  ],
  'traits.notEndless': [
    'Questa run non è in modalità Torre: i tratti non hanno effetto.',
    'This run is not in Tower mode: traits have no effect.',
    'Esta partida no está en modo Torre: los rasgos no tienen efecto.',
    'Cette partie n’est pas en mode Tour : les traits n’ont aucun effet.',
    'Dieser Run ist nicht im Turm-Modus: Talente haben keine Wirkung.',
    'Esta partida não está no modo Torre: os traços não têm efeito.'
  ],
  'traits.none': ['Nessun tratto attivo.', 'No active traits.', 'Sin rasgos activos.', 'Aucun trait actif.', 'Keine aktiven Talente.', 'Sem traços ativos.'],
  'traits.tierN': ['Tier {n}/{m}', 'Tier {n}/{m}', 'Nivel {n}/{m}', 'Palier {n}/{m}', 'Stufe {n}/{m}', 'Nível {n}/{m}'],
  'traits.tierZero': ['Nessuno', 'None', 'Ninguno', 'Aucun', 'Keine', 'Nenhum'],
  'traits.points': ['{n} pt', '{n} pt', '{n} pt', '{n} pt', '{n} Pkt', '{n} pt'],
  'traits.outOfReach': ['(fuori portata)', '(out of reach)', '(fuera de alcance)', '(hors de portée)', '(nicht erreichbar)', '(fora de alcance)'],
  'traits.ceiling': [
    'Con questa squadra arrivi al tier {n} di {m}. Per salire ancora servono più membri con quel tipo, o il passivo Squadra Rimescolata.',
    'With this team you can reach tier {n} of {m}. Going higher needs more members of that type, or the Team Reroll passive.',
    'Con este equipo llegas al nivel {n} de {m}. Para subir más hacen falta más miembros de ese tipo, o el pasivo Reroll de Equipo.',
    'Avec cette équipe vous atteignez le palier {n} sur {m}. Pour monter plus haut il faut plus de membres de ce type, ou le passif Équipe Relancée.',
    'Mit diesem Team erreichst du Stufe {n} von {m}. Höher geht es nur mit mehr Mitgliedern dieses Typs oder dem Passiv Team-Neuauslosung.',
    'Com esta equipa chegas ao nível {n} de {m}. Para subir mais precisas de mais membros desse tipo, ou do passivo Reroll de Equipa.'
  ],
  'traits.alreadyThere': ['Il tier richiesto c’è già.', 'That tier is already reached.', 'Ese nivel ya está alcanzado.', 'Ce palier est déjà atteint.', 'Diese Stufe ist bereits erreicht.', 'Esse nível já está alcançado.'],
  'traits.planHead': [
    'Verranno applicate {n} modifiche:', '{n} changes will be applied:', 'Se aplicarán {n} cambios:',
    '{n} modifications seront appliquées :', 'Es werden {n} Änderungen angewendet:', 'Serão aplicadas {n} alterações:'
  ],
  'traits.planShort': [
    'Si arriva solo al tier {n}, non a {m}. Modifiche previste:',
    'This only reaches tier {n}, not {m}. Planned changes:',
    'Solo se llega al nivel {n}, no a {m}. Cambios previstos:',
    'On n’atteint que le palier {n}, pas {m}. Modifications prévues :',
    'Damit wird nur Stufe {n} erreicht, nicht {m}. Geplante Änderungen:',
    'Só se chega ao nível {n}, não a {m}. Alterações previstas:'
  ],
  'traits.changeShiny': ['{name} diventa shiny', '{name} becomes shiny', '{name} pasa a variocolor', '{name} devient chromatique', '{name} wird schillernd', '{name} passa a shiny'],
  'traits.changeMutate': ['{name} muta su {type}', '{name} mutates to {type}', '{name} muta a {type}', '{name} mute en {type}', '{name} mutiert zu {type}', '{name} muta para {type}'],
  'traits.changeMark': [
    '{name} viene marcato mutante su {type}', '{name} is marked as a {type} mutant',
    '{name} queda marcado como mutante de {type}', '{name} est marqué mutant {type}',
    '{name} wird als {type}-Mutant markiert', '{name} fica marcado como mutante de {type}'
  ],
  'traits.changeRemutate': [
    '{name} cambia mutazione da {from} a {type}', '{name} changes mutation from {from} to {type}',
    '{name} cambia la mutación de {from} a {type}', '{name} change sa mutation de {from} en {type}',
    '{name} wechselt die Mutation von {from} zu {type}', '{name} muda a mutação de {from} para {type}'
  ],
  'traits.applied': [
    '{type} portato al tier {n}.', '{type} raised to tier {n}.', '{type} subido al nivel {n}.',
    '{type} porté au palier {n}.', '{type} auf Stufe {n} gebracht.', '{type} elevado ao nível {n}.'
  ],

  // ── Vitamine ──
  'vit.title': ['Vitamine', 'Vitamins', 'Vitaminas', 'Vitamines', 'Vitamine', 'Vitaminas'],
  'vit.intro': [
    'Ogni vitamina arriva al massimo a {max} punti e ognuno vale +5%. Attacco copre sia Attacco sia Attacco Speciale, perché nel gioco la Proteina li alza insieme.',
    'Each vitamin caps at {max} points, and each point is worth +5%. Attack covers both Attack and Sp. Atk, because in the game Protein raises them together.',
    'Cada vitamina llega como máximo a {max} puntos y cada uno vale +5%. Ataque cubre Ataque y At. Esp., porque en el juego la Proteína los sube a la vez.',
    'Chaque vitamine plafonne à {max} points, et chaque point vaut +5%. Attaque couvre Attaque et Atq. Spé., car dans le jeu la Protéine augmente les deux ensemble.',
    'Jedes Vitamin ist bei {max} Punkten gedeckelt, jeder Punkt bringt +5%. Angriff deckt Angriff und Sp.-Angriff ab, da Protein im Spiel beide zugleich erhöht.',
    'Cada vitamina chega no máximo a {max} pontos e cada um vale +5%. Ataque cobre Ataque e At. Esp., porque no jogo a Proteína aumenta ambos em conjunto.'
  ],
  'vit.allStarters': ['Tutti gli starter ({n})', 'All starters ({n})', 'Todos los iniciales ({n})', 'Tous les starters ({n})', 'Alle Starter ({n})', 'Todos os iniciais ({n})'],
  'vit.lines': ['Linee evolutive', 'Evolution lines', 'Líneas evolutivas', 'Lignées évolutives', 'Entwicklungslinien', 'Linhas evolutivas'],
  'vit.linesMaxed': ['{n} / {m} al massimo', '{n} / {m} maxed', '{n} / {m} al máximo', '{n} / {m} au maximum', '{n} / {m} auf Maximum', '{n} / {m} no máximo'],
  'vit.persistNote': [
    'Le vitamine valgono per la linea evolutiva, non per il singolo esemplare: restano anche fuori dalla run e si applicano allo starter quando lo scegli. I Pokémon già in squadra vengono aggiornati anche loro; premi Sincronizza perché il gioco ricalcoli gli HP.',
    'Vitamins apply to the evolution line, not to a single Pokémon: they persist outside runs and take effect on the starter when you pick it. Pokémon already on your team are updated too; press Sync so the game recalculates HP.',
    'Las vitaminas valen para la línea evolutiva, no para un ejemplar: persisten fuera de la partida y se aplican al inicial cuando lo eliges. Los Pokémon que ya tienes en el equipo también se actualizan; pulsa Sincronizar para que el juego recalcule los PS.',
    'Les vitamines valent pour la lignée évolutive, pas pour un individu : elles persistent hors partie et s\'appliquent au starter quand vous le choisissez. Les Pokémon déjà dans l\'équipe sont aussi mis à jour ; appuyez sur Synchroniser pour que le jeu recalcule les PV.',
    'Vitamine gelten für die Entwicklungslinie, nicht für ein einzelnes Pokémon: sie bleiben außerhalb von Runs erhalten und wirken auf den Starter, wenn du ihn wählst. Pokémon im Team werden ebenfalls aktualisiert; drücke Sync, damit das Spiel die KP neu berechnet.',
    'As vitaminas valem para a linha evolutiva, não para um exemplar: persistem fora das partidas e aplicam-se ao inicial quando o escolhes. Os Pokémon já na equipa também são atualizados; carrega em Sincronizar para o jogo recalcular os PS.'
  ],
  'vit.who': ['A chi darle', 'Who gets them', 'A quién dárselas', 'À qui les donner', 'Wer sie bekommt', 'A quem dar'],
  'vit.which': ['Quale vitamina', 'Which vitamin', 'Qué vitamina', 'Quelle vitamine', 'Welches Vitamin', 'Qual vitamina'],
  'vit.allStats': ['Tutte le categorie', 'All categories', 'Todas las categorías', 'Toutes les catégories', 'Alle Kategorien', 'Todas as categorias'],
  'vit.apply': ['Dai il massimo', 'Give the maximum', 'Dar el máximo', 'Donner le maximum', 'Maximum geben', 'Dar o máximo'],
  'vit.current': ['Stato attuale', 'Current state', 'Estado actual', 'État actuel', 'Aktueller Stand', 'Estado atual'],
  'vit.working': ['Applicazione in corso...', 'Applying...', 'Aplicando...', 'Application...', 'Wird angewendet...', 'A aplicar...'],
  'vit.done': [
    '\ud83d\udc8a {what} al massimo su {n} Pokémon',
    '\ud83d\udc8a {what} maxed on {n} Pokémon',
    '\ud83d\udc8a {what} al máximo en {n} Pokémon',
    '\ud83d\udc8a {what} au maximum sur {n} Pokémon',
    '\ud83d\udc8a {what} auf Maximum bei {n} Pokémon',
    '\ud83d\udc8a {what} no máximo em {n} Pokémon'
  ],
  'vit.hp': ['HP', 'HP', 'PS', 'PV', 'KP', 'PS'],
  'vit.atk': ['Attacco', 'Attack', 'Ataque', 'Attaque', 'Angriff', 'Ataque'],
  'vit.def': ['Difesa', 'Defense', 'Defensa', 'Défense', 'Verteidigung', 'Defesa'],
  'vit.spdef': ['Difesa Sp.', 'Sp. Def', 'Def. Esp.', 'Déf. Spé.', 'Sp.-Vert.', 'Def. Esp.'],
  'vit.speed': ['Velocità', 'Speed', 'Velocidad', 'Vitesse', 'Initiative', 'Velocidade'],

  // ── Squadra ──
  'team.empty': ['La tua squadra è vuota<br>Aggiungi dei Pokémon dalla scheda ➕', 'Your team is empty<br>Add Pokémon from the ➕ tab', 'Tu equipo está vacío<br>Añade Pokémon desde la pestaña ➕', 'Votre équipe est vide<br>Ajoutez des Pokémon depuis l\'onglet ➕', 'Dein Team ist leer<br>Füge Pokémon im Tab ➕ hinzu', 'A tua equipa está vazia<br>Adiciona Pokémon no separador ➕'],
  'team.healAll': ['💚 Cura Squadra Completa', '💚 Heal Entire Team', '💚 Curar todo el equipo', '💚 Soigner toute l\'équipe', '💚 Ganzes Team heilen', '💚 Curar equipa inteira'],
  'team.healed': ['💚 Squadra curata completamente!', '💚 Team fully healed!', '💚 ¡Equipo totalmente curado!', '💚 Équipe entièrement soignée !', '💚 Team vollständig geheilt!', '💚 Equipa totalmente curada!'],
  'team.makeAllShiny': ['\u2728 Tutti shiny ({n})', '\u2728 All shiny ({n})', '\u2728 Todos variocolor ({n})', '\u2728 Tous chromatiques ({n})', '\u2728 Alle schillernd ({n})', '\u2728 Todos shiny ({n})'],
  'team.allShinyDone': ['\u2728 Gi\u00e0 tutti shiny', '\u2728 All already shiny', '\u2728 Ya todos variocolor', '\u2728 D\u00e9j\u00e0 tous chromatiques', '\u2728 Schon alle schillernd', '\u2728 J\u00e1 todos shiny'],
  'team.shinyDone': ['\u2728 {n} Pok\u00e9mon resi shiny', '\u2728 {n} Pok\u00e9mon made shiny', '\u2728 {n} Pok\u00e9mon ahora variocolor', '\u2728 {n} Pok\u00e9mon rendus chromatiques', '\u2728 {n} Pok\u00e9mon schillernd gemacht', '\u2728 {n} Pok\u00e9mon tornados shiny'],
  'team.maxAllTier': ['\u2b06 Mosse al massimo ({n})', '\u2b06 Max move tier ({n})', '\u2b06 Movimientos al m\u00e1ximo ({n})', '\u2b06 Attaques au maximum ({n})', '\u2b06 Attacken auf Maximum ({n})', '\u2b06 Ataques no m\u00e1ximo ({n})'],
  'team.allTierDone': ['\u2b06 Gi\u00e0 tutte al massimo', '\u2b06 Already all maxed', '\u2b06 Ya todos al m\u00e1ximo', '\u2b06 D\u00e9j\u00e0 au maximum', '\u2b06 Schon alle auf Maximum', '\u2b06 J\u00e1 todos no m\u00e1ximo'],
  'team.tierDone': ['\u2b06 Mosse al massimo su {n} Pok\u00e9mon', '\u2b06 Move tier maxed on {n} Pok\u00e9mon', '\u2b06 Movimientos al m\u00e1ximo en {n} Pok\u00e9mon', '\u2b06 Attaques au maximum sur {n} Pok\u00e9mon', '\u2b06 Attacken auf Maximum bei {n} Pok\u00e9mon', '\u2b06 Ataques no m\u00e1ximo em {n} Pok\u00e9mon'],
  'team.remove': ['Rimuovi', 'Remove', 'Quitar', 'Retirer', 'Entfernen', 'Remover'],
  'team.editStats': ['Modifica statistiche', 'Edit stats', 'Editar estadísticas', 'Modifier les stats', 'Werte bearbeiten', 'Editar estatísticas'],
  'team.numericEdit': ['Modifica Numerica', 'Numeric Edit', 'Edición numérica', 'Édition numérique', 'Numerische Bearbeitung', 'Edição numérica'],
  'team.item': ['Strumento', 'Item', 'Objeto', 'Objet', 'Item', 'Item'],
  'team.itemGroup': ['Strumenti', 'Items', 'Objetos', 'Objets', 'Items', 'Itens'],
  'team.megaExtraGroup': [
    'Megapietre ricostruite (senza abilità Mega)', 'Rebuilt Mega Stones (no Mega ability)',
    'Megapiedras reconstruidas (sin habilidad Mega)', 'Méga-Gemmes reconstituées (sans talent Méga)',
    'Nachgebaute Mega-Steine (ohne Mega-Fähigkeit)', 'Megapedras reconstruídas (sem habilidade Mega)'
  ],
  'team.megaGroup': ['Megapietre', 'Mega Stones', 'Megapiedras', 'Méga-Gemmes', 'Mega-Steine', 'Megapedras'],
  'team.megaAssigned': ['\u2728 Megapietra assegnata: {name}', '\u2728 Mega Stone assigned: {name}', '\u2728 Megapiedra asignada: {name}', '\u2728 M\u00e9ga-Gemme attribu\u00e9e : {name}', '\u2728 Mega-Stein zugewiesen: {name}', '\u2728 Megapedra atribu\u00edda: {name}'],
  'team.megaFailed': ['\u274c Impossibile creare la megapietra: apri pokelike.xyz e riprova', '\u274c Could not create the Mega Stone: open pokelike.xyz and try again', '\u274c No se pudo crear la megapiedra: abre pokelike.xyz e int\u00e9ntalo de nuevo', '\u274c Impossible de cr\u00e9er la M\u00e9ga-Gemme : ouvrez pokelike.xyz et r\u00e9essayez', '\u274c Mega-Stein konnte nicht erstellt werden: \u00f6ffne pokelike.xyz und versuche es erneut', '\u274c N\u00e3o foi poss\u00edvel criar a megapedra: abre pokelike.xyz e tenta de novo'],
  'team.megaNoneForSpecies': ['Questa specie non ha una megaevoluzione.', 'This species has no Mega Evolution.', 'Esta especie no tiene Megaevoluci\u00f3n.', 'Cette esp\u00e8ce n\'a pas de M\u00e9ga-\u00c9volution.', 'Diese Art hat keine Mega-Entwicklung.', 'Esta esp\u00e9cie n\u00e3o tem Megaevolu\u00e7\u00e3o.'],
  'team.megaUnavailable': ['Megapietre non disponibili: apri pokelike.xyz e premi Sincronizza.', 'Mega Stones unavailable: open pokelike.xyz and press Sync.', 'Megapiedras no disponibles: abre pokelike.xyz y pulsa Sincronizar.', 'M\u00e9ga-Gemmes indisponibles : ouvrez pokelike.xyz et appuyez sur Synchroniser.', 'Mega-Steine nicht verf\u00fcgbar: \u00f6ffne pokelike.xyz und dr\u00fccke Sync.', 'Megapedras indispon\u00edveis: abre pokelike.xyz e carrega em Sincronizar.'],
  'team.tier': ['Tier', 'Tier', 'Nivel', 'Palier', 'Stufe', 'Nível'],
  'team.tierN': ['Tier {n}', 'Tier {n}', 'Nivel {n}', 'Palier {n}', 'Stufe {n}', 'Nível {n}'],
  'team.tierMax': ['Tier {n} (Max)', 'Tier {n} (Max)', 'Nivel {n} (Máx)', 'Palier {n} (Max)', 'Stufe {n} (Max)', 'Nível {n} (Máx)'],
  'team.shiny': ['✨ Shiny', '✨ Shiny', '✨ Variocolor', '✨ Chromatique', '✨ Schillernd', '✨ Shiny'],
  'team.mutation': ['🧬 Mut.', '🧬 Mut.', '🧬 Mut.', '🧬 Mut.', '🧬 Mut.', '🧬 Mut.'],
  'team.mutationExtra': ['tipo extra', 'extra type', 'tipo extra', 'type supplémentaire', 'Extra-Typ', 'tipo extra'],
  'team.mutationTitle': ['Tipo da mutazione', 'Mutation type', 'Tipo de mutación', 'Type de mutation', 'Mutationstyp', 'Tipo de mutação'],

  // ── Aggiungi ──
  'add.search': ['Cerca per nome o numero...', 'Search by name or number...', 'Busca por nombre o número...', 'Rechercher par nom ou numéro...', 'Nach Name oder Nummer suchen...', 'Procurar por nome ou número...'],
  'add.type1': ['Tipo 1', 'Type 1', 'Tipo 1', 'Type 1', 'Typ 1', 'Tipo 1'],
  'add.type2': ['Tipo 2', 'Type 2', 'Tipo 2', 'Type 2', 'Typ 2', 'Tipo 2'],
  'add.allGens': ['Tutte le Gen', 'All Gens', 'Todas las Gen', 'Toutes les gén.', 'Alle Gen.', 'Todas as Ger.'],
  'add.gen': ['Gen {n}', 'Gen {n}', 'Gen {n}', 'Gén {n}', 'Gen {n}', 'Ger {n}'],
  'add.clearFilters': ['Azzera filtri', 'Clear filters', 'Borrar filtros', 'Effacer les filtres', 'Filter zurücksetzen', 'Limpar filtros'],
  'add.countAll': ['{n} Pokémon', '{n} Pokémon', '{n} Pokémon', '{n} Pokémon', '{n} Pokémon', '{n} Pokémon'],
  'add.countFiltered': ['{n} di {m}', '{n} of {m}', '{n} de {m}', '{n} sur {m}', '{n} von {m}', '{n} de {m}'],
  'add.sameType': ['Scegli due tipi diversi: nessun Pokémon ha lo stesso tipo due volte.', 'Pick two different types: no Pokémon has the same type twice.', 'Elige dos tipos distintos: ningún Pokémon tiene el mismo tipo dos veces.', 'Choisissez deux types différents : aucun Pokémon n\'a deux fois le même type.', 'Wähle zwei verschiedene Typen: kein Pokémon hat denselben Typ zweimal.', 'Escolhe dois tipos diferentes: nenhum Pokémon tem o mesmo tipo duas vezes.'],
  'add.noneFound': ['Nessun Pokémon trovato con questi filtri.', 'No Pokémon match these filters.', 'Ningún Pokémon coincide con estos filtros.', 'Aucun Pokémon ne correspond à ces filtres.', 'Keine Pokémon passen zu diesen Filtern.', 'Nenhum Pokémon corresponde a estes filtros.'],
  'add.addTitle': ['Aggiungi {name} (#{id})', 'Add {name} (#{id})', 'Añadir {name} (#{id})', 'Ajouter {name} (#{id})', '{name} hinzufügen (#{id})', 'Adicionar {name} (#{id})'],
  'add.level': ['Livello', 'Level', 'Nivel', 'Niveau', 'Level', 'Nível'],
  'add.confirm': ['➕ Alla Squadra', '➕ To Team', '➕ Al equipo', '➕ Dans l\'équipe', '➕ Ins Team', '➕ Para a equipa'],
  'add.teamFull': ['❌ Squadra piena (max 6)', '❌ Team full (max 6)', '❌ Equipo lleno (máx. 6)', '❌ Équipe pleine (max 6)', '❌ Team voll (max. 6)', '❌ Equipa cheia (máx. 6)'],
  'add.added': ['✅ Pokémon aggiunto!', '✅ Pokémon added!', '✅ ¡Pokémon añadido!', '✅ Pokémon ajouté !', '✅ Pokémon hinzugefügt!', '✅ Pokémon adicionado!'],

  // ── Zaino ──
  'bag.generate': ['➕ Genera Strumento', '➕ Generate Item', '➕ Generar objeto', '➕ Générer un objet', '➕ Item erzeugen', '➕ Gerar item'],
  'bag.hint': ['Lo zaino ha 10 slot e tiene un solo esemplare per strumento: gli strumenti già posseduti non compaiono nell\'elenco.', 'The bag has 10 slots and holds one of each item: items you already own are hidden from the list.', 'La mochila tiene 10 espacios y guarda un ejemplar de cada objeto: los que ya tienes no aparecen en la lista.', 'Le sac a 10 emplacements et ne garde qu\'un exemplaire par objet : ceux que vous avez déjà n\'apparaissent pas.', 'Der Beutel hat 10 Plätze und hält ein Exemplar pro Item: bereits vorhandene erscheinen nicht in der Liste.', 'A mochila tem 10 espaços e guarda um exemplar de cada item: os que já tens não aparecem na lista.'],
  'bag.quickFill': ['💎 Riempimento Rapido', '💎 Quick Fill', '💎 Relleno rápido', '💎 Remplissage rapide', '💎 Schnellbefüllung', '💎 Preenchimento rápido'],
  'bag.quickFillHint': ['Riempi gli slot liberi con gli strumenti che non hai ancora.', 'Fill the free slots with items you don\'t have yet.', 'Rellena los espacios libres con los objetos que aún no tienes.', 'Remplissez les emplacements libres avec les objets qui vous manquent.', 'Fülle die freien Plätze mit Items, die du noch nicht hast.', 'Preenche os espaços livres com os itens que ainda não tens.'],
  'bag.fillFree': ['✨ Riempi gli Slot Liberi', '✨ Fill Free Slots', '✨ Rellenar espacios libres', '✨ Remplir les emplacements libres', '✨ Freie Plätze füllen', '✨ Preencher espaços livres'],
  'bag.yours': ['🎒 Il Tuo Zaino', '🎒 Your Bag', '🎒 Tu mochila', '🎒 Votre sac', '🎒 Dein Beutel', '🎒 A tua mochila'],
  'bag.slots': ['{n} / {m} slot', '{n} / {m} slots', '{n} / {m} espacios', '{n} / {m} emplacements', '{n} / {m} Plätze', '{n} / {m} espaços'],
  'bag.empty': ['Lo zaino è vuoto.', 'The bag is empty.', 'La mochila está vacía.', 'Le sac est vide.', 'Der Beutel ist leer.', 'A mochila está vazia.'],
  'bag.clear': ['🗑️ Svuota Zaino', '🗑️ Empty Bag', '🗑️ Vaciar mochila', '🗑️ Vider le sac', '🗑️ Beutel leeren', '🗑️ Esvaziar mochila'],
  'bag.noneAvailable': ['Nessuno strumento disponibile', 'No items available', 'No hay objetos disponibles', 'Aucun objet disponible', 'Keine Items verfügbar', 'Nenhum item disponível'],
  'bag.full': ['❌ Zaino pieno (max {n} strumenti)', '❌ Bag full (max {n} items)', '❌ Mochila llena (máx. {n} objetos)', '❌ Sac plein (max {n} objets)', '❌ Beutel voll (max. {n} Items)', '❌ Mochila cheia (máx. {n} itens)'],
  'bag.already': ['❌ {item} è già nello zaino', '❌ {item} is already in the bag', '❌ {item} ya está en la mochila', '❌ {item} est déjà dans le sac', '❌ {item} ist bereits im Beutel', '❌ {item} já está na mochila'],
  'bag.addedItem': ['🎒 {item} aggiunto ({n}/{m})', '🎒 {item} added ({n}/{m})', '🎒 {item} añadido ({n}/{m})', '🎒 {item} ajouté ({n}/{m})', '🎒 {item} hinzugefügt ({n}/{m})', '🎒 {item} adicionado ({n}/{m})'],
  'bag.filled': ['🎒 {n} strumenti aggiunti ({m}/{t} slot)', '🎒 {n} items added ({m}/{t} slots)', '🎒 {n} objetos añadidos ({m}/{t} espacios)', '🎒 {n} objets ajoutés ({m}/{t} emplacements)', '🎒 {n} Items hinzugefügt ({m}/{t} Plätze)', '🎒 {n} itens adicionados ({m}/{t} espaços)'],
  'bag.alreadyFull': ['🎒 Lo zaino è già pieno ({n}/{m})', '🎒 The bag is already full ({n}/{m})', '🎒 La mochila ya está llena ({n}/{m})', '🎒 Le sac est déjà plein ({n}/{m})', '🎒 Der Beutel ist schon voll ({n}/{m})', '🎒 A mochila já está cheia ({n}/{m})'],
  'bag.cleared': ['🗑️ Zaino svuotato.', '🗑️ Bag emptied.', '🗑️ Mochila vaciada.', '🗑️ Sac vidé.', '🗑️ Beutel geleert.', '🗑️ Mochila esvaziada.'],

  // ── Run ──
  'run.finance': ['💰 Finanze & Base', '💰 Money & Basics', '💰 Dinero y básicos', '💰 Argent & bases', '💰 Geld & Basis', '💰 Dinheiro e base'],
  'run.passives': ['Oggetti passivi', 'Passive items', 'Objetos pasivos', 'Objets passifs', 'Passive Items', 'Itens passivos'],
  'run.passiveSlots': ['{n} / {m} slot', '{n} / {m} slots', '{n} / {m} espacios', '{n} / {m} emplacements', '{n} / {m} Pl\u00e4tze', '{n} / {m} espa\u00e7os'],
  'run.passivesHint': [
    'Valgono per tutta la run. Il numero di slot lo decide la sfida: in Endless cresce con le ricompense, altrimenti vale il limite della sfida.',
    'They apply for the whole run. The number of slots depends on the challenge: in Endless it grows with rewards, otherwise the challenge cap applies.',
    'Valen para toda la partida. El n\u00famero de espacios depende del desaf\u00edo: en Infinito crece con las recompensas, si no se aplica el l\u00edmite del desaf\u00edo.',
    'Ils valent pour toute la partie. Le nombre d\'emplacements d\u00e9pend du d\u00e9fi : en mode infini il augmente avec les r\u00e9compenses, sinon la limite du d\u00e9fi s\'applique.',
    'Sie gelten f\u00fcr den ganzen Run. Die Anzahl der Pl\u00e4tze h\u00e4ngt von der Herausforderung ab: im Endlos-Modus w\u00e4chst sie mit Belohnungen, sonst gilt das Limit der Herausforderung.',
    'Valem para toda a partida. O n\u00famero de espa\u00e7os depende do desafio: no modo infinito cresce com as recompensas, caso contr\u00e1rio aplica-se o limite do desafio.'
  ],
  'run.passivesUnavailable': [
    'Catalogo non disponibile: apri pokelike.xyz e premi Sincronizza.',
    'Catalogue unavailable: open pokelike.xyz and press Sync.',
    'Cat\u00e1logo no disponible: abre pokelike.xyz y pulsa Sincronizar.',
    'Catalogue indisponible : ouvrez pokelike.xyz et appuyez sur Synchroniser.',
    'Katalog nicht verf\u00fcgbar: \u00f6ffne pokelike.xyz und dr\u00fccke Sync.',
    'Cat\u00e1logo indispon\u00edvel: abre pokelike.xyz e carrega em Sincronizar.'
  ],
  'run.passivesFull': [
    '\u274c Slot esauriti (max {m}): togline uno prima di aggiungerne un altro',
    '\u274c No slots left (max {m}): remove one before adding another',
    '\u274c Sin espacios (m\u00e1x. {m}): quita uno antes de a\u00f1adir otro',
    '\u274c Plus d\'emplacements (max {m}) : retirez-en un avant d\'en ajouter',
    '\u274c Keine Pl\u00e4tze mehr (max. {m}): entferne einen, bevor du einen hinzuf\u00fcgst',
    '\u274c Sem espa\u00e7os (m\u00e1x. {m}): remove um antes de adicionar outro'
  ],
  'run.passiveAdded': ['\u2728 {name} aggiunto', '\u2728 {name} added', '\u2728 {name} a\u00f1adido', '\u2728 {name} ajout\u00e9', '\u2728 {name} hinzugef\u00fcgt', '\u2728 {name} adicionado'],
  'run.passiveRemoved': ['\ud83d\uddd1\ufe0f {name} rimosso', '\ud83d\uddd1\ufe0f {name} removed', '\ud83d\uddd1\ufe0f {name} quitado', '\ud83d\uddd1\ufe0f {name} retir\u00e9', '\ud83d\uddd1\ufe0f {name} entfernt', '\ud83d\uddd1\ufe0f {name} removido'],
  'run.pokedollarsLabel': ['Pokédollari:', 'Pokédollars:', 'Pokédólares:', 'Pokédollars :', 'Pokédollar:', 'Pokédólares:'],
  'run.badgesLabel': ['Medaglie:', 'Badges:', 'Medallas:', 'Badges :', 'Orden:', 'Medalhas:'],
  'run.mapNumLabel': ['Mappa N.:', 'Map no.:', 'Mapa n.º:', 'Carte n° :', 'Karte Nr.:', 'Mapa n.º:'],
  'run.endlessWaveLabel': ['Ondata Endless:', 'Endless wave:', 'Oleada infinita:', 'Vague infinie :', 'Endlos-Welle:', 'Vaga infinita:'],
  'run.progression': ['🗺️ Progressione', '🗺️ Progression', '🗺️ Progresión', '🗺️ Progression', '🗺️ Fortschritt', '🗺️ Progressão'],
  'run.nuzlocke': ['Modalità Nuzlocke (Morte Permanente)', 'Nuzlocke mode (permadeath)', 'Modo Nuzlocke (muerte permanente)', 'Mode Nuzlocke (mort permanente)', 'Nuzlocke-Modus (Permadeath)', 'Modo Nuzlocke (morte permanente)'],
  'run.endless': ['Modalità Endless', 'Endless mode', 'Modo infinito', 'Mode infini', 'Endlos-Modus', 'Modo infinito'],
  'run.mapEditor': ['🗺️ Editor Mappa', '🗺️ Map Editor', '🗺️ Editor de mapa', '🗺️ Éditeur de carte', '🗺️ Karten-Editor', '🗺️ Editor de mapa'],
  'run.editNodes': ['Modifica i Nodi', 'Edit Nodes', 'Editar nodos', 'Modifier les nœuds', 'Knoten bearbeiten', 'Editar nós'],
  'run.noMap': ['Nessuna mappa caricata.', 'No map loaded.', 'No hay mapa cargado.', 'Aucune carte chargée.', 'Keine Karte geladen.', 'Nenhum mapa carregado.'],

  // ── Sblocchi / Platino ──
  'unlocks.platinum': ['🏆 Platino', '🏆 Platinum', '🏆 Platino', '🏆 Platine', '🏆 Platin', '🏆 Platina'],
  'unlocks.platinumHint': ['Stato di completamento letto dal salvataggio. Le voci già complete non mostrano il pulsante.', 'Completion status read from your save. Finished entries hide their button.', 'Estado de finalización leído de tu partida. Las entradas completas ocultan el botón.', 'État d\'avancement lu depuis votre sauvegarde. Les entrées terminées masquent leur bouton.', 'Fortschritt aus deinem Spielstand. Abgeschlossene Einträge blenden ihre Schaltfläche aus.', 'Estado de conclusão lido do teu save. As entradas completas escondem o botão.'],
  'unlocks.platinumAll': ['🏆 Platina Tutto', '🏆 Platinum Everything', '🏆 Platinar todo', '🏆 Tout platiner', '🏆 Alles platinieren', '🏆 Platinar tudo'],
  'unlocks.platinumDone': ['✔ Gioco platinato', '✔ Game platinumed', '✔ Juego platinado', '✔ Jeu platiné', '✔ Spiel platiniert', '✔ Jogo platinado'],
  'unlocks.reloadHint': ['Al termine ricarica il gioco per vedere i progressi aggiornati.', 'Reload the game afterwards to see the updated progress.', 'Recarga el juego después para ver el progreso actualizado.', 'Rechargez le jeu ensuite pour voir la progression mise à jour.', 'Lade das Spiel danach neu, um den Fortschritt zu sehen.', 'Recarrega o jogo depois para veres o progresso atualizado.'],
  'unlocks.catalogUnavailable': ['catalogo non leggibile', 'catalogue unavailable', 'catálogo no disponible', 'catalogue indisponible', 'Katalog nicht lesbar', 'catálogo indisponível'],
  'goal.ach': ['🏅 Achievement', '🏅 Achievements', '🏅 Logros', '🏅 Succès', '🏅 Erfolge', '🏅 Conquistas'],
  'goal.dex': ['📚 Pokédex', '📚 Pokédex', '📚 Pokédex', '📚 Pokédex', '📚 Pokédex', '📚 Pokédex'],
  'goal.shiny': ['✨ Shiny Dex', '✨ Shiny Dex', '✨ Dex variocolor', '✨ Dex chromatique', '✨ Schillernd-Dex', '✨ Shiny Dex'],
  'goal.mega': ['💠 Megaevoluzioni', '💠 Mega Evolutions', '💠 Megaevoluciones', '💠 Méga-Évolutions', '💠 Mega-Entwicklungen', '💠 Megaevoluções'],
  'goal.starters': ['🥚 Starter base', '🥚 Base starters', '🥚 Iniciales base', '🥚 Starters de base', '🥚 Basis-Starter', '🥚 Iniciais base'],
  'goal.legend': ['👑 Leggendari', '👑 Legendaries', '👑 Legendarios', '👑 Légendaires', '👑 Legendäre', '👑 Lendários'],
  'goal.chal': ['⚔️ Sfide', '⚔️ Challenges', '⚔️ Desafíos', '⚔️ Défis', '⚔️ Herausforderungen', '⚔️ Desafios'],
  'goal.unlocked': ['{n} sbloccati', '{n} unlocked', '{n} desbloqueados', '{n} débloqués', '{n} freigeschaltet', '{n} desbloqueados'],
  'unlocks.achToggleHint': [
    'Clicca un obiettivo per sbloccarlo o rimetterlo da fare.',
    'Click an achievement to unlock it or set it back to locked.',
    'Haz clic en un logro para desbloquearlo o volver a bloquearlo.',
    'Cliquez sur un succès pour le débloquer ou le reverrouiller.',
    'Klicke einen Erfolg an, um ihn freizuschalten oder wieder zu sperren.',
    'Clica numa conquista para a desbloqueares ou voltares a bloqueá-la.'
  ],
  'unlocks.achOn': ['{name} sbloccato.', '{name} unlocked.', '{name} desbloqueado.', '{name} débloqué.', '{name} freigeschaltet.', '{name} desbloqueada.'],
  'unlocks.achOff': ['{name} rimesso da fare.', '{name} set back to locked.', '{name} vuelve a estar bloqueado.', '{name} reverrouillé.', '{name} wieder gesperrt.', '{name} voltou a ficar bloqueada.'],
  'unlocks.achTitle': ['🏅 Achievement ({n}/{m})', '🏅 Achievements ({n}/{m})', '🏅 Logros ({n}/{m})', '🏅 Succès ({n}/{m})', '🏅 Erfolge ({n}/{m})', '🏅 Conquistas ({n}/{m})'],
  'unlocks.megaTitle': ['💠 Sblocco Mega Evoluzioni', '💠 Mega Evolution Unlocks', '💠 Desbloqueo de Megaevoluciones', '💠 Déblocage des Méga-Évolutions', '💠 Mega-Entwicklungen freischalten', '💠 Desbloqueio de Megaevoluções'],
  'unlocks.megaHint': ['Una pietra si usa quando gli MVP della sua linea evolutiva arrivano al livello richiesto (1, 5, 10 o 50). Qui puoi aggiungere quelli che mancano.', 'A stone can be used once its evolution line\'s MVPs reach the required level (1, 5, 10 or 50). Here you can add the missing ones.', 'Una piedra se puede usar cuando los MVP de su línea evolutiva llegan al nivel requerido (1, 5, 10 o 50). Aquí puedes añadir los que faltan.', 'Une pierre s\'utilise quand les MVP de sa lignée atteignent le niveau requis (1, 5, 10 ou 50). Ici, tu peux ajouter ceux qui manquent.', 'Ein Stein ist nutzbar, sobald die MVPs seiner Entwicklungsreihe die nötige Stufe erreichen (1, 5, 10 oder 50). Hier kannst du die fehlenden ergänzen.', 'Uma pedra pode ser usada quando os MVP da sua linha evolutiva atingem o nível exigido (1, 5, 10 ou 50). Aqui podes adicionar os que faltam.'],
  'unlocks.megaAll': ['✨ Sblocca Tutte le Mega', '✨ Unlock All Megas', '✨ Desbloquear todas las Megas', '✨ Débloquer toutes les Mégas', '✨ Alle Megas freischalten', '✨ Desbloquear todas as Megas'],
  'unlocks.megaReq': ['{name} ({n} MVP)', '{name} ({n} MVP)', '{name} ({n} MVP)', '{name} ({n} MVP)', '{name} ({n} MVP)', '{name} ({n} MVP)'],
  'unlocks.dexRegion': ['📚 Pokédex per Regione', '📚 Pokédex by Region', '📚 Pokédex por región', '📚 Pokédex par région', '📚 Pokédex nach Region', '📚 Pokédex por região'],
  'unlocks.allRegions': ['Tutte le Regioni', 'All Regions', 'Todas las regiones', 'Toutes les régions', 'Alle Regionen', 'Todas as regiões'],
  'unlocks.startersTitle': ['🥚 Starter e Leggendari', '🥚 Starters and Legendaries', '🥚 Iniciales y legendarios', '🥚 Starters et légendaires', '🥚 Starter und Legendäre', '🥚 Iniciais e lendários'],
  'unlocks.startersHint': ['Aggiunge le specie alla lista degli starter disponibili (come uovo).', 'Adds the species to the available starter list (as an egg).', 'Añade las especies a la lista de iniciales disponibles (como huevo).', 'Ajoute les espèces à la liste des starters disponibles (sous forme d\'œuf).', 'Fügt die Arten der Liste verfügbarer Starter hinzu (als Ei).', 'Adiciona as espécies à lista de iniciais disponíveis (como ovo).'],
  'unlocks.allStarters': ['🥚 Tutti gli Starter Base', '🥚 All Base Starters', '🥚 Todos los iniciales base', '🥚 Tous les starters de base', '🥚 Alle Basis-Starter', '🥚 Todos os iniciais base'],
  'unlocks.legendaries': ['👑 Leggendari', '👑 Legendaries', '👑 Legendarios', '👑 Légendaires', '👑 Legendäre', '👑 Lendários'],
  'unlocks.legendariesShiny': ['✨ Leggendari Shiny', '✨ Shiny Legendaries', '✨ Legendarios variocolor', '✨ Légendaires chromatiques', '✨ Schillernde Legendäre', '✨ Lendários shiny'],
  'unlocks.confirmPlatinum': ['Completare Pokédex, Shiny Dex, achievement, Mega, starter, leggendari e sfide?', 'Complete Pokédex, Shiny Dex, achievements, Megas, starters, legendaries and challenges?', '¿Completar Pokédex, Dex variocolor, logros, Megas, iniciales, legendarios y desafíos?', 'Compléter Pokédex, Dex chromatique, succès, Mégas, starters, légendaires et défis ?', 'Pokédex, Schillernd-Dex, Erfolge, Megas, Starter, Legendäre und Herausforderungen abschließen?', 'Completar Pokédex, Shiny Dex, conquistas, Megas, iniciais, lendários e desafios?'],
  'status.loadedParked': ['✅ Run Endless 2.0 in pausa caricata · {n} Pokémon', '✅ Paused Endless 2.0 run loaded · {n} Pokémon', '✅ Partida Endless 2.0 en pausa cargada · {n} Pokémon', '✅ Partie Endless 2.0 en pause chargée · {n} Pokémon', '✅ Pausierter Endless-2.0-Run geladen · {n} Pokémon', '✅ Partida Endless 2.0 em pausa carregada · {n} Pokémon'],
  'unlocks.megaUnavailable': ['Dati delle Mega non leggibili dal gioco: ricarica pokelike.xyz e riprova', 'Couldn\'t read Mega data from the game: reload pokelike.xyz and try again', 'No se pudieron leer los datos Mega del juego: recarga pokelike.xyz e inténtalo de nuevo', 'Données Méga illisibles depuis le jeu : recharge pokelike.xyz et réessaie', 'Mega-Daten des Spiels nicht lesbar: lade pokelike.xyz neu und versuche es erneut', 'Dados Mega do jogo ilegíveis: recarregue pokelike.xyz e tente novamente'],
  'unlocks.braceletMissing': ['Mega Bracciale non ancora ottenuto: senza, nessuna pietra si può usare. Il gioco lo dà dopo lo stadio 6 della Torre.', 'Mega Bracelet not obtained yet: without it no stone can be used. The game grants it after Tower stage 6.', 'Megapulsera aún no obtenida: sin ella no se puede usar ninguna piedra. El juego la da tras la fase 6 de la Torre.', 'Méga-Bracelet pas encore obtenu : sans lui, aucune pierre n\'est utilisable. Le jeu le donne après l\'étape 6 de la Tour.', 'Mega-Armband noch nicht erhalten: ohne es ist kein Stein nutzbar. Das Spiel gibt es nach Turm-Stufe 6.', 'Megapulseira ainda não obtida: sem ela nenhuma pedra pode ser usada. O jogo a dá após a fase 6 da Torre.'],
  'unlocks.braceletOk': ['✓ Mega Bracciale ottenuto', '✓ Mega Bracelet obtained', '✓ Megapulsera obtenida', '✓ Méga-Bracelet obtenu', '✓ Mega-Armband erhalten', '✓ Megapulseira obtida'],
  'unlocks.braceletDone': ['💠 Mega Bracciale sbloccato', '💠 Mega Bracelet unlocked', '💠 Megapulsera desbloqueada', '💠 Méga-Bracelet débloqué', '💠 Mega-Armband freigeschaltet', '💠 Megapulseira desbloqueada'],
  'er.title': ['Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0'],
  'er.passiveSlots': ['Slot passivi (6–10)', 'Passive slots (6–10)', 'Huecos de pasivos (6–10)', 'Emplacements passifs (6–10)', 'Passiv-Plätze (6–10)', 'Espaços de passivos (6–10)'],
  'er.catchBonus': ['Livelli extra alle catture', 'Extra levels on catches', 'Niveles extra en capturas', 'Niveaux bonus aux captures', 'Extra-Level bei Fängen', 'Níveis extra nas capturas'],
  'er.mode': ['Modalità', 'Mode', 'Modo', 'Mode', 'Modus', 'Modo'],
  'er.modeCreative': ['Creativa', 'Creative', 'Creativo', 'Créatif', 'Kreativ', 'Criativo'],
  'er.modeHardcore': ['Hardcore', 'Hardcore', 'Hardcore', 'Hardcore', 'Hardcore', 'Hardcore'],
  'er.modeUnset': ['non ancora scelta', 'not chosen yet', 'aún sin elegir', 'pas encore choisi', 'noch nicht gewählt', 'ainda não escolhido'],
  'er.sigTitle': ['⭐ Oggetto Firma', '⭐ Signature Item', '⭐ Objeto Firma', '⭐ Objet Signature', '⭐ Signatur-Item', '⭐ Item Assinatura'],
  'er.sigHint': ['Ogni linea evolutiva ha il suo. Se ne tiene uno solo, fuori dagli slot passivi, e potenzia solo il Pokémon scelto.', 'Every evolution line has its own. You hold just one, outside the passive slots, and it only powers up the chosen Pokémon.', 'Cada línea evolutiva tiene el suyo. Solo se lleva uno, fuera de los huecos de pasivos, y solo potencia al Pokémon elegido.', 'Chaque lignée d\'évolution a le sien. On n\'en tient qu\'un, hors des emplacements passifs, et il ne renforce que le Pokémon choisi.', 'Jede Entwicklungsreihe hat ihr eigenes. Man hält nur eines, außerhalb der Passiv-Plätze, und es stärkt nur das gewählte Pokémon.', 'Cada linha evolutiva tem o seu. Só se leva um, fora dos espaços de passivos, e só fortalece o Pokémon escolhido.'],
  'er.sigLoading': ['Lettura degli Oggetti Firma…', 'Reading Signature Items…', 'Leyendo Objetos Firma…', 'Lecture des Objets Signature…', 'Signatur-Items werden gelesen…', 'Lendo Itens Assinatura…'],
  'er.sigUnavailable': ['Oggetti Firma non leggibili dal gioco: ricarica pokelike.xyz', 'Couldn\'t read Signature Items from the game: reload pokelike.xyz', 'No se pudieron leer los Objetos Firma: recarga pokelike.xyz', 'Objets Signature illisibles : recharge pokelike.xyz', 'Signatur-Items nicht lesbar: lade pokelike.xyz neu', 'Itens Assinatura ilegíveis: recarregue pokelike.xyz'],
  'er.sigNone': ['Nessuno', 'None', 'Ninguno', 'Aucun', 'Keins', 'Nenhum'],
  'er.sigAssigned': ['⭐ {item} a {name}', '⭐ {item} to {name}', '⭐ {item} para {name}', '⭐ {item} à {name}', '⭐ {item} an {name}', '⭐ {item} para {name}'],
  'er.sigRemoved': ['Oggetto Firma rimosso', 'Signature Item removed', 'Objeto Firma retirado', 'Objet Signature retiré', 'Signatur-Item entfernt', 'Item Assinatura removido'],
  'team.mutationPct': ['🧬 %', '🧬 %', '🧬 %', '🧬 %', '🧬 %', '🧬 %'],
  'team.mutationPctTitle': ['Forza della mutazione', 'Mutation strength', 'Fuerza de la mutación', 'Force de la mutation', 'Stärke der Mutation', 'Força da mutação'],
  'team.mutationPctHint': ['bonus PS della mutazione', 'mutation HP bonus', 'bonus de PS de la mutación', 'bonus de PV de la mutation', 'KP-Bonus der Mutation', 'bônus de PS da mutação'],
  'team.augment': ['⬆ %', '⬆ %', '⬆ %', '⬆ %', '⬆ %', '⬆ %'],
  'team.augmentTitle': ['Potenziamento', 'Augment', 'Potenciación', 'Amélioration', 'Verstärkung', 'Aprimoramento'],
  'team.augmentHint': ['potenziamento su tutte le statistiche', 'boost to every stat', 'mejora de todas las estadísticas', 'bonus à toutes les stats', 'Bonus auf alle Werte', 'bônus em todos os atributos'],
  'spire.title': ['SpireMon', 'SpireMon', 'SpireMon', 'SpireMon', 'SpireMon', 'SpireMon'],
  'spire.hint': ['Il gioco di carte del menu Sfide. Le carte si trovano nei pacchetti, che costano gettoni; il mazzo si costruisce dopo la prima vittoria Intro.', 'The card game in the Challenge menu. Cards come from packs, which cost tokens; deck building opens after the first Intro win.', 'El juego de cartas del menú Desafíos. Las cartas salen de sobres que cuestan fichas; el mazo se construye tras la primera victoria Intro.', 'Le jeu de cartes du menu Défis. Les cartes viennent de boosters payés en jetons ; le deck se construit après la première victoire Intro.', 'Das Kartenspiel im Herausforderungsmenü. Karten gibt es in Packs, die Tokens kosten; Deckbau öffnet sich nach dem ersten Intro-Sieg.', 'O jogo de cartas do menu Desafios. As cartas vêm de pacotes que custam fichas; o baralho monta-se após a primeira vitória Intro.'],
  'spire.loading': ['Lettura della collezione…', 'Reading collection…', 'Leyendo la colección…', 'Lecture de la collection…', 'Sammlung wird gelesen…', 'Lendo a coleção…'],
  'spire.unavailable': ['SpireMon non leggibile dal gioco: ricarica pokelike.xyz', 'Couldn\'t read SpireMon from the game: reload pokelike.xyz', 'No se pudo leer SpireMon: recarga pokelike.xyz', 'SpireMon illisible : recharge pokelike.xyz', 'SpireMon nicht lesbar: lade pokelike.xyz neu', 'SpireMon ilegível: recarregue pokelike.xyz'],
  'spire.summary': ['Carte {n}/{m} · Shiny {s}/{m}', 'Cards {n}/{m} · Shiny {s}/{m}', 'Cartas {n}/{m} · Shiny {s}/{m}', 'Cartes {n}/{m} · Shiny {s}/{m}', 'Karten {n}/{m} · Shiny {s}/{m}', 'Cartas {n}/{m} · Shiny {s}/{m}'],
  'spire.deckOk': ['✓ Costruzione del mazzo sbloccata', '✓ Deck building unlocked', '✓ Construcción de mazo desbloqueada', '✓ Construction de deck débloquée', '✓ Deckbau freigeschaltet', '✓ Montagem de baralho desbloqueada'],
  'spire.deckLocked': ['Costruzione del mazzo bloccata', 'Deck building locked', 'Construcción de mazo bloqueada', 'Construction de deck verrouillée', 'Deckbau gesperrt', 'Montagem de baralho bloqueada'],
  'spire.allCards': ['🃏 Tutte le carte', '🃏 All cards', '🃏 Todas las cartas', '🃏 Toutes les cartes', '🃏 Alle Karten', '🃏 Todas as cartas'],
  'spire.allShiny': ['✨ Tutte shiny', '✨ All shiny', '✨ Todas shiny', '✨ Toutes shiny', '✨ Alle shiny', '✨ Todas shiny'],
  'spire.unlockDeck': ['Sblocca costruzione del mazzo', 'Unlock deck building', 'Desbloquear construcción de mazo', 'Débloquer la construction de deck', 'Deckbau freischalten', 'Desbloquear montagem de baralho'],
  'spire.tokens': ['Gettoni (pacchetto: {n})', 'Tokens (pack: {n})', 'Fichas (sobre: {n})', 'Jetons (booster : {n})', 'Tokens (Pack: {n})', 'Fichas (pacote: {n})'],
  'spire.cardsDone': ['🃏 Tutte le carte sbloccate', '🃏 All cards unlocked', '🃏 Todas las cartas desbloqueadas', '🃏 Toutes les cartes débloquées', '🃏 Alle Karten freigeschaltet', '🃏 Todas as cartas desbloqueadas'],
  'spire.shinyDone': ['✨ Tutte le carte anche shiny', '✨ All cards shiny too', '✨ Todas las cartas también shiny', '✨ Toutes les cartes aussi en shiny', '✨ Alle Karten auch shiny', '✨ Todas as cartas também shiny'],
  'spire.deckDone': ['Costruzione del mazzo sbloccata', 'Deck building unlocked', 'Construcción de mazo desbloqueada', 'Construction de deck débloquée', 'Deckbau freigeschaltet', 'Montagem de baralho desbloqueada'],
  'spire.tokensDone': ['Gettoni aggiornati', 'Tokens updated', 'Fichas actualizadas', 'Jetons mis à jour', 'Tokens aktualisiert', 'Fichas atualizadas'],
  'shards.title': ['Frammenti leggendari', 'Legendary shards', 'Fragmentos legendarios', 'Fragments légendaires', 'Legendäre Splitter', 'Fragmentos lendários'],
  'shards.hint': ['Si spendono per le uova leggendarie (2) e per i buoni del PC (10). Ogni uovo leggendario senza shiny alza la probabilità del successivo.', 'Spent on legendary eggs (2) and PC vouchers (10). Every legendary egg that hatches non-shiny raises the odds of the next one.', 'Se gastan en huevos legendarios (2) y vales del PC (10). Cada huevo legendario sin shiny sube la probabilidad del siguiente.', 'Dépensés pour les œufs légendaires (2) et les bons du PC (10). Chaque œuf légendaire non shiny augmente les chances du suivant.', 'Werden für legendäre Eier (2) und PC-Gutscheine (10) ausgegeben. Jedes legendäre Ei ohne Shiny erhöht die Chance des nächsten.', 'Gastos em ovos lendários (2) e vales do PC (10). Cada ovo lendário sem shiny aumenta a chance do seguinte.'],
  'shards.count': ['Frammenti', 'Shards', 'Fragmentos', 'Fragments', 'Splitter', 'Fragmentos'],
  'shards.pity': ['Uova di fila senza shiny', 'Eggs in a row without shiny', 'Huevos seguidos sin shiny', 'Œufs d\'affilée sans shiny', 'Eier in Folge ohne Shiny', 'Ovos seguidos sem shiny'],
  'shards.chance': ['Probabilità shiny del prossimo uovo leggendario: {p}%', 'Shiny odds of the next legendary egg: {p}%', 'Probabilidad shiny del próximo huevo legendario: {p}%', 'Chance shiny du prochain œuf légendaire : {p} %', 'Shiny-Chance des nächsten legendären Eis: {p} %', 'Chance shiny do próximo ovo lendário: {p}%'],
  'shards.guarantee': ['✨ Shiny garantito', '✨ Guaranteed shiny', '✨ Shiny garantizado', '✨ Shiny garanti', '✨ Shiny garantiert', '✨ Shiny garantido'],
  'shards.saved': ['💎 Frammenti aggiornati', '💎 Shards updated', '💎 Fragmentos actualizados', '💎 Fragments mis à jour', '💎 Splitter aktualisiert', '💎 Fragmentos atualizados'],
  'compat.title': ['pokelike.xyz è cambiato{v}', 'pokelike.xyz has changed{v}', 'pokelike.xyz ha cambiado{v}', 'pokelike.xyz a changé{v}', 'pokelike.xyz hat sich geändert{v}', 'pokelike.xyz mudou{v}'],
  'compat.body': ['Per non rischiare il salvataggio sono disattivate: {list}. Il resto funziona; arriverà un aggiornamento.', 'To keep your save safe these are turned off: {list}. Everything else works; an update is on its way.', 'Para no arriesgar la partida se han desactivado: {list}. El resto funciona; llegará una actualización.', 'Pour ne pas risquer la sauvegarde, ces fonctions sont désactivées : {list}. Le reste fonctionne ; une mise à jour arrive.', 'Um den Spielstand nicht zu gefährden, sind deaktiviert: {list}. Der Rest funktioniert; ein Update kommt.', 'Para não arriscar o progresso foram desativadas: {list}. O resto funciona; virá uma atualização.'],
  'compat.report': ['Segnala', 'Report', 'Informar', 'Signaler', 'Melden', 'Reportar'],
  'compat.featureOff': ['⚠️ {name}: disattivato perché il gioco è cambiato. Arriverà un aggiornamento dell\'estensione.', '⚠️ {name}: turned off because the game has changed. An extension update is on its way.', '⚠️ {name}: desactivado porque el juego ha cambiado. Llegará una actualización de la extensión.', '⚠️ {name} : désactivé car le jeu a changé. Une mise à jour de l\'extension arrive.', '⚠️ {name}: deaktiviert, weil sich das Spiel geändert hat. Ein Update der Erweiterung kommt.', '⚠️ {name}: desativado porque o jogo mudou. Virá uma atualização da extensão.'],
  'compat.f.starters': ['Starter e leggendari', 'Starters and legendaries', 'Iniciales y legendarios', 'Starters et légendaires', 'Starter und Legendäre', 'Iniciais e lendários'],
  'compat.f.megas': ['Sblocco Mega', 'Mega unlocks', 'Desbloqueo Mega', 'Déblocage Méga', 'Mega-Freischaltung', 'Desbloqueio Mega'],
  'compat.f.megaItems': ['Megapietre', 'Mega Stones', 'Megapiedras', 'Méga-Gemmes', 'Mega-Steine', 'Megapedras'],
  'compat.f.parkedRun': ['Run in pausa', 'Paused run', 'Partida en pausa', 'Partie en pause', 'Pausierter Run', 'Partida em pausa'],
  'compat.f.endless2': ['Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0', 'Endless 2.0'],
  'compat.f.signature': ['Oggetto Firma', 'Signature Item', 'Objeto Firma', 'Objet Signature', 'Signatur-Item', 'Item Assinatura'],
  'compat.f.spire': ['SpireMon', 'SpireMon', 'SpireMon', 'SpireMon', 'SpireMon', 'SpireMon'],
  'compat.f.shards': ['Frammenti leggendari', 'Legendary shards', 'Fragmentos legendarios', 'Fragments légendaires', 'Legendäre Splitter', 'Fragmentos lendários'],
  'compat.f.passives': ['Oggetti passivi', 'Passive items', 'Objetos pasivos', 'Objets passifs', 'Passive Items', 'Itens passivos'],
  'compat.f.traits': ['Tratti della Torre', 'Tower traits', 'Rasgos de la Torre', 'Traits de la Tour', 'Turm-Merkmale', 'Traços da Torre'],
  'compat.f.vitamins': ['Vitamine', 'Vitamins', 'Vitaminas', 'Vitamines', 'Vitamine', 'Vitaminas'],
  'compat.f.achievements': ['Obiettivi e sfide', 'Achievements and challenges', 'Logros y desafíos', 'Succès et défis', 'Erfolge und Herausforderungen', 'Conquistas e desafios'],
  'compat.f.dailyWeekly': ['Sfide giornaliere e settimanali', 'Daily and weekly challenges', 'Desafíos diarios y semanales', 'Défis quotidiens et hebdomadaires', 'Tägliche und wöchentliche Herausforderungen', 'Desafios diários e semanais'],
  'compat.f.backupSync': ['Ripristino con il cloud', 'Cloud restore', 'Restauración con la nube', 'Restauration avec le cloud', 'Wiederherstellung mit der Cloud', 'Restauro com a nuvem'],
  'compat.f.saveBasics': ['Salvataggio di base', 'Basic save data', 'Datos básicos de la partida', 'Données de base', 'Grunddaten des Spielstands', 'Dados básicos do progresso'],
  'unlocks.working': ['Operazione in corso...', 'Working...', 'Procesando...', 'Traitement en cours...', 'Wird ausgeführt...', 'A processar...'],
  'unlocks.achDone': ['🏅 {n} achievement sbloccati', '🏅 {n} achievements unlocked', '🏅 {n} logros desbloqueados', '🏅 {n} succès débloqués', '🏅 {n} Erfolge freigeschaltet', '🏅 {n} conquistas desbloqueadas'],
  'unlocks.chalDone': ['⚔️ {n} sfide completate', '⚔️ {n} challenges completed', '⚔️ {n} desafíos completados', '⚔️ {n} défis terminés', '⚔️ {n} Herausforderungen abgeschlossen', '⚔️ {n} desafios concluídos'],
  'unlocks.dexDone': ['📚 Pokédex completato', '📚 Pokédex completed', '📚 Pokédex completada', '📚 Pokédex complété', '📚 Pokédex abgeschlossen', '📚 Pokédex completa'],
  'unlocks.dexUpdated': ['📚 Pokédex aggiornato', '📚 Pokédex updated', '📚 Pokédex actualizada', '📚 Pokédex mis à jour', '📚 Pokédex aktualisiert', '📚 Pokédex atualizada'],
  'unlocks.shinyDone': ['✨ Shiny Dex completato', '✨ Shiny Dex completed', '✨ Dex variocolor completada', '✨ Dex chromatique complété', '✨ Schillernd-Dex abgeschlossen', '✨ Shiny Dex completa'],
  'unlocks.shinyUpdated': ['✨ Shiny Dex aggiornato', '✨ Shiny Dex updated', '✨ Dex variocolor actualizada', '✨ Dex chromatique mis à jour', '✨ Schillernd-Dex aktualisiert', '✨ Shiny Dex atualizada'],
  'unlocks.megaDone': ['💠 Tutte le Mega sbloccate', '💠 All Megas unlocked', '💠 Todas las Megas desbloqueadas', '💠 Toutes les Mégas débloquées', '💠 Alle Megas freigeschaltet', '💠 Todas as Megas desbloqueadas'],
  'unlocks.megaOne': ['💠 Sbloccata: {name}', '💠 Unlocked: {name}', '💠 Desbloqueada: {name}', '💠 Débloquée : {name}', '💠 Freigeschaltet: {name}', '💠 Desbloqueada: {name}'],
  'unlocks.startersDone': ['🥚 Starter base sbloccati', '🥚 Base starters unlocked', '🥚 Iniciales base desbloqueados', '🥚 Starters de base débloqués', '🥚 Basis-Starter freigeschaltet', '🥚 Iniciais base desbloqueados'],
  'unlocks.hofUnavailable': ['Indice Hall of Fame del gioco non leggibile: ricarica la pagina di pokelike.xyz e riprova', "Game's Hall of Fame index unavailable: reload pokelike.xyz and try again", 'Índice del Salón de la Fama no disponible: recarga pokelike.xyz e inténtalo de nuevo', "Index du Panthéon du jeu indisponible : recharge pokelike.xyz et réessaie", 'Ruhmeshallen-Index des Spiels nicht lesbar: lade pokelike.xyz neu und versuche es erneut', 'Índice do Hall da Fama indisponível: recarregue pokelike.xyz e tente novamente'],
  'unlocks.legendDone': ['👑 Leggendari sbloccati', '👑 Legendaries unlocked', '👑 Legendarios desbloqueados', '👑 Légendaires débloqués', '👑 Legendäre freigeschaltet', '👑 Lendários desbloqueados'],
  'unlocks.legendShinyDone': ['✨ Leggendari shiny sbloccati', '✨ Shiny legendaries unlocked', '✨ Legendarios variocolor desbloqueados', '✨ Légendaires chromatiques débloqués', '✨ Schillernde Legendäre freigeschaltet', '✨ Lendários shiny desbloqueados'],
  'unlocks.platinumDoneMsg': ['🏆 Platino applicato ({steps}). Ricarica il gioco.', '🏆 Platinum applied ({steps}). Reload the game.', '🏆 Platino aplicado ({steps}). Recarga el juego.', '🏆 Platine appliqué ({steps}). Rechargez le jeu.', '🏆 Platin angewendet ({steps}). Lade das Spiel neu.', '🏆 Platina aplicada ({steps}). Recarrega o jogo.'],
  'unlocks.achCatalogMissing': ['Catalogo achievement non disponibile', 'Achievement catalogue unavailable', 'Catálogo de logros no disponible', 'Catalogue des succès indisponible', 'Erfolgs-Katalog nicht verfügbar', 'Catálogo de conquistas indisponível'],
  'unlocks.chalCatalogMissing': ['Catalogo sfide non disponibile', 'Challenge catalogue unavailable', 'Catálogo de desafíos no disponible', 'Catalogue des défis indisponible', 'Herausforderungs-Katalog nicht verfügbar', 'Catálogo de desafios indisponível'],

  // ── Dona ──
  'donate.title': ['Pokélike Editor è gratis. Per sempre.', 'Pokélike Editor is free. Forever.', 'Pokélike Editor es gratis. Para siempre.', 'Pokélike Editor est gratuit. Pour toujours.', 'Pokélike Editor ist kostenlos. Für immer.', 'O Pokélike Editor é grátis. Para sempre.'],
  'donate.text': ['Se l\'estensione ti è utile e vuoi supportare il tempo speso a svilupparla e mantenerla, una piccola donazione libera è sempre apprezzata — ma non è mai richiesta.', 'If the extension is useful to you and you want to support the time spent building and maintaining it, a small donation is always appreciated — but never required.', 'Si la extensión te resulta útil y quieres apoyar el tiempo dedicado a crearla y mantenerla, una pequeña donación siempre se agradece, pero nunca es obligatoria.', 'Si l\'extension vous est utile et que vous voulez soutenir le temps passé à la développer et la maintenir, un petit don est toujours apprécié — mais jamais exigé.', 'Wenn dir die Erweiterung nützt und du die investierte Zeit unterstützen möchtest, freut mich eine kleine Spende — nötig ist sie nie.', 'Se a extensão te é útil e queres apoiar o tempo dedicado a criá-la e mantê-la, um pequeno donativo é sempre bem-vindo — mas nunca é exigido.'],
  'donate.button': ['☕ Offrimi un caffè', '☕ Buy me a coffee', '☕ Invítame a un café', '☕ Offrez-moi un café', '☕ Spendier mir einen Kaffee', '☕ Paga-me um café'],
  'donate.rateTitle': ['Lascia una recensione', 'Leave a review', 'Deja una reseña', 'Laissez un avis', 'Bewertung abgeben', 'Deixa uma avaliação'],
  'donate.rateText': ['Anche gratis puoi dare una mano: una valutazione sul Chrome Web Store aiuta altri giocatori a trovare l\'estensione. Bastano dieci secondi.', 'You can help for free too: a rating on the Chrome Web Store helps other players find the extension. It takes ten seconds.', 'También puedes ayudar gratis: una valoración en Chrome Web Store ayuda a otros jugadores a encontrar la extensión. Solo son diez segundos.', 'Vous pouvez aussi aider gratuitement : une note sur le Chrome Web Store aide d\'autres joueurs à trouver l\'extension. Dix secondes suffisent.', 'Du kannst auch kostenlos helfen: eine Bewertung im Chrome Web Store hilft anderen Spielern, die Erweiterung zu finden. Zehn Sekunden genügen.', 'Também podes ajudar de graça: uma avaliação na Chrome Web Store ajuda outros jogadores a encontrar a extensão. Bastam dez segundos.'],
  'donate.rateButton': ['⭐ Valuta sul Chrome Web Store', '⭐ Rate on the Chrome Web Store', '⭐ Valorar en Chrome Web Store', '⭐ Noter sur le Chrome Web Store', '⭐ Im Chrome Web Store bewerten', '⭐ Avaliar na Chrome Web Store'],
  'donate.rateHint': ['Disponibile quando l\'estensione è installata dal Chrome Web Store.', 'Available once the extension is installed from the Chrome Web Store.', 'Disponible cuando la extensión se instala desde Chrome Web Store.', 'Disponible une fois l\'extension installée depuis le Chrome Web Store.', 'Verfügbar, sobald die Erweiterung aus dem Chrome Web Store installiert ist.', 'Disponível quando a extensão for instalada da Chrome Web Store.'],

  // ── Impostazioni ──
  'settings.general': ['⚙️ Impostazioni Generali', '⚙️ General Settings', '⚙️ Ajustes generales', '⚙️ Réglages généraux', '⚙️ Allgemeine Einstellungen', '⚙️ Definições gerais'],
  'settings.language': ['🌍 Lingua', '🌍 Language', '🌍 Idioma', '🌍 Langue', '🌍 Sprache', '🌍 Idioma'],
  'settings.languageChanged': ['Lingua aggiornata', 'Language updated', 'Idioma actualizado', 'Langue mise à jour', 'Sprache aktualisiert', 'Idioma atualizado'],
  'settings.theme': ['🎨 Tema Interfaccia', '🎨 Interface Theme', '🎨 Tema de la interfaz', '🎨 Thème de l\'interface', '🎨 Oberflächen-Design', '🎨 Tema da interface'],
  'settings.themeChanged': ['Tema aggiornato', 'Theme updated', 'Tema actualizado', 'Thème mis à jour', 'Design aktualisiert', 'Tema atualizado'],
  'settings.themeMidnight': ['Midnight (scuro, predefinito)', 'Midnight (dark, default)', 'Midnight (oscuro, por defecto)', 'Midnight (sombre, par défaut)', 'Midnight (dunkel, Standard)', 'Midnight (escuro, predefinido)'],
  'settings.themeSolar': ['Solar (chiaro)', 'Solar (light)', 'Solar (claro)', 'Solar (clair)', 'Solar (hell)', 'Solar (claro)'],
  'settings.themeCyber': ['Cyberpunk (neon)', 'Cyberpunk (neon)', 'Cyberpunk (neón)', 'Cyberpunk (néon)', 'Cyberpunk (Neon)', 'Cyberpunk (néon)'],
  'settings.themeGameboy': ['Retro Gameboy', 'Retro Gameboy', 'Gameboy retro', 'Gameboy rétro', 'Retro-Gameboy', 'Gameboy retro'],
  'settings.backup': ['💾 Backup del Salvataggio', '💾 Save Backup', '💾 Copia de seguridad', '💾 Sauvegarde', '💾 Spielstand-Backup', '💾 Cópia de segurança'],
  'settings.backupHint': ['Crea una copia del salvataggio prima di modificarlo: se qualcosa non ti convince puoi tornare indietro. Vengono conservati gli ultimi {n} backup.', 'Make a copy of your save before editing it, so you can go back if something goes wrong. The last {n} backups are kept.', 'Crea una copia de tu partida antes de editarla: si algo no te convence, puedes volver atrás. Se conservan las últimas {n} copias.', 'Créez une copie de votre sauvegarde avant de la modifier : vous pourrez revenir en arrière. Les {n} dernières sauvegardes sont conservées.', 'Erstelle eine Kopie deines Spielstands vor dem Bearbeiten, um zurückkehren zu können. Die letzten {n} Backups bleiben erhalten.', 'Cria uma cópia do teu save antes de o editares: se algo correr mal podes voltar atrás. São guardados os últimos {n} backups.'],
  'settings.backupName': ['Nome (facoltativo)', 'Name (optional)', 'Nombre (opcional)', 'Nom (facultatif)', 'Name (optional)', 'Nome (opcional)'],
  'settings.backupCreate': ['💾 Crea', '💾 Create', '💾 Crear', '💾 Créer', '💾 Erstellen', '💾 Criar'],
  'settings.backupNone': ['Nessun backup salvato.', 'No backups saved.', 'No hay copias guardadas.', 'Aucune sauvegarde enregistrée.', 'Keine Backups gespeichert.', 'Nenhum backup guardado.'],
  'settings.backupRestore': ['Ripristina', 'Restore', 'Restaurar', 'Restaurer', 'Wiederherstellen', 'Restaurar'],
  'settings.backupRestoreTitle': ['Ripristina questo salvataggio', 'Restore this save', 'Restaurar esta partida', 'Restaurer cette sauvegarde', 'Diesen Spielstand wiederherstellen', 'Restaurar este save'],
  'settings.backupExportTitle': ['Scarica come file', 'Download as file', 'Descargar como archivo', 'Télécharger en fichier', 'Als Datei herunterladen', 'Transferir como ficheiro'],
  'settings.backupImport': ['⬆ Importa da file', '⬆ Import from file', '⬆ Importar desde archivo', '⬆ Importer depuis un fichier', '⬆ Aus Datei importieren', '⬆ Importar de ficheiro'],
  'settings.backupNote': ['I backup restano in questo browser e spariscono se disinstalli l\'estensione: esportali su file per conservarli. Il file contiene anche il token del tuo account di gioco, quindi non condividerlo.', 'Backups live in this browser and disappear if you uninstall the extension: export them to a file to keep them. The file also contains your game account token, so don\'t share it.', 'Las copias se guardan en este navegador y desaparecen si desinstalas la extensión: expórtalas a un archivo para conservarlas. El archivo también contiene el token de tu cuenta, así que no lo compartas.', 'Les sauvegardes restent dans ce navigateur et disparaissent si vous désinstallez l\'extension : exportez-les dans un fichier. Le fichier contient aussi le jeton de votre compte, ne le partagez pas.', 'Backups liegen in diesem Browser und verschwinden beim Deinstallieren: exportiere sie als Datei. Die Datei enthält auch dein Spielkonto-Token, teile sie also nicht.', 'Os backups ficam neste navegador e desaparecem se desinstalares a extensão: exporta-os para ficheiro. O ficheiro contém também o token da tua conta, por isso não o partilhes.'],
  'settings.backupCount': ['{date} · {keys} chiavi · {size}', '{date} · {keys} keys · {size}', '{date} · {keys} claves · {size}', '{date} · {keys} clés · {size}', '{date} · {keys} Schlüssel · {size}', '{date} · {keys} chaves · {size}'],
  'settings.backupCreated': ['💾 Backup creato ({keys} chiavi, {size})', '💾 Backup created ({keys} keys, {size})', '💾 Copia creada ({keys} claves, {size})', '💾 Sauvegarde créée ({keys} clés, {size})', '💾 Backup erstellt ({keys} Schlüssel, {size})', '💾 Backup criado ({keys} chaves, {size})'],
  'settings.backupDropped': [' · {n} più vecchio rimosso', ' · {n} oldest removed', ' · {n} más antiguo eliminado', ' · {n} plus ancien supprimé', ' · {n} ältestes entfernt', ' · {n} mais antigo removido'],
  'settings.backupCreating': ['Creazione backup...', 'Creating backup...', 'Creando copia...', 'Création de la sauvegarde...', 'Backup wird erstellt...', 'A criar backup...'],
  'settings.backupDownloaded': ['⬇ Backup scaricato', '⬇ Backup downloaded', '⬇ Copia descargada', '⬇ Sauvegarde téléchargée', '⬇ Backup heruntergeladen', '⬇ Backup transferido'],
  'settings.backupDeleted': ['🗑️ Backup eliminato', '🗑️ Backup deleted', '🗑️ Copia eliminada', '🗑️ Sauvegarde supprimée', '🗑️ Backup gelöscht', '🗑️ Backup eliminado'],
  'settings.backupImporting': ['Importazione...', 'Importing...', 'Importando...', 'Importation...', 'Import läuft...', 'A importar...'],
  'settings.backupImported': ['⬆ Backup importato ({keys} chiavi)', '⬆ Backup imported ({keys} keys)', '⬆ Copia importada ({keys} claves)', '⬆ Sauvegarde importée ({keys} clés)', '⬆ Backup importiert ({keys} Schlüssel)', '⬆ Backup importado ({keys} chaves)'],
  'settings.backupRestored': ['✅ Ripristinate {n} chiavi', '✅ Restored {n} keys', '✅ Restauradas {n} claves', '✅ {n} clés restaurées', '✅ {n} Schlüssel wiederhergestellt', '✅ {n} chaves restauradas'],
  'settings.backupRemoved': [', {n} più recenti rimosse', ', {n} newer ones removed', ', {n} más recientes eliminadas', ', {n} plus récentes supprimées', ', {n} neuere entfernt', ', {n} mais recentes removidas'],
  'settings.restoreConfirm': ['Ripristinare questo backup?\n\nIl salvataggio attuale su pokelike.xyz verrà sostituito e la pagina del gioco ricaricata.', 'Restore this backup?\n\nYour current save on pokelike.xyz will be replaced and the game page reloaded.', '¿Restaurar esta copia?\n\nTu partida actual en pokelike.xyz será reemplazada y la página del juego se recargará.', 'Restaurer cette sauvegarde ?\n\nVotre sauvegarde actuelle sur pokelike.xyz sera remplacée et la page du jeu rechargée.', 'Dieses Backup wiederherstellen?\n\nDein aktueller Spielstand auf pokelike.xyz wird ersetzt und die Spielseite neu geladen.', 'Restaurar este backup?\n\nO teu save atual em pokelike.xyz será substituído e a página do jogo recarregada.'],

  // ── Ripristino e cloud ──
  'settings.restoreMode': ['☁️ Ripristino con sincronizzazione cloud', '☁️ Restoring with cloud sync', '☁️ Restauración con sincronización en la nube', '☁️ Restauration avec synchronisation cloud', '☁️ Wiederherstellung mit Cloud-Sync', '☁️ Restauro com sincronização na nuvem'],
  'settings.restoreModeAsk': ['Chiedi ogni volta', 'Ask every time', 'Preguntar cada vez', 'Demander à chaque fois', 'Jedes Mal fragen', 'Perguntar sempre'],
  'settings.restoreModeCloud': ['Torna indietro davvero (aggiorna il server)', 'Really roll back (update the server)', 'Revertir de verdad (actualiza el servidor)', 'Revenir vraiment en arrière (met à jour le serveur)', 'Wirklich zurücksetzen (Server aktualisieren)', 'Voltar atrás mesmo (atualiza o servidor)'],
  'settings.restoreModeLocal': ['Solo su questo browser', 'This browser only', 'Solo en este navegador', 'Sur ce navigateur uniquement', 'Nur in diesem Browser', 'Apenas neste navegador'],
  'settings.restoreModeHint': ['Il gioco conserva la copia con più progresso, quindi un backup va caricato anche sul server per non essere annullato al ricaricamento.', 'The game keeps whichever copy has more progress, so a backup must also be uploaded to the server or it gets undone on reload.', 'El juego conserva la copia con más progreso, así que la copia debe subirse también al servidor para que no se deshaga al recargar.', 'Le jeu conserve la copie la plus avancée : une sauvegarde doit donc aussi être envoyée au serveur, sinon elle est annulée au rechargement.', 'Das Spiel behält die Kopie mit mehr Fortschritt, daher muss ein Backup auch zum Server hochgeladen werden.', 'O jogo mantém a cópia com mais progresso, por isso o backup tem de ser enviado também para o servidor.'],
  'settings.restoreModeChanged': ['Preferenza di ripristino aggiornata', 'Restore preference updated', 'Preferencia de restauración actualizada', 'Préférence de restauration mise à jour', 'Wiederherstellungs-Einstellung aktualisiert', 'Preferência de restauro atualizada'],
  'cloud.title': ['Sincronizzazione cloud attiva', 'Cloud sync is active', 'Sincronización en la nube activa', 'Synchronisation cloud active', 'Cloud-Sync ist aktiv', 'Sincronização na nuvem ativa'],
  'cloud.text': ['Il gioco tiene una copia del salvataggio sul suo server e, quando i due non coincidono, conserva quello con più progresso. Un backup è più indietro, quindi va deciso cosa farne.', 'The game keeps a copy of your save on its server and, when the two differ, keeps whichever has more progress. A backup is further behind, so you need to decide what to do.', 'El juego guarda una copia de tu partida en su servidor y, cuando no coinciden, conserva la que tiene más progreso. Una copia va más atrasada, así que hay que decidir qué hacer.', 'Le jeu conserve une copie de votre sauvegarde sur son serveur et, en cas de différence, garde celle qui a le plus de progression. Une sauvegarde est en retard : il faut décider.', 'Das Spiel hält eine Kopie auf seinem Server und behält bei Abweichungen die mit mehr Fortschritt. Ein Backup liegt zurück, also musst du entscheiden.', 'O jogo guarda uma cópia do teu save no servidor e, quando diferem, mantém a que tem mais progresso. Um backup está atrasado, por isso tens de decidir.'],
  'cloud.choiceCloud': ['↩ Torna indietro davvero', '↩ Really roll back', '↩ Revertir de verdad', '↩ Revenir vraiment en arrière', '↩ Wirklich zurücksetzen', '↩ Voltar atrás mesmo'],
  'cloud.choiceCloudDesc': ['Ripristina il backup e lo carica sul server del gioco. Il progresso più recente viene perso, anche da altri dispositivi. È quello che serve per annullare delle modifiche.', 'Restores the backup and uploads it to the game server. More recent progress is lost, on other devices too. This is what you want to undo changes.', 'Restaura la copia y la sube al servidor del juego. El progreso más reciente se pierde, también en otros dispositivos. Es lo que necesitas para deshacer cambios.', 'Restaure la sauvegarde et l\'envoie au serveur du jeu. La progression récente est perdue, y compris sur d\'autres appareils. C\'est ce qu\'il faut pour annuler des modifications.', 'Stellt das Backup wieder her und lädt es zum Spielserver hoch. Neuerer Fortschritt geht verloren, auch auf anderen Geräten. Genau das brauchst du zum Rückgängigmachen.', 'Restaura o backup e envia-o para o servidor do jogo. O progresso mais recente perde-se, também noutros dispositivos. É o que precisas para desfazer alterações.'],
  'cloud.choiceLocal': ['👁 Solo su questo browser', '👁 This browser only', '👁 Solo en este navegador', '👁 Sur ce navigateur uniquement', '👁 Nur in diesem Browser', '👁 Apenas neste navegador'],
  'cloud.choiceLocalDesc': ['Ripristina senza toccare il salvataggio sul server. Alla prossima ricarica normale il server rivince e il ripristino sparisce. Utile solo per dare un\'occhiata.', 'Restores without touching the server copy. On the next normal reload the server wins again and the restore disappears. Only useful for a quick look.', 'Restaura sin tocar la copia del servidor. En la siguiente recarga normal el servidor vuelve a ganar y la restauración desaparece. Solo sirve para echar un vistazo.', 'Restaure sans toucher à la copie du serveur. Au prochain rechargement normal, le serveur reprend le dessus et la restauration disparaît. Utile juste pour regarder.', 'Stellt wieder her, ohne die Server-Kopie zu ändern. Beim nächsten normalen Laden gewinnt der Server wieder. Nur zum Nachsehen nützlich.', 'Restaura sem tocar na cópia do servidor. No próximo carregamento normal o servidor volta a ganhar e o restauro desaparece. Só serve para espreitar.'],
  'cloud.remember': ['Ricorda la scelta (modificabile nelle impostazioni)', 'Remember my choice (changeable in settings)', 'Recordar mi elección (modificable en ajustes)', 'Mémoriser mon choix (modifiable dans les réglages)', 'Auswahl merken (in den Einstellungen änderbar)', 'Memorizar a escolha (alterável nas definições)'],
  'cloud.uploaded': [' · salvataggio cloud aggiornato', ' · cloud save updated', ' · partida en la nube actualizada', ' · sauvegarde cloud mise à jour', ' · Cloud-Spielstand aktualisiert', ' · save na nuvem atualizado'],
  'cloud.paused': [' · solo locale, il server non è stato toccato', ' · local only, the server was not touched', ' · solo local, el servidor no se ha tocado', ' · local uniquement, le serveur n\'a pas été modifié', ' · nur lokal, der Server blieb unberührt', ' · apenas local, o servidor não foi tocado'],
  'cloud.failed': [' · ⚠ cloud non aggiornato: {err}', ' · ⚠ cloud not updated: {err}', ' · ⚠ nube no actualizada: {err}', ' · ⚠ cloud non mis à jour : {err}', ' · ⚠ Cloud nicht aktualisiert: {err}', ' · ⚠ nuvem não atualizada: {err}'],

  // ── Zona pericolo ──
  'settings.danger': ['⚠️ Zona Pericolo', '⚠️ Danger Zone', '⚠️ Zona peligrosa', '⚠️ Zone dangereuse', '⚠️ Gefahrenzone', '⚠️ Zona de perigo'],
  'settings.dangerHint': ['Azzera le impostazioni dell\'estensione e cancella tutti i backup salvati. Il salvataggio su pokelike.xyz non viene toccato. Esporta i backup che vuoi tenere prima di procedere.', 'Resets the extension settings and deletes every saved backup. Your save on pokelike.xyz is not touched. Export any backups you want to keep first.', 'Restablece los ajustes de la extensión y borra todas las copias guardadas. Tu partida en pokelike.xyz no se toca. Exporta antes las copias que quieras conservar.', 'Réinitialise les réglages de l\'extension et supprime toutes les sauvegardes. Votre sauvegarde sur pokelike.xyz n\'est pas touchée. Exportez d\'abord celles à conserver.', 'Setzt die Einstellungen zurück und löscht alle Backups. Dein Spielstand auf pokelike.xyz bleibt unberührt. Exportiere vorher, was du behalten willst.', 'Repõe as definições da extensão e apaga todos os backups. O teu save em pokelike.xyz não é tocado. Exporta antes os backups que queiras manter.'],
  'settings.reset': ['Reset Completo Dati', 'Full Data Reset', 'Restablecer todos los datos', 'Réinitialisation complète', 'Vollständiger Daten-Reset', 'Reposição total dos dados'],
  'settings.resetConfirm': ['Resettare i dati dell\'estensione?\n\nVerranno cancellati anche tutti i backup del salvataggio. L\'azione non può essere annullata.', 'Reset the extension data?\n\nAll save backups will be deleted too. This cannot be undone.', '¿Restablecer los datos de la extensión?\n\nTambién se borrarán todas las copias. No se puede deshacer.', 'Réinitialiser les données de l\'extension ?\n\nToutes les sauvegardes seront aussi supprimées. Action irréversible.', 'Erweiterungsdaten zurücksetzen?\n\nAlle Backups werden ebenfalls gelöscht. Nicht rückgängig zu machen.', 'Repor os dados da extensão?\n\nTodos os backups serão apagados também. Não pode ser anulado.'],
  'settings.resetDone': ['Dati resettati. L\'estensione verrà ricaricata.', 'Data reset. The extension will reload.', 'Datos restablecidos. La extensión se recargará.', 'Données réinitialisées. L\'extension va se recharger.', 'Daten zurückgesetzt. Die Erweiterung wird neu geladen.', 'Dados repostos. A extensão será recarregada.'],

  // ── Backup: errori ──
  'backup.noData': ['Nessun dato di salvataggio da copiare', 'No save data to copy', 'No hay datos de partida que copiar', 'Aucune donnée de sauvegarde à copier', 'Keine Spielstanddaten zum Kopieren', 'Sem dados de save para copiar'],
  'backup.noSpace': ['Spazio insufficiente per il backup ({err}). Eliminane qualcuno.', 'Not enough space for the backup ({err}). Delete some.', 'Espacio insuficiente para la copia ({err}). Elimina alguna.', 'Espace insuffisant pour la sauvegarde ({err}). Supprimez-en.', 'Zu wenig Speicher für das Backup ({err}). Lösche einige.', 'Espaço insuficiente para o backup ({err}). Elimina alguns.'],
  'backup.notFound': ['Backup non trovato o già eliminato', 'Backup not found or already deleted', 'Copia no encontrada o ya eliminada', 'Sauvegarde introuvable ou déjà supprimée', 'Backup nicht gefunden oder bereits gelöscht', 'Backup não encontrado ou já eliminado'],
  'backup.manual': ['Backup manuale', 'Manual backup', 'Copia manual', 'Sauvegarde manuelle', 'Manuelles Backup', 'Backup manual'],
  'backup.imported': ['{label} (importato)', '{label} (imported)', '{label} (importada)', '{label} (importée)', '{label} (importiert)', '{label} (importado)'],
  'backup.badJson': ['Il file non è un JSON valido', 'The file is not valid JSON', 'El archivo no es un JSON válido', 'Le fichier n\'est pas un JSON valide', 'Die Datei ist kein gültiges JSON', 'O ficheiro não é um JSON válido'],
  'backup.badFormat': ['Il file non è un backup di Pokélike Editor', 'The file is not a Pokélike Editor backup', 'El archivo no es una copia de Pokélike Editor', 'Le fichier n\'est pas une sauvegarde Pokélike Editor', 'Die Datei ist kein Pokélike-Editor-Backup', 'O ficheiro não é um backup do Pokélike Editor'],
  'backup.emptyFile': ['Il backup è vuoto', 'The backup is empty', 'La copia está vacía', 'La sauvegarde est vide', 'Das Backup ist leer', 'O backup está vazio'],
  'backup.badKeys': ['Il backup contiene chiavi non riconosciute', 'The backup contains unrecognised keys', 'La copia contiene claves no reconocidas', 'La sauvegarde contient des clés non reconnues', 'Das Backup enthält unbekannte Schlüssel', 'O backup contém chaves não reconhecidas'],
  'backup.pushMissing': ['funzione di upload non trovata', 'upload function not found', 'función de subida no encontrada', 'fonction d\'envoi introuvable', 'Upload-Funktion nicht gefunden', 'função de envio não encontrada'],
  'backup.pushRejected': ['il server ha rifiutato il caricamento', 'the server rejected the upload', 'el servidor rechazó la subida', 'le serveur a refusé l\'envoi', 'der Server hat den Upload abgelehnt', 'o servidor recusou o envio'],
  'backup.pushNetwork': ['errore di rete', 'network error', 'error de red', 'erreur réseau', 'Netzwerkfehler', 'erro de rede'],
  'backup.pageNotLoaded': ['la pagina non ha finito di caricare', 'the page did not finish loading', 'la página no terminó de cargar', 'la page n\'a pas fini de charger', 'die Seite wurde nicht fertig geladen', 'a página não terminou de carregar']
};

// Controllo di coerenza: ogni voce deve coprire tutte le lingue.
for (const [key, values] of Object.entries(DICT)) {
  if (values.length !== LANGS.length) {
    console.warn(`i18n: "${key}" ha ${values.length} traduzioni invece di ${LANGS.length}`);
  }
}

let current = null;

export function getLanguage() {
  if (current) return current;
  const saved = localStorage.getItem(LANG_KEY);
  if (LANGS.includes(saved)) return (current = saved);

  // Prima apertura: si parte dalla lingua dell'estensione, cioe' quella che
  // chrome.i18n ha gia' scelto per nome e descrizione nel manifest. Cosi'
  // popup e metadati partono d'accordo.
  let ui = '';
  try {
    ui = (chrome.i18n.getUILanguage() || '').slice(0, 2).toLowerCase();
  } catch (e) {
    ui = (navigator.language || '').slice(0, 2).toLowerCase();
  }
  return (current = LANGS.includes(ui) ? ui : 'it');
}

export function setLanguage(lang) {
  if (!LANGS.includes(lang)) return;
  current = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
}

export function t(key, vars) {
  const entry = DICT[key];
  if (!entry) return key;
  const index = LANGS.indexOf(getLanguage());
  let text = entry[index] ?? entry[0];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}

// Traduce il markup statico di popup.html: data-i18n per il testo,
// data-i18n-title / data-i18n-placeholder per gli attributi.
export function applyStaticTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.documentElement.lang = getLanguage();
}
