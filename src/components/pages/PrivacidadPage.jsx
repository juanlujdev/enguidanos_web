import React from 'react'

function PrivacidadPage() {
  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal-header section">
          <p className="mono">Información legal</p>
          <h1 className="serif">Política de Privacidad y Cookies</h1>
        </div>

        <div className="legal-body">

          {/* ── PRIVACIDAD ── */}
          <section>
            <h2>1. Responsable del tratamiento</h2>
            <table className="legal-table">
              <tbody>
                <tr><th>Responsable</th><td>Ayuntamiento de Enguídanos</td></tr>
                <tr><th>NIF</th><td>P1608500C</td></tr>
                <tr><th>Domicilio</th><td>C/ San Blas, 2 · 16372 Enguídanos (Cuenca)</td></tr>
                <tr><th>Contacto</th><td><a href="mailto:info@enguidanos.es">info@enguidanos.es</a> · <a href="tel:969145002">969 145 002</a></td></tr>
                <tr>
                  <th>Delegado de Protección de Datos</th>
                  <td>
                    Diputación Provincial de Cuenca (función ejercida de forma corporativa)<br />
                    <a href="mailto:dpd@dipucuenca.es">dpd@dipucuenca.es</a><br />
                    C/ Aguirre, 1 · 16001 Cuenca (Palacio de la Diputación)<br />
                    <a href="tel:+34969177177">+34 969 17 71 77</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>2. ¿Qué datos tratamos y con qué finalidad?</h2>
            <p>Este sitio web <strong>no dispone de formularios de registro ni de contacto</strong>. Los únicos datos personales que puede tratar el Ayuntamiento son los que usted facilite voluntariamente al ponerse en contacto mediante:</p>
            <ul>
              <li><strong>Correo electrónico</strong> (info@enguidanos.es): nombre, dirección de correo y el contenido de su mensaje.</li>
              <li><strong>Teléfono</strong> (969 145 002): datos de identificación que usted facilite durante la llamada.</li>
            </ul>
            <p>La finalidad es exclusivamente atender su consulta o solicitud y, en su caso, tramitar los procedimientos administrativos que correspondan.</p>
          </section>

          <section>
            <h2>3. Base jurídica del tratamiento</h2>
            <p>El tratamiento se ampara en el artículo 6.1.e) del Reglamento (UE) 2016/679 (RGPD): <em>ejercicio de poderes públicos y cumplimiento de una misión de interés público</em> encomendados al Ayuntamiento conforme a la legislación de régimen local.</p>
          </section>

          <section>
            <h2>4. Conservación de los datos</h2>
            <p>Los datos se conservan durante el tiempo necesario para gestionar la consulta o procedimiento, y posteriormente durante los plazos de prescripción legales aplicables. Los expedientes administrativos se conservan conforme a la normativa de archivos y patrimonio documental.</p>
          </section>

          <section>
            <h2>5. Comunicación a terceros</h2>
            <p>Los datos no se ceden a terceros salvo obligación legal o cuando sea necesario para la tramitación del procedimiento (p. ej., otras administraciones públicas). No se realizan transferencias internacionales de datos.</p>
          </section>

          <section>
            <h2>6. Sus derechos</h2>
            <p>En cualquier momento puede ejercer los derechos de <strong>acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición</strong> dirigiéndose por escrito al Ayuntamiento de Enguídanos (C/ San Blas, 2 · 16372 Enguídanos) o por correo electrónico a <a href="mailto:info@enguidanos.es">info@enguidanos.es</a>, indicando su nombre, apellidos y una copia de su DNI.</p>
            <p>Si considera que sus derechos no han sido atendidos correctamente, puede presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).</p>
          </section>

          {/* ── COOKIES ── */}
          <section>
            <h2>7. Política de cookies</h2>
            <p>Este sitio web <strong>no utiliza cookies propias ni de terceros</strong> para rastrear su actividad.</p>

            <h3>¿Por qué no necesita usted aceptar cookies?</h3>
            <p>Todas las fuentes tipográficas se sirven desde nuestro propio servidor (no se realizan peticiones a Google Fonts ni a otros CDN externos). No existe ningún sistema de analítica, publicidad ni redes sociales integradas.</p>

            <h3>Mapa interactivo</h3>
            <p>El mapa de puntos de interés usa <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a> con teselas de <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>. La carga de teselas implica peticiones a los servidores de OpenStreetMap, que pueden registrar su dirección IP en sus propios logs de acceso. No se instala ninguna cookie en su navegador como resultado de esta interacción. Puede consultar la <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer">política de privacidad de OpenStreetMap</a> para más información.</p>

            <h3>Resumen</h3>
            <table className="legal-table">
              <thead>
                <tr><th>Tipo de cookie</th><th>¿Se usa?</th><th>Motivo</th></tr>
              </thead>
              <tbody>
                <tr><td>Cookies propias</td><td>No</td><td>El sitio no establece ninguna cookie</td></tr>
                <tr><td>Google Analytics / estadísticas</td><td>No</td><td>No se usa ningún sistema de analítica</td></tr>
                <tr><td>Publicidad</td><td>No</td><td>No hay anuncios</td></tr>
                <tr><td>Redes sociales</td><td>No</td><td>No hay botones de compartir integrados</td></tr>
                <tr><td>Google Fonts</td><td>No</td><td>Las fuentes se sirven en local</td></tr>
              </tbody>
            </table>
            <p>Al no existir cookies no esenciales, <strong>no es necesario su consentimiento</strong> y no se muestra ningún aviso de cookies.</p>
          </section>

          <p className="legal-updated">Última actualización: junio de 2026</p>
        </div>
      </div>
    </main>
  )
}

export default PrivacidadPage
