import React, { useState, useEffect, useRef } from 'react'
import GALERIA from '../../data/galeria.json'

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

export default Gallery
