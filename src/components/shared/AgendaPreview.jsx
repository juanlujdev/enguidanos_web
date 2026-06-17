import React, { useState, useEffect } from 'react'
import EVENTOS from '../../data/eventos.json'
import AGENDA_CATS from '../../data/agenda-cats.json'
import { parseEvDate, expandEventos } from '../../utils/eventos.js'
import Icon from './Icon.jsx'

// WMO weather-code → [texto, emoji]
const WMO_CODES = {
  0:["Despejado","☀️"], 1:["Mayormente despejado","🌤️"], 2:["Parcialmente nublado","⛅"], 3:["Nublado","☁️"],
  45:["Niebla","🌫️"], 48:["Niebla con escarcha","🌫️"],
  51:["Llovizna débil","🌦️"], 53:["Llovizna","🌦️"], 55:["Llovizna intensa","🌦️"],
  56:["Llovizna helada","🌧️"], 57:["Llovizna helada","🌧️"],
  61:["Lluvia débil","🌧️"], 63:["Lluvia","🌧️"], 65:["Lluvia fuerte","🌧️"],
  66:["Lluvia helada","🌧️"], 67:["Lluvia helada","🌧️"],
  71:["Nieve débil","🌨️"], 73:["Nieve","🌨️"], 75:["Nieve intensa","❄️"], 77:["Aguanieve","🌨️"],
  80:["Chubascos","🌦️"], 81:["Chubascos","🌦️"], 82:["Chubascos fuertes","⛈️"],
  85:["Chubascos de nieve","🌨️"], 86:["Chubascos de nieve","🌨️"],
  95:["Tormenta","⛈️"], 96:["Tormenta con granizo","⛈️"], 99:["Tormenta con granizo","⛈️"],
};

function Weather() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    const url = "https://api.open-meteo.com/v1/forecast?latitude=39.674&longitude=-1.606" +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset" +
      "&timezone=Europe%2FMadrid&forecast_days=5";
    const load = () => fetch(url).then(r => r.json())
      .then(j => { if (alive) { setData(j); setErr(false); } })
      .catch(() => { if (alive) setErr(true); });
    load();
    const t = setInterval(load, 15 * 60 * 1000); // refresca cada 15 min
    return () => { alive = false; clearInterval(t); };
  }, []);

  const days = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];
  const dirName = (deg) => ["N","NE","E","SE","S","SO","O","NO"][Math.round((deg||0)/45) % 8];
  const hhmm = (iso) => { try { return new Date(iso).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}); } catch(e){ return "—"; } };
  const now = new Date();

  const header = (
    <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.18em",color:"var(--ink-3)",textTransform:"uppercase"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background: err ? "#b4533a" : (data ? "#4f8a4f" : "var(--ink-3)"),flexShrink:0,boxShadow: data && !err ? "0 0 0 0 rgba(79,138,79,0.5)" : "none",animation: data && !err ? "wpulse 2s infinite" : "none"}}></span>
      El tiempo · en directo
    </div>
  );

  if (err) {
    return (
      <div className="weather reveal reveal-delay-2">
        {header}
        <div style={{padding:"24px 0",textAlign:"center",color:"var(--ink-2)",fontSize:14}}>
          No se ha podido cargar el tiempo en este momento.
        </div>
      </div>
    );
  }
  if (!data || !data.current || !data.daily) {
    return (
      <div className="weather reveal reveal-delay-2">
        {header}
        <div style={{padding:"24px 0",textAlign:"center",color:"var(--ink-3)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase"}}>
          Cargando datos…
        </div>
      </div>
    );
  }

  const cur = data.current;
  const [curText, curIcon] = WMO_CODES[cur.weather_code] || ["—","🌡️"];
  const dy = data.daily;
  const forecast = dy.time.map((iso, i) => {
    const d = new Date(iso + "T12:00");
    const [, icon] = WMO_CODES[dy.weather_code[i]] || ["","🌡️"];
    return { day: i === 0 ? "HOY" : days[d.getDay()], t: Math.round(dy.temperature_2m_max[i]), icon };
  });

  return (
    <div className="weather reveal reveal-delay-2">
      {header}
      <div className="weather-current">
        <div>
          <div className="weather-place">Enguídanos · {now.toLocaleDateString("es-ES",{weekday:"long"})}</div>
          <div className="weather-temp">{Math.round(cur.temperature_2m)}<sup>°C</sup></div>
          <div className="weather-cond">{curText} · viento {Math.round(cur.wind_speed_10m)} km/h del {dirName(cur.wind_direction_10m)}</div>
        </div>
        <span className="weather-icon" style={{fontSize:52,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{curIcon}</span>
      </div>
      <div className="weather-forecast">
        {forecast.map((d, i) => (
          <div key={i} className="weather-day">
            {d.day}
            <span className="icon">{d.icon}</span>
            <span className="t">{d.t}°</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.12em",color:"var(--ink-3)",textTransform:"uppercase",borderTop:"1px solid var(--line-soft)",paddingTop:12}}>
        <span>Amanecer {hhmm(dy.sunrise[0])}</span>
        <span>Ocaso {hhmm(dy.sunset[0])}</span>
      </div>
    </div>
  );
}

function AgendaPreview({ setPage }) {
  return (
    <section className="section agenda-preview">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>Próximos eventos</div>
            <h2 className="section-title">¿Qué pasa en <em>el pueblo</em>?</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setPage("agenda")}>Ver agenda completa <Icon.arrow /></button>
        </div>
        <div className="agenda-split">
          <div className="events-list reveal">
            {(() => {
              const todayISO = new Date().toISOString().slice(0, 10);
              const sorted = expandEventos(EVENTOS).sort((a, b) => a.date.localeCompare(b.date));
              const upcoming = sorted.filter(e => e.date >= todayISO);        // próximos, ascendente
              const past = sorted.filter(e => e.date < todayISO).reverse();    // pasados recientes primero
              const list = [...upcoming, ...past].slice(0, 4);
              return list.map((ev, i) => {
                const p = parseEvDate(ev.date);
                const c = AGENDA_CATS[ev.cat] || { label: ev.cat, color: "var(--ink-3)" };
                return (
                  <div key={i} className="event-row" onClick={() => setPage("agenda")}>
                    <div className="event-date">
                      {p.day ? <>{p.day}<span>{p.abbr}</span></> : <span className="event-date-mo">{p.abbr}<small>{p.y}</small></span>}
                    </div>
                    <div className="event-title">{ev.title}</div>
                    <div className="event-meta">{ev.when}</div>
                    <div>
                      <span className="event-cat">
                        <span className="swatch" style={{background: c.color}}></span>
                        {c.label}
                      </span>
                    </div>
                    <div className="event-arrow"><Icon.arrowR /></div>
                  </div>
                );
              });
            })()}
          </div>
          <Weather />
        </div>
      </div>
    </section>
  );
}

export default AgendaPreview
