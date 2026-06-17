import React from 'react'
import Icon from './Icon.jsx'

function CabrielFeature() {
  return (
    <section className="cabriel">
      <div className="container cabriel-grid">
        <div className="reveal">
          <div className="eyebrow" style={{color:"var(--sol)",marginBottom:20}}>El río que nos define</div>
          <h2>El <em>Cabriel</em>,<br/>nuestro tesoro<br/>esculpido en piedra</h2>
          <p>
            Declarado Reserva Natural por sus aguas cristalinas y su biodiversidad excepcional,
            el río Cabriel atraviesa el término municipal dibujando meandros, hoces y, sobre todo,
            las espectaculares Chorreras: una sucesión de saltos y pozas turquesas labradas
            durante milenios sobre la roca calcárea.
          </p>
          <p>
            Ruta lineal de 3,2 km con final en la cascada principal. Pasarelas de madera,
            áreas de descanso y bañeras naturales en los tramos habilitados.
          </p>
          <div style={{marginTop:32, display:"flex", gap:12}}>
            <button className="btn btn-primary">Cómo llegar <Icon.arrow /></button>
            <button className="btn" style={{background:"transparent", color:"var(--bg)", border:"1px solid rgba(246,241,231,0.3)"}}>Descargar GPX</button>
          </div>
          <div className="cabriel-stats">
            <div>Recorrido<span>3,2 km</span></div>
            <div>Desnivel<span>+180 m</span></div>
            <div>Dificultad<span>Media</span></div>
          </div>
        </div>
        <div className="reveal reveal-delay-2">
          <div className="cabriel-image photo-tinted">
            <div className="photo-label" style={{fontSize:11}}>FOTO · Las Chorreras del Cabriel · plano cenital o cascada principal</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CabrielFeature
