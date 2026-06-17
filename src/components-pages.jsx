import React from 'react'
const { useState, useEffect, useRef, useMemo } = React;
import {
  PUEBLO, POIS, POI_CAT, EVENTOS, AGENDA_CATS, parseEvDate, expandEventos, MES_ABBR,
  TRAMITES, AREAS_CONTENT, ALCALDE, NOTICIAS, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO
} from './data.jsx'
import { HISTORIA, HISTORIA_META } from './data-historia.jsx'
import { Icon, PageHeroMedia } from './components/shared/index.js'

// Bloque de imagen histórica (hueco para foto de archivo en B/N o sepia)
function HistoriaFoto({ img }) {
  return (
    <figure className="hist-figure">
      <div className="hist-photo">
        {img.src && (
          <img src={img.src} alt={img.cap || ""} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
        )}
        <div className="hist-photo-grain"></div>
        {!img.src && <div className="photo-label">FOTO DE ARCHIVO</div>}
      </div>
      <figcaption className="hist-caption">
        <span>{img.cap}</span>
        {img.credit && <span className="hist-credit">{img.credit}</span>}
      </figcaption>
    </figure>
  );
}

// Sección histórica con índice lateral de épocas
function HistoriaLongRead() {
  const [activeId, setActiveId] = useState(HISTORIA[0].id);
  const refs = useRef({});

  // Resaltar la época visible en el índice lateral
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.dataset.histId); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const goTo = (id) => {
    const el = refs.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  };

  return (
    <div className="hist reveal in">
      {/* Cabecera del artículo */}
      <header className="hist-head">
        <div className="mono hist-kicker">{HISTORIA_META.kicker}</div>
        <p className="hist-lead"><span className="hist-dropcap">{HISTORIA_META.lead.charAt(0)}</span>{HISTORIA_META.lead.slice(1)}</p>
        <div className="hist-byline mono">Por {HISTORIA_META.byline} · {HISTORIA_META.date}</div>
      </header>

      <div className="hist-layout">
        {/* Índice lateral de épocas */}
        <aside className="hist-rail">
          <div className="mono hist-rail-title">Las épocas</div>
          <nav className="hist-rail-nav">
            {HISTORIA.map((s, i) => (
              <button key={s.id} onClick={() => goTo(s.id)}
                className={`hist-rail-link ${activeId === s.id ? "active" : ""}`}>
                <span className="hist-rail-num">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.nav}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Cuerpo del artículo */}
        <article className="hist-body">
          {HISTORIA.map((s) => (
            <section key={s.id} className="hist-section reveal" data-hist-id={s.id}
              ref={(el) => { refs.current[s.id] = el; }}>
              <div className="hist-section-head">
                <div className="mono hist-era">{s.era}</div>
                <h2 className="serif hist-title">{s.title}</h2>
              </div>
              {s.img && <HistoriaFoto img={s.img} />}
              <div className="hist-prose">
                {s.content.map((b, j) => {
                  if (b.type === "quote") return <blockquote key={j} className="hist-quote">{b.text}</blockquote>;
                  if (b.type === "list") return (
                    <ul key={j} className="hist-list">
                      {b.items.map((it, k) => <li key={k}>{it}</li>)}
                    </ul>
                  );
                  return <p key={j}>{b.text}</p>;
                })}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}

// Foto con fallback: intenta cargar la imagen real; si aún no existe,
// muestra el marcador degradado "FOTO" propio del sitio.
function PatrimonioPhoto({ item, className, children }) {
  const [ok, setOk] = useState(false);
  const c = (PATRIMONIO_CATS[item.cat] || {}).color || { a: "#9c8a6a", b: "#5a4f3a" };
  return (
    <div className={`${className || ""} photo-tinted`} style={{ "--photo-a": c.a, "--photo-b": c.b }}>
      {item.img && (
        <img src={item.img} alt={`${item.title} ${item.titleEm || ""}`} loading="lazy"
          onLoad={() => setOk(true)} onError={() => setOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: item.imgPos || "center", opacity: ok ? 1 : 0, transition: "opacity .4s" }} />
      )}
      {!ok && <div className="photo-label">FOTO · {item.title} {item.titleEm || ""}</div>}
      {children}
    </div>
  );
}

// =============== NATURALEZA PAGE ===============
// Foto con fallback para los parajes naturales.
function NaturePhoto({ item, cat, className, children }) {
  const [ok, setOk] = useState(false);
  const c = (NATURALEZA_CATS[cat || item.cat] || {}).color || { a: "#5a7a4a", b: "#2f4727" };
  return (
    <div className={`${className || ""} photo-tinted`} style={{ "--photo-a": c.a, "--photo-b": c.b }}>
      {item.img && (
        <img src={item.img} alt={`${item.title} ${item.titleEm || ""}`} loading="lazy"
          onLoad={() => setOk(true)} onError={() => setOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: item.imgPos || "center", opacity: ok ? 1 : 0, transition: "opacity .4s" }} />
      )}
      {!ok && <div className="photo-label">FOTO · {item.title} {item.titleEm || ""}</div>}
      {children}
    </div>
  );
}

function NaturalezaPage({ navTarget }) {
  const [cat, setCat] = useState("all");
  const [active, setActive] = useState(null);
  const catKeys = Object.keys(NATURALEZA_CATS);
  const filtered = cat === "all" ? NATURALEZA : NATURALEZA.filter(p => p.cat === cat);
  const D = NATURALEZA_DESTACADO;

  // Deep-link desde Imperdibles: lleva la vista al paraje destino y lo resalta.
  useEffect(() => {
    if (!navTarget) return;
    setCat("all");
    const id = navTarget === "feature" ? "nat-feature" : `nat-card-${navTarget}`;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add("in"); // posición final (sin transform de reveal)
      const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 110);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev;
      el.classList.add("deeplink-flash");
      setTimeout(() => el.classList.remove("deeplink-flash"), 2200);
    }, 300);
    return () => clearTimeout(t);
  }, [navTarget]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <main>
      <PageHeroMedia img="assets/naturaleza-portada.webp" alt="Poza de aguas turquesa entre paredes de roca rojiza en Enguídanos">
        <div className="breadcrumb"><span>Inicio</span> · Naturaleza</div>
        <h1 className="reveal in">Naturaleza<br/><em>en estado puro</em></h1>
        <p className="reveal in reveal-delay-1">Casi 10.000 hectáreas de montes de la Serranía Baja conquense, modeladas por cinco ríos y sus hoces. Un paisaje de roca caliza, agua turquesa y silencio.</p>
      </PageHeroMedia>

      {/* Contexto del paisaje */}
      <section className="section" style={{ paddingTop: 56, paddingBottom: 0 }}>
        <div className="container">
          <div className="nat-intro reveal">
            <p>El pueblo está rodeado por montes de la estribación final de la Serranía Baja conquense —La Losilla, Matallana, Azagrado, Pinos Altos, Maraña, Las Ramblas y la Dehesa Boyal—, que ocupan casi 10.000 hectáreas. El paisaje local, abrupto y sinuoso, ofrece distintas hoces o cañones de gran belleza.</p>
            <p>Cinco ríos riegan el término municipal: el <em>Cabriel</em> y sus afluentes el <em>Guadazaón</em>, el <em>Narboneta</em>, el <em>San Martín</em> y el <em>Mira</em>. Tres embalses aprovechan sus aguas para producir energía eléctrica.</p>
          </div>
        </div>
      </section>

      {/* Paraje destacado — Chorreras del Cabriel */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container">
          <div className="nat-feature reveal" id="nat-feature">
            <NaturePhoto item={D} className="nat-feature-img" />
            <div className="nat-feature-body">
              <div className="nat-badge"><span className="nat-badge-dot"></span>{D.badge}</div>
              <h2 className="serif nat-feature-title">{D.title} <em>{D.titleEm}</em></h2>
              {D.desc.map((p, i) => <p key={i} className="nat-feature-p">{p}</p>)}
              <div className="nat-feature-meta">
                {D.meta.map((m, k) => <div key={k}>{m.k}<span>{m.v}</span></div>)}
              </div>
              {D.web && (
                <a className="nat-web mono" href={D.web.href} target="_blank" rel="noopener noreferrer">
                  Más información · {D.web.label} <Icon.arrowR />
                </a>
              )}
              {D.rutas && (
                <div className="nat-feature-rutas">
                  <span className="nat-feature-rutas-label mono">Rutas señalizadas</span>
                  {D.rutas.map((c) => {
                    const r = RUTAS_INFO[c];
                    return (
                      <a key={c} className="nat-ruta-mini" href={r.pdf} title={`Descargar PDF · ${r.code} · ${r.name}`} onClick={(e) => downloadPdf(e, r.pdf, `${r.code} ${r.name}`)}>
                        <img src={r.logo} alt={`Ruta ${r.code}`} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Parajes naturales */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="nat-sec-head">
            <h2 className="serif">Parajes <em>naturales</em></h2>
            <p>Hoces labradas en la caliza, saltos de agua, embalses y enclaves singulares repartidos por todo el término.</p>
          </div>

          <div className="pat-filterbar">
            <div className="pat-filters">
              <button className={`filter-chip ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>
                Todos <span className="pat-chip-count">{NATURALEZA.length}</span>
              </button>
              {catKeys.map(k => {
                const n = NATURALEZA.filter(p => p.cat === k).length;
                return (
                  <button key={k} className={`filter-chip ${cat === k ? "active" : ""}`} onClick={() => setCat(k)}>
                    {NATURALEZA_CATS[k].label} <span className="pat-chip-count">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pat-grid">
            {filtered.map(p => (
              <button key={p.id} id={`nat-card-${p.id}`} className="pat-card reveal" onClick={() => setActive(p)}>
                <NaturePhoto item={p} className="pat-card-img" />
                <div className="pat-card-body">
                  <div className="pat-card-tag">{NATURALEZA_CATS[p.cat].label}</div>
                  <h3 className="pat-card-title">{p.title} <em>{p.titleEm}</em></h3>
                  <p className="pat-card-excerpt">{p.excerpt}</p>
                  <div className="pat-card-foot mono">Leer más <Icon.arrowR />
                    {p.rutas && (
                      <span className="pat-rutas-badges">
                        {p.rutas.map((c) => (
                          <img key={c} src={RUTAS_INFO[c].logo} alt={`Ruta ${c}`} title={`Ruta ${RUTAS_INFO[c].code} · ${RUTAS_INFO[c].name}`} />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ríos, fuentes y manantiales */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="nat-sec-head">
            <h2 className="serif">Ríos, fuentes <em>y manantiales</em></h2>
            <p>El agua es el hilo que cose este paisaje: cinco ríos vertebran el término y un puñado de fuentes brotan en el pueblo y sus alrededores.</p>
          </div>

          <div className="nat-rios-grid">
            {NATURALEZA_RIOS.map(r => (
              <figure key={r.id} className="nat-rio reveal">
                <div className="nat-rio-img photo-tinted" style={{ "--photo-a": "#5a8aa3", "--photo-b": "#2d5a72" }}>
                  {r.img
                    ? <img src={r.img} alt={r.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div className="photo-label">FOTO · {r.name}</div>}
                </div>
                <figcaption className="nat-rio-cap">{r.name}</figcaption>
              </figure>
            ))}
          </div>

          <h3 className="mono nat-sub">Fuentes del municipio</h3>
          <div className="nat-fuentes-grid">
            {NATURALEZA_FUENTES.map(f => (
              <figure key={f.id} className="nat-fuente reveal">
                <div className="nat-fuente-img photo-tinted" style={{ "--photo-a": "#7ba3bc", "--photo-b": "#3a6a7a" }}>
                  {f.img
                    ? <img src={f.img} alt={f.name} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div className="photo-label">FOTO · {f.name}</div>}
                </div>
                <figcaption className="nat-rio-cap">{f.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Detalle en panel modal */}
      {active && (
        <div className="pat-modal-overlay" onClick={() => setActive(null)}>
          <div className="pat-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pat-modal-close" onClick={() => setActive(null)} aria-label="Cerrar">✕</button>
            <NaturePhoto item={active} className="pat-modal-img" />
            <div className="pat-modal-body">
              <div className="pat-card-tag">{NATURALEZA_CATS[active.cat].label}</div>
              <h3 className="serif pat-modal-title">{active.title} <em>{active.titleEm}</em></h3>
              {active.meta && (
                <div className="pat-modal-meta">
                  {active.meta.map((m, j) => <div key={j}>{m.k}<span>{m.v}</span></div>)}
                </div>
              )}
              <div className="pat-modal-text">
                {active.desc.map((para, j) => <p key={j}>{para}</p>)}
              </div>
              {active.rutas && (
                <div className="pat-modal-rutas">
                  <div className="pat-modal-rutas-head mono">Rutas señalizadas por este paraje</div>
                  {active.rutas.map((c) => {
                    const r = RUTAS_INFO[c];
                    return (
                      <a key={c} className="pat-modal-ruta" href={r.pdf} onClick={(e) => downloadPdf(e, r.pdf, `${r.code} ${r.name}`)}>
                        <img src={r.logo} alt={`Ruta ${r.code}`} />
                        <span className="pat-modal-ruta-info">
                          <strong className="mono">{r.code}</strong>
                          <span>{r.name}</span>
                        </span>
                        <span className="pat-modal-ruta-dl mono">Descargar PDF <Icon.arrowR /></span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// =============== HISTORIA PAGE ===============
function HistoriaPage() {
  return (
    <main>
      <PageHeroMedia img="assets/historia/castillo-edad-media.webp" alt="El castillo de Enguídanos en la Edad Media">
        <div className="breadcrumb"><span>Inicio</span> · Historia</div>
        <h1 className="reveal in">Historia<br/><em>de Enguídanos</em></h1>
        <p className="reveal in reveal-delay-1">Mil años de huellas: del poblado celtíbero y la calzada romana al castillo árabe, de los señoríos y los molinos a la vida contemporánea del valle del Cabriel.</p>
      </PageHeroMedia>
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <HistoriaLongRead />
        </div>
      </section>
    </main>
  );
}

// =============== PATRIMONIO PAGE ===============
function PatrimonioPage({ navTarget }) {
  const [cat, setCat] = useState("all");
  const [active, setActive] = useState(null); // elemento abierto en el detalle

  const catKeys = Object.keys(PATRIMONIO_CATS);
  const filtered = cat === "all" ? PATRIMONIO : PATRIMONIO.filter(p => p.cat === cat);

  // Deep-link desde Imperdibles: abre la pestaña de patrimonio, lleva la vista
  // al elemento destino y lo resalta brevemente.
  useEffect(() => {
    if (!navTarget) return;
    setCat("all");
    const t = setTimeout(() => {
      const el = document.getElementById(`pat-card-${navTarget}`);
      if (!el) return;
      el.classList.add("in"); // posición final (sin transform de reveal)
      const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 110);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev;
      el.classList.add("deeplink-flash");
      setTimeout(() => el.classList.remove("deeplink-flash"), 2200);
    }, 320);
    return () => clearTimeout(t);
  }, [navTarget]);

  // Cerrar el detalle con Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <main>
      <PageHeroMedia img="assets/patrimonio-portada.webp" position="center 34%" alt="El castillo de Enguídanos sobre el cerro, con el pueblo a sus pies">
        <div className="breadcrumb"><span>Inicio</span> · <span>Turismo</span> · Patrimonio</div>
        <h1 className="reveal in">Patrimonio<br/><em>cultural</em></h1>
        <p className="reveal in reveal-delay-1">Mil años de huellas en la piedra: del poblado celtíbero al castillo árabe, de las ermitas y casas solariegas a los molinos y miradores sobre el Cabriel.</p>
      </PageHeroMedia>

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div>
              {/* Filtros por categoría + contador */}
              <div className="pat-filterbar">
                <div className="pat-filters">
                  <button className={`filter-chip ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>
                    Todos <span className="pat-chip-count">{PATRIMONIO.length}</span>
                  </button>
                  {catKeys.map(k => {
                    const n = PATRIMONIO.filter(p => p.cat === k).length;
                    return (
                      <button key={k} className={`filter-chip ${cat === k ? "active" : ""}`} onClick={() => setCat(k)}>
                        {PATRIMONIO_CATS[k].label} <span className="pat-chip-count">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rejilla de tarjetas */}
              <div className="pat-grid">
                {filtered.map((p) => (
                  <button key={p.id} id={`pat-card-${p.id}`} className="pat-card reveal" onClick={() => setActive(p)}>
                    <PatrimonioPhoto item={p} className="pat-card-img" />
                    <div className="pat-card-body">
                      <div className="pat-card-tag">{PATRIMONIO_CATS[p.cat].label}</div>
                      <h3 className="pat-card-title">{p.title} <em>{p.titleEm}</em></h3>
                      <p className="pat-card-excerpt">{p.excerpt}</p>
                      <div className="pat-card-foot mono">Leer más <Icon.arrowR /></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Detalle en panel modal */}
      {active && (
        <div className="pat-modal-overlay" onClick={() => setActive(null)}>
          <div className="pat-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pat-modal-close" onClick={() => setActive(null)} aria-label="Cerrar">✕</button>
            <PatrimonioPhoto item={active} className="pat-modal-img" />
            <div className="pat-modal-body">
              <div className="pat-card-tag">{PATRIMONIO_CATS[active.cat].label}</div>
              <h3 className="serif pat-modal-title">{active.title} <em>{active.titleEm}</em></h3>
              {active.meta && (
                <div className="pat-modal-meta">
                  {active.meta.map((m, j) => <div key={j}>{m.k}<span>{m.v}</span></div>)}
                </div>
              )}
              <div className="pat-modal-text">
                {active.desc.map((para, j) => <p key={j}>{para}</p>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// =============== AGENDA PAGE ===============
const MESES_LARGO = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// Modal a pantalla completa con el cartel del evento + su ficha
function EventoModal({ items, index, setIndex }) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIndex(null);
      else if (e.key === "ArrowRight") setIndex((index + 1) % items.length);
      else if (e.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [index, items.length, setIndex]);

  if (index === null) return null;
  const ev = items[index];
  const p = parseEvDate(ev.date);
  const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
  const fechaLarga = p.day ? `${p.day} de ${MESES_LARGO[p.mi].toLowerCase()} de ${p.y}` : `${MESES_LARGO[p.mi]} de ${p.y}`;

  return (
    <div className="agenda-modal" onClick={() => setIndex(null)}>
      <button className="agenda-modal-close" onClick={() => setIndex(null)} aria-label="Cerrar">×</button>
      <div className="agenda-modal-counter">{String(index + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</div>
      <button className="agenda-modal-arrow prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length); }} aria-label="Anterior">‹</button>
      <button className="agenda-modal-arrow next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length); }} aria-label="Siguiente">›</button>
      <div className="agenda-modal-inner" onClick={e => e.stopPropagation()}>
        <div className="agenda-modal-poster">
          <img src={ev.poster} alt={`Cartel · ${ev.title}`} />
        </div>
        <div className="agenda-modal-info">
          <span className="agenda-modal-tipo"><span className="swatch" style={{background:c.color}}></span>{ev.tipo}</span>
          <h3 className="serif">{ev.title}</h3>
          {ev.dayLabel && <div className="agenda-modal-daylabel">{ev.dayLabel}</div>}
          <p className="agenda-modal-desc">{ev.desc}</p>
          <div className="agenda-modal-meta">
            <div className="agenda-modal-row"><span className="label">Cuándo</span><span className="value">{ev.dayLabel || fechaLarga}</span></div>
            {!ev.multi && <div className="agenda-modal-row"><span className="label">Horario</span><span className="value">{ev.when}</span></div>}
            <div className="agenda-modal-row"><span className="label">Dónde</span><span className="value">{ev.place}</span></div>
          </div>
          {ev.items && ev.items.length > 0 && (
            <div className="agenda-modal-programa">
              <div className="agenda-modal-programa-head">{ev.multi ? "Programa del día" : "Programa"}</div>
              <div className="agenda-prog-bloque">
                <ul>
                  {ev.items.map((it, ii) => <li key={ii}>{it}</li>)}
                </ul>
              </div>
            </div>
          )}
          <a className="agenda-modal-dl" href={ev.poster} download={ev.poster.split("/").pop()} onClick={(e) => downloadImage(e, ev.poster, ev.title)}>Descargar cartel ↓</a>
        </div>
      </div>
    </div>
  );
}

function AgendaPage() {
  const [filter, setFilter] = useState("all");
  const [month, setMonth] = useState(new Date()); // arranca en el mes actual
  const [openEv, setOpenEv] = useState(null); // índice (dentro de `displayList`) del evento abierto
  const [tab, setTab] = useState("prox");      // "prox" = próximos · "pas" = pasados
  const [visible, setVisible] = useState(6);    // cuántos se muestran (botón "Ver más")
  useEffect(() => { setVisible(6); setOpenEv(null); }, [filter, tab]); // reinicia al cambiar filtro o pestaña

  const allRows = expandEventos(EVENTOS);
  const base = filter === "all" ? allRows : allRows.filter(e => e.cat === filter);
  const todayISO = new Date().toISOString().slice(0, 10);
  const upcoming = [...base].filter(e => e.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date)); // próximos: el más cercano primero
  const past = [...base].filter(e => e.date < todayISO).sort((a, b) => b.date.localeCompare(a.date));       // pasados: el más reciente primero
  // En "Próximos" sin eventos futuros, se cae a los pasados recientes con un aviso
  const fallbackPast = tab === "prox" && upcoming.length === 0;
  const displayList = (tab === "pas" || fallbackPast) ? past : upcoming;
  const shown = displayList.slice(0, visible);
  const filterChips = [{ k: "all", l: "Todos" }, ...Object.entries(AGENDA_CATS).map(([k, v]) => ({ k, l: v.label }))];

  // Calendar grid for current month
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // monday-first
  const daysInMonth = last.getDate();
  const daysInPrev = new Date(y, m, 0).getDate();
  const evDayMap = {};
  allRows.forEach(e => {
    const p = parseEvDate(e.date);
    if (p.y === y && p.mi === m && p.day) evDayMap[p.day] = e.cat;
  });

  const cells = [];
  for (let i = startDay - 1; i >= 0; i--) cells.push({ d: daysInPrev - i, muted: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i, muted: false, ev: evDayMap[i] });
  while (cells.length % 7 !== 0) cells.push({ d: cells.length - daysInMonth - startDay + 1, muted: true });

  const today = new Date();

  return (
    <main>
      <PageHeroMedia img="assets/hoguera-san-blas.webp" alt="Hoguera de San Blas en la plaza de Enguídanos">
        <div className="breadcrumb"><span>Inicio</span> · Agenda</div>
        <h1 className="reveal in">Agenda<br/><em>cultural</em></h1>
        <p className="reveal in reveal-delay-1">Fiestas, mercados, jornadas y rutas guiadas. Todo lo que pasa en Enguídanos durante el año. Pulsa un evento para ver su cartel.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:64}}>
        <div className="container">
          <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:64}} className="reveal agenda-layout">
            <div>
              <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap"}}>
                {filterChips.map(f => (
                  <button key={f.k}
                    className={`filter-chip ${filter===f.k?"active":""}`}
                    onClick={() => setFilter(f.k)}>
                    {f.l}
                  </button>
                ))}
              </div>
              <div className="agenda-tabs">
                <button className={`agenda-tab ${tab==="prox"?"active":""}`} onClick={() => setTab("prox")}>Próximos <span>{upcoming.length}</span></button>
                <button className={`agenda-tab ${tab==="pas"?"active":""}`} onClick={() => setTab("pas")}>Pasados <span>{past.length}</span></button>
              </div>
              {fallbackPast && (
                <div className="agenda-empty">
                  No hay eventos próximos programados por el momento. Vuelve pronto: la agenda se actualiza con regularidad.
                  <span>Mientras tanto, estos son los eventos más recientes:</span>
                </div>
              )}
              <div className="events-list">
                {shown.map((ev, i) => {
                  const p = parseEvDate(ev.date);
                  const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
                  return (
                    <div key={i} className="event-row event-row-click" onClick={() => setOpenEv(i)}>
                      <div className="event-date">
                        {p.day ? <>{p.day}<span>{p.abbr} {p.y}</span></> : <span className="event-date-mo">{p.abbr}<small>{p.y}</small></span>}
                      </div>
                      <div>
                        <div className="event-title">{ev.title}</div>
                        <div style={{fontSize:13, color:"var(--ink-3)", marginTop:6, maxWidth:360}}>{ev.multi && ev.items.length ? ev.items.join(" · ") : ev.desc}</div>
                      </div>
                      <div className="event-meta">{ev.when}</div>
                      <div>
                        <span className="event-cat">
                          <span className="swatch" style={{background:c.color}}></span>
                          {c.label}
                        </span>
                      </div>
                      <div className="event-arrow"><Icon.arrowR /></div>
                    </div>
                  );
                })}
                {displayList.length === 0 && (
                  <div className="agenda-empty">No hay eventos en esta categoría.</div>
                )}
              </div>
              {visible < displayList.length && (
                <button className="agenda-more" onClick={() => setVisible(v => v + 6)}>
                  Ver más eventos <span className="mono">({displayList.length - visible})</span>
                </button>
              )}
            </div>
            <div>
              <div className="calendar">
                <div className="calendar-head">
                  <h3 className="serif">{MESES_LARGO[m]} <span style={{color:"var(--ink-3)"}}>{y}</span></h3>
                  <div className="calendar-nav">
                    <button onClick={() => setMonth(new Date(y, m-1, 1))}>‹</button>
                    <button onClick={() => setMonth(new Date(y, m+1, 1))}>›</button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {["L","M","X","J","V","S","D"].map(d => <div key={d} className="dow">{d}</div>)}
                  {cells.map((c, i) => {
                    const isToday = !c.muted && c.d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
                    return (
                      <div key={i} className={`cal-day ${c.muted?"muted":""} ${c.ev?"has-event "+c.ev:""} ${isToday?"today":""}`}>
                        {c.d}
                      </div>
                    );
                  })}
                </div>
                <div className="calendar-legend">
                  {Object.entries(AGENDA_CATS).map(([k, v]) => (
                    <span key={k}><span style={{width:6,height:6,borderRadius:"50%",background:v.color,flexShrink:0}}></span>{v.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EventoModal items={displayList} index={openEv} setIndex={setOpenEv} />
    </main>
  );
}

// =============== AYUNTAMIENTO PAGE ===============
function AyuntamientoPage({ navTarget }) {
  const [area, setArea] = useState(null);
  useEffect(() => {
    if (navTarget && navTarget.indexOf("area:") === 0) setArea(navTarget.slice(5));
  }, [navTarget]);
  if (area) return <AreaDetail slug={area} onBack={() => { window.scrollTo(0,0); setArea(null); }} />;
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"end"}}>
            <div>
              <div className="breadcrumb"><span>Inicio</span> · Ayuntamiento</div>
              <h1 className="reveal in">Ayuntamiento<br/><em>de Enguídanos</em></h1>
              <p className="reveal in reveal-delay-1">Trámites, contacto y avisos oficiales. Aquí también empieza tu vida en el pueblo.</p>
            </div>
            <img src="assets/escudo-enguidanos.webp" alt="Escudo" style={{width:120, height:140, objectFit:"contain"}} className="reveal in reveal-delay-2"/>
          </div>
        </div>
      </section>

      <section className="section saludo">
        <div className="container">
          <div className="saludo-grid">
            <div className="saludo-figure reveal">
              <div className="saludo-photo">
                <img src="assets/alcalde-sergio-de-fez.webp" alt={ALCALDE.nombre} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
              </div>
              <div className="saludo-plate">
                <span className="mono">Alcaldía</span>
                <strong className="serif">{ALCALDE.nombre}</strong>
                <span>{ALCALDE.cargo}</span>
              </div>
            </div>
            <div className="saludo-text">
              <div className="eyebrow" style={{marginBottom:20}}>Saludo del alcalde</div>
              <h2 className="section-title reveal">Bienvenid@s a <em>Enguídanos</em></h2>
              <div className="saludo-body">
                {ALCALDE.parrafos.map((p, i) => (
                  <p key={i} className="reveal" style={{transitionDelay:`${i*0.05}s`}}>{p}</p>
                ))}
              </div>
              <div className="saludo-sign reveal">
                <span className="saludo-rubric serif">{ALCALDE.nombre}</span>
                <span className="mono">{ALCALDE.cargo}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:"var(--bg-2)"}}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Corporación municipal</div>
              <h2 className="section-title">El Ayuntamiento, <em>por áreas</em></h2>
            </div>
            <div className="section-meta">Acceso directo a las secciones del consistorio</div>
          </div>
          <div className="tramites-grid areas-grid">
            {TRAMITES.map((t, i) => {
              const ready = !!AREAS_CONTENT[t.slug];
              const onOpen = () => { window.scrollTo(0,0); setArea(t.slug); };
              const cls = `tramite reveal ${t.ext || ready ? "is-link" : "is-soon"}`;
              return (
                <div key={i} className={cls} style={{transitionDelay:`${i*0.05}s`}}
                  onClick={t.ext ? undefined : (ready ? onOpen : undefined)}>
                  <div className="tramite-num">{t.num} / Área</div>
                  <h4 className="serif">{t.title}</h4>
                  <p>{t.desc}</p>
                  {t.ext ? (
                    <a href={t.ext} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>Acceder ↗</a>
                  ) : ready ? (
                    <a onClick={onOpen}>Ver sección →</a>
                  ) : (
                    <span className="tramite-soon">Próximamente</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Contacto</div>
              <h2 className="section-title">Dónde nos <em>encuentras</em></h2>
            </div>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-row">
                <span className="label">Dirección</span>
                <span className="value">Calle San Blas, 2<small>16372 Enguídanos · Cuenca</small></span>
              </div>
              <div className="contact-row">
                <span className="label">Teléfono</span>
                <span className="value">969 145 002</span>
              </div>
              <div className="contact-row">
                <span className="label">Email</span>
                <span className="value">info@enguidanos.es</span>
              </div>
              <div className="contact-row">
                <span className="label">Horario</span>
                <span className="value">Lun – Vie · 09:00 – 14:00</span>
              </div>
              <div className="contact-row">
                <span className="label">Alcalde</span>
                <span className="value">Sergio de Fez</span>
              </div>
            </div>
            <div className="photo-tinted" style={{height:480, borderRadius:"var(--r-lg)", overflow:"hidden", "--photo-a":"#9c8a6a", "--photo-b":"#5a4f3a"}}>
              <img src="assets/fachada-ayuntamiento.webp" alt="Fachada del Ayuntamiento de Enguídanos" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// =============== OFICINA DE TURISMO PAGE ===============
function OficinaTurismoPage({ navTarget }) {
  // Deep-link: salta al bloque destino (p. ej. "senderos") y lo resalta.
  useEffect(() => {
    if (!navTarget) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`ofi-${navTarget}`);
      if (!el) return;
      el.querySelectorAll(".reveal").forEach(r => r.classList.add("in"));
      const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 110);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev;
      el.classList.add("deeplink-flash");
      setTimeout(() => el.classList.remove("deeplink-flash"), 2200);
    }, 300);
    return () => clearTimeout(t);
  }, [navTarget]);
  const openPdf = async (e, pdf, code) => {
    e.preventDefault();
    const filename = (code ? code.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") : "folleto") + ".pdf";
    try {
      const res = await fetch(pdf);
      if (!res.ok) throw new Error("not found");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      window.location.href = pdf;
    }
  };
  const senderos = [
    { code: "PR CU-50", name: "Hoz del Agua y Hoz Cerrada", pdf: "assets/senderos/pr-cu-50.pdf" },
    { code: "PR CU-53", name: "Sendero de Las Chorreras", pdf: "assets/senderos/pr-cu-53.pdf" },
    { code: "PR CU-54", name: "Sendero de Los Cuatro Ríos", pdf: "assets/senderos/pr-cu-54.pdf" },
    { code: "GR 64", name: "Tramo Enguídanos – Mira", pdf: "assets/senderos/gr-64.pdf" },
    { code: "GR 66", name: "Valle del Cabriel · Víllora – Enguídanos (16,5 km)", pdf: "assets/senderos/gr-66.pdf" },
    { code: "BTT CU-02", name: "Ruta señalizada de bici de montaña, baja dificultad", pdf: "assets/senderos/btt-cu-02.pdf" },
  ];
  const planos = [
    { name: "Plano Turístico de Enguídanos I", desc: "Información general: alojamientos, restauración, espacios naturales, senderos y rutas urbanas, gastronomía, fiestas y teléfonos.", pdf: "http://enguidanos.es/wp-content/uploads/2015/08/Plano-Engui%CC%81danos-1.pdf" },
    { name: "Plano Turístico de Enguídanos II", desc: "Callejero general del municipio con la Ruta de las Fuentes, la Ruta de los Miradores y la Ruta Monumental.", pdf: "http://enguidanos.es/wp-content/uploads/2015/08/Plano-Engui%CC%81danos-2.pdf" },
  ];
  const publicaciones = [
    { title: "Red de Itinerarios y Rutas Botánicas de Enguídanos", desc: "Once rutas botánicas que recorren la riqueza florística del municipio.", precio: null },
    { title: "Retratos de Poesía · Mi Sendero de Versos (2ª parte)", desc: "Jesús de Frías Luján.", precio: "5€" },
    { title: "Historia, Tradiciones, Costumbres y Paisajes de Enguídanos", desc: "Álvaro Luján Algarra.", precio: "5€" },
    { title: "Guía de Fauna Vertebrada de Enguídanos", desc: "136 especies descritas: peces, anfibios, reptiles, mamíferos y aves.", precio: "8€" },
    { title: "Valle del Cabriel: Vive y Descubre", desc: "Museos, paisajes, pueblos, alojamientos, gastronomía y visitas del valle.", precio: "8€" },
    { title: "Patrimonio Histórico y Natural del Valle del Cabriel", desc: "Patrimonio arqueológico, castillos, ermitas, molinos y naturaleza.", precio: "8€" },
    { title: "Enguídanos: Un Paraíso en el Valle del Cabriel", desc: "Historia, patrimonio, ocio y aventura, mapa callejero y legados fotográficos.", precio: "12€" },
    { title: "CD de fotografías", desc: "Más de 400 imágenes de parajes, monumentos, eventos y tradiciones.", precio: "3€" },
    { title: "DVD Enguídanos", desc: "Vídeo musical por los monumentos y parajes más interesantes del municipio.", precio: "8€" },
  ];
  return (
    <main>
      <PageHeroMedia placeholder="Foto · Oficina de Turismo (Calle Virgen, 3)">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Oficina de Turismo</div>
        <h1 className="reveal in">Oficina de<br/><em>Turismo</em></h1>
        <p className="reveal in reveal-delay-1">Tu punto de partida para descubrir Enguídanos: información, visitas guiadas, mapas, folletos de senderos y publicaciones sobre el municipio y el Valle del Cabriel.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="ofi-intro">
            <div className="ofi-photo reveal">
              <img src="assets/oficina-turismo.webp" alt="Interior de la Oficina de Turismo de Enguídanos" />
            </div>
            <div className="ofi-info reveal">
              <div className="eyebrow" style={{marginBottom:20}}>Información práctica</div>
              <h2 className="serif" style={{fontSize:34, lineHeight:1.05, marginBottom:24}}>Oficina de Turismo de Enguídanos</h2>
              <div className="ofi-rows">
                <div className="ofi-row"><span className="ofi-k mono">Dirección</span><span className="ofi-v">C/ San Blas, 3 · 16372 Enguídanos (Cuenca)</span></div>
                <div className="ofi-row"><span className="ofi-k mono">Teléfono</span><span className="ofi-v"><a href="tel:+34969344955">969 344 955</a></span></div>
                <div className="ofi-row"><span className="ofi-k mono">Correo</span><span className="ofi-v"><a href="mailto:infoturismoenguidanos@gmail.com">infoturismoenguidanos@gmail.com</a></span></div>
              </div>
              <div className="ofi-hours">
                <div className="ofi-k mono" style={{marginBottom:14}}>Horario</div>
                <div className="ofi-hours-grid">
                  <div><strong>Miércoles y jueves</strong><span>11:00 – 14:00</span></div>
                  <div><strong>Viernes</strong><span>11:00 – 14:00 · 17:00 – 20:00</span></div>
                  <div><strong>Sábado</strong><span>11:00 – 14:00 · 17:00 – 20:00</span></div>
                  <div><strong>Domingo</strong><span>11:00 – 14:00</span></div>
                </div>
              </div>
              <div className="ofi-note">
                <strong>Visitas guiadas</strong> por Enguídanos con reserva previa en la Oficina de Turismo. Consultar tarifas y horarios.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:"var(--bg-2)", paddingTop:80, paddingBottom:80}}>
        <div className="container">
          <div className="ofi-park reveal">
            <div className="ofi-park-text">
              <div className="eyebrow" style={{marginBottom:18}}>Monumento Natural</div>
              <h3 className="serif">Aparcamiento de las Chorreras del Cabriel</h3>
              <p>El Ayuntamiento dispone de un aparcamiento en la entrada del Monumento Natural de las Chorreras del Cabriel. Reserva tu plaza con antelación para asegurar el acceso en temporada alta.</p>
              <a className="btn-solid" href="https://www.chorrerasdelcabriel.es/es/reservar-plaza-aparcamiento" target="_blank" rel="noopener noreferrer">Reservar plaza ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="ofi-senderos">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Senderismo</div>
              <h2 className="section-title">Folletos de <em>senderos</em></h2>
            </div>
            <div className="section-meta">Disponibles en la Oficina de Turismo</div>
          </div>
          <div className="ofi-senderos">
            {senderos.map((s, i) => (
              <a key={i} href={s.pdf} download={(s.code ? s.code.replace(/[^\w]+/g,"-").replace(/^-|-$/g,"") : "folleto") + ".pdf"} onClick={(e) => openPdf(e, s.pdf, s.code)} className="ofi-sendero reveal" style={{transitionDelay:`${i*0.04}s`}}>
                <span className="ofi-sendero-code mono">{s.code}</span>
                <span className="ofi-sendero-name serif">{s.name}</span>
                <span className="ofi-sendero-dl mono">PDF <Icon.arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:"var(--bg-2)"}}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Mapas</div>
              <h2 className="section-title">Planos <em>turísticos</em></h2>
            </div>
          </div>
          <div className="ofi-planos">
            {planos.map((p, i) => (
              <a key={i} className="ofi-plano reveal" href={p.pdf} target="_blank" rel="noopener noreferrer" style={{transitionDelay:`${i*0.05}s`}}>
                <div className="ofi-plano-body">
                  <h4 className="serif">{p.name}</h4>
                  <p>{p.desc}</p>
                </div>
                <span className="ofi-plano-dl mono">Descargar PDF ↓</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>A la venta</div>
              <h2 className="section-title">Publicaciones sobre <em>Enguídanos</em></h2>
            </div>
            <div className="section-meta">Disponibles en la Oficina de Turismo</div>
          </div>
          <div className="ofi-pubs">
            {publicaciones.map((p, i) => (
              <div key={i} className="ofi-pub reveal" style={{transitionDelay:`${i*0.04}s`}}>
                <div className="ofi-pub-head">
                  <h4 className="serif">{p.title}</h4>
                  {p.precio && <span className="ofi-pub-price mono">{p.precio}</span>}
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// =============== ÁREA DETAIL (sub-páginas del Ayuntamiento) ===============
function AreaDetail({ slug, onBack }) {
  const data = AREAS_CONTENT[slug];
  if (!data) return null;
  return (
    <main>
      <section className="page-hero area-hero">
        <div className="container">
          <div className="breadcrumb">
            <span style={{cursor:"pointer"}} onClick={onBack}>Ayuntamiento</span> · {data.title}
          </div>
          <button className="area-back" onClick={onBack}>← Volver a las áreas</button>
          <h1 className="reveal in">{data.title}</h1>
          <p className="reveal in reveal-delay-1">{data.intro}</p>
        </div>
      </section>
      <section className="section" style={{paddingTop:64}}>
        <div className="container">
          {slug === "corporacion" && <CorporacionView data={data} />}
          {slug === "plenos" && <PlenosView data={data} />}
          {slug === "ordenanzas-fiscales" && <OrdenanzasFiscalesView data={data} />}
          {slug === "ordenanzas-municipales" && <OrdenanzasFiscalesView data={data} />}
          {slug === "perfil-contratante" && <OrdenanzasFiscalesView data={data} />}
          {slug === "tramites-formularios" && <OrdenanzasFiscalesView data={data} />}
          {slug === "bandos" && <BandosView data={data} />}
        </div>
      </section>
    </main>
  );
}

function PartidoBadge({ partido }) {
  return <span className={`partido-badge ${partido.toLowerCase()}`}>{partido}</span>;
}

function CorporacionView({ data }) {
  return (
    <div className="corp">
      <div className="corp-alcalde reveal">
        <div className="corp-alcalde-photo">
          <img src={data.alcalde.foto} alt={data.alcalde.nombre} />
        </div>
        <div className="corp-alcalde-info">
          <PartidoBadge partido={data.alcalde.partido} />
          <div className="mono corp-role">{data.alcalde.cargo}</div>
          <h3 className="serif">{data.alcalde.nombre}</h3>
        </div>
      </div>
      <div className="corp-sub mono">Concejales</div>
      <div className="corp-grid">
        {data.concejales.map((c, i) => (
          <div key={i} className="corp-card reveal" style={{transitionDelay:`${i*0.05}s`}}>
            <PartidoBadge partido={c.partido} />
            <h4 className="serif">{c.nombre}</h4>
            <p>{c.cargo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdenanzasFiscalesView({ data }) {
  const [q, setQ] = useState("");
  const showSearch = data.docs.length >= 4;
  const docs = data.docs.filter(d => d.title.toLowerCase().includes(q.toLowerCase()));
  const tagClass = (t) => t === "Impuesto" ? "imp" : t === "Tasa" ? "tasa" : "doc";
  return (
    <div className="ord">
      {showSearch && (
        <div className="ord-toolbar reveal">
          <input className="ord-search" placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} />
          <span className="mono ord-count">{docs.length} documento{docs.length === 1 ? "" : "s"}</span>
        </div>
      )}
      <div className="ord-list">
        {docs.map((d, i) => (
          <a key={i} className="ord-row reveal" href={d.pdf} download={d.title.replace(/[^\w]+/g,"-").slice(0,60)+".pdf"} onClick={(e) => downloadPdf(e, d.pdf, d.title.slice(0,60))}>
            <span className={`ord-tag ${tagClass(d.tipo)}`}>{d.tipo}</span>
            <span className="ord-title serif">{d.title}</span>
            <span className="ord-dl">PDF&nbsp;↓</span>
          </a>
        ))}
        {docs.length === 0 && <div className="ord-empty">No se encontraron documentos para «{q}».</div>}
      </div>
      <p className="ord-note">Documentos oficiales en PDF. Fuente: Ayuntamiento de Enguídanos.</p>
    </div>
  );
}

async function downloadImage(e, src, name) {
  e.preventDefault();
  const ext = (src.split(".").pop() || "jpg").split(/[?#]/)[0];
  const base = (name || "cartel").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "cartel";
  const filename = `${base}.${ext}`;
  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error("not found");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (err) {
    window.open(src, "_blank", "noopener");
  }
}

async function downloadPdf(e, pdf, name) {
  e.preventDefault();
  const filename = (name || "documento").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
  try {
    const res = await fetch(pdf);
    if (!res.ok) throw new Error("not found");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (err) {
    window.location.href = pdf;
  }
}

function PlenosView({ data }) {
  return (
    <div className="plenos">
      {data.years.map((y, i) => (
        <div key={i} className="plenos-year reveal" style={{transitionDelay:`${i*0.05}s`}}>
          <div className="plenos-year-label serif">{y.year}</div>
          <div className="plenos-list">
            {y.actas.map((a, j) => (
              <div key={j} className="acta-row">
                <div className="acta-info">
                  <div className="acta-fecha serif">{a.fecha}</div>
                  {a.sesion && <div className="acta-sesion mono">{a.sesion}</div>}
                </div>
                <div className="acta-docs">
                  {a.partes ? (
                    a.partes.map((p, k) => (
                      <a key={k} className="acta-parte" href={p.pdf} download={`Acta ${a.fecha} parte ${p.n}`.replace(/[^\w]+/g,"-")+".pdf"} onClick={(e) => downloadPdf(e, p.pdf, `Acta ${a.fecha} parte ${p.n}`)}>Parte {p.n}</a>
                    ))
                  ) : (
                    <a className="acta-dl" href={a.pdf} download={`Acta ${a.fecha}`.replace(/[^\w]+/g,"-")+".pdf"} onClick={(e) => downloadPdf(e, a.pdf, `Acta ${a.fecha}`)}>Ver acta&nbsp;↓</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.nota && <p className="ord-note">{data.nota}</p>}
    </div>
  );
}

function BandosView({ data }) {
  return (
    <div className="bandos">
      {data.bandos.map((b, i) => (
        <article key={i} className="bando reveal" style={{transitionDelay:`${i*0.05}s`}}>
          <div className="bando-mark mono">Bando</div>
          <h3 className="serif">{b.title}</h3>
          {b.cuerpo.map((p, j) => <p key={j}>{p}</p>)}
          {b.campos && (
            <ul className="bando-campos">
              {b.campos.map((c, j) => <li key={j}>{c}</li>)}
            </ul>
          )}
          {b.fecha && <div className="bando-fecha mono">{b.fecha}</div>}
          <div className="bando-firma">{b.cargo || "El Alcalde"}<span>{b.firmante || data.firma}</span></div>
          {b.pdf && (
            <a className="bando-pdf" href={b.pdf} download={b.title.replace(/[^\w]+/g,"-").slice(0,60)+".pdf"} onClick={(e) => downloadPdf(e, b.pdf, b.title.slice(0,60))}>
              Descargar bando oficial <span className="mono">PDF&nbsp;↓</span>
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

// =============== TURISMO (landing) PAGE ===============
function TurismoPage({ setPage }) {
  const go = (dest) => { window.scrollTo(0, 0); setPage(dest); };
  const cards = [
    { id: "oficina-turismo", label: "Oficina de Turismo", img: "assets/oficina-turismo.webp", dest: "oficina-turismo",
      desc: "Tu punto de partida: mapas, horarios y consejos para aprovechar la visita." },
    { id: "turismo-deportivo", label: "Turismo Deportivo", img: "assets/menu-turismo-deportivo.webp", dest: "turismo-deportivo",
      desc: "Rafting y barranquismo sobre las aguas bravas del Cabriel, además de rutas de senderismo y de bicicleta." },
    { id: "patrimonio-cultural", label: "Patrimonio Cultural", img: "assets/menu-patrimonio-cultural.webp", dest: "patrimonio",
      desc: "Veinte rincones con historia: el poblado celtíbero, el castillo árabe, ermitas, molinos, escudos y miradores." },
    { id: "naturaleza", label: "Naturaleza", img: "assets/menu-naturaleza.webp", dest: "naturaleza",
      desc: "Las Chorreras, las hoces y los senderos de la Reserva de la Biosfera." },
    { id: "restaurantes", label: "Restaurantes", img: "assets/menu-restaurantes.webp", dest: "restaurantes",
      desc: "Cocina serrana junto al fuego: caldereta, migas y guisos de caza." },
    { id: "alojamientos", label: "Alojamientos", img: "assets/menu-alojamientos.webp", dest: "alojamientos",
      desc: "Casas rurales y cabañas de madera para quedarte más de un día." },
  ];
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><span>Inicio</span> · Turismo</div>
          <h1 className="reveal in">Todo lo que el río<br/><em>te deja descubrir</em></h1>
          <p className="reveal in reveal-delay-1">Enguídanos se recorre despacio: por sus hoces y cascadas, por las piedras de su castillo, por la mesa de sus mesones y el descanso de sus casas rurales. Elige por dónde empezar.</p>
        </div>
      </section>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:28}}>Planes para todos los gustos</div>
          <div className="turismo-grid">
            {cards.map((c, i) => (
              <a key={c.id} className="turismo-card reveal" style={{transitionDelay:`${(i%3)*0.06}s`}} onClick={() => go(c.dest)}>
                <div className="turismo-card-media" style={{backgroundImage:`url(${c.img})`}}></div>
                <div className="turismo-card-scrim"></div>
                <div className="turismo-card-body">
                  <h3 className="serif">{c.label}</h3>
                  <p>{c.desc}</p>
                  <span className="turismo-card-cta">Explorar <Icon.arrow /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// =============== TURISMO DEPORTIVO PAGE ===============
const RUTAS_SENDERISMO = [
  {
    code: "PR CU-50", label: "Sendero de la Hoz del Agua y Hoz Cerrada",
    logo: "assets/rutas/logos/pr-cu-50.webp", pdf: "assets/senderos/pr-cu-50.pdf",
    tipo: "Circular", dist: "8 km", tiempo: "2h 30 – 3h", dif: "Baja",
    fotos: ["assets/rutas/fotos/pr-cu-50-1.webp"],
    desc: "Recorrido circular desde el casco urbano que se adentra en la Hoz del Agua y la Hoz Cerrada, entre farallones de roca caliza, fuentes que riegan los huertos y miradores con amplias panorámicas del valle.",
  },
  {
    code: "PR CU-53", label: "Sendero de Las Chorreras",
    logo: "assets/rutas/logos/pr-cu-53.webp", pdf: "assets/senderos/pr-cu-53.pdf",
    tipo: "Circular", dist: "8 km", tiempo: "2h 30 – 3h", dif: "Baja",
    fotos: ["assets/rutas/fotos/pr-cu-53-2.webp"],
    desc: "Sendero junto al Cabriel hasta el paraje de Las Chorreras, con sus tobas cuaternarias y saltos de agua de color turquesa. Uno de los rincones más fotografiados del municipio.",
  },
  {
    code: "PR CU-54", label: "Sendero de los Cuatro Ríos",
    logo: "assets/rutas/logos/pr-cu-54.webp", pdf: "assets/senderos/pr-cu-54.pdf",
    tipo: "Circular", dist: "13,5 km", tiempo: "3h 30", dif: "Media",
    fotos: ["assets/rutas/fotos/pr-cu-54-1.webp"],
    desc: "La ruta más exigente y espectacular: sigue el entorno acuático del Cabriel, donde el agua ha tallado rápidos, estrechos y puentes rocosos en la caliza. La de mayor desnivel de la zona.",
  },
  {
    code: "GR 64", label: "De Enguídanos a Mira",
    logo: "assets/rutas/logos/gr-64.webp", pdf: "assets/senderos/gr-64.pdf",
    tipo: "Lineal", dist: "—", tiempo: "Jornada", dif: "Media",
    fotos: ["assets/rutas/fotos/gr-64-1.webp"],
    desc: "Entre olivos, almendros y pinares, este gran recorrido baja hasta las ruinas del Balneario del Salobral y la unión de los ríos Mira y Narboneta, con vistas a la imponente Hoz del Río Mira.",
  },
  {
    code: "GR 66", label: "Valle del Cabriel · Víllora – Enguídanos",
    logo: "assets/rutas/logos/gr-66.webp", pdf: "assets/senderos/gr-66.pdf",
    tipo: "Lineal", dist: "16,5 km", tiempo: "4h 30", dif: "Media",
    fotos: ["assets/rutas/fotos/gr-66-1.webp"],
    desc: "Primera etapa del GR 66, lineal de Víllora a Enguídanos, que recorre los valles y estribaciones del Valle del Cabriel atravesando viaductos y antiguos trazados.",
  },
  {
    code: "BTT CU-02", label: "Ruta de bicicleta de montaña",
    logo: "assets/rutas/logos/btt-cu-02.webp", pdf: "assets/senderos/btt-cu-02.pdf",
    tipo: "BTT", dist: "—", tiempo: "Media jornada", dif: "Baja",
    fotos: ["assets/rutas/fotos/btt-cu-02-1.webp"],
    desc: "Ruta señalizada de bici de montaña que enlaza los paisajes más bellos de Enguídanos: El Perejil, la Hoz del Río Mira, Las Chorreras o La Playeta. Baja dificultad, apta para iniciarse.",
  },
];

function TurismoDeportivoPage() {
  return (
    <main>
      <PageHeroMedia img="assets/turismo-deportivo-portada.webp" alt="Salto a la poza turquesa del Cabriel en una jornada de barranquismo">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Turismo Deportivo</div>
        <h1 className="reveal in">Aventura sobre<br/><em>el Cabriel</em></h1>
        <p className="reveal in reveal-delay-1">Rafting y barranquismo en aguas bravas, senderos señalizados entre hoces y cascadas, y rutas de bicicleta de montaña. Enguídanos se vive también con las botas puestas.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Rutas de senderismo y BTT</div>
          <p className="td-section-intro reveal">Las mismas rutas homologadas que encontrarás en la Oficina de Turismo. Descarga el folleto oficial de cada una en PDF.</p>
          <div className="td-routes">
            {RUTAS_SENDERISMO.map((r, i) => (
              <article key={r.code} className="td-route reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="td-route-main">
                  <div className="td-route-head">
                    <img className="td-logo" src={r.logo} alt={`Logo ${r.code}`} />
                    <div>
                      <div className="td-route-code mono">{r.code}</div>
                      <h3 className="td-route-name serif">{r.label}</h3>
                    </div>
                  </div>
                  <div className="td-route-meta">
                    <span className="td-chip"><strong>Tipo</strong>{r.tipo}</span>
                    {r.dist !== "—" && <span className="td-chip"><strong>Distancia</strong>{r.dist}</span>}
                    <span className="td-chip"><strong>Duración</strong>{r.tiempo}</span>
                    <span className={`td-chip td-dif td-dif-${r.dif.toLowerCase()}`}><strong>Dificultad</strong>{r.dif}</span>
                  </div>
                  <p className="td-route-desc">{r.desc}</p>
                  <a className="td-dl mono" href={r.pdf} download={`${r.code} ${r.label}`.replace(/[^\w]+/g,"-")+".pdf"} onClick={(e) => downloadPdf(e, r.pdf, `${r.code} ${r.label}`)}>
                    Descargar folleto&nbsp;<Icon.arrow />
                  </a>
                </div>
                <div className={`td-photos ${r.fotos.length === 1 ? "single" : ""}`}>
                  {r.fotos.map((f, k) => (
                    <div key={k} className="td-photo" style={{backgroundImage:`url(${f})`}}></div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop:8}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Empresas de deportes multiaventura</div>
          <p className="td-section-intro reveal">Profesionales del Cabriel que organizan actividades de aventura para todos los públicos: colegios, familias, grupos de amigos y empresas.</p>
          <div className="td-empresas">

            <article className="td-empresa reveal">
              <div className="td-empresa-main">
                <div className="td-empresa-head">
                  <img className="td-empresa-logo" src="assets/turismo-deportivo/empresas/altair-logo.webp" alt="Logo Altair" />
                  <div>
                    <h3 className="td-empresa-name serif">Altair Turismo Activo Rural</h3>
                    <div className="td-empresa-lugar mono">Enguídanos · Río Cabriel</div>
                  </div>
                </div>
                <p className="td-empresa-desc">Centro de turismo activo a orillas del Cabriel, especialistas en el barranco acuático de Las Chorreras. Rafting, kayak, canoas, paddle SUP, hidrospeed, puenting, travesías y rutas interpretadas: una oferta completa para colegios, familias, empresas y grupos de amigos de todas las edades.</p>
                <div className="td-empresa-tags">
                  {["Rafting","Barranquismo","Kayak","Paddle SUP","Hidrospeed","Puenting","Rutas interpretadas"].map(t=>(
                    <span key={t} className="td-tag">{t}</span>
                  ))}
                </div>
                <div className="td-empresa-contact">
                  <a href="tel:+34620545865" className="td-contact-item mono"><span>📞</span>620 54 58 65</a>
                  <span className="td-contact-item mono"><span>📍</span>Camino a La Pesquera, Km 2, Enguídanos</span>
                </div>
              </div>
              <div className="td-empresa-fotos">
                <img src="assets/turismo-deportivo/empresas/altair-foto-1.webp" alt="Altair rafting" />
              </div>
            </article>

            <article className="td-empresa reveal" style={{transitionDelay:"0.06s"}}>
              <div className="td-empresa-main">
                <div className="td-empresa-head">
                  <img className="td-empresa-logo" src="assets/turismo-deportivo/empresas/vegaventura-logo.webp" alt="Logo Vegaventura" />
                  <div>
                    <h3 className="td-empresa-name serif">Vegaventura</h3>
                    <div className="td-empresa-lugar mono">Enguídanos · Cuenca</div>
                  </div>
                </div>
                <p className="td-empresa-desc">Aventura y naturaleza sin límites: Vegaventura pone al alcance del visitante una amplia carta de actividades al aire libre, desde el descenso de barrancos acuáticos hasta las rutas a caballo, pasando por trekking, bicicleta, piragüismo, puenting, paintball y tiro con arco. Hay algo para cada nivel y cada tipo de grupo.</p>
                <div className="td-empresa-tags">
                  {["Rafting","Barranquismo","Rutas a caballo","Trekking","BTT","Piragüismo","Paintball","Tiro con arco"].map(t=>(
                    <span key={t} className="td-tag">{t}</span>
                  ))}
                </div>
                <div className="td-empresa-contact">
                  <a href="tel:+34650564955" className="td-contact-item mono"><span>📞</span>650 56 49 55</a>
                  <a href="mailto:gemmsu@hotmail.com" className="td-contact-item mono"><span>✉</span>gemmsu@hotmail.com</a>
                  <a href="https://lascasasdelavega.com/" target="_blank" rel="noopener noreferrer" className="td-contact-item mono"><span>🌐</span>lascasasdelavega.com</a>
                </div>
              </div>
              <div className="td-empresa-fotos">
                <img src="assets/turismo-deportivo/empresas/vegaventura-foto-1.webp" alt="Vegaventura barranquismo" />
              </div>
            </article>

          </div>
        </div>
      </section>
    </main>
  );
}

export { NaturalezaPage, PatrimonioPage, HistoriaPage, AgendaPage, AyuntamientoPage, OficinaTurismoPage, TurismoPage, TurismoDeportivoPage };
