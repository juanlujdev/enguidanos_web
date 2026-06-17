import React from 'react'
import { Icon } from '../shared/index.js'

function TurismoPage({ setPage }) {
  const go = (dest) => { window.scrollTo(0, 0); setPage(dest); };
  const cards = [
    { id: "oficina-turismo", label: "Oficina de Turismo", img: "assets/oficina-turismo.webp", dest: "oficina-turismo",
      desc: "Tu punto de partida: mapas, horarios y consejos para aprovechar la visita." },
    { id: "turismo-deportivo", label: "Turismo Deportivo", img: "assets/menu-turismo-deportivo.webp", dest: "turismo-deportivo",
      desc: "Rafting y barranquismo sobre las aguas bravas del Cabriel, además de rutas de senderismo y de bicicleta." },
    { id: "patrimonio-cultural", label: "Patrimonio Cultural", img: "assets/menu-patrimonio-cultural.webp", dest: "patrimonio",
      desc: "Veinte rincones con historia: el poblado celtíbero, el castillo árabe, ermitas, molinos, escudos y miradores." },
    { id: "naturaleza", label: "Naturaleza", img: "assets/menu-naturaleza.webp", dest: "naturaleza",
      desc: "Las Chorreras, las hoces y los senderos de la Reserva de la Biosfera." },
    { id: "restaurantes", label: "Restaurantes", img: "assets/menu-restaurantes.webp", dest: "restaurantes",
      desc: "Cocina serrana junto al fuego: caldereta, migas y guisos de caza." },
    { id: "alojamientos", label: "Alojamientos", img: "assets/menu-alojamientos.webp", dest: "alojamientos",
      desc: "Casas rurales y cabañas de madera para quedarte más de un día." },
  ];
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><span>Inicio</span> · Turismo</div>
          <h1 className="reveal in">Todo lo que el río<br/><em>te deja descubrir</em></h1>
          <p className="reveal in reveal-delay-1">Enguídanos se recorre despacio: por sus hoces y cascadas, por las piedras de su castillo, por la mesa de sus mesones y el descanso de sus casas rurales. Elige por dónde empezar.</p>
        </div>
      </section>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:28}}>Planes para todos los gustos</div>
          <div className="turismo-grid">
            {cards.map((c, i) => (
              <a key={c.id} className="turismo-card reveal" style={{transitionDelay:`${(i%3)*0.06}s`}} onClick={() => go(c.dest)}>
                <div className="turismo-card-media" style={{backgroundImage:`url(${c.img})`}}></div>
                <div className="turismo-card-scrim"></div>
                <div className="turismo-card-body">
                  <h3 className="serif">{c.label}</h3>
                  <p>{c.desc}</p>
                  <span className="turismo-card-cta">Explorar <Icon.arrow /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default TurismoPage
