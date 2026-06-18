import React from 'react'

function AccesibilidadPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-header section">
          <p className="mono">Información legal</p>
          <h1 className="serif">Declaración de Accesibilidad</h1>
        </div>

        <div className="legal-body">
          <section>
            <p>El <strong>Ayuntamiento de Enguídanos</strong> se ha comprometido a hacer accesible su sitio web de conformidad con el <strong>Real Decreto 1112/2018, de 7 de septiembre</strong>, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público (transposición de la Directiva UE 2016/2102).</p>
            <p>La presente declaración de accesibilidad se aplica al sitio web <strong>www.enguidanos.es</strong>.</p>
          </section>

          <section>
            <h2>Situación de cumplimiento</h2>
            <p>Este sitio web es <strong>parcialmente conforme</strong> con el Real Decreto 1112/2018, debido a las excepciones y a la falta de conformidad con algunos aspectos que se indican a continuación.</p>
          </section>

          <section>
            <h2>Contenido no accesible</h2>
            <p>El contenido que se relaciona a continuación no es accesible por los siguientes motivos:</p>
            <h3>Falta de conformidad con el RD 1112/2018</h3>
            <ul>
              <li>Algunos documentos PDF del tablón de anuncios pueden no disponer de una versión accesible alternativa.</li>
              <li>El mapa interactivo de puntos de interés puede presentar dificultades de uso mediante teclado o lector de pantalla.</li>
              <li>Determinados elementos multimedia (imágenes decorativas) pueden carecer de texto alternativo adecuado.</li>
            </ul>
            <h3>Carga desproporcionada</h3>
            <p>No se invocan cargas desproporcionadas en la presente declaración.</p>
            <h3>Contenido no incluido en el ámbito de la legislación aplicable</h3>
            <p>No aplica.</p>
          </section>

          <section>
            <h2>Preparación de la presente declaración de accesibilidad</h2>
            <p>La presente declaración fue preparada el <strong>19 de junio de 2026</strong>.</p>
            <p>El método empleado para preparar la declaración ha sido una autoevaluación realizada por el propio organismo basada en las <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1</a>, nivel AA.</p>
          </section>

          <section>
            <h2>Observaciones y datos de contacto</h2>
            <p>Si detecta algún contenido inaccesible o necesita información equivalente accesible, puede ponerse en contacto con el Ayuntamiento de Enguídanos:</p>
            <ul>
              <li>Correo electrónico: <a href="mailto:info@enguidanos.es">info@enguidanos.es</a></li>
              <li>Teléfono: <a href="tel:969145002">969 145 002</a></li>
              <li>Presencialmente: C/ San Blas, 2 · 16372 Enguídanos (Cuenca)</li>
            </ul>
            <p>Nos comprometemos a responder en un plazo máximo de <strong>20 días hábiles</strong>.</p>
          </section>

          <section>
            <h2>Procedimiento de reclamación</h2>
            <p>Si tras contactar con el Ayuntamiento no ha obtenido una respuesta satisfactoria, puede presentar una reclamación a través del <strong>procedimiento establecido por la Administración General del Estado</strong>. Dicho procedimiento se tramita ante la Unidad responsable de accesibilidad del organismo competente conforme al artículo 12.2 del Real Decreto 1112/2018.</p>
            <p>Más información: <a href="https://administracion.gob.es/pag_Home/atencionCiudadana/Accesibilidad.html" target="_blank" rel="noopener noreferrer">Portal de Administración Electrónica — Accesibilidad</a>.</p>
          </section>

          <p className="legal-updated">Última actualización: junio de 2026</p>
        </div>
      </div>
    </main>
  )
}

export default AccesibilidadPage
