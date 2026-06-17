import React, { useState, useEffect } from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'
import PATRIMONIO from '../../data/patrimonio.json'
import PATRIMONIO_CATS from '../../data/patrimonio-cats.json'

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

export default PatrimonioPage
