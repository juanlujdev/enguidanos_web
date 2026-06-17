import React, { useState, useEffect } from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'
import _naturaleza from '../../data/naturaleza.json'
import NATURALEZA_CATS from '../../data/naturaleza-cats.json'
import NATURALEZA_RIOS from '../../data/naturaleza-rios.json'
import NATURALEZA_FUENTES from '../../data/naturaleza-fuentes.json'
import RUTAS_INFO from '../../data/rutas.json'

const NATURALEZA = _naturaleza.items
const NATURALEZA_DESTACADO = _naturaleza.destacado

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

export default NaturalezaPage
