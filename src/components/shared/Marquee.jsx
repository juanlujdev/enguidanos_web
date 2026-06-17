import React from 'react'

function Marquee() {
  const items = ["Reserva de la Biosfera", "Chorreras del Cabriel", "Castillo del s. XI", "Senderos PR-CU", "Río Cabriel", "Embalse de Contreras", "Hoz del Agua", "Atracción Natural"];
  const track = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {track.map((t, i) => <span key={i} className="dot">{t}</span>)}
      </div>
    </div>
  );
}

export default Marquee
