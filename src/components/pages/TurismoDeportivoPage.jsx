import React from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'
import RUTAS_JSON from '../../data/rutas.json'

const RUTAS_SENDERISMO = Object.values(RUTAS_JSON)

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
                      <h3 className="td-route-name serif">{r.name}</h3>
                    </div>
                  </div>
                  <div className="td-route-meta">
                    <span className="td-chip"><strong>Tipo</strong>{r.tipo}</span>
                    {r.dist !== "—" && <span className="td-chip"><strong>Distancia</strong>{r.dist}</span>}
                    <span className="td-chip"><strong>Duración</strong>{r.tiempo}</span>
                    <span className={`td-chip td-dif td-dif-${r.dif.toLowerCase()}`}><strong>Dificultad</strong>{r.dif}</span>
                  </div>
                  <p className="td-route-desc">{r.desc}</p>
                  <a className="td-dl mono" href={r.pdf} download={`${r.code} ${r.name}`.replace(/[^\w]+/g,"-")+".pdf"} onClick={(e) => downloadPdf(e, r.pdf, `${r.code} ${r.name}`)}>
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
