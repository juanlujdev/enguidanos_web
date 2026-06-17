import React from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'

async function downloadPdf(e, pdf, name) {
  e.preventDefault();
  const filename = (name || "documento").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
  try {
    const res = await fetch(pdf);
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
    window.location.href = pdf;
  }
}

const RUTAS_SENDERISMO = [
  {
    code: "PR CU-50", label: "Sendero de la Hoz del Agua y Hoz Cerrada",
    logo: "assets/rutas/logos/pr-cu-50.webp", pdf: "assets/senderos/pr-cu-50.pdf",
    tipo: "Circular", dist: "8 km", tiempo: "2h 30 – 3h", dif: "Baja",
    fotos: ["assets/rutas/fotos/pr-cu-50-1.webp"],
    desc: "Recorrido circular desde el casco urbano que se adentra en la Hoz del Agua y la Hoz Cerrada, entre farallones de roca caliza, fuentes que riegan los huertos y miradores con amplias panorámicas del valle.",
  },
  {
    code: "PR CU-53", label: "Sendero de Las Chorreras",
    logo: "assets/rutas/logos/pr-cu-53.webp", pdf: "assets/senderos/pr-cu-53.pdf",
    tipo: "Circular", dist: "8 km", tiempo: "2h 30 – 3h", dif: "Baja",
    fotos: ["assets/rutas/fotos/pr-cu-53-2.webp"],
    desc: "Sendero junto al Cabriel hasta el paraje de Las Chorreras, con sus tobas cuaternarias y saltos de agua de color turquesa. Uno de los rincones más fotografiados del municipio.",
  },
  {
    code: "PR CU-54", label: "Sendero de los Cuatro Ríos",
    logo: "assets/rutas/logos/pr-cu-54.webp", pdf: "assets/senderos/pr-cu-54.pdf",
    tipo: "Circular", dist: "13,5 km", tiempo: "3h 30", dif: "Media",
    fotos: ["assets/rutas/fotos/pr-cu-54-1.webp"],
    desc: "La ruta más exigente y espectacular: sigue el entorno acuático del Cabriel, donde el agua ha tallado rápidos, estrechos y puentes rocosos en la caliza. La de mayor desnivel de la zona.",
  },
  {
    code: "GR 64", label: "De Enguídanos a Mira",
    logo: "assets/rutas/logos/gr-64.webp", pdf: "assets/senderos/gr-64.pdf",
    tipo: "Lineal", dist: "—", tiempo: "Jornada", dif: "Media",
    fotos: ["assets/rutas/fotos/gr-64-1.webp"],
    desc: "Entre olivos, almendros y pinares, este gran recorrido baja hasta las ruinas del Balneario del Salobral y la unión de los ríos Mira y Narboneta, con vistas a la imponente Hoz del Río Mira.",
  },
  {
    code: "GR 66", label: "Valle del Cabriel · Víllora – Enguídanos",
    logo: "assets/rutas/logos/gr-66.webp", pdf: "assets/senderos/gr-66.pdf",
    tipo: "Lineal", dist: "16,5 km", tiempo: "4h 30", dif: "Media",
    fotos: ["assets/rutas/fotos/gr-66-1.webp"],
    desc: "Primera etapa del GR 66, lineal de Víllora a Enguídanos, que recorre los valles y estribaciones del Valle del Cabriel atravesando viaductos y antiguos trazados.",
  },
  {
    code: "BTT CU-02", label: "Ruta de bicicleta de montaña",
    logo: "assets/rutas/logos/btt-cu-02.webp", pdf: "assets/senderos/btt-cu-02.pdf",
    tipo: "BTT", dist: "—", tiempo: "Media jornada", dif: "Baja",
    fotos: ["assets/rutas/fotos/btt-cu-02-1.webp"],
    desc: "Ruta señalizada de bici de montaña que enlaza los paisajes más bellos de Enguídanos: El Perejil, la Hoz del Río Mira, Las Chorreras o La Playeta. Baja dificultad, apta para iniciarse.",
  },
];

function TurismoDeportivoPage() {
  return (
    <main>
      <PageHeroMedia img="assets/turismo-deportivo-portada.webp" alt="Salto a la poza turquesa del Cabriel en una jornada de barranquismo">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Turismo Deportivo</div>
        <h1 className="reveal in">Aventura sobre<br/><em>el Cabriel</em></h1>
        <p className="reveal in reveal-delay-1">Rafting y barranquismo en aguas bravas, senderos señalizados entre hoces y cascadas, y rutas de bicicleta de montaña. Enguídanos se vive también con las botas puestas.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Rutas de senderismo y BTT</div>
          <p className="td-section-intro reveal">Las mismas rutas homologadas que encontrarás en la Oficina de Turismo. Descarga el folleto oficial de cada una en PDF.</p>
          <div className="td-routes">
            {RUTAS_SENDERISMO.map((r, i) => (
              <article key={r.code} className="td-route reveal" style={{transitionDelay:`${(i%2)*0.06}s`}}>
                <div className="td-route-main">
                  <div className="td-route-head">
                    <img className="td-logo" src={r.logo} alt={`Logo ${r.code}`} />
                    <div>
                      <div className="td-route-code mono">{r.code}</div>
                      <h3 className="td-route-name serif">{r.label}</h3>
                    </div>
                  </div>
                  <div className="td-route-meta">
                    <span className="td-chip"><strong>Tipo</strong>{r.tipo}</span>
                    {r.dist !== "—" && <span className="td-chip"><strong>Distancia</strong>{r.dist}</span>}
                    <span className="td-chip"><strong>Duración</strong>{r.tiempo}</span>
                    <span className={`td-chip td-dif td-dif-${r.dif.toLowerCase()}`}><strong>Dificultad</strong>{r.dif}</span>
                  </div>
                  <p className="td-route-desc">{r.desc}</p>
                  <a className="td-dl mono" href={r.pdf} download={`${r.code} ${r.label}`.replace(/[^\w]+/g,"-")+".pdf"} onClick={(e) => downloadPdf(e, r.pdf, `${r.code} ${r.label}`)}>
                    Descargar folleto&nbsp;<Icon.arrow />
                  </a>
                </div>
                <div className={`td-photos ${r.fotos.length === 1 ? "single" : ""}`}>
                  {r.fotos.map((f, k) => (
                    <div key={k} className="td-photo" style={{backgroundImage:`url(${f})`}}></div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop:8}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:14}}>Empresas de deportes multiaventura</div>
          <p className="td-section-intro reveal">Profesionales del Cabriel que organizan actividades de aventura para todos los públicos: colegios, familias, grupos de amigos y empresas.</p>
          <div className="td-empresas">

            <article className="td-empresa reveal">
              <div className="td-empresa-main">
                <div className="td-empresa-head">
                  <img className="td-empresa-logo" src="assets/turismo-deportivo/empresas/altair-logo.webp" alt="Logo Altair" />
                  <div>
                    <h3 className="td-empresa-name serif">Altair Turismo Activo Rural</h3>
                    <div className="td-empresa-lugar mono">Enguídanos · Río Cabriel</div>
                  </div>
                </div>
                <p className="td-empresa-desc">Centro de turismo activo a orillas del Cabriel, especialistas en el barranco acuático de Las Chorreras. Rafting, kayak, canoas, paddle SUP, hidrospeed, puenting, travesías y rutas interpretadas: una oferta completa para colegios, familias, empresas y grupos de amigos de todas las edades.</p>
                <div className="td-empresa-tags">
                  {["Rafting","Barranquismo","Kayak","Paddle SUP","Hidrospeed","Puenting","Rutas interpretadas"].map(t=>(
                    <span key={t} className="td-tag">{t}</span>
                  ))}
                </div>
                <div className="td-empresa-contact">
                  <a href="tel:+34620545865" className="td-contact-item mono"><span>📞</span>620 54 58 65</a>
                  <span className="td-contact-item mono"><span>📍</span>Camino a La Pesquera, Km 2, Enguídanos</span>
                </div>
              </div>
              <div className="td-empresa-fotos">
                <img src="assets/turismo-deportivo/empresas/altair-foto-1.webp" alt="Altair rafting" />
              </div>
            </article>

            <article className="td-empresa reveal" style={{transitionDelay:"0.06s"}}>
              <div className="td-empresa-main">
                <div className="td-empresa-head">
                  <img className="td-empresa-logo" src="assets/turismo-deportivo/empresas/vegaventura-logo.webp" alt="Logo Vegaventura" />
                  <div>
                    <h3 className="td-empresa-name serif">Vegaventura</h3>
                    <div className="td-empresa-lugar mono">Enguídanos · Cuenca</div>
                  </div>
                </div>
                <p className="td-empresa-desc">Aventura y naturaleza sin límites: Vegaventura pone al alcance del visitante una amplia carta de actividades al aire libre, desde el descenso de barrancos acuáticos hasta las rutas a caballo, pasando por trekking, bicicleta, piragüismo, puenting, paintball y tiro con arco. Hay algo para cada nivel y cada tipo de grupo.</p>
                <div className="td-empresa-tags">
                  {["Rafting","Barranquismo","Rutas a caballo","Trekking","BTT","Piragüismo","Paintball","Tiro con arco"].map(t=>(
                    <span key={t} className="td-tag">{t}</span>
                  ))}
                </div>
                <div className="td-empresa-contact">
                  <a href="tel:+34650564955" className="td-contact-item mono"><span>📞</span>650 56 49 55</a>
                  <a href="mailto:gemmsu@hotmail.com" className="td-contact-item mono"><span>✉</span>gemmsu@hotmail.com</a>
                  <a href="https://lascasasdelavega.com/" target="_blank" rel="noopener noreferrer" className="td-contact-item mono"><span>🌐</span>lascasasdelavega.com</a>
                </div>
              </div>
              <div className="td-empresa-fotos">
                <img src="assets/turismo-deportivo/empresas/vegaventura-foto-1.webp" alt="Vegaventura barranquismo" />
              </div>
            </article>

          </div>
        </div>
      </section>
    </main>
  );
}

export default TurismoDeportivoPage
