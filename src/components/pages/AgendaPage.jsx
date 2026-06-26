import React, { useState, useEffect } from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'
import { useEventos } from '../../hooks/useEventos.js'
import AGENDA_CATS from '../../data/agenda-cats.json'
import { parseEvDate, expandEventos, MES_ABBR } from '../../utils/eventos.js'

const MESES_LARGO = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

async function downloadImage(e, src, name) {
  e.preventDefault();
  const ext = (src.split(".").pop() || "jpg").split(/[?#]/)[0];
  const base = (name || "cartel").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "cartel";
  const filename = `${base}.${ext}`;
  try {
    const res = await fetch(src);
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
    window.open(src, "_blank", "noopener");
  }
}

// Modal a pantalla completa con el cartel del evento + su ficha
function EventoModal({ items, index, setIndex }) {
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
  const ev = items[index];
  const p = parseEvDate(ev.date);
  const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
  const fechaLarga = p.day ? `${p.day} de ${MESES_LARGO[p.mi].toLowerCase()} de ${p.y}` : `${MESES_LARGO[p.mi]} de ${p.y}`;

  return (
    <div className="agenda-modal" onClick={() => setIndex(null)}>
      <button className="agenda-modal-close" onClick={() => setIndex(null)} aria-label="Cerrar">×</button>
      <div className="agenda-modal-counter">{String(index + 1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</div>
      <button className="agenda-modal-arrow prev" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length); }} aria-label="Anterior">‹</button>
      <button className="agenda-modal-arrow next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length); }} aria-label="Siguiente">›</button>
      <div className="agenda-modal-inner" onClick={e => e.stopPropagation()}>
        <div className="agenda-modal-poster">
          <img src={ev.poster || "assets/escudo-enguidanos.webp"} alt={`Cartel · ${ev.title}`} />
        </div>
        <div className="agenda-modal-info">
          <span className="agenda-modal-tipo"><span className="swatch" style={{background:c.color}}></span>{ev.subtipo || c.label}</span>
          <h3 className="serif">{ev.title}</h3>
          {ev.dayLabel && <div className="agenda-modal-daylabel">{ev.dayLabel}</div>}
          <p className="agenda-modal-desc">{ev.desc}</p>
          <div className="agenda-modal-meta">
            <div className="agenda-modal-row"><span className="label">Cuándo</span><span className="value">{ev.dayLabel || fechaLarga}</span></div>
            {!ev.multi && <div className="agenda-modal-row"><span className="label">Horario</span><span className="value">{ev.when}</span></div>}
            <div className="agenda-modal-row"><span className="label">Dónde</span><span className="value">{ev.place}</span></div>
          </div>
          {ev.items && ev.items.length > 0 && (
            <div className="agenda-modal-programa">
              <div className="agenda-modal-programa-head">{ev.multi ? "Programa del día" : "Programa"}</div>
              <div className="agenda-prog-bloque">
                <ul>
                  {ev.items.map((it, ii) => <li key={ii}>{it}</li>)}
                </ul>
              </div>
            </div>
          )}
          {ev.poster && (
            <a className="agenda-modal-dl" href={ev.poster} download={ev.poster.split("/").pop()} onClick={(e) => downloadImage(e, ev.poster, ev.title)}>Descargar cartel ↓</a>
          )}
        </div>
      </div>
    </div>
  );
}

function AgendaPage() {
  const eventos = useEventos()
  const [filter, setFilter] = useState("all");
  const [month, setMonth] = useState(new Date()); // arranca en el mes actual
  const [openEv, setOpenEv] = useState(null); // índice (dentro de `displayList`) del evento abierto
  const [tab, setTab] = useState("prox");      // "prox" = próximos · "pas" = pasados
  const [visible, setVisible] = useState(6);    // cuántos se muestran (botón "Ver más")
  useEffect(() => { setVisible(6); setOpenEv(null); }, [filter, tab]); // reinicia al cambiar filtro o pestaña

  if (!eventos) return (
    <main>
      <div style={{textAlign:"center",padding:"120px 0",color:"var(--ink-3)",fontFamily:"var(--font-mono)",fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase"}}>
        Cargando agenda…
      </div>
    </main>
  );

  const secciones = (eventos || []).filter(e => e.tipo === "seccion");
  const allRows = expandEventos(secciones);
  const base = filter === "all" ? allRows : allRows.filter(e => e.cat === filter);
  const todayISO = new Date().toISOString().slice(0, 10);
  const upcoming = [...base].filter(e => e.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date)); // próximos: el más cercano primero
  const past = [...base].filter(e => e.date < todayISO).sort((a, b) => b.date.localeCompare(a.date));       // pasados: el más reciente primero
  // En "Próximos" sin eventos futuros, se cae a los pasados recientes con un aviso
  const fallbackPast = tab === "prox" && upcoming.length === 0;
  const displayList = (tab === "pas" || fallbackPast) ? past : upcoming;
  const shown = displayList.slice(0, visible);
  const filterChips = [{ k: "all", l: "Todos" }, ...Object.entries(AGENDA_CATS).map(([k, v]) => ({ k, l: v.label }))];

  // Calendar grid for current month
  const y = month.getFullYear(), m = month.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // monday-first
  const daysInMonth = last.getDate();
  const daysInPrev = new Date(y, m, 0).getDate();
  const evDayMap = {};
  allRows.forEach(e => {
    const p = parseEvDate(e.date);
    if (p.y === y && p.mi === m && p.day) evDayMap[p.day] = e.cat;
  });

  const cells = [];
  for (let i = startDay - 1; i >= 0; i--) cells.push({ d: daysInPrev - i, muted: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i, muted: false, ev: evDayMap[i] });
  while (cells.length % 7 !== 0) cells.push({ d: cells.length - daysInMonth - startDay + 1, muted: true });

  const today = new Date();

  return (
    <main>
      <PageHeroMedia img="assets/hoguera-san-blas.webp" alt="Hoguera de San Blas en la plaza de Enguídanos">
        <div className="breadcrumb"><span>Inicio</span> · Agenda</div>
        <h1 className="reveal in">Agenda<br/><em>cultural</em></h1>
        <p className="reveal in reveal-delay-1">Fiestas, mercados, jornadas y rutas guiadas. Todo lo que pasa en Enguídanos durante el año. Pulsa un evento para ver su cartel.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:64}}>
        <div className="container">
          <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:64}} className="reveal agenda-layout">
            <div>
              <div style={{display:"flex", gap:8, marginBottom:20, flexWrap:"wrap"}}>
                {filterChips.map(f => (
                  <button key={f.k}
                    className={`filter-chip ${filter===f.k?"active":""}`}
                    onClick={() => setFilter(f.k)}>
                    {f.l}
                  </button>
                ))}
              </div>
              <div className="agenda-tabs">
                <button className={`agenda-tab ${tab==="prox"?"active":""}`} onClick={() => setTab("prox")}>Próximos <span>{upcoming.length}</span></button>
                <button className={`agenda-tab ${tab==="pas"?"active":""}`} onClick={() => setTab("pas")}>Pasados <span>{past.length}</span></button>
              </div>
              {fallbackPast && (
                <div className="agenda-empty">
                  No hay eventos próximos programados por el momento. Vuelve pronto: la agenda se actualiza con regularidad.
                  <span>Mientras tanto, estos son los eventos más recientes:</span>
                </div>
              )}
              <div className="events-list">
                {shown.map((ev, i) => {
                  const p = parseEvDate(ev.date);
                  const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
                  return (
                    <div key={i} className="event-row event-row-click" onClick={() => setOpenEv(i)}>
                      <div className="event-date">
                        {p.day ? <>{p.day}<span>{p.abbr} {p.y}</span></> : <span className="event-date-mo">{p.abbr}<small>{p.y}</small></span>}
                      </div>
                      <div>
                        <div className="event-title">{ev.title}</div>
                        <div style={{fontSize:13, color:"var(--ink-3)", marginTop:6, maxWidth:360}}>{ev.multi && ev.items.length ? ev.items.join(" · ") : ev.desc}</div>
                      </div>
                      <div className="event-meta">{ev.when}</div>
                      <div>
                        <span className="event-cat">
                          <span className="swatch" style={{background:c.color}}></span>
                          {c.label}
                        </span>
                      </div>
                      <div className="event-arrow"><Icon.arrowR /></div>
                    </div>
                  );
                })}
                {displayList.length === 0 && (
                  <div className="agenda-empty">No hay eventos en esta categoría.</div>
                )}
              </div>
              {visible < displayList.length && (
                <button className="agenda-more" onClick={() => setVisible(v => v + 6)}>
                  Ver más eventos <span className="mono">({displayList.length - visible})</span>
                </button>
              )}
            </div>
            <div>
              <div className="calendar">
                <div className="calendar-head">
                  <h3 className="serif">{MESES_LARGO[m]} <span style={{color:"var(--ink-3)"}}>{y}</span></h3>
                  <div className="calendar-nav">
                    <button onClick={() => setMonth(new Date(y, m-1, 1))}>‹</button>
                    <button onClick={() => setMonth(new Date(y, m+1, 1))}>›</button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {["L","M","X","J","V","S","D"].map(d => <div key={d} className="dow">{d}</div>)}
                  {cells.map((c, i) => {
                    const isToday = !c.muted && c.d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
                    return (
                      <div key={i} className={`cal-day ${c.muted?"muted":""} ${c.ev?"has-event "+c.ev:""} ${isToday?"today":""}`}>
                        {c.d}
                      </div>
                    );
                  })}
                </div>
                <div className="calendar-legend">
                  {Object.entries(AGENDA_CATS).map(([k, v]) => (
                    <span key={k}><span style={{width:6,height:6,borderRadius:"50%",background:v.color,flexShrink:0}}></span>{v.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EventoModal items={displayList} index={openEv} setIndex={setOpenEv} />
    </main>
  );
}

export default AgendaPage
