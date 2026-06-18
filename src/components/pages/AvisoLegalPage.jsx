import React from 'react'

function AvisoLegalPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-header section">
          <p className="mono">Información legal</p>
          <h1 className="serif">Aviso Legal</h1>
        </div>

        <div className="legal-body">
          <section>
            <h2>Titular del sitio web</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos de identificación:</p>
            <table className="legal-table">
              <tbody>
                <tr><th>Denominación</th><td>Ayuntamiento de Enguídanos</td></tr>
                <tr><th>NIF</th><td>P1608500C</td></tr>
                <tr><th>Domicilio</th><td>C/ San Blas, 2 · 16372 Enguídanos (Cuenca)</td></tr>
                <tr><th>Teléfono</th><td><a href="tel:969145002">969 145 002</a></td></tr>
                <tr><th>Correo electrónico</th><td><a href="mailto:info@enguidanos.es">info@enguidanos.es</a></td></tr>
                <tr><th>Sede electrónica</th><td><a href="https://enguidanos.sedelectronica.es" target="_blank" rel="noopener noreferrer">enguidanos.sedelectronica.es</a></td></tr>
                <tr><th>Responsable</th><td>Sergio de Fez, Alcalde de Enguídanos</td></tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>Objeto y ámbito de aplicación</h2>
            <p>El presente Aviso Legal regula el acceso y uso del sitio web <strong>www.enguidanos.es</strong>, titularidad del Ayuntamiento de Enguídanos. El acceso a este sitio implica la aceptación de las condiciones aquí recogidas. El Ayuntamiento se reserva el derecho a modificar este aviso en cualquier momento, siendo efectivos los cambios desde su publicación.</p>
          </section>

          <section>
            <h2>Propiedad intelectual e industrial</h2>
            <p>Los contenidos de este sitio web —textos, imágenes, diseño, logotipos y demás elementos— son propiedad del Ayuntamiento de Enguídanos o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.</p>
            <p>Queda expresamente prohibida su reproducción, distribución, comunicación pública o transformación sin autorización previa y por escrito del Ayuntamiento, salvo para uso personal y privado o cuando la ley lo permita.</p>
          </section>

          <section>
            <h2>Condiciones de uso</h2>
            <p>El usuario se compromete a hacer un uso lícito de los contenidos y servicios del sitio web, sin vulnerar derechos de terceros ni infringir la legislación vigente. Queda prohibido:</p>
            <ul>
              <li>Utilizar el sitio para fines contrarios a la ley, el orden público o los derechos de terceros.</li>
              <li>Introducir o difundir contenidos falsos, ofensivos, difamatorios o que atenten contra la dignidad de las personas.</li>
              <li>Llevar a cabo acciones que puedan dañar, inutilizar o sobrecargar los sistemas informáticos del Ayuntamiento.</li>
            </ul>
          </section>

          <section>
            <h2>Responsabilidad</h2>
            <p>El Ayuntamiento de Enguídanos no se hace responsable de los daños o perjuicios que pudieran derivarse del uso de este sitio web, incluyendo fallos técnicos, interrupciones del servicio o contenidos de sitios de terceros enlazados. Los enlaces a páginas externas se ofrecen a título informativo y el Ayuntamiento no controla ni avala su contenido.</p>
          </section>

          <section>
            <h2>Legislación aplicable y jurisdicción</h2>
            <p>Este aviso legal se rige por la legislación española vigente. Para cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten, con renuncia expresa a cualquier otro fuero, a los Juzgados y Tribunales competentes de acuerdo con la normativa aplicable.</p>
          </section>

          <p className="legal-updated">Última actualización: junio de 2026</p>
        </div>
      </div>
    </main>
  )
}

export default AvisoLegalPage
