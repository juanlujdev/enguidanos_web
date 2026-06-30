import React, { useState, useEffect } from 'react'
import AGENDA_CATS from '../../data/agenda-cats.json'
import Icon from './Icon.jsx'
import { useEventos } from '../../hooks/useEventos.js'

const BANDO_COLOR = "#5a6b78"
const LOGO_CASTILLO = "assets/logo-enguidanos.webp"
const MES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]
const MESES_LARGO = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function formatFecha(iso) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${parseInt(d, 10)} ${MES[parseInt(m,10)-1]} ${y}`
}

function truncate(text, maxWords) {
  if (!text) return { text: "", truncated: false }
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return { text, truncated: false }
  return { text: words.slice(0, maxWords).join(" "), truncated: true }
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

function NewsModal({ items, index, setIndex }) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e) => {
      if (e.key === "Escape") setIndex(null)
      else if (e.key === "ArrowRight") setIndex((index + 1) % items.length)
      else if (e.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [index, items.length, setIndex])

  if (index === null) return null
  const ev = items[index]
  const isBando = ev.tipo === "bando"
  const cat = AGENDA_CATS[ev.cat] || { label: ev.cat || "Bando", color: BANDO_COLOR }
  const tag = isBando ? "BANDO" : (cat.label || "").toUpperCase()
  const color = isBando ? BANDO_COLOR : cat.color

  // Fecha legible para secciones
  let fechaLarga = ""
  if (!isBando && ev.date) {
    const [y, m, d] = ev.date.split("-").map(Number)
    fechaLarga = d
      ? `${d} de ${MESES_LARGO[(m || 1) - 1].toLowerCase()} de ${y}`
      : `${MESES_LARGO[(m || 1) - 1]} de ${y}`
  }

  return (
    <div className="agenda-modal" onClick={() => setIndex(null)}>
      <button className="agenda-modal-close" onClick={() => setIndex(null)} aria-label="Cerrar">×</button>
      <div className="agenda-modal-counter">{String(index + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</div>
      {items.length > 1 && <>
        <button className="agenda-modal-arrow prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length) }} aria-label="Anterior">‹</button>
        <button className="agenda-modal-arrow next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length) }} aria-label="Siguiente">›</button>
      </>}
      <div className="agenda-modal-inner" onClick={e => e.stopPropagation()}>
        <div className="agenda-modal-poster">
          <img src={ev.poster || LOGO_CASTILLO} alt={`Cartel · ${ev.title}`} />
        </div>
        <div className="agenda-modal-info">
          <span className="agenda-modal-tipo">
            <span className="swatch" style={{background: color}}></span>
            {tag}
          </span>
          <h3 className="serif">{ev.title}</h3>
          {isBando
            ? <p className="agenda-modal-desc" style={{whiteSpace:"pre-wrap"}}>{ev.original_text || ev.desc}</p>
            : <>
                <p className="agenda-modal-desc">{ev.desc}</p>
                <div className="agenda-modal-meta">
                  {fechaLarga && <div className="agenda-modal-row"><span className="label">Cuándo</span><span className="value">{ev.when || fechaLarga}</span></div>}
                  {ev.place && <div className="agenda-modal-row"><span className="label">Dónde</span><span className="value">{ev.place}</span></div>}
                </div>
              </>
          }
        </div>
      </div>
    </div>
  )
}

function News({ setPage }) {
  const eventos = useEventos()
  const [openItem, setOpenItem] = useState(null)

  const items = eventos ? eventos.slice(0, 3) : null

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
                const img = n.poster || LOGO_CASTILLO
                const isBando = n.tipo === "bando"

                let excerpt, showVerMas
                if (isBando) {
                  const { text, truncated } = truncate(n.original_text || n.desc, 50)
                  excerpt = text
                  showVerMas = truncated
                } else {
                  excerpt = n.desc_short || n.desc
                  showVerMas = false
                }

                return (
                  <article
                    key={n.id || i}
                    className="news-card reveal"
                    style={{transitionDelay:`${i*0.08}s`, cursor:"pointer"}}
                    onClick={() => setOpenItem(i)}
                  >
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
                      <p className="news-excerpt">
                        {excerpt}
                        {showVerMas && <button
                          onClick={e => { e.stopPropagation(); setOpenItem(i) }}
                          style={{background:"none",border:"none",padding:0,marginLeft:4,color:"var(--terracota)",fontFamily:"inherit",fontSize:"inherit",cursor:"pointer",textDecoration:"underline"}}
                        >… ver más</button>}
                      </p>
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
      {items && <NewsModal items={items} index={openItem} setIndex={setOpenItem} />}
    </section>
  )
}

export default News
