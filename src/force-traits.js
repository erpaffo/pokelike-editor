// Tratti forzati: il calcolo e il riquadro che li mostra nel gioco.
//
// I tier dei tratti non sono un dato del salvataggio: il gioco li ricalcola
// dalla squadra con computeTraitTiers() prima di ogni lotta, quindi scriverli
// non servirebbe a niente. L'unico modo per imporli senza toccare la squadra e'
// avvolgere quella funzione nella pagina e sovrascriverne il risultato.
//
// Lo script gira nel mondo MAIN al document_start, cioe' prima del gioco: la
// funzione ancora non esiste e va attesa. Non si puo' usare un accessor con
// Object.defineProperty, perche' una dichiarazione di funzione globale usa
// DefineOwnProperty e sostituirebbe l'accessor senza chiamarne il setter; si
// aspetta quindi che compaia e la si riassegna (la proprieta' e' writable).
//
// I valori da imporre stanno nel localStorage della pagina sotto una chiave
// nostra, che non comincia per poke_ ne' pkrl_: cosi' resta fuori dai backup
// del salvataggio e dalla sincronizzazione cloud del gioco.
(function () {
  const KEY = 'pkeditor_forced_traits';
  const MARK = '__pokeEditorTraitsWrapped';
  const HUD_ID = 'pokelike-editor-traits-hud';
  const POLL_MS = 100;
  const GIVE_UP_MS = 60000;
  const HUD_TICK_MS = 500;

  function config() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const cfg = JSON.parse(raw);
      return (cfg && typeof cfg === 'object') ? cfg : null;
    } catch (e) {
      return null;
    }
  }

  function save(cfg) {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* quota */ }
  }

  function desired() {
    const cfg = config();
    if (!cfg || !cfg.enabled) return null;
    const tiers = cfg.tiers;
    return (tiers && typeof tiers === 'object') ? tiers : null;
  }

  // ── il calcolo ──────────────────────────────────────────────────────────
  // I valori imposti sostituiscono quelli calcolati, tipo per tipo. I tipi non
  // elencati restano come li ha calcolati il gioco: forzare "Buio" non deve
  // cancellare gli altri tratti della squadra.
  function merge(base) {
    const tiers = desired();
    if (!tiers) return base;
    const out = Object.assign({}, base || {});
    Object.keys(tiers).forEach(function (type) {
      const value = Number(tiers[type]);
      if (!Number.isFinite(value)) return;
      if (value > 0) out[type] = Math.floor(value);
      else delete out[type];
    });
    return out;
  }

  function wrap(original) {
    function forced() {
      return merge(original.apply(this, arguments));
    }
    forced[MARK] = true;
    // Qualche punto del gioco controlla typeof prima di chiamare: il nome e la
    // lunghezza restano quelli originali per non confondere niente.
    try {
      Object.defineProperty(forced, 'name', { value: original.name, configurable: true });
    } catch (e) { /* non essenziale */ }
    return forced;
  }

  const started = Date.now();
  const timer = setInterval(function () {
    const current = window.computeTraitTiers;
    if (typeof current === 'function') {
      if (!current[MARK]) window.computeTraitTiers = wrap(current);
      clearInterval(timer);
      return;
    }
    if (Date.now() - started > GIVE_UP_MS) clearInterval(timer);
  }, POLL_MS);

  // ── il riquadro ─────────────────────────────────────────────────────────
  // Il gioco non mostra da nessuna parte i tratti imposti: li applica in lotta
  // e basta. Questo riquadro li tiene sotto gli occhi. Vive in uno shadow root
  // perche' il foglio di stile del gioco non lo tocchi, ed e' trascinabile; la
  // posizione e la visibilita' restano nella stessa chiave dei valori.

  // Il nome del tipo nella lingua del gioco, quando il gioco sa darlo.
  function typeLabel(type) {
    try {
      if (typeof window.tType === 'function') {
        const v = window.tType(type);
        if (v) return v;
      }
    } catch (e) { /* si ripiega sul nome interno */ }
    return type;
  }

  function texts() {
    const cfg = config() || {};
    const l = (cfg.hud && cfg.hud.labels) || {};
    return {
      title: l.title || 'Forced traits',
      empty: l.empty || 'No forced traits.',
      hide: l.hide || 'Hide',
      drag: l.drag || 'Drag to move'
    };
  }

  let hud = null;

  function buildHud() {
    const host = document.createElement('div');
    host.id = HUD_ID;
    // Lo shadow root isola del tutto stili e markup dal gioco.
    const root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;
    const style = document.createElement('style');
    style.textContent = [
      ':host{all:initial;}',
      '.box{position:fixed;z-index:2147483600;min-width:150px;max-width:260px;',
      'font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#f2f3f7;',
      'background:rgba(18,20,28,0.94);border:1px solid rgba(255,215,0,0.45);border-radius:10px;',
      'box-shadow:0 6px 20px rgba(0,0,0,0.45);overflow:hidden;}',
      '.head{display:flex;align-items:center;gap:6px;padding:6px 8px;cursor:move;',
      'background:rgba(255,215,0,0.12);border-bottom:1px solid rgba(255,255,255,0.08);',
      'user-select:none;touch-action:none;}',
      '.title{flex:1;font-weight:600;font-size:11px;color:#ffd700;white-space:nowrap;',
      'overflow:hidden;text-overflow:ellipsis;}',
      '.close{cursor:pointer;border:0;background:transparent;color:#f2f3f7;font-size:13px;',
      'line-height:1;padding:2px 4px;border-radius:4px;}',
      '.close:hover{background:rgba(255,255,255,0.12);}',
      '.body{padding:6px 8px;max-height:220px;overflow:auto;}',
      '.row{display:flex;justify-content:space-between;gap:10px;padding:2px 0;}',
      '.type{color:#ffd700;}',
      '.tier{font-variant-numeric:tabular-nums;}',
      '.empty{opacity:0.7;}'
    ].join('');
    const box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = '<div class="head"><span class="title"></span>'
      + '<button class="close" type="button">✕</button></div>'
      + '<div class="body"></div>';
    root.appendChild(style);
    root.appendChild(box);

    const head = box.querySelector('.head');
    const close = box.querySelector('.close');

    close.addEventListener('click', function () {
      const cfg = config() || {};
      cfg.hud = Object.assign({}, cfg.hud, { visible: false });
      save(cfg);
      render();
    });

    // Trascinamento: si tiene la posizione dentro lo schermo, altrimenti una
    // finestra rimpicciolita lascerebbe il riquadro fuori portata per sempre.
    let dragging = false, offX = 0, offY = 0;
    head.addEventListener('pointerdown', function (e) {
      if (e.target === close) return;
      dragging = true;
      const r = box.getBoundingClientRect();
      offX = e.clientX - r.left;
      offY = e.clientY - r.top;
      try { head.setPointerCapture(e.pointerId); } catch (err) { /* vecchi browser */ }
      e.preventDefault();
    });
    head.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      place(box, e.clientX - offX, e.clientY - offY);
    });
    const stop = function () {
      if (!dragging) return;
      dragging = false;
      const r = box.getBoundingClientRect();
      const cfg = config() || {};
      cfg.hud = Object.assign({}, cfg.hud, { x: Math.round(r.left), y: Math.round(r.top) });
      save(cfg);
    };
    head.addEventListener('pointerup', stop);
    head.addEventListener('pointercancel', stop);

    (document.body || document.documentElement).appendChild(host);
    return { host: host, box: box, title: box.querySelector('.title'), body: box.querySelector('.body') };
  }

  function place(box, x, y) {
    const w = box.offsetWidth || 180;
    const h = box.offsetHeight || 80;
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);
    box.style.left = Math.min(Math.max(0, x), maxX) + 'px';
    box.style.top = Math.min(Math.max(0, y), maxY) + 'px';
    box.style.right = 'auto';
    box.style.bottom = 'auto';
  }

  function render() {
    const cfg = config();
    const tiers = desired();
    const wanted = !!(cfg && cfg.enabled && (!cfg.hud || cfg.hud.visible !== false));

    if (!wanted) {
      if (hud && hud.host.isConnected) hud.host.remove();
      hud = null;
      return;
    }
    if (!document.body && !document.documentElement) return;
    // Il gioco ridisegna intere schermate: se il riquadro e' stato staccato
    // dal documento va rimesso, altrimenti sparirebbe senza motivo apparente.
    if (!hud || !hud.host.isConnected) hud = buildHud();

    const label = texts();
    hud.title.textContent = label.title;
    hud.box.querySelector('.close').title = label.hide;
    hud.box.querySelector('.head').title = label.drag;

    const rows = Object.keys(tiers || {})
      .filter(function (type) { return Number(tiers[type]) > 0; })
      .sort(function (a, b) { return Number(tiers[b]) - Number(tiers[a]); });

    if (!rows.length) {
      hud.body.innerHTML = '<div class="empty"></div>';
      hud.body.firstChild.textContent = label.empty;
    } else {
      hud.body.textContent = '';
      rows.forEach(function (type) {
        const row = document.createElement('div');
        row.className = 'row';
        const name = document.createElement('span');
        name.className = 'type';
        name.textContent = typeLabel(type);
        const tier = document.createElement('span');
        tier.className = 'tier';
        tier.textContent = String(Math.floor(Number(tiers[type])));
        row.appendChild(name);
        row.appendChild(tier);
        hud.body.appendChild(row);
      });
    }

    const pos = (cfg && cfg.hud) || {};
    if (typeof pos.x === 'number' && typeof pos.y === 'number') {
      place(hud.box, pos.x, pos.y);
    } else if (!hud.box.style.left) {
      hud.box.style.right = '12px';
      hud.box.style.top = '12px';
    }
  }

  // La configurazione cambia dal popup dell'estensione, che vive in un altro
  // contesto: l'evento `storage` non arriva, quindi si guarda la chiave.
  let lastSeen = null;
  setInterval(function () {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return; }
    const moved = hud && !hud.host.isConnected;
    if (raw === lastSeen && !moved) return;
    lastSeen = raw;
    render();
  }, HUD_TICK_MS);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
