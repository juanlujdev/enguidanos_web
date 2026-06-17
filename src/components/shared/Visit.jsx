import React from 'react'
import Icon from './Icon.jsx'

function Visit({ setPage }) {
  return (
    <section className="visit">
      <div className="container">
        <div className="visit-card reveal">
          <div style={{position:"relative", zIndex:1}}>
            <div className="eyebrow" style={{color:"rgba(255,255,255,0.85)",marginBottom:24}}>Planifica tu escapada</div>
            <h2>Ven a perderte<br/>en la <em>serranía</em></h2>
            <p>Tres horas desde Madrid, dos desde Valencia. Una semana, un fin de semana, un día. Lo que cabe, cabe.</p>
            <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
              <a className="btn btn-dark" href="https://www.google.com/maps/dir/?api=1&destination=Engu%C3%ADdanos%2C+Cuenca" target="_blank" rel="noopener noreferrer">Cómo llegar <Icon.arrow /></a>
              <button className="btn" style={{background:"#fff", color:"var(--terracota-deep)"}} onClick={() => { window.scrollTo(0, 0); setPage && setPage("alojamientos"); }}>Dónde dormir</button>
            </div>
          </div>
          <div className="visit-info">
            <div className="visit-info-row">
              <span className="label">Desde Madrid</span>
              <span className="value">2h 50min · A-3</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Desde Valencia</span>
              <span className="value">1h 50min · A-3</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Desde Cuenca</span>
              <span className="value">1h 20min · CUV-3001</span>
            </div>
            <div className="visit-info-row">
              <span className="label">Estación más cercana</span>
              <span className="value">Cuenca AVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Visit
