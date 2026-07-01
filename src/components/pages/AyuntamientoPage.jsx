import React, { useState, useEffect } from 'react'
import { useEventos } from '../../hooks/useEventos.js'
import AREAS_CONTENT from '../../data/areas-content.json'
import TRAMITES from '../../data/tramites.json'
import ALCALDE from '../../data/alcalde.json'

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
    window.open(pdf, '_blank', 'noopener');
  }
}

function PartidoBadge({ partido }) {
  return <span className={`partido-badge ${partido.toLowerCase()}`}>{partido}</span>;
}

function CorporacionView({ data }) {
  return (
    <div className="corp">
      <div className="corp-alcalde reveal">
        <div className="corp-alcalde-photo">
          <img src={data.alcalde.foto} alt={data.alcalde.nombre} loading="lazy" />
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

// Modal a pantalla completa con la imagen del bando (o el escudo de Enguídanos
// si no tiene) + el texto original de la publicación.
function BandoModal({ items, index, setIndex }) {
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
  const b = items[index];

  return (
    <div className="agenda-modal" onClick={() => setIndex(null)}>
      <button className="agenda-modal-close" onClick={() => setIndex(null)} aria-label="Cerrar">×</button>
      <div className="agenda-modal-counter">{String(index + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</div>
      <button className="agenda-modal-arrow prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length); }} aria-label="Anterior">‹</button>
      <button className="agenda-modal-arrow next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length); }} aria-label="Siguiente">›</button>
      <div className="agenda-modal-inner" onClick={e => e.stopPropagation()}>
        <div className="agenda-modal-poster">
          <img src={b.poster || "assets/escudo-enguidanos.webp"} alt={`Bando · ${b.title}`} />
        </div>
        <div className="agenda-modal-info">
          <span className="agenda-modal-tipo"><span className="swatch" style={{background:"var(--terracota)"}}></span>Bando</span>
          <h3 className="serif">{b.title}</h3>
          {b.fecha_publicacion && <div className="agenda-modal-daylabel">{b.fecha_publicacion}</div>}
          <p className="agenda-modal-desc" style={{whiteSpace:"pre-line"}}>{b.original_text || b.desc}</p>
          {b.place && (
            <div className="agenda-modal-meta">
              <div className="agenda-modal-row"><span className="label">Dónde</span><span className="value">{b.place}</span></div>
            </div>
          )}
          {b.pdf && (
            <a className="agenda-modal-dl" href={b.pdf}
              download={b.title.replace(/[^\w]+/g,"-").slice(0,60)+".pdf"}
              onClick={(e) => downloadPdf(e, b.pdf, b.title.slice(0,60))}>
              Descargar bando oficial ↓
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function BandosView() {
  const eventos = useEventos()
  const [openB, setOpenB] = useState(null);
  const bandos = eventos
    ? [...eventos]
        .filter(e => e.tipo === "bando")
        .sort((a, b) => (b.fecha_publicacion || "").localeCompare(a.fecha_publicacion || ""))
    : null

  if (!bandos) return (
    <div style={{padding:"48px 0",textAlign:"center",color:"var(--ink-3)",fontFamily:"var(--font-mono)",fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase"}}>
      Cargando bandos…
    </div>
  )

  if (bandos.length === 0) return (
    <div className="agenda-empty">No hay bandos publicados por el momento.</div>
  )

  return (
    <div className="bandos">
      {bandos.map((b, i) => (
        <article key={b.id || i} className="bando reveal" style={{transitionDelay:`${i*0.05}s`, cursor:"pointer"}} onClick={() => setOpenB(i)}>
          <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
            <img
              src={b.poster || "assets/escudo-enguidanos.webp"}
              alt={b.title}
              loading="lazy"
              style={{width:80,height:80,objectFit:"contain",flexShrink:0,borderRadius:"var(--r-sm)"}}
            />
            <div style={{flex:1}}>
              <div className="bando-mark mono">Bando</div>
              <h3 className="serif">{b.title}</h3>
              <p>{b.desc}</p>
              {b.fecha_publicacion && (
                <div className="bando-fecha mono">{b.fecha_publicacion}</div>
              )}
              {b.pdf && (
                <a className="bando-pdf" href={b.pdf}
                  download={b.title.replace(/[^\w]+/g,"-").slice(0,60)+".pdf"}
                  onClick={(e) => { e.stopPropagation(); downloadPdf(e, b.pdf, b.title.slice(0,60)); }}>
                  Descargar bando oficial <span className="mono">PDF&nbsp;↓</span>
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
      <p className="ord-note">Bandos y comunicaciones oficiales de la Alcaldía de Enguídanos. Recopilación no oficial; fuente: <a href="https://www.facebook.com/AyuntamientodeEnguidanos/?locale=es_ES" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Facebook oficial del Ayuntamiento</a>.</p>
      <BandoModal items={bandos} index={openB} setIndex={setOpenB} />
    </div>
  )
}

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
          {slug === "bandos" && <BandosView />}
        </div>
      </section>
    </main>
  );
}

function AyuntamientoPage({ navTarget }) {
  const [area, setArea] = useState(null);
  useEffect(() => {
    if (navTarget && navTarget.indexOf("area:") === 0) {
      window.scrollTo(0, 0);
      setArea(navTarget.slice(5));
    } else if (!navTarget) {
      setArea(null);
    }
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
                <img src="assets/alcalde-sergio-de-fez.webp" alt={ALCALDE.nombre} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} />
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
              <img src="assets/fachada-ayuntamiento.webp" alt="Fachada del Ayuntamiento de Enguídanos" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AyuntamientoPage
