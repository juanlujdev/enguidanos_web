import React, { useState, useEffect, useRef } from 'react'
import { PageHeroMedia } from '../shared/index.js'
import historiaData from '../../data/historia.json'

const HISTORIA = historiaData.secciones
const HISTORIA_META = historiaData.meta

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

export default HistoriaPage
