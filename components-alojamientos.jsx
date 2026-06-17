/* global React */
// =============== ALOJAMIENTOS PAGE ===============

const ALOJAMIENTOS = [
  {
    id: "las-casas-de-la-vega",
    name: "Las Casas de la Vega",
    tipo: "Cabañas rurales de madera · Vegaventura",
    desc: "Complejo de turismo rural en plena Vega de Enguídanos, junto al río Cabriel. Sus cabañas de madera, completamente equipadas y rodeadas de árboles, están pensadas para desconectar del ritmo de la ciudad: despertar en silencio, respirar aire puro y disfrutar de la naturaleza en estado puro. Un refugio perfecto para una escapada en familia o con amigos, con barbacoa, zonas ajardinadas y mucho espacio al aire libre.",
    extra: "Bajo la marca Vegaventura ofrecen además multiaventura para todos los niveles: rafting y descenso de barrancos por las aguas bravas del Cabriel, trekking y senderismo, rutas en bicicleta guiadas, canoa y piragua, puenting, hidrospeed, paintball y tiro con arco. Admiten mascotas avisando con antelación.",
    features: ["Cabañas equipadas", "Admite mascotas", "Barbacoa", "Multiaventura", "Junto al río Cabriel", "Ideal familias"],
    address: "Paraje de la Vega, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/place/Las+Casas+De+La+Vega/@39.7047999,-1.5914547,17z",
    phones: ["650 56 49 55"],
    email: "gemmsu@hotmail.com",
    web: "https://lascasasdelavega.com/",
    fotos: [
      "assets/alojamientos/casas-vega-cabanas.webp",
      "assets/alojamientos/casas-vega-noche.webp",
      "assets/alojamientos/casas-vega-pergola.webp",
    ],
  },
  {
    id: "mirador-de-la-cueva",
    name: "Mirador de la Cueva",
    tipo: "Apartamento rural · Vistas a la montaña",
    desc: "Alojamiento con WiFi gratis y vistas a la montaña en pleno casco de Enguídanos, situado en un edificio de 2010 y a un paso del Mirador de la Cueva, uno de los miradores más espectaculares del pueblo, con vistas al castillo y al paisaje de la serranía. Una zona ideal para practicar senderismo y pesca y para descubrir el entorno natural sin prisas.",
    extra: "El apartamento cuenta con balcón y vistas al pueblo, 3 dormitorios, una sala de estar con TV de pantalla plana, una cocina equipada con nevera y microondas y 1 baño con ducha. Se entrega con toallas y ropa de cama incluidas, listo para entrar a disfrutar.",
    features: ["WiFi gratis", "Vistas a la montaña", "3 dormitorios", "Junto al Mirador de la Cueva"],
    address: "C. la Paz, 17, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Calle+la+Paz+17+Engu%C3%ADdanos+Cuenca",
    phones: ["680 14 02 40"],
    fotos: [
      "assets/alojamientos/mirador-cueva-fachada.webp",
      "assets/alojamientos/mirador-cueva-salon.webp",
      "assets/alojamientos/mirador-cueva-cocina.webp",
    ],
  },
  {
    id: "los-carriles",
    name: "Los Carriles",
    tipo: "Alojamiento rural · Mesón propio",
    desc: "Alojamiento rural en Enguídanos que recrea el sabor de la casa de pueblo de toda la vida: muros de entramado de madera, patio con pozo encalado y rincones decorados con aperos de labranza que respiran tradición. Un lugar tranquilo para descansar y disfrutar del ambiente sereno de la serranía, rodeado de detalles que rememoran la vida rural manchega.",
    extra: "Dispone además de un mesón exclusivo para los clientes que se hospedan en él, donde degustar comida típica tradicional de la zona elaborada al calor del horno y la chimenea. Un comedor con encanto, de vigas de madera y mesas vestidas a cuadros, para terminar el día con la mejor cocina casera.",
    features: ["Mesón para huéspedes", "Comida típica tradicional", "Casa rural con encanto", "Patio con pozo", "Ambiente serrano"],
    address: "C. de Don Leonardo Lujan, 113, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Don+Leonardo+Lujan+113+Engu%C3%ADdanos+Cuenca",
    phones: ["969 34 49 60"],
    fotos: [
      "assets/alojamientos/carriles-exterior.webp",
      "assets/alojamientos/carriles-meson.webp",
      "assets/alojamientos/carriles-patio.webp",
    ],
  },
  {
    id: "la-lumbre",
    name: "Hostal Rural La Lumbre",
    tipo: "Hostal rural · A los pies del castillo",
    desc: "Hostal rural en pleno casco de Enguídanos, a los pies del castillo y abrazado por la roca de la montaña. Su mayor encanto es un coqueto patio interior pegado a la pared rocosa, un rincón tranquilo y resguardado donde tomar algo a la sombra antes de salir a descubrir el pueblo. Habitaciones acogedoras de aire rústico para un descanso cálido y sereno.",
    features: ["A los pies del castillo", "Patio interior", "Junto a la montaña", "Ambiente rústico", "En el casco histórico"],
    address: "C. Castillo, 1, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Castillo+1+Engu%C3%ADdanos+Cuenca",
    phones: ["969 34 47 40"],
    fotos: [
      "assets/alojamientos/lumbre-fachada.webp",
      "assets/alojamientos/lumbre-patio.webp",
      "assets/alojamientos/lumbre-habitacion.webp",
    ],
  },
  {
    id: "rincon-de-piedra",
    name: "Apartamentos El Rincón de Piedra",
    tipo: "Apartahotel · Restaurante y bar propios",
    desc: "Apartahotel en pleno Enguídanos con WiFi gratis, terraza y restaurante-bar propios. Sus apartamentos disponen de balcón, zona de estar con TV, cocina totalmente equipada con nevera, horno, microondas, fogones y cafetera, y baño privado con bidet. Un alojamiento cómodo y completo, pensado tanto para una escapada de fin de semana como para estancias más largas en la serranía.",
    extra: "Cada mañana se ofrece desayuno a la carta o continental, y desde la terraza se disfruta de unas vistas privilegiadas sobre los tejados del pueblo y las montañas que lo rodean. El entorno invita a descubrir la zona practicando senderismo, pesca y ciclismo por los alrededores.",
    features: ["WiFi gratis", "Terraza con vistas", "Restaurante y bar", "Cocina equipada", "Desayuno a la carta", "Baño privado"],
    address: "C. Entrehuertas, 7, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Calle+Entrehuertas+7+Engu%C3%ADdanos+Cuenca",
    phones: ["695 90 66 91"],
    fotos: [
      "assets/alojamientos/rincon-piedra-fachada.webp",
      "assets/alojamientos/rincon-piedra-terraza.webp",
      "assets/alojamientos/rincon-piedra-salon.webp",
    ],
  },
];

function alojaTelHref(p) { return "tel:" + p.replace(/[^\d+]/g, ""); }

function AlojamientosPage() {
  return (
    <main>
      <PageHeroMedia img="assets/alojamientos-portada.webp" alt="Cabaña de madera «Río Narboneta» con su porche entre la vegetación">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Alojamientos</div>
        <h1 className="reveal in">Dónde<br/><em>dormir</em></h1>
        <p className="reveal in reveal-delay-1">Casas rurales y cabañas de madera para alargar la visita y vivir Enguídanos sin prisas: despertar entre pinos, escuchar el río y dormir bajo uno de los cielos más limpios de la serranía.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Dónde alojarse en Enguídanos</div>
          <div className="resto-list">
            {ALOJAMIENTOS.map((a, i) => (
              <article key={a.id} className="resto-card reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="resto-head">
                  <div className="resto-tipo mono">{a.tipo}</div>
                  <h3 className="resto-name serif">{a.name}</h3>
                </div>
                <div className="aloja-gallery">
                  {a.fotos.map((f, k) => (
                    <img key={k} src={f} alt={`${a.name} — foto ${k+1}`} loading="lazy" />
                  ))}
                </div>
                <p className="resto-desc">{a.desc}</p>
                {a.extra && <p className="resto-desc" style={{marginTop:-10}}>{a.extra}</p>}
                {a.features && a.features.length > 0 && (
                  <div className="aloja-features">
                    {a.features.map(f => <span key={f} className="aloja-chip mono">{f}</span>)}
                  </div>
                )}
                <div className="resto-contact">
                  <a className="resto-contact-item mono" href={a.mapUrl} target="_blank" rel="noopener noreferrer">
                    <span>📍</span>{a.address}
                  </a>
                  <div className="resto-phones">
                    {a.phones.map(p => (
                      <a key={p} className="resto-contact-item mono" href={alojaTelHref(p)}><span>📞</span>{p}</a>
                    ))}
                    {a.email && (
                      <a className="resto-contact-item mono" href={`mailto:${a.email}`}><span>✉️</span>{a.email}</a>
                    )}
                    {a.web && (
                      <a className="resto-contact-item mono" href={a.web} target="_blank" rel="noopener noreferrer"><span>🌐</span>Web oficial</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="aloja-note reveal">
            <p className="mono">¿Gestionas un alojamiento en Enguídanos y quieres aparecer aquí? Escríbenos a <a href="mailto:info@enguidanos.es">info@enguidanos.es</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { AlojamientosPage });
