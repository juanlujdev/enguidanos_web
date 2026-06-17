import React from 'react'
import PUEBLO from '../../data/pueblo.json'

function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          draggable={false}
          src="assets/portada-v2.mp4">
        </video>
        <div className="placeholder-video" style={{zIndex:-1}}></div>
      </div>
      <div className="container hero-content">
        <div className="reveal in">
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:32,color:"rgba(255,255,255,0.75)",fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase"}}>
            <span style={{width:24,height:1,background:"currentColor"}}></span>
            Serranía baja de Cuenca · {PUEBLO.altitud} m
          </div>
          <h1 className="hero-title">Donde el río<br/>esculpe la <em>piedra</em></h1>
          <div className="hero-sub">
            <p className="hero-tagline">
              Un pueblo de la serranía baja de Cuenca, abrazado por bosques de pino y sabina,
              y por uno de los ríos más salvajes de la península: el Cabriel.
            </p>
            <div className="hero-meta">
              <div>Habitantes<span>{PUEBLO.habitantes}</span></div>
              <div>Altitud<span>{PUEBLO.altitud} m</span></div>
              <div>Fundación<span>S. XI</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll">Desliza</div>
    </section>
  );
}

export default Hero
