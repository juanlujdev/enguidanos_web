import React, { useEffect } from 'react'
import { PageHeroMedia, Icon } from '../shared/index.js'

function OficinaTurismoPage({ navTarget }) {
  // Deep-link: salta al bloque destino (p. ej. "senderos") y lo resalta.
  useEffect(() => {
    if (!navTarget) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`ofi-${navTarget}`);
      if (!el) return;
      el.querySelectorAll(".reveal").forEach(r => r.classList.add("in"));
      const y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 110);
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev;
      el.classList.add("deeplink-flash");
      setTimeout(() => el.classList.remove("deeplink-flash"), 2200);
    }, 300);
    return () => clearTimeout(t);
  }, [navTarget]);
  const openPdf = async (e, pdf, code) => {
    e.preventDefault();
    const filename = (code ? code.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") : "folleto") + ".pdf";
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
  };
  const senderos = [
    { code: "PR CU-50", name: "Hoz del Agua y Hoz Cerrada", pdf: "assets/senderos/pr-cu-50.pdf" },
    { code: "PR CU-53", name: "Sendero de Las Chorreras", pdf: "assets/senderos/pr-cu-53.pdf" },
    { code: "PR CU-54", name: "Sendero de Los Cuatro Ríos", pdf: "assets/senderos/pr-cu-54.pdf" },
    { code: "GR 64", name: "Tramo Enguídanos – Mira", pdf: "assets/senderos/gr-64.pdf" },
    { code: "GR 66", name: "Valle del Cabriel · Víllora – Enguídanos (16,5 km)", pdf: "assets/senderos/gr-66.pdf" },
    { code: "BTT CU-02", name: "Ruta señalizada de bici de montaña, baja dificultad", pdf: "assets/senderos/btt-cu-02.pdf" },
  ];
  const planos = [
    { name: "Plano Turístico de Enguídanos I", desc: "Información general: alojamientos, restauración, espacios naturales, senderos y rutas urbanas, gastronomía, fiestas y teléfonos.", pdf: "http://enguidanos.es/wp-content/uploads/2015/08/Plano-Engui%CC%81danos-1.pdf" },
    { name: "Plano Turístico de Enguídanos II", desc: "Callejero general del municipio con la Ruta de las Fuentes, la Ruta de los Miradores y la Ruta Monumental.", pdf: "http://enguidanos.es/wp-content/uploads/2015/08/Plano-Engui%CC%81danos-2.pdf" },
  ];
  const publicaciones = [
    { title: "Red de Itinerarios y Rutas Botánicas de Enguídanos", desc: "Once rutas botánicas que recorren la riqueza florística del municipio.", precio: null },
    { title: "Retratos de Poesía · Mi Sendero de Versos (2ª parte)", desc: "Jesús de Frías Luján.", precio: "5€" },
    { title: "Historia, Tradiciones, Costumbres y Paisajes de Enguídanos", desc: "Álvaro Luján Algarra.", precio: "5€" },
    { title: "Guía de Fauna Vertebrada de Enguídanos", desc: "136 especies descritas: peces, anfibios, reptiles, mamíferos y aves.", precio: "8€" },
    { title: "Valle del Cabriel: Vive y Descubre", desc: "Museos, paisajes, pueblos, alojamientos, gastronomía y visitas del valle.", precio: "8€" },
    { title: "Patrimonio Histórico y Natural del Valle del Cabriel", desc: "Patrimonio arqueológico, castillos, ermitas, molinos y naturaleza.", precio: "8€" },
    { title: "Enguídanos: Un Paraíso en el Valle del Cabriel", desc: "Historia, patrimonio, ocio y aventura, mapa callejero y legados fotográficos.", precio: "12€" },
    { title: "CD de fotografías", desc: "Más de 400 imágenes de parajes, monumentos, eventos y tradiciones.", precio: "3€" },
    { title: "DVD Enguídanos", desc: "Vídeo musical por los monumentos y parajes más interesantes del municipio.", precio: "8€" },
  ];
  return (
    <main>
      <PageHeroMedia placeholder="Foto · Oficina de Turismo (Calle Virgen, 3)">
        <div className="breadcrumb"><span>Inicio</span> · Turismo · Oficina de Turismo</div>
        <h1 className="reveal in">Oficina de<br/><em>Turismo</em></h1>
        <p className="reveal in reveal-delay-1">Tu punto de partida para descubrir Enguídanos: información, visitas guiadas, mapas, folletos de senderos y publicaciones sobre el municipio y el Valle del Cabriel.</p>
      </PageHeroMedia>

      <section className="section" style={{paddingTop:48}}>
        <div className="container">
          <div className="ofi-intro">
            <div className="ofi-photo reveal">
              <img src="assets/oficina-turismo.webp" alt="Interior de la Oficina de Turismo de Enguídanos" loading="lazy" />
            </div>
            <div className="ofi-info reveal">
              <div className="eyebrow" style={{marginBottom:20}}>Información práctica</div>
              <h2 className="serif" style={{fontSize:34, lineHeight:1.05, marginBottom:24}}>Oficina de Turismo de Enguídanos</h2>
              <div className="ofi-rows">
                <div className="ofi-row"><span className="ofi-k mono">Dirección</span><span className="ofi-v">C/ San Blas, 3 · 16372 Enguídanos (Cuenca)</span></div>
                <div className="ofi-row"><span className="ofi-k mono">Teléfono</span><span className="ofi-v"><a href="tel:+34969344955">969 344 955</a></span></div>
                <div className="ofi-row"><span className="ofi-k mono">Correo</span><span className="ofi-v"><a href="mailto:infoturismoenguidanos@gmail.com">infoturismoenguidanos@gmail.com</a></span></div>
              </div>
              <div className="ofi-hours">
                <div className="ofi-k mono" style={{marginBottom:14}}>Horario</div>
                <div className="ofi-hours-grid">
                  <div><strong>Miércoles y jueves</strong><span>11:00 – 14:00</span></div>
                  <div><strong>Viernes</strong><span>11:00 – 14:00 · 17:00 – 20:00</span></div>
                  <div><strong>Sábado</strong><span>11:00 – 14:00 · 17:00 – 20:00</span></div>
                  <div><strong>Domingo</strong><span>11:00 – 14:00</span></div>
                </div>
              </div>
              <div className="ofi-note">
                <strong>Visitas guiadas</strong> por Enguídanos con reserva previa en la Oficina de Turismo. Consultar tarifas y horarios.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{background:"var(--bg-2)", paddingTop:80, paddingBottom:80}}>
        <div className="container">
          <div className="ofi-park reveal">
            <div className="ofi-park-text">
              <div className="eyebrow" style={{marginBottom:18}}>Monumento Natural</div>
              <h3 className="serif">Aparcamiento de las Chorreras del Cabriel</h3>
              <p>El Ayuntamiento dispone de un aparcamiento en la entrada del Monumento Natural de las Chorreras del Cabriel. Reserva tu plaza con antelación para asegurar el acceso en temporada alta.</p>
              <a className="btn-solid" href="https://www.chorrerasdelcabriel.es/es/reservar-plaza-aparcamiento" target="_blank" rel="noopener noreferrer">Reservar plaza ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="ofi-senderos">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Senderismo</div>
              <h2 className="section-title">Folletos de <em>senderos</em></h2>
            </div>
            <div className="section-meta">Disponibles en la Oficina de Turismo</div>
          </div>
          <div className="ofi-senderos">
            {senderos.map((s, i) => (
              <a key={i} href={s.pdf} download={(s.code ? s.code.replace(/[^\w]+/g,"-").replace(/^-|-$/g,"") : "folleto") + ".pdf"} onClick={(e) => openPdf(e, s.pdf, s.code)} className="ofi-sendero reveal" style={{transitionDelay:`${i*0.04}s`}}>
                <span className="ofi-sendero-code mono">{s.code}</span>
                <span className="ofi-sendero-name serif">{s.name}</span>
                <span className="ofi-sendero-dl mono">PDF <Icon.arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:"var(--bg-2)"}}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>Mapas</div>
              <h2 className="section-title">Planos <em>turísticos</em></h2>
            </div>
          </div>
          <div className="ofi-planos">
            {planos.map((p, i) => (
              <a key={i} className="ofi-plano reveal" href={p.pdf} target="_blank" rel="noopener noreferrer" style={{transitionDelay:`${i*0.05}s`}}>
                <div className="ofi-plano-body">
                  <h4 className="serif">{p.name}</h4>
                  <p>{p.desc}</p>
                </div>
                <span className="ofi-plano-dl mono">Descargar PDF ↓</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{marginBottom:20}}>A la venta</div>
              <h2 className="section-title">Publicaciones sobre <em>Enguídanos</em></h2>
            </div>
            <div className="section-meta">Disponibles en la Oficina de Turismo</div>
          </div>
          <div className="ofi-pubs">
            {publicaciones.map((p, i) => (
              <div key={i} className="ofi-pub reveal" style={{transitionDelay:`${i*0.04}s`}}>
                <div className="ofi-pub-head">
                  <h4 className="serif">{p.title}</h4>
                  {p.precio && <span className="ofi-pub-price mono">{p.precio}</span>}
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default OficinaTurismoPage
