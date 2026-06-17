import React from 'react'
import NOTICIAS from '../../data/noticias.json'
import Icon from './Icon.jsx'

function News({ setPage }) {
  return (
    <section className="section" style={{background:"var(--bg-2)"}}>
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Noticias del pueblo</div>
            <h2 className="section-title">Lo último de <em>Enguídanos</em></h2>
          </div>
          <a className="btn btn-outline" href="https://www.facebook.com/AyuntamientodeEnguidanos/?locale=es_ES" target="_blank" rel="noopener noreferrer">Todas las noticias <Icon.arrow /></a>
        </div>
        <div className="news-grid">
          {NOTICIAS.map((n, i) => (
            <article key={i} className="news-card reveal" style={{transitionDelay:`${i*0.08}s`}}>
              <div className="news-img photo-tinted" style={{"--photo-a":n.color.a, "--photo-b":n.color.b}}>
                {n.img
                  ? <img src={n.img} alt={n.title} loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                  : <div className="photo-label">FOTO · {n.title.slice(0, 28)}…</div>}
              </div>
              <div className="news-body">
                <div className="news-tag">
                  <span style={{width:6,height:6,borderRadius:"50%",background:"var(--terracota)"}}></span>
                  {n.tag}
                </div>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-excerpt">{n.excerpt}</p>
                <div className="news-foot">
                  <span>{n.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default News
