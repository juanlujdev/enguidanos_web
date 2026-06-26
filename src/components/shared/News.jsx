import React from 'react'
import AGENDA_CATS from '../../data/agenda-cats.json'
import Icon from './Icon.jsx'
import { useEventos } from '../../hooks/useEventos.js'

const BANDO_COLOR = "#5a6b78"
const ESCUDO = "assets/escudo-enguidanos.webp"
const MES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]

function formatFecha(iso) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${parseInt(d, 10)} ${MES[parseInt(m,10)-1]} ${y}`
}

function SkeletonCard({ delay }) {
  return (
    <article className="news-card reveal" style={{transitionDelay:`${delay}s`, opacity:0.35}}>
      <div className="news-img" style={{background:"var(--bg-3)"}} />
      <div className="news-body" style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{height:10,background:"var(--bg-3)",borderRadius:4,width:"35%"}} />
        <div style={{height:18,background:"var(--bg-3)",borderRadius:4,width:"85%"}} />
        <div style={{height:10,background:"var(--bg-3)",borderRadius:4,width:"100%"}} />
        <div style={{height:10,background:"var(--bg-3)",borderRadius:4,width:"70%"}} />
      </div>
    </article>
  )
}

function News({ setPage }) {
  const eventos = useEventos()

  const items = eventos
    ? [...eventos]
        .sort((a, b) => (b.fecha_publicacion || "").localeCompare(a.fecha_publicacion || ""))
        .slice(0, 3)
    : null

  return (
    <section className="section" style={{background:"var(--bg-2)"}}>
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Noticias del pueblo</div>
            <h2 className="section-title">Lo último de <em>Enguídanos</em></h2>
          </div>
          <a className="btn btn-outline" href="https://www.facebook.com/AyuntamientodeEnguidanos/?locale=es_ES" target="_blank" rel="noopener noreferrer">
            Todas las noticias <Icon.arrow />
          </a>
        </div>
        <div className="news-grid">
          {items === null
            ? [0,1,2].map(i => <SkeletonCard key={i} delay={i*0.08} />)
            : items.map((n, i) => {
                const cat = AGENDA_CATS[n.cat]
                const color = cat?.color || BANDO_COLOR
                const tag = n.tipo === "bando" ? "BANDO" : (cat?.label || "").toUpperCase()
                const img = n.poster || ESCUDO
                return (
                  <article key={n.id || i} className="news-card reveal" style={{transitionDelay:`${i*0.08}s`}}>
                    <div className="news-img photo-tinted" style={{"--photo-a": color, "--photo-b": color}}>
                      <img src={img} alt={n.title} loading="lazy"
                        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                    </div>
                    <div className="news-body">
                      <div className="news-tag">
                        <span style={{width:6,height:6,borderRadius:"50%",background:"var(--terracota)"}}></span>
                        {tag}
                      </div>
                      <h3 className="news-title">{n.title}</h3>
                      <p className="news-excerpt">{n.desc}</p>
                      <div className="news-foot">
                        <span>{formatFecha(n.fecha_publicacion)}</span>
                      </div>
                    </div>
                  </article>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}

export default News
