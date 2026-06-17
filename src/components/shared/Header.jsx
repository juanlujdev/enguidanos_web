import React, { useState, useRef } from 'react'

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

export default Header
