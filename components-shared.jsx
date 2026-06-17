/* global React, PUEBLO, HIGHLIGHTS, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, TRAMITES, NOTICIAS, GALERIA, PATRIMONIO */
const { useState, useEffect, useRef, useMemo } = React;

// =============== ICONS ===============
const Icon = {
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowR: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  play: (p) => <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" {...p}><path d="M3 1.5L10.5 6 3 10.5V1.5Z"/></svg>,
  pin: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M7 1C4.5 1 2.5 3 2.5 5.5c0 3 4.5 7.5 4.5 7.5s4.5-4.5 4.5-7.5C11.5 3 9.5 1 7 1z" stroke="currentColor" strokeWidth="1.5"/><circle cx="7" cy="5.5" r="1.5" fill="currentColor"/></svg>,
  sun: (p) => <svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...p}><circle cx="24" cy="24" r="8" fill="#d4a017"/><g stroke="#d4a017" strokeWidth="2" strokeLinecap="round"><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M11 37l4-4"/></g></svg>,
  cloud: (p) => <svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...p}><path d="M14 30c-3 0-6-2-6-6s3-6 6-6c1-5 5-8 10-8s9 3 10 8c4 0 8 3 8 7s-4 7-8 7H14z" fill="#a8b8c8" stroke="#6b7888" strokeWidth="1"/></svg>,
};

// =============== HEADER ===============
const TURISMO_MENU = [
  { id: "oficina-turismo", label: "Oficina de Turismo", img: "assets/oficina-turismo.webp", dest: "oficina-turismo" },
  { id: "turismo-deportivo", label: "Turismo Deportivo", img: "assets/menu-turismo-deportivo.webp", dest: "turismo-deportivo" },
  { id: "patrimonio-cultural", label: "Patrimonio Cultural", img: "assets/menu-patrimonio-cultural.webp", dest: "patrimonio" },
  { id: "naturaleza", label: "Naturaleza", img: "assets/menu-naturaleza.webp", dest: "naturaleza" },
  { id: "restaurantes", label: "Restaurantes", img: "assets/menu-restaurantes.webp", dest: "restaurantes" },
  { id: "alojamientos", label: "Alojamientos", img: "assets/menu-alojamientos.webp", dest: "alojamientos" },
];

function Header({ page, setPage, scrolled, transparent }) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileTur, setMobileTur] = useState(false);
  const closeTimer = useRef(null);
  // Anti-"clic fantasma": al abrir el menú en táctil (iPad/móvil), el
  // navegador emite tras el toque un segundo evento sintético que cae sobre
  // el backdrop recién creado y cierra el menú de inmediato — parece que la
  // hamburguesa "no despliega nada". Bloqueamos los cierres durante un
  // instante después de abrir (mismo patrón que el visor de fotos).
  const navLock = useRef(0);
  const links = [
    { id: "home", label: "Inicio" },
    { id: "turismo", label: "Turismo", mega: true },
    { id: "historia", label: "Historia" },
    { id: "agenda", label: "Agenda" },
    { id: "ayuntamiento", label: "Ayuntamiento" },
  ];
  const openMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const scheduleClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setMega(false), 160); };
  const go = (dest) => { setPage(dest); setOpen(false); setMega(false); setMobileTur(false); const html = document.documentElement; const prev = html.style.scrollBehavior; html.style.scrollBehavior = "auto"; window.scrollTo(0, 0); html.style.scrollBehavior = prev; };
  const toggleMenu = () => setOpen(v => {
    if (!v) { navLock.current = Date.now() + 450; return true; }
    if (Date.now() < navLock.current) return v;
    return false;
  });
  const closeMenu = () => { if (Date.now() < navLock.current) return; setOpen(false); };
  const turismoActive = page === "naturaleza" || page === "turismo";

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""} ${transparent && !scrolled ? "transparent" : ""} ${mega ? "mega-open" : ""}`}>
      {open && <div className="nav-backdrop" onClick={closeMenu}></div>}
      <div className="container header-inner">
        <a className="logo" onClick={() => go("home")} style={{cursor:"pointer"}}>
          <div className="logo-mark">
            <img src="assets/logo-enguidanos.webp" alt="Enguídanos" />
          </div>
          <div>
            <div className="logo-text">Enguídanos</div>
            <div className="logo-tag">Atracción Natural</div>
          </div>
        </a>
        <nav className={`nav ${open ? "open" : ""}`}>
          {links.map(l => (
            l.mega ? (
              <div key={l.id} className="nav-has-mega"
                onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                <a className={`nav-link nav-link-mega ${turismoActive ? "active" : ""}`}
                  onClick={() => setMobileTur(v => !v)}>
                  {l.label}
                  <svg className={`nav-caret ${mega ? "up" : ""}`} width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <div className={`mobile-sub ${mobileTur ? "show" : ""}`}>
                  <div className="mobile-sub-inner">
                    {TURISMO_MENU.map(m => (
                      <a key={m.id} className="mobile-sub-link" onClick={() => go(m.dest)}>{m.label}</a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a key={l.id}
                className={`nav-link ${page === l.id ? "active" : ""}`}
                onClick={() => go(l.id)}>
                {l.label}
              </a>
            )
          ))}
        </nav>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className={`mega-panel ${mega ? "show" : ""}`}
        onMouseEnter={openMega} onMouseLeave={scheduleClose}>
        <div className="container">
          <div className="mega-head">
            <h3 className="serif"><strong>Planes</strong> para todos los gustos</h3>
            <a className="mega-more" onClick={() => go("turismo")}>Saber más <span>↗</span></a>
          </div>
          <div className="mega-grid">
            {TURISMO_MENU.map(m => (
              <a key={m.id} className="mega-card" onClick={() => go(m.dest)}>
                <div className={`mega-card-media mega-card-media--${m.id}`}
                  style={m.img
                    ? { backgroundImage: `url(${m.img})` }
                    : { background: `linear-gradient(150deg, ${m.tint[0]}, ${m.tint[1]})` }}>
                </div>
                <div className="mega-card-scrim"></div>
                <span className="mega-card-label serif">{m.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// =============== HERO ===============
function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          draggable={false}
          src="assets/portada-v2.mp4">
        </video>
        <div className="placeholder-video" style={{zIndex:-1}}></div>
      </div>
      <div className="container hero-content">
        <div className="reveal in">
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32,color:"rgba(255,255,255,0.75)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase"}}>
            <span style={{width:24,height:1,background:"currentColor"}}></span>
            Serranía baja de Cuenca · {PUEBLO.altitud} m
          </div>
          <h1 className="hero-title">Donde el río<br/>esculpe la <em>piedra</em></h1>
          <div className="hero-sub">
            <p className="hero-tagline">
              Un pueblo de la serranía baja de Cuenca, abrazado por bosques de pino y sabina,
              y por uno de los ríos más salvajes de la península: el Cabriel.
            </p>
            <div className="hero-meta">
              <div>Habitantes<span>{PUEBLO.habitantes}</span></div>
              <div>Altitud<span>{PUEBLO.altitud} m</span></div>
              <div>Fundación<span>S. XI</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll">Desliza</div>
    </section>
  );
}

// =============== MARQUEE ===============
function Marquee() {
  const items = ["Reserva de la Biosfera", "Chorreras del Cabriel", "Castillo del s. XI", "Senderos PR-CU", "Río Cabriel", "Embalse de Contreras", "Hoz del Agua", "Atracción Natural"];
  const track = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {track.map((t, i) => <span key={i} className="dot">{t}</span>)}
      </div>
    </div>
  );
}

// =============== HIGHLIGHTS ===============
function Highlights({ setPage, navigate }) {
  const go = navigate || ((d) => setPage(d));
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Imperdibles</div>
            <h2 className="section-title">Lo que no te puedes perder de <em>Enguídanos</em></h2>
          </div>
          <div className="section-meta">Cinco lugares que cuentan, mejor que mil palabras, por qué este pueblo se llama atracción natural.</div>
        </div>
        <div className="highlights-grid">
          {HIGHLIGHTS.map((h, i) => (
            <div key={h.id} className="highlight reveal" style={{transitionDelay:`${i*0.06}s`}} onClick={() => go(h.nav ? h.nav.page : "naturaleza", h.nav ? h.nav.target : null)}>
              {h.img ? (
                <img className="highlight-img" src={h.img} alt={h.title} style={{width:"100%", height:"100%", objectFit:"cover"}} />
              ) : (
                <div className="highlight-img photo-tinted" style={{"--photo-a": h.color.a, "--photo-b": h.color.b}}>
                  <div className="photo-label">FOTO · {h.title}</div>
                </div>
              )}
              <div className="highlight-content">
                <div className="highlight-tag"><span className="dot"></span>{h.tag}</div>
                <div className="highlight-title">{h.title}</div>
                <div className="highlight-meta">{h.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== CABRIEL FEATURE ===============
function CabrielFeature() {
  return (
    <section className="cabriel">
      <div className="container cabriel-grid">
        <div className="reveal">
          <div className="eyebrow" style={{color:"var(--sol)",marginBottom:20}}>El río que nos define</div>
          <h2>El <em>Cabriel</em>,<br/>nuestro tesoro<br/>esculpido en piedra</h2>
          <p>
            Declarado Reserva Natural por sus aguas cristalinas y su biodiversidad excepcional,
            el río Cabriel atraviesa el término municipal dibujando meandros, hoces y, sobre todo,
            las espectaculares Chorreras: una sucesión de saltos y pozas turquesas labradas
            durante milenios sobre la roca calcárea.
          </p>
          <p>
            Ruta lineal de 3,2 km con final en la cascada principal. Pasarelas de madera,
            áreas de descanso y bañeras naturales en los tramos habilitados.
          </p>
          <div style={{marginTop:32, display:"flex", gap:12}}>
            <button className="btn btn-primary">Cómo llegar <Icon.arrow /></button>
            <button className="btn" style={{background:"transparent", color:"var(--bg)", border:"1px solid rgba(246,241,231,0.3)"}}>Descargar GPX</button>
          </div>
          <div className="cabriel-stats">
            <div>Recorrido<span>3,2 km</span></div>
            <div>Desnivel<span>+180 m</span></div>
            <div>Dificultad<span>Media</span></div>
          </div>
        </div>
        <div className="reveal reveal-delay-2">
          <div className="cabriel-image photo-tinted">
            <div className="photo-label" style={{fontSize:11}}>FOTO · Las Chorreras del Cabriel · plano cenital o cascada principal</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== AGENDA + WEATHER ===============
function AgendaPreview({ setPage }) {
  return (
    <section className="section agenda-preview">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Próximos eventos</div>
            <h2 className="section-title">¿Qué pasa en <em>el pueblo</em>?</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setPage("agenda")}>Ver agenda completa <Icon.arrow /></button>
        </div>
        <div className="agenda-split">
          <div className="events-list reveal">
            {(() => {
              const todayISO = new Date().toISOString().slice(0, 10);
              const sorted = expandEventos(EVENTOS).sort((a, b) => a.date.localeCompare(b.date));
              const upcoming = sorted.filter(e => e.date >= todayISO);        // próximos, ascendente
              const past = sorted.filter(e => e.date < todayISO).reverse();    // pasados recientes primero
              const list = [...upcoming, ...past].slice(0, 4);
              return list.map((ev, i) => {
                const p = parseEvDate(ev.date);
                const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
                return (
                  <div key={i} className="event-row" onClick={() => setPage("agenda")}>
                    <div className="event-date">
                      {p.day ? <>{p.day}<span>{p.abbr}</span></> : <span className="event-date-mo">{p.abbr}<small>{p.y}</small></span>}
                    </div>
                    <div className="event-title">{ev.title}</div>
                    <div className="event-meta">{ev.when}</div>
                    <div>
                      <span className="event-cat">
                        <span className="swatch" style={{background: c.color}}></span>
                        {c.label}
                      </span>
                    </div>
                    <div className="event-arrow"><Icon.arrowR /></div>
                  </div>
                );
              });
            })()}
          </div>
          <Weather />
        </div>
      </div>
    </section>
  );
}

// WMO weather-code → [texto, emoji]
const WMO_CODES = {
  0:["Despejado","☀️"], 1:["Mayormente despejado","🌤️"], 2:["Parcialmente nublado","⛅"], 3:["Nublado","☁️"],
  45:["Niebla","🌫️"], 48:["Niebla con escarcha","🌫️"],
  51:["Llovizna débil","🌦️"], 53:["Llovizna","🌦️"], 55:["Llovizna intensa","🌦️"],
  56:["Llovizna helada","🌧️"], 57:["Llovizna helada","🌧️"],
  61:["Lluvia débil","🌧️"], 63:["Lluvia","🌧️"], 65:["Lluvia fuerte","🌧️"],
  66:["Lluvia helada","🌧️"], 67:["Lluvia helada","🌧️"],
  71:["Nieve débil","🌨️"], 73:["Nieve","🌨️"], 75:["Nieve intensa","❄️"], 77:["Aguanieve","🌨️"],
  80:["Chubascos","🌦️"], 81:["Chubascos","🌦️"], 82:["Chubascos fuertes","⛈️"],
  85:["Chubascos de nieve","🌨️"], 86:["Chubascos de nieve","🌨️"],
  95:["Tormenta","⛈️"], 96:["Tormenta con granizo","⛈️"], 99:["Tormenta con granizo","⛈️"],
};
function Weather() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    const url = "https://api.open-meteo.com/v1/forecast?latitude=39.674&longitude=-1.606" +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset" +
      "&timezone=Europe%2FMadrid&forecast_days=5";
    const load = () => fetch(url).then(r => r.json())
      .then(j => { if (alive) { setData(j); setErr(false); } })
      .catch(() => { if (alive) setErr(true); });
    load();
    const t = setInterval(load, 15 * 60 * 1000); // refresca cada 15 min
    return () => { alive = false; clearInterval(t); };
  }, []);

  const days = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];
  const dirName = (deg) => ["N","NE","E","SE","S","SO","O","NO"][Math.round((deg||0)/45) % 8];
  const hhmm = (iso) => { try { return new Date(iso).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}); } catch(e){ return "—"; } };
  const now = new Date();

  const header = (
    <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"var(--ink-3)",textTransform:"uppercase"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background: err ? "#b4533a" : (data ? "#4f8a4f" : "var(--ink-3)"),flexShrink:0,boxShadow: data && !err ? "0 0 0 0 rgba(79,138,79,0.5)" : "none",animation: data && !err ? "wpulse 2s infinite" : "none"}}></span>
      El tiempo · en directo
    </div>
  );

  if (err) {
    return (
      <div className="weather reveal reveal-delay-2">
        {header}
        <div style={{padding:"24px 0",textAlign:"center",color:"var(--ink-2)",fontSize:14}}>
          No se ha podido cargar el tiempo en este momento.
        </div>
      </div>
    );
  }
  if (!data || !data.current || !data.daily) {
    return (
      <div className="weather reveal reveal-delay-2">
        {header}
        <div style={{padding:"24px 0",textAlign:"center",color:"var(--ink-3)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>
          Cargando datos…
        </div>
      </div>
    );
  }

  const cur = data.current;
  const [curText, curIcon] = WMO_CODES[cur.weather_code] || ["—","🌡️"];
  const dy = data.daily;
  const forecast = dy.time.map((iso, i) => {
    const d = new Date(iso + "T12:00");
    const [, icon] = WMO_CODES[dy.weather_code[i]] || ["","🌡️"];
    return { day: i === 0 ? "HOY" : days[d.getDay()], t: Math.round(dy.temperature_2m_max[i]), icon };
  });

  return (
    <div className="weather reveal reveal-delay-2">
      {header}
      <div className="weather-current">
        <div>
          <div className="weather-place">Enguídanos · {now.toLocaleDateString("es-ES",{weekday:"long"})}</div>
          <div className="weather-temp">{Math.round(cur.temperature_2m)}<sup>°C</sup></div>
          <div className="weather-cond">{curText} · viento {Math.round(cur.wind_speed_10m)} km/h del {dirName(cur.wind_direction_10m)}</div>
        </div>
        <span className="weather-icon" style={{fontSize:52,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{curIcon}</span>
      </div>
      <div className="weather-forecast">
        {forecast.map((d, i) => (
          <div key={i} className="weather-day">
            {d.day}
            <span className="icon">{d.icon}</span>
            <span className="t">{d.t}°</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--ink-3)",textTransform:"uppercase",borderTop:"1px solid var(--line-soft)",paddingTop:12}}>
        <span>Amanecer {hhmm(dy.sunrise[0])}</span>
        <span>Ocaso {hhmm(dy.sunset[0])}</span>
      </div>
    </div>
  );
}

// =============== MAP ===============
function InteractiveMap() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(1);
  const filtered = filter === "all" ? POIS : POIS.filter(p => p.cat === filter);

  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);
  const markersRef = useRef({});
  const activeRef = useRef(active);
  const didInteract = useRef(false);
  activeRef.current = active;

  const makeIcon = (p, isActive) => window.L.divIcon({
    className: "poi-divicon",
    html: `<div class="poi-marker${isActive ? " active" : ""}" style="--c:${POI_CAT[p.cat].color}">${p.id}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  // Init map once
  useEffect(() => {
    if (!window.L || !mapEl.current || mapRef.current) return;
    const map = window.L.map(mapEl.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([39.6733, -1.6067], 13);
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    const cluster = window.L.markerClusterGroup
      ? window.L.markerClusterGroup({ maxClusterRadius: 44, showCoverageOnHover: false, spiderfyOnMaxZoom: true })
      : window.L.layerGroup();
    map.addLayer(cluster);
    mapRef.current = map;
    clusterRef.current = cluster;
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; clusterRef.current = null; markersRef.current = {}; };
  }, []);

  // Sync markers with current filter
  useEffect(() => {
    const map = mapRef.current, cluster = clusterRef.current;
    if (!map || !cluster || !window.L) return;
    cluster.clearLayers();
    markersRef.current = {};
    filtered.forEach(p => {
      const m = window.L.marker([p.lat, p.lng], { icon: makeIcon(p, p.id === activeRef.current) })
        .bindTooltip(p.name, { direction: "top", offset: [0, -12] })
        .on("click", () => setActive(p.id));
      markersRef.current[p.id] = m;
      cluster.addLayer(m);
    });
    if (filtered.length) {
      const bounds = window.L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [filter]);

  // Highlight + reveal active
  useEffect(() => {
    const map = mapRef.current, cluster = clusterRef.current;
    if (!map || !cluster || !window.L) return;
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const p = POIS.find(x => x.id === Number(id));
      if (p) m.setIcon(makeIcon(p, Number(id) === active));
    });
    if (!didInteract.current) { didInteract.current = true; return; }
    const am = markersRef.current[active];
    if (!am) return;
    if (cluster.zoomToShowLayer) {
      cluster.zoomToShowLayer(am, () => am.openTooltip());
    } else {
      map.panTo(am.getLatLng(), { animate: true });
      am.openTooltip();
    }
  }, [active]);

  return (
    <section className="section map-section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Mapa interactivo</div>
            <h2 className="section-title">Descubre el <em>territorio</em></h2>
          </div>
          <div className="section-meta">Naturaleza, patrimonio, dónde comer y dormir. Filtra y haz clic en los puntos del mapa.</div>
        </div>
      </div>
      <div className="container">
        <div className="map-container reveal">
          <div className="map-sidebar">
            <div className="map-filters">
              <button className={`filter-chip ${filter==="all"?"active":""}`} onClick={() => setFilter("all")}>Todos</button>
              {Object.entries(POI_CAT).map(([k, v]) => (
                <button key={k} className={`filter-chip ${filter===k?"active":""}`} onClick={() => setFilter(k)}>
                  <span className="swatch" style={{background:v.color}}></span>{v.label}
                </button>
              ))}
            </div>
            <div className="poi-list">
              {filtered.map(p => (
                <div key={p.id} className={`poi-item ${active===p.id?"active":""}`} onClick={() => setActive(p.id)}>
                  <div className="poi-num" style={{background: POI_CAT[p.cat].color}}>{p.id}</div>
                  <div>
                    <div className="poi-name">{p.name}</div>
                    <div className="poi-cat">{POI_CAT[p.cat].label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="map-canvas">
            <div ref={mapEl} className="leaflet-map"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== GALLERY + LIGHTBOX ===============
function Gallery() {
  const [open, setOpen] = useState(null);
  // Bloqueo anti-"clic fantasma". El navegador, tras un toque/clic, puede emitir
  // un SEGUNDO evento (sintético) que cae sobre el visor ya abierto y lo hace
  // avanzar a la foto siguiente o cerrarse. Al abrir o navegar marcamos un
  // instante de bloqueo SÍNCRONO; durante 350 ms el visor ignora cierres y
  // navegación. Se comprueba dentro de los propios manejadores (no por captura
  // en document), por lo que es inmune a cómo React delega los eventos.
  const lockUntil = useRef(0);
  const arm = () => { lockUntil.current = performance.now() + 350; };
  const locked = () => performance.now() < lockUntil.current;
  const openAt = (i) => { arm(); setOpen(i); };
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Galería</div>
            <h2 className="section-title">Enguídanos en <em>imágenes</em></h2>
          </div>
          <div className="section-meta">{GALERIA.length} fotografías · clica para ampliar</div>
        </div>
        <div className="gallery-grid">
          {GALERIA.map((g, i) => (
            <div key={i} className={`gallery-item ${g.span || ""} reveal`} style={{transitionDelay:`${(i%6)*0.04}s`}} onClick={() => openAt(i)}>
              <div className="photo-tinted" style={{"--photo-a": g.color.a, "--photo-b": g.color.b}}>
                {g.img
                  ? <img src={g.img} alt={g.title} loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                  : <div className="photo-label">FOTO · {g.title}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Lightbox open={open} setOpen={setOpen} items={GALERIA} arm={arm} locked={locked} />
    </section>
  );
}

function Lightbox({ open, setOpen, items, arm, locked }) {
  // Cierre y navegación pasan por el bloqueo: si el visor acaba de abrirse, un
  // segundo evento fantasma se ignora en vez de avanzar/cerrar.
  const close = () => { if (locked()) return; setOpen(null); };
  const go = (delta) => { if (locked()) return; arm(); setOpen((open + delta + items.length) % items.length); };
  useEffect(() => {
    const onKey = (e) => {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((open + 1) % items.length);
      if (e.key === "ArrowLeft") setOpen((open - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length, setOpen]);
  // Bloquea el scroll del fondo mientras el visor está abierto (si no, el dedo
  // sobre el backdrop desplazaba la página por detrás de la imagen).
  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open === null]);
  if (open === null) return null;
  const g = items[open];
  return (
    <div className={`lightbox open`} onClick={close}>
      <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); close(); }}>×</button>
      <div className="lightbox-counter">{String(open + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</div>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <div className="lightbox-img photo-tinted" style={{"--photo-a": g.color.a, "--photo-b": g.color.b}}>
          {g.img
            ? <img src={g.img} alt={g.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
            : <div className="photo-label">FOTO · {g.title}</div>}
        </div>
        <div className="lightbox-info">
          <div>
            <h3>{g.title}</h3>
            <p>{g.tag}</p>
          </div>
          <div className="lightbox-nav">
            <button onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============== NEWS ===============
function News({ setPage }) {
  return (
    <section className="section" style={{background:"var(--bg-2)"}}>
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Noticias del pueblo</div>
            <h2 className="section-title">Lo último de <em>Enguídanos</em></h2>
          </div>
          <a className="btn btn-outline" href="https://www.facebook.com/AyuntamientodeEnguidanos/?locale=es_ES" target="_blank" rel="noopener noreferrer">Todas las noticias <Icon.arrow /></a>
        </div>
        <div className="news-grid">
          {NOTICIAS.map((n, i) => (
            <article key={i} className="news-card reveal" style={{transitionDelay:`${i*0.08}s`}}>
              <div className="news-img photo-tinted" style={{"--photo-a":n.color.a, "--photo-b":n.color.b}}>
                {n.img
                  ? <img src={n.img} alt={n.title} loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                  : <div className="photo-label">FOTO · {n.title.slice(0, 28)}…</div>}
              </div>
              <div className="news-body">
                <div className="news-tag">
                  <span style={{width:6,height:6,borderRadius:"50%",background:"var(--terracota)"}}></span>
                  {n.tag}
                </div>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-excerpt">{n.excerpt}</p>
                <div className="news-foot">
                  <span>{n.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============== VISIT / CTA ===============
function Visit({ setPage }) {
  return (
    <section className="visit">
      <div className="container">
        <div className="visit-card reveal">
          <div style={{position:"relative", zIndex:1}}>
            <div className="eyebrow" style={{color:"rgba(255,255,255,0.85)",marginBottom:24}}>Planifica tu escapada</div>
            <h2>Ven a perderte<br/>en la <em>serranía</em></h2>
            <p>Tres horas desde Madrid, dos desde Valencia. Una semana, un fin de semana, un día. Lo que cabe, cabe.</p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
              <a className="btn btn-dark" href="https://www.google.com/maps/dir/?api=1&destination=Engu%C3%ADdanos%2C+Cuenca" target="_blank" rel="noopener noreferrer">Cómo llegar <Icon.arrow /></a>
              <button className="btn" style={{background:"#fff", color:"var(--terracota-deep)"}} onClick={() => { window.scrollTo(0, 0); setPage && setPage("alojamientos"); }}>Dónde dormir</button>
            </div>
          </div>
          <div className="visit-info">
            <div className="visit-info-row">
              <span className="label">Desde Madrid</span>
              <span className="value">2h 50min · A-3</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Desde Valencia</span>
              <span className="value">1h 50min · A-3</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Desde Cuenca</span>
              <span className="value">1h 20min · CUV-3001</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Estación más cercana</span>
              <span className="value">Cuenca AVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============== FOOTER ===============
function Footer({ setPage, navigate }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="serif">Enguídanos</h3>
            <p>Pueblo de la serranía baja de Cuenca, en la Reserva de la Biosfera del Valle del Cabriel. Habitado desde el siglo XI y custodio del cañón fluvial más espectacular de la provincia.</p>
          </div>
          <div className="footer-col">
            <h4>Visitar</h4>
            <ul>
              <li><a onClick={() => navigate("naturaleza", "feature")}>Chorreras del Cabriel</a></li>
              <li><a onClick={() => navigate("oficina-turismo", "senderos")}>Rutas de senderismo</a></li>
              <li><a onClick={() => setPage("patrimonio")}>Patrimonio</a></li>
              <li><a onClick={() => setPage("agenda")}>Agenda</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Vecinos</h4>
            <ul>
              <li><a onClick={() => navigate("ayuntamiento", "area:tramites-formularios")}>Trámites</a></li>
              <li><a onClick={() => setPage("ayuntamiento")}>Tablón de anuncios</a></li>
              <li><a href="https://enguidanos.sedelectronica.es/info.0" target="_blank" rel="noopener noreferrer">Sede electrónica</a></li>
              <li><a>Bandos</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a>C/ San Blas, 2</a></li>
              <li><a>16372 Enguídanos</a></li>
              <li><a>969 145 002</a></li>
              <li><a>info@enguidanos.es</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="escudo">
            <img src="assets/escudo-enguidanos.webp" alt="Escudo de Enguídanos" />
            <span>Ayuntamiento de Enguídanos · {new Date().getFullYear()}</span>
          </div>
          <span>Diseño rediseñado con cariño · Aviso legal · Privacidad · Accesibilidad</span>
        </div>
      </div>
    </footer>
  );
}

// =============== PAGE HERO CON IMAGEN ===============
// Cabecera editorial a sangre: imagen de fondo a pantalla completa con un
// velo oscuro degradado y el título encima en blanco. Si no se pasa `img`,
// muestra un fondo oscuro con un marcador de la foto que debe ir ahí.
function PageHeroMedia({ img, alt, placeholder, position, children }) {
  return (
    <section
      className={"page-hero page-hero--bg" + (img ? "" : " page-hero--bg-ph")}
      style={img ? { backgroundImage: `url(${img})`, backgroundPosition: position || "center" } : undefined}
      role="img" aria-label={alt || placeholder || "Imagen de cabecera"}>
      <div className="container">
        <div className="page-hero-text">{children}</div>
      </div>
      {!img && <span className="page-hero-bg-label mono">{placeholder || "FOTO"}</span>}
    </section>
  );
}

Object.assign(window, {
  Header, Hero, Marquee, Highlights, CabrielFeature, AgendaPreview, Weather,
  InteractiveMap, Gallery, Lightbox, News, Visit, Footer, Icon, PageHeroMedia,
});
