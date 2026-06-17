import React from 'react'
import { PageHeroMedia } from '../shared/index.js'
import ALOJAMIENTOS from '../../data/alojamientos.json'

function alojaTelHref(p) { return "tel:" + p.replace(/[^\d+]/g, ""); }

function AlojamientosPage() {
  return (
    <main>
      <PageHeroMedia img="assets/alojamientos-portada.webp" alt="Cabaña de madera «Río Narboneta» con su porche entre la vegetación">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Alojamientos</div>
        <h1 className="reveal in">Dónde<br/><em>dormir</em></h1>
        <p className="reveal in reveal-delay-1">Casas rurales y cabañas de madera para alargar la visita y vivir Enguídanos sin prisas: despertar entre pinos, escuchar el río y dormir bajo uno de los cielos más limpios de la serranía.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Dónde alojarse en Enguídanos</div>
          <div className="resto-list">
            {ALOJAMIENTOS.map((a, i) => (
              <article key={a.id} className="resto-card reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="resto-head">
                  <div className="resto-tipo mono">{a.tipo}</div>
                  <h3 className="resto-name serif">{a.name}</h3>
                </div>
                <div className="aloja-gallery">
                  {a.fotos.map((f, k) => (
                    <img key={k} src={f} alt={`${a.name} — foto ${k+1}`} loading="lazy" />
                  ))}
                </div>
                <p className="resto-desc">{a.desc}</p>
                {a.extra && <p className="resto-desc" style={{marginTop:-10}}>{a.extra}</p>}
                {a.features && a.features.length > 0 && (
                  <div className="aloja-features">
                    {a.features.map(f => <span key={f} className="aloja-chip mono">{f}</span>)}
                  </div>
                )}
                <div className="resto-contact">
                  <a className="resto-contact-item mono" href={a.mapUrl} target="_blank" rel="noopener noreferrer">
                    <span>📍</span>{a.address}
                  </a>
                  <div className="resto-phones">
                    {a.phones.map(p => (
                      <a key={p} className="resto-contact-item mono" href={alojaTelHref(p)}><span>📞</span>{p}</a>
                    ))}
                    {a.email && (
                      <a className="resto-contact-item mono" href={`mailto:${a.email}`}><span>✉️</span>{a.email}</a>
                    )}
                    {a.web && (
                      <a className="resto-contact-item mono" href={a.web} target="_blank" rel="noopener noreferrer"><span>🌐</span>Web oficial</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="aloja-note reveal">
            <p className="mono">¿Gestionas un alojamiento en Enguídanos y quieres aparecer aquí? Escríbenos a <a href="mailto:info@enguidanos.es">info@enguidanos.es</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AlojamientosPage
