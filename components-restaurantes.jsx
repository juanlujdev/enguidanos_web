/* global React */
// =============== RESTAURANTES PAGE ===============

const RESTAURANTES = [
  {
    id: "hostal-el-cabriel",
    name: "Hostal El Cabriel",
    tipo: "Cocina típica regional",
    desc: "Mesón serrano de toda la vida, con comedor de vigas de madera, chimenea y lámparas de forja. Aquí se cocina el recetario de la sierra: gazpacho manchego, caldereta y guisos de caza que se sirven en cazuela de barro y se acompañan con pan tostado para mojar. Producto de la tierra, fuego lento y raciones generosas a un paso del río.",
    address: "C/ Leonardo Luján, 47, Enguídanos, 16372",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hostal+El+Cabriel+C%2F+Leonardo+Luj%C3%A1n+47+Engu%C3%ADdanos+16372",
    phones: ["+34 687 48 09 43", "969 34 49 00"],
    fotos: [
      "assets/restaurantes/hostal-el-cabriel-1.webp",
      "assets/restaurantes/hostal-el-cabriel-3.webp",
      "assets/restaurantes/hostal-el-cabriel-2.webp",
    ],
  },
  {
    id: "cobijo-de-los-sentidos",
    name: "El Cobijo de los Sentidos",
    tipo: "Cocina tradicional manchega",
    desc: "Cocina tradicional manchega y tapas en pleno casco antiguo, con una terraza de preciosas vistas al valle del Cabriel. Ajoarriero, gazpachos y guisos de siempre servidos en cazuela de barro, para disfrutar a fuego lento entre la piedra del pueblo y la sierra al fondo.",
    address: "C. Entrehuertas, 7, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=El+Cobijo+de+los+Sentidos+C.+Entrehuertas+7+Engu%C3%ADdanos+16372",
    phones: ["695 90 66 91"],
    fotos: [
      "assets/restaurantes/cobijo-1.webp",
      "assets/restaurantes/cobijo-2.webp",
      "assets/restaurantes/cobijo-3.webp",
    ],
  },
  {
    id: "bar-la-sentaeta",
    name: "Bar La Sentaeta",
    tipo: "Bar de tapas",
    desc: "Bar de tapas con terraza y preciosas vistas hacia la Hoz Cerrada. Tostas y pinchos recién hechos —pollo a la brasa, queso y salsas de la casa— para tomar con una caña mientras el valle se abre a tus pies. Ambiente de pueblo, de los de sentarse un rato y disfrutar.",
    address: "C. Cuenca, 74, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Bar+La+Sentaeta+C.+Cuenca+74+Engu%C3%ADdanos+16372",
    phones: ["601 31 53 35"],
    fotos: [
      "assets/restaurantes/sentaeta-1.webp",
      "assets/restaurantes/sentaeta-2.webp",
    ],
  },
  {
    id: "cafeteria-nhora",
    name: "Cafetería Nhora",
    tipo: "Cafetería · Tapas",
    desc: "Cafetería junto a la Plaza Mayor para tomarse el día con calma: cafés, cervezas bien tiradas, tapas y bocadillos. Su terraza en la Gran Vía es de las de quedarse a ver pasar el pueblo, con una caña fría y algo que picar a media tarde.",
    address: "C. Gran Vía, 2, 16372 Enguídanos, Cuenca",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Cafeter%C3%ADa+Nhora+C.+Gran+V%C3%ADa+2+Engu%C3%ADdanos+16372",
    phones: ["642 80 08 48"],
    fotos: [
      "assets/restaurantes/nhora-3.webp",
      "assets/restaurantes/nhora-1.webp",
      "assets/restaurantes/nhora-2.webp",
    ],
  },
];

function telHref(p) { return "tel:" + p.replace(/[^\d+]/g, ""); }

function RestaurantesPage() {
  return (
    <main>
      <PageHeroMedia img="assets/restaurantes/hostal-el-cabriel-1.webp" alt="Caldereta serrana servida en cazuela de barro">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Restaurantes</div>
        <h1 className="reveal in">Sabores de<br/><em>la sierra</em></h1>
        <p className="reveal in reveal-delay-1">Cocina serrana junto al fuego: caldereta, guisos de caza, gazpacho manchego y migas. Los mesones de Enguídanos sirven el recetario de siempre con producto de la tierra y mesa sin prisas.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Dónde comer en Enguídanos</div>
          <div className="resto-list">
            {RESTAURANTES.map((r, i) => (
              <article key={r.id} className="resto-card reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="resto-head">
                  <div className="resto-tipo mono">{r.tipo}</div>
                  <h3 className="resto-name serif">{r.name}</h3>
                </div>
                <div className="resto-gallery">
                  {r.fotos.map((f, k) => (
                    <img key={k} src={f} alt={`${r.name} — foto ${k+1}`} loading="lazy" />
                  ))}
                </div>
                <p className="resto-desc">{r.desc}</p>
                {(r.address || (r.phones && r.phones.length > 0)) && (
                  <div className="resto-contact">
                    {r.address && (
                      <a className="resto-contact-item mono" href={r.mapUrl} target="_blank" rel="noopener noreferrer">
                        <span>📍</span>{r.address}
                      </a>
                    )}
                    {r.phones && r.phones.length > 0 && (
                      <div className="resto-phones">
                        {r.phones.map(p => (
                          <a key={p} className="resto-contact-item mono" href={telHref(p)}><span>📞</span>{p}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { RestaurantesPage });
