import React from 'react'
import HIGHLIGHTS from '../../data/highlights.json'

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

export default Highlights
