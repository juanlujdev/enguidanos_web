import React from 'react'
const { useState } = React;
import { PageHeroMedia } from './components/shared/index.js'
import RESTAURANTES from './data/restaurantes.json'
// =============== RESTAURANTES PAGE ===============

function telHref(p) { return "tel:" + p.replace(/[^\d+]/g, ""); }

function RestaurantesPage() {
  return (
    <main>
      <PageHeroMedia img="assets/restaurantes/hostal-el-cabriel-1.webp" alt="Caldereta serrana servida en cazuela de barro">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Restaurantes</div>
        <h1 className="reveal in">Sabores de<br/><em>la sierra</em></h1>
        <p className="reveal in reveal-delay-1">Cocina serrana junto al fuego: caldereta, guisos de caza, gazpacho manchego y migas. Los mesones de Enguídanos sirven el recetario de siempre con producto de la tierra y mesa sin prisas.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Dónde comer en Enguídanos</div>
          <div className="resto-list">
            {RESTAURANTES.map((r, i) => (
              <article key={r.id} className="resto-card reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="resto-head">
                  <div className="resto-tipo mono">{r.tipo}</div>
                  <h3 className="resto-name serif">{r.name}</h3>
                </div>
                <div className="resto-gallery">
                  {r.fotos.map((f, k) => (
                    <img key={k} src={f} alt={`${r.name} — foto ${k+1}`} loading="lazy" />
                  ))}
                </div>
                <p className="resto-desc">{r.desc}</p>
                {(r.address || (r.phones && r.phones.length > 0)) && (
                  <div className="resto-contact">
                    {r.address && (
                      <a className="resto-contact-item mono" href={r.mapUrl} target="_blank" rel="noopener noreferrer">
                        <span>📍</span>{r.address}
                      </a>
                    )}
                    {r.phones && r.phones.length > 0 && (
                      <div className="resto-phones">
                        {r.phones.map(p => (
                          <a key={p} className="resto-contact-item mono" href={telHref(p)}><span>📞</span>{p}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export { RestaurantesPage };
