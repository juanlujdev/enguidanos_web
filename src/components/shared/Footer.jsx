import React from 'react'

function Footer({ setPage, navigate }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="serif">Enguídanos</h3>
            <p>Pueblo de la serranía baja de Cuenca, en la Reserva de la Biosfera del Valle del Cabriel. Habitado desde el siglo XI y custodio del cañón fluvial más espectacular de la provincia.</p>
          </div>
          <div className="footer-col">
            <h4>Visitar</h4>
            <ul>
              <li><a onClick={() => navigate("naturaleza", "feature")}>Chorreras del Cabriel</a></li>
              <li><a onClick={() => navigate("oficina-turismo", "senderos")}>Rutas de senderismo</a></li>
              <li><a onClick={() => setPage("patrimonio")}>Patrimonio</a></li>
              <li><a onClick={() => setPage("agenda")}>Agenda</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Vecinos</h4>
            <ul>
              <li><a onClick={() => navigate("ayuntamiento", "area:tramites-formularios")}>Trámites</a></li>
              <li><a onClick={() => setPage("ayuntamiento")}>Tablón de anuncios</a></li>
              <li><a href="https://enguidanos.sedelectronica.es/info.0" target="_blank" rel="noopener noreferrer">Sede electrónica</a></li>
              <li><a>Bandos</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a>C/ San Blas, 2</a></li>
              <li><a>16372 Enguídanos</a></li>
              <li><a href="tel:969145002">969 145 002</a></li>
              <li><a>info@enguidanos.es</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="escudo">
            <img src="assets/escudo-enguidanos.webp" alt="Escudo de Enguídanos" />
            <span>Ayuntamiento de Enguídanos · {new Date().getFullYear()}</span>
          </div>
          <span>Diseño rediseñado con cariño · Aviso legal · Privacidad · Accesibilidad</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer
