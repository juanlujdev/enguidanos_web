import PUEBLO from './data/pueblo.json'
import HIGHLIGHTS from './data/highlights.json'
import POIS from './data/pois.json'
import POI_CAT from './data/poi-cats.json'
import AGENDA_CATS from './data/agenda-cats.json'
import GALERIA from './data/galeria.json'
import NOTICIAS from './data/noticias.json'
import ALCALDE from './data/alcalde.json'
export { MES_ABBR, parseEvDate, expandEventos } from './utils/eventos.js'

// ============================================================
//  AGENDA CULTURAL DE ENGUÍDANOS
// ============================================================
// Categorías de la agenda. Para crear un tipo nuevo, añádelo en
// src/data/agenda-cats.json y referencia su clave en el campo `cat`.

// ── CÓMO AÑADIR UN EVENTO NUEVO ──────────────────────────────
// Copia un bloque de abajo, mantén el orden por fecha y rellena:
//   date   → "AAAA-MM-DD"  (o "AAAA-MM" si aún no hay día concreto)
//   title  → nombre del evento
//   cat    → clave de AGENDA_CATS (da color y filtro)
//   tipo   → etiqueta descriptiva libre que se muestra tal cual
//   place  → ubicación
//   when   → días y horario (texto libre)  [solo eventos de un día]
//   desc   → descripción corta
//   poster → cartel en assets/agenda/  (se abre a pantalla completa
//            al pulsar el evento). Optimiza la imagen antes de subirla.
//
// EVENTOS DE VARIOS DÍAS (fiestas con programa):
//   En lugar de `when`, añade `dias: [ ... ]`. Cada día se muestra como
//   un evento independiente en la agenda, todos con el mismo `poster`:
//     { date: "AAAA-MM-DD", label: "Lunes 2 de febrero", items: ["17:00 · Misa", ...] }
//   `items` es la lista de actos de ese día (se ve en el modal).
// ─────────────────────────────────────────────────────────────
const EVENTOS = [
  { date: "2026-01-16", title: "Hogueras de San Antón 2026", cat: "fest", tipo: "Fiesta · Tradición",
    place: "Plaza Mayor de Enguídanos", when: "Viernes · 20:00 h",
    desc: "Hoguera tradicional de invierno para vecinos y visitantes.",
    poster: "assets/agenda/hogueras-san-anton.webp" },
  { date: "2026-01-17", title: "Misa de San Antón y bendición de animales", cat: "cult", tipo: "Cultura · Religioso",
    place: "Iglesia Parroquial de Enguídanos", when: "Sábado · 17:00 h",
    desc: "Misa en honor a San Antón y bendición de los animales.",
    poster: "assets/agenda/misa-san-anton.webp" },
  { date: "2026-01-02", title: "Apertura de la Biblioteca Municipal", cat: "servicio", tipo: "Cultura · Servicio",
    place: "Biblioteca Municipal de Enguídanos", when: "Lun a Vie · 10:00–13:30 y 16:00–19:30",
    desc: "Biblioteca municipal abierta para lectura, estudio y cultura.",
    poster: "assets/agenda/biblioteca-municipal.webp" },
  { date: "2026-02-02", title: "San Blas 2026 · Fiestas patronales", cat: "fest", tipo: "Fiesta patronal",
    place: "Varios puntos del pueblo",
    desc: "Fiestas de San Blas con misas, baile y comida popular.",
    poster: "assets/agenda/san-blas-2026.webp",
    dias: [
      { date: "2026-02-02", label: "Lunes 2 de febrero", items: ["17:00 · Misa de la Candelaria"] },
      { date: "2026-02-03", label: "Martes 3 de febrero", items: ["12:00 · Misa en honor a San Blas", "13:00 · Aperitivo popular (Casa de la Cultura)"] },
      { date: "2026-02-06", label: "Viernes 6 de febrero", items: ["18:00 · Presentación del libro «Retales de tierra cosidos a mano» de María Elisa Beneite (Casa de la Cultura)"] },
      { date: "2026-02-07", label: "Sábado 7 de febrero", items: ["10:00 · Ruta de senderismo a las Chorreras del Cabriel (salida desde la plaza)", "11:30 · El show de Lolo y sus amigos (Casa de la Cultura)", "19:00 · Degustación a cargo de la Asoc. de Mujeres", "19:00 · Baile (Dúo Pura Vida + DJ)"] },
      { date: "2026-02-08", label: "Domingo 8 de febrero", items: ["11:30 · Colchonetas en la calle Gran Vía", "12:30 · Procesión", "13:00 · Misa", "13:30 · Subasta (patio de la iglesia)", "14:00 · Comida en la plaza", "16:00 · Concierto con el grupo Rondadores (Casa de la Cultura)"] },
    ] },
  { date: "2026-03-28", title: "Semana Santa 2026", cat: "cult", tipo: "Cultura · Religioso",
    place: "Iglesia Parroquial y calles de Enguídanos",
    desc: "Procesiones, vía crucis y celebraciones de la Pasión, desde el Domingo de Ramos hasta la Resurrección.",
    poster: "assets/agenda/semana-santa.webp",
    dias: [
      { date: "2026-03-28", label: "Sábado 28 de marzo · Víspera del Domingo de Ramos", items: ["19:00 · Bendición de Ramos y celebración de la Eucaristía (el domingo no hay celebración)"] },
      { date: "2026-03-31", label: "Martes Santo · 31 de marzo", items: ["18:00 · Celebración comunitaria de la penitencia. Eucaristía"] },
      { date: "2026-04-02", label: "Jueves Santo · 2 de abril", items: ["21:00 · Celebración de la Cena del Señor", "Procesión del Nazareno y la Dolorosa", "00:00 · Hora Santa (adoración ante el Santísimo)"] },
      { date: "2026-04-03", label: "Viernes Santo · 3 de abril", items: ["12:00 · Vía Crucis", "19:30 · Celebración de la Pasión y Muerte del Señor", "Procesión del Santo Entierro"] },
      { date: "2026-04-05", label: "Domingo de Resurrección · 5 de abril", items: ["01:00 · Vigilia Pascual (madrugada del sábado al domingo)", "11:00 · Procesión del Encuentro", "Misa Pascual"] },
    ] },
  { date: "2026-04-03", title: "Enguídanos Burguer Fest", cat: "gastro", tipo: "Gastronomía",
    place: "Frontón municipal de Enguídanos",
    desc: "Festival gastronómico de hamburguesas con La Vaca Lola y Galgo.",
    poster: "assets/agenda/burguer-fest.webp",
    dias: [
      { date: "2026-04-03", label: "Viernes 3 de abril", items: ["Hamburgueserías La Vaca Lola y Galgo · Frontón municipal"] },
      { date: "2026-04-04", label: "Sábado 4 de abril", items: ["Hamburgueserías La Vaca Lola y Galgo · Frontón municipal"] },
    ] },
  { date: "2026-04-04", title: "Ruta de senderismo · Chorreras del Cabriel", cat: "nat", tipo: "Naturaleza · Senderismo",
    place: "Salida desde la plaza", when: "Sábado · 10:00 h",
    desc: "Ruta de senderismo guiada por las cascadas del Cabriel.",
    poster: "assets/agenda/ruta-chorreras-cabriel.webp" },
  { date: "2026-04-22", title: "Gymkana literaria y marcapáginas", cat: "cult", tipo: "Cultura · Taller",
    place: "Biblioteca de Enguídanos", when: "Miércoles · 17:30 h",
    desc: "Gymkana literaria y manualidades para crear marcapáginas personalizados.",
    poster: "assets/agenda/gymkana-literaria.webp" },
  { date: "2026-04-27", title: "Jornada · Emprendimiento Femenino y Desarrollo Rural", cat: "form", tipo: "Charla · Jornada",
    place: "Casa de la Cultura · C/ Leonardo Luján, 2", when: "Lunes · 18:00–20:00 h",
    desc: "Jornada sobre la mujer empresaria, el desarrollo rural y la lucha contra la despoblación.",
    poster: "assets/agenda/jornada-emprendimiento.webp" },
  { date: "2026-04-30", title: "Programación de mayo · Mayos y Día de la Cruz", cat: "cult", tipo: "Cultura · Tradición",
    place: "Patio de la iglesia y La Cruz",
    desc: "Canto de los Mayos con reparto de chocolate y celebración del Día de la Cruz.",
    poster: "assets/agenda/programacion-mayo.webp",
    dias: [
      { date: "2026-04-30", label: "Jueves 30 de abril · Canto de los Mayos", items: ["23:00 · Canto de los Mayos de la Virgen en el patio de la iglesia", "Después, reparto de chocolate y magdalenas"] },
      { date: "2026-05-03", label: "Domingo 3 de mayo · Día de la Cruz", items: ["18:00 · Misa en la iglesia", "Después, subida a La Cruz y reparto de caridad"] },
    ] },
  { date: "2026-05-13", title: "Cuentacuentos · La niña que se comía todos los cuentos", cat: "cult", tipo: "Cultura · Infantil",
    place: "Casa de la Cultura de Enguídanos", when: "Miércoles · 17:30 h",
    desc: "Sesión de cuentacuentos infantil a cargo de la ludoteca y la biblioteca.",
    poster: "assets/agenda/cuentacuentos.webp" },
  { date: "2026-05-15", title: "San Isidro 2026", cat: "fest", tipo: "Fiesta · Tradición",
    place: "Varios puntos · Abades, Casa de la Cultura y La Cruz",
    desc: "Concurso de surcos, comida, baile, misa, procesión y aperitivo.",
    poster: "assets/agenda/san-isidro-2026.webp",
    dias: [
      { date: "2026-05-15", label: "Viernes 15 de mayo", items: ["11:00 · Concurso de surcos (Abades)", "14:30 · Comida (solo apuntados)", "19:30 · Baile de jotas (Casa de la Cultura)"] },
      { date: "2026-05-16", label: "Sábado 16 de mayo", items: ["8:00 · Decoración del santo", "12:00 · Misa y procesión", "13:00 · Aperitivo en La Cruz"] },
    ] },
  { date: "2026-05-19", title: "Capacitación Digital · La IA para la vida cotidiana", cat: "form", tipo: "Formación · Tecnología",
    place: "Biblioteca de Enguídanos",
    desc: "Curso de competencias digitales sobre asistencia inteligente (IA) para mayores de 55 años.",
    poster: "assets/agenda/capacitacion-digital.webp",
    dias: [
      { date: "2026-05-19", label: "Martes 19 de mayo", items: ["16:30–19:30 · La IA para la vida cotidiana · Mi asistente inteligente"] },
      { date: "2026-05-20", label: "Miércoles 20 de mayo", items: ["16:30–19:30 · La IA para la vida cotidiana · Mi asistente inteligente"] },
      { date: "2026-05-22", label: "Viernes 22 de mayo", items: ["16:30–19:30 · La IA para la vida cotidiana · Mi asistente inteligente"] },
      { date: "2026-05-26", label: "Martes 26 de mayo", items: ["16:30–19:30 · La IA para la vida cotidiana · Mi asistente inteligente"] },
      { date: "2026-05-27", label: "Miércoles 27 de mayo", items: ["16:30–19:30 · La IA para la vida cotidiana · Mi asistente inteligente"] },
    ] },
  { date: "2026-06-03", title: "Recogida de Electrodomésticos", cat: "servicio", tipo: "Medio ambiente · Reciclaje",
    place: "Punto La Báscula Municipal", when: "Miércoles · 9:00 h",
    desc: "Recogida de electrodomésticos para reciclar y cuidar el entorno.",
    poster: "assets/agenda/recogida-electrodomesticos.webp" },
  { date: "2026-07-01", title: "Apertura de la Oficina de Turismo", cat: "servicio", tipo: "Turismo · Servicio",
    place: "Calle Virgen nº 3, Enguídanos", when: "A partir del 1 de julio",
    desc: "Nueva oficina de turismo con mapas, rutas y visitas guiadas.",
    poster: "assets/agenda/oficina-turismo.webp" },
  { date: "2026-07-01", title: "Escuela de Verano 2026", cat: "servicio", tipo: "Infantil · Juventud",
    place: "Inscripciones en la Ludoteca Municipal", when: "A partir del 1 de julio",
    desc: "Juegos, diversión y actividades infantiles durante el verano.",
    poster: "assets/agenda/escuela-verano.webp" },
  // San Roque 2026 — dos eventos distintos que comparten el mismo cartel
  { date: "2026-08-08", title: "Finde de las Peñas", cat: "fest", tipo: "Fiesta · Peñas",
    place: "Enguídanos",
    desc: "Fin de semana de las peñas, antesala de las fiestas de San Roque.",
    poster: "assets/agenda/san-roque-2026.webp",
    dias: [
      { date: "2026-08-08", label: "Sábado 8 de agosto", items: [] },
      { date: "2026-08-09", label: "Domingo 9 de agosto", items: [] },
    ] },
  { date: "2026-08-12", title: "Fiestas de San Roque 2026", cat: "fest", tipo: "Fiesta patronal",
    place: "Enguídanos · Cuenca",
    desc: "Fiestas patronales de San Roque: verbenas, actos populares y celebraciones por todo el pueblo.",
    poster: "assets/agenda/san-roque-2026.webp",
    dias: [
      { date: "2026-08-12", label: "Miércoles 12 de agosto", items: [] },
      { date: "2026-08-13", label: "Jueves 13 de agosto", items: [] },
      { date: "2026-08-14", label: "Viernes 14 de agosto", items: [] },
      { date: "2026-08-15", label: "Sábado 15 de agosto", items: [] },
      { date: "2026-08-16", label: "Domingo 16 de agosto", items: [] },
    ] },
];

// ALCALDE importado desde src/data/alcalde.json

// Áreas del Ayuntamiento — submenú "Ayuntamiento" del sitio oficial
const TRAMITES = [
  { num: "01", slug: "corporacion", title: "Corporación Municipal", desc: "Composición del consistorio: alcaldía, concejalías y grupos políticos." },
  { num: "02", slug: "plenos", title: "Plenos", desc: "Convocatorias, órdenes del día y actas de las sesiones plenarias." },
  { num: "03", slug: "ordenanzas-municipales", title: "Ordenanzas Municipales", desc: "Normativa y reglamentos que regulan la vida del municipio." },
  { num: "04", slug: "ordenanzas-fiscales", title: "Ordenanzas Fiscales", desc: "Tasas, impuestos y precios públicos en vigor cada ejercicio." },
  { num: "05", slug: "perfil-contratante", title: "Perfil del Contratante", desc: "Licitaciones, contratos y procedimientos de contratación pública." },
  { num: "06", slug: "bandos", title: "Bandos", desc: "Avisos y comunicaciones oficiales de la Alcaldía a los vecinos." },
  { num: "07", slug: "sostenibilidad", title: "Sostenibilidad", desc: "Compromiso con el desarrollo sostenible y el medio ambiente." },
  { num: "08", slug: "administracion-electronica", title: "Administración Electrónica", desc: "Sede electrónica para tramitar en línea con certificado o Cl@ve.", ext: "https://enguidanos.sedelectronica.es/info.0" },
  { num: "09", slug: "tramites-formularios", title: "Trámites y Formularios", desc: "Modelos de solicitud e instancias en PDF para descargar, rellenar y presentar." },
];

// Contenido replicado de cada área (de la web oficial). Sólo las áreas con
// contenido disponible son navegables; el resto se muestran como "Próximamente".
const AREAS_CONTENT = {
  corporacion: {
    title: "Corporación Municipal",
    intro: "Corporación municipal de Enguídanos tras las elecciones del 26 de mayo de 2019.",
    alcalde: { nombre: "Sergio de Fez Cerezuela", cargo: "Alcalde-Presidente", partido: "PSOE", foto: "assets/alcalde-sergio-de-fez.webp" },
    concejales: [
      { nombre: "Mª Rosario Cerdán Pérez", cargo: "1ª Teniente de Alcalde · Concejala", partido: "PSOE" },
      { nombre: "Vicente Jiménez Luján", cargo: "Concejal", partido: "PSOE" },
      { nombre: "Mª Jesús López Luján", cargo: "Concejala", partido: "PSOE" },
      { nombre: "Daniela Martínez De Fez", cargo: "Concejala", partido: "PSOE" },
      { nombre: "Jesús Sáiz Plá", cargo: "Concejal", partido: "PP" },
    ],
  },
  plenos: {
    title: "Plenos",
    intro: "Actas de las sesiones plenarias del Ayuntamiento de Enguídanos. Selecciona un acta para consultarla o descargar el documento oficial en PDF.",
    nota: "En 2017, 2018 y 2019 no constan actas publicadas en el archivo municipal.",
    years: [
      {
        year: "2016",
        actas: [
          { fecha: "31 de marzo de 2016", pdf: "assets/ayuntamiento/plenos/acta-31-marzo-2016.pdf" },
          { fecha: "28 de enero de 2016", pdf: "assets/ayuntamiento/plenos/acta-28-enero-2016.pdf" },
        ],
      },
      {
        year: "2015",
        actas: [
          { fecha: "23 de noviembre de 2015", pdf: "assets/ayuntamiento/plenos/acta-23-noviembre-2015.pdf" },
          { fecha: "28 de septiembre de 2015", pdf: "assets/ayuntamiento/plenos/acta-28-septiembre-2015.pdf" },
          { fecha: "16 de julio de 2015", sesion: "Sesión 07/2015", partes: [
            { n: 1, pdf: "assets/ayuntamiento/plenos/pleno-16-julio-2015-parte-1.pdf" },
            { n: 2, pdf: "assets/ayuntamiento/plenos/pleno-16-julio-2015-parte-2.pdf" },
            { n: 3, pdf: "assets/ayuntamiento/plenos/pleno-16-julio-2015-parte-3.pdf" },
          ] },
          { fecha: "24 de junio de 2015", sesion: "Sesión 06/2015", partes: [
            { n: 1, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-1.pdf" },
            { n: 2, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-2.pdf" },
            { n: 3, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-3.pdf" },
            { n: 4, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-4.pdf" },
            { n: 5, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-5.pdf" },
            { n: 6, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-6.pdf" },
            { n: 7, pdf: "assets/ayuntamiento/plenos/pleno-24-junio-2015-parte-7.pdf" },
          ] },
        ],
      },
    ],
  },
  "ordenanzas-fiscales": {    title: "Ordenanzas Fiscales",
    intro: "Impuestos, tasas y precios públicos en vigor en el municipio. Cada ordenanza está disponible como documento oficial en PDF.",
    docs: [
      { tipo: "Impuesto", title: "Impuesto sobre Bienes Inmuebles (IBI)", pdf: "assets/ayuntamiento/ordenanzas-fiscales/ibi.pdf" },
      { tipo: "Impuesto", title: "Impuesto sobre Vehículos de Tracción Mecánica (IVTM)", pdf: "assets/ayuntamiento/ordenanzas-fiscales/ivtm.pdf" },
      { tipo: "Impuesto", title: "Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (Plusvalía)", pdf: "assets/ayuntamiento/ordenanzas-fiscales/plusvalia.pdf" },
      { tipo: "Tasa", title: "Tasa por el servicio público de recogida de basuras", pdf: "assets/ayuntamiento/ordenanzas-fiscales/basura.pdf" },
      { tipo: "Tasa", title: "Tasa por el servicio público de suministro de agua potable", pdf: "assets/ayuntamiento/ordenanzas-fiscales/agua-potable.pdf" },
      { tipo: "Tasa", title: "Tasa por la prestación del servicio de depuración de aguas residuales", pdf: "assets/ayuntamiento/ordenanzas-fiscales/depuracion-aguas-residuales.pdf" },
      { tipo: "Tasa", title: "Tasa por la expedición de documentos administrativos", pdf: "assets/ayuntamiento/ordenanzas-fiscales/expedicion-documentos.pdf" },
      { tipo: "Tasa", title: "Tasa por la prestación del servicio de piscina municipal", pdf: "assets/ayuntamiento/ordenanzas-fiscales/tasa-piscina-municipal.pdf" },
    ],
  },
  "ordenanzas-municipales": {
    title: "Ordenanzas Municipales",
    intro: "Normativa y reglamentos municipales en vigor en Enguídanos. El texto íntegro está disponible como documento oficial en PDF.",
    docs: [
      { tipo: "Ordenanza", title: "Ordenanza Integral Reguladora de las Actividades Económicas, Sociales y Medioambientales", pdf: "assets/ayuntamiento/ordenanzas-municipales/ordenanza-integral.pdf" },
      { tipo: "Ordenanza", title: "Ordenanza Reguladora del Vertido de Lodos y Purines", pdf: "assets/ayuntamiento/ordenanzas-municipales/vertido-lodos-purines.pdf" },
      { tipo: "Ordenanza", title: "Ordenanza Municipal de Protección del Arbolado de Interés Local", pdf: "assets/ayuntamiento/ordenanzas-municipales/arbolado-interes-local.pdf" },
      { tipo: "Ordenanza", title: "Ordenanza Municipal Reguladora del Cementerio Municipal", pdf: "assets/ayuntamiento/ordenanzas-municipales/cementerio.pdf" },
      { tipo: "Reglamento", title: "Reglamento de la Piscina Municipal", pdf: "assets/ayuntamiento/ordenanzas-municipales/reglamento-piscina.pdf" },
      { tipo: "Plan", title: "Plan de Autocontrol de la Piscina Municipal", pdf: "assets/ayuntamiento/ordenanzas-municipales/plan-autocontrol-piscina.pdf" },
      { tipo: "Reglamento", title: "Reglamento del Consejo de Sostenibilidad Local", pdf: "assets/ayuntamiento/ordenanzas-municipales/reglamento-consejo-sostenibilidad.pdf" },
    ],
  },
  "perfil-contratante": {
    title: "Perfil del Contratante",
    intro: "Licitaciones, contratos y procedimientos de contratación pública del Ayuntamiento de Enguídanos. Cada expediente está disponible como documento oficial en PDF.",
    docs: [
      { tipo: "Pliego", title: "Pliego de condiciones para el arrendamiento del local sito en Calle Virgen nº 3", pdf: "assets/ayuntamiento/perfil-contratante/pliego-alquiler-local-virgen-3.pdf" },
      { tipo: "Pliego", title: "Pliego de condiciones para el arrendamiento y acondicionamiento del Bar de la Piscina Municipal", pdf: "assets/ayuntamiento/perfil-contratante/pliego-bar-piscina.pdf" },
    ],
  },
  "tramites-formularios": {
    title: "Trámites y Formularios",
    intro: "Modelos de solicitud, instancias y anexos del Ayuntamiento de Enguídanos para descargar, rellenar y presentar. Para tramitar en línea, accede a la Sede Electrónica.",
    docs: [
      { tipo: "Instancia", title: "Instancia general", pdf: "assets/ayuntamiento/tramites-formularios/instancia-general.pdf" },
      { tipo: "Tributos", title: "Orden de domiciliación bancaria", pdf: "assets/ayuntamiento/tramites-formularios/orden-domiciliacion.pdf" },
      { tipo: "Tributos", title: "Solicitud de devolución de ingresos indebidos", pdf: "assets/ayuntamiento/tramites-formularios/devolucion-ingresos-indebidos.pdf" },
      { tipo: "Tributos", title: "Solicitud de exención del Impuesto de Vehículos (IVTM)", pdf: "assets/ayuntamiento/tramites-formularios/exencion-ivtm.pdf" },
      { tipo: "Urbanismo", title: "Solicitud de licencia de obra menor", pdf: "assets/ayuntamiento/tramites-formularios/licencia-obra-menor.pdf" },
      { tipo: "Registro civil", title: "Solicitud de partidas de nacimiento, matrimonio y defunción", pdf: "assets/ayuntamiento/tramites-formularios/partidas-registro-civil.pdf" },
      { tipo: "Subvenciones", title: "Ayudas por catástrofes (RD 307/2005) · Presentación", pdf: "assets/ayuntamiento/tramites-formularios/ayudas-catastrofes-rd307-2005.pdf" },
      { tipo: "Subvenciones", title: "Anexo I · Ayuda a unidades familiares o de convivencia", pdf: "assets/ayuntamiento/tramites-formularios/anexo-1-unidades-familiares.pdf" },
      { tipo: "Subvenciones", title: "Anexo III · Ayuda a corporaciones locales", pdf: "assets/ayuntamiento/tramites-formularios/anexo-3-corporaciones-locales.pdf" },
      { tipo: "Subvenciones", title: "Anexo IV · Ayuda por prestación de bienes o servicios", pdf: "assets/ayuntamiento/tramites-formularios/anexo-4-prestacion-bienes-servicios.pdf" },
      { tipo: "Subvenciones", title: "Anexo V · Ayuda a comunidades de propietarios", pdf: "assets/ayuntamiento/tramites-formularios/anexo-5-comunidades-propietarios.pdf" },
      { tipo: "Subvenciones", title: "Anexo VI · Ayuda a establecimientos industriales y comerciales", pdf: "assets/ayuntamiento/tramites-formularios/anexo-6-establecimientos.pdf" },
    ],
  },
  bandos: {
    title: "Bandos",
    intro: "Avisos y comunicaciones oficiales de la Alcaldía a los vecinos de Enguídanos.",
    firma: "Sergio de Fez Cerezuela",
    bandos: [
      {
        title: "Voto por correo · Elecciones Generales 26 de junio de 2016",
        cuerpo: ["Se comunica que se puede solicitar el voto por correo para las Elecciones Generales del 26 de junio de 2016."],
      },
      {
        title: "Exposición del censo · Listas electorales",
        cuerpo: ["Se comunica que las listas del censo electoral están expuestas al público toda la semana (del 09/05 al 16/05). Aquella persona que quiera consultarla y efectuar las reclamaciones oportunas podrá hacerlo dentro del horario de oficinas de nuestro Ayuntamiento."],
      },
      {
        title: "Servicio de información al alquiler",
        cuerpo: [
          "El Ayuntamiento de Enguídanos activa un servicio de difusión de las viviendas en alquiler (no vacacional). Todos los propietarios interesados en alquilar una vivienda en el municipio pueden pasar por el Ayuntamiento para rellenar un formulario, o enviar los datos a info@enguidanos.es.",
          "Tras ser revisadas, las propuestas se publicarán en la app municipal de forma gratuita.",
        ],
        campos: ["Tipo de inmueble", "Dirección", "Teléfono", "Correo electrónico", "Nº de habitaciones", "Nº de aseos", "Superficie", "Precio", "Fotos"],
      },
      {
        title: "Tenencia de perros · Obligaciones de los propietarios",
        fecha: "Enguídanos, 7 de febrero de 2012",
        cuerpo: [
          "Se comunica a los propietarios de perros que tienen la obligación de llevarlos atados en toda la vía pública y que está totalmente prohibido que depositen sus heces en la vía pública, parques o zonas verdes urbanas, estando obligados los propietarios a recoger en bolsas las deposiciones y depositarlas en los contenedores.",
          "Se convoca a todos los propietarios de perros el viernes 10 de febrero a las 12h en la Casa de la Cultura a una charla informativa para explicar la nueva ordenanza integral aprobada por el Ayuntamiento de Enguídanos donde se regulan las obligaciones de los propietarios de perros en el municipio.",
          "Posteriormente se llevará a cabo una inspección en todo el casco urbano y se multará a aquellas personas que no cumplan con estas obligaciones.",
        ],
        cargo: "La Concejala de Sostenibilidad",
        firmante: "Carmen Atienza",
        pdf: "assets/ayuntamiento/bandos/bando-perros.pdf",
      },
    ],
  },
};

// NOTICIAS y GALERIA importadas desde src/data/noticias.json y src/data/galeria.json

// Categorías del patrimonio cultural — agrupación temática de los 20 elementos
const PATRIMONIO_CATS = {
  arqueologia: { label: "Arqueología", color: { a: "#9c8a5a", b: "#5a4f2a" } },
  monumentos: { label: "Monumentos", color: { a: "#9c6b3a", b: "#5a3d1f" } },
  industrial: { label: "Hidráulico e industrial", color: { a: "#5a7a8e", b: "#2d4a5a" } },
  miradores: { label: "Miradores", color: { a: "#7ba3bc", b: "#3a6a7a" } },
  heraldica: { label: "Heráldica", color: { a: "#8a7a6a", b: "#5a4a3f" } },
};

// 20 elementos del Patrimonio Cultural de Enguídanos.
// img: ruta prevista para la foto — al dejar el archivo en assets/patrimonio/opt/
// el sitio la mostrará automáticamente; mientras tanto se ve el marcador "FOTO".
const PATRIMONIO = [
  {
    id: "cabeza-moya", cat: "arqueologia",
    title: "Yacimiento Celtíbero", titleEm: "del Cerro Cabeza Moya",
    img: "assets/patrimonio/opt/cabeza-moya.webp",
    excerpt: "Poblado celtíbero amurallado sobre el Cabriel, habitado entre los siglos V y III a.C.",
    desc: [
      "Poblado celtíbero rodeado por las aguas del río Cabriel, que formaba el núcleo mayor de unos yacimientos circundantes dedicados al pastoreo. Habitado desde los siglos V a III a.C. (I y II Edad de Bronce), fue destruido por el fuego, quizá en una guerra con los romanos.",
      "Los restos encontrados por Josefina Navarro y Carlos Sandoval en los años 80 se conservan actualmente en el Museo de Cuenca. El poblado está a 822 m sobre el nivel del mar: es un castro u observatorio avanzado, una línea defensiva de contención adelantada respecto a otros poblados, desde la cual los guerreros controlaban el valle del río.",
      "Su extensión es grande, 25 × 275 m. Con las excavaciones se han descubierto habitaciones de planta cuadrada y rectangular, y también han aparecido cerámicas de origen griego y monedas romanas.",
    ],
    meta: [{ k: "Época", v: "s. V–III a.C." }, { k: "Altitud", v: "822 m" }, { k: "Extensión", v: "25 × 275 m" }],
  },
  {
    id: "centro-celtiberia", cat: "arqueologia",
    title: "Futuro Centro de Interpretación", titleEm: "de la Celtiberia",
    img: "assets/patrimonio/opt/centro-celtiberia.webp",
    excerpt: "Recreación de una casa y una necrópolis celtíberas junto al Castillo, visitable con cita previa.",
    desc: [
      "En el Mirador del Sagrado Corazón, próximo al Castillo-fortaleza, se ha llevado a cabo una actuación singular aprovechando un taller de empleo para recrear una casa celtíbera, réplica de las existentes en el yacimiento de Cabeza Moya, que puede visitarse con guía y cita previa en la Oficina de Turismo.",
      "También se ha reconstruido el cementerio, con la necrópolis donde podemos observar la pira funeraria y las estelas funerarias. En breve se espera instalar los paneles informativos del futuro Centro de Interpretación de la Celtiberia.",
    ],
    meta: [{ k: "Visita", v: "Con cita previa" }, { k: "Origen", v: "Taller de empleo TEPRO" }],
  },
  {
    id: "puente-romano", cat: "arqueologia",
    title: "Antiguo Puente", titleEm: "romano",
    img: "assets/patrimonio/opt/puente-romano.webp",
    excerpt: "Ruinas y pilastras de un puente romano sobre el Cabriel, visibles desde el puente de hierro.",
    desc: [
      "Los restos del antiguo puente romano se encuentran en el término municipal de Enguídanos, sobre el río Cabriel. En la actualidad, solo se conservan ruinas y las pilastras de la estructura original, las cuales se pueden observar fácilmente desde el puente de hierro moderno.",
    ],
  },
  {
    id: "castillo", cat: "monumentos",
    title: "Castillo-Fortaleza", titleEm: "del siglo XI",
    img: "assets/patrimonio/opt/castillo.webp",
    excerpt: "Fortaleza árabe sobre un cerro escarpado a 734 m, origen del pueblo.",
    desc: [
      "Se encuentra en un escarpado cerro, a unos 734 m de altitud. Construido por los árabes sobre la base de un castro íbero-romano entre los siglos X y XI, su misión primordial fue la defensa avanzada de los reinos levantinos. Su planta es casi rectangular, con tres cubos en las esquinas en forma de «D».",
      "A partir de su construcción comenzaron a asentarse a su alrededor los primeros habitantes, dando lugar al nacimiento del Barrio de la Virgen, el Barrio de San Blas, la Plaza Mayor, el Barrio Cuenca y la Umbría.",
      "Tras la reconquista cristiana perteneció primero al Marquesado de Villena y después al de Moya. Fue en los siglos XIV y XV cuando se terminó su edificación, con elementos góticos defensivos y elevando la altura de la Torre del Homenaje.",
    ],
    meta: [{ k: "Origen", v: "Siglos X–XI" }, { k: "Altitud", v: "734 m" }, { k: "Acceso", v: "Libre" }],
  },
  {
    id: "central-hidroelectrica", cat: "industrial",
    title: "Central Hidroeléctrica", titleEm: "Lucas de Urquijo",
    img: "assets/patrimonio/opt/central-hidroelectrica.webp",
    excerpt: "Central de 1914 sobre el Cabriel, con el poblado de sus trabajadores.",
    desc: [
      "Su construcción data de 1914. La central se compone de dos edificios paralelos construidos de manera homogénea, y junto a ella se conservan los edificios abandonados de un antiguo poblado para los trabajadores de la central y de la desaparecida Hidroeléctrica Española.",
      "Esta central se alimenta del agua del río Cabriel y del Guadazaón.",
    ],
    meta: [{ k: "Año", v: "1914" }, { k: "Ríos", v: "Cabriel y Guadazaón" }],
  },
  {
    id: "ermita-cruz", cat: "monumentos",
    title: "Ermita", titleEm: "de la Cruz",
    img: "assets/patrimonio/opt/ermita-cruz.webp",
    excerpt: "Ermita en la subida al cementerio, con vistas del Campichuelo. Fiesta el 3 de mayo.",
    desc: [
      "Situada en la subida al cementerio, en esta ermita se celebra el día 3 de mayo la festividad de la Cruz y se bendicen las caridades.",
      "Tiene unas vistas impresionantes del Campichuelo.",
    ],
    meta: [{ k: "Fiesta", v: "3 de mayo" }],
  },
  {
    id: "estacion-tren", cat: "industrial",
    title: "Antigua Estación", titleEm: "de tren",
    img: "assets/patrimonio/opt/estacion-tren.webp",
    excerpt: "Antigua estación abandonada junto al puente de la Cortina, el mayor de la zona.",
    desc: [
      "Esta vieja estación se encuentra abandonada. Ni siquiera los pocos trenes que pasan con destino Madrid-Cuenca-Valencia tienen parada facultativa. Como todas las estaciones de su categoría, el conjunto de elementos patrimoniales abandonados lo forman la propia estación y apeadero, las casas de los trabajadores y el almacén.",
      "Todos estos edificios serían fácilmente recuperables para acciones de tipo turístico —alojamiento, restauración, centro de interpretación, etc.—. Junto a la estación se puede observar el mayor puente de vía férrea de toda la zona: el puente de la Cortina.",
    ],
    meta: [{ k: "Línea", v: "Madrid–Cuenca–Valencia" }, { k: "Junto a", v: "Puente de la Cortina" }],
  },
  {
    id: "iglesia-asuncion", cat: "monumentos",
    title: "Iglesia Ntra. Sra.", titleEm: "de la Asunción",
    img: "assets/patrimonio/opt/iglesia-asuncion.webp",
    excerpt: "Templo gótico-mudéjar de los siglos XV-XVI con un valioso artesonado de madera.",
    desc: [
      "Se encuentra en la Plaza Rafael Torrella y data de los siglos XV-XVI. Su estilo es gótico y mudéjar. Tiene una austera torre cuadrada adosada a la única nave, de planta rectangular, con puerta de entrada del gótico tardío.",
      "La nave tiene cubierta a dos aguas y su principal importancia radica en un artesonado de madera de gran valor y una pila bautismal del mismo siglo de construcción de la iglesia. Esta pila tiene gallones en su parte inferior y, sobre ellos, arcos de medio punto, siendo su soporte octogonal.",
    ],
    meta: [{ k: "Estilo", v: "Gótico-mudéjar" }, { k: "Siglos", v: "XV–XVI" }],
  },
  {
    id: "lavadero", cat: "industrial",
    title: "Lavadero", titleEm: "público",
    img: "assets/patrimonio/opt/lavadero-publico.webp",
    excerpt: "Lavadero cubierto de 1963, rehabilitado en 2001, de una losa de más de 15 metros.",
    desc: [
      "Construido en 1963, ha sido cuidado y rehabilitado en el año 2001, integrándose en los monumentos y lugares de interés del municipio.",
      "Se trata de un lavadero de tipo cubierto y elevado, de una sola losa corrida de más de 15 metros. Su caudal, abundante, lo recibe de uno de los manantiales que tiene la población.",
    ],
    meta: [{ k: "Construido", v: "1963" }, { k: "Rehabilitado", v: "2001" }],
  },
  {
    id: "mirador-cueva", cat: "miradores",
    title: "Mirador", titleEm: "de la Cueva",
    img: "assets/patrimonio/opt/mirador-cueva.webp",
    excerpt: "Vistas del casco urbano desde el sur, con la iglesia y el Castillo.",
    desc: [
      "Permite observar el paisaje urbano de Enguídanos desde el sur, obteniendo unas vistas extraordinarias del casco urbano, con la iglesia y su torre y la Plaza Mayor, presidido todo por la majestuosidad del Castillo.",
    ],
  },
  {
    id: "mirador-reloj-solar", cat: "miradores",
    title: "Mirador", titleEm: "del Reloj Solar",
    img: "assets/patrimonio/opt/mirador-reloj-solar-foto.webp",
    excerpt: "Pasada la piscina, vistas del Cabriel y un reloj solar.",
    desc: [
      "Se encuentra al pasar la piscina, y desde allí se pueden observar unas vistas del río Cabriel de gran belleza, así como un reloj solar.",
    ],
  },
  {
    id: "mirador-sagrado-corazon", cat: "miradores",
    title: "Mirador", titleEm: "del Sagrado Corazón",
    img: "assets/patrimonio/opt/mirador-sagrado-corazon-foto.webp",
    excerpt: "Mirador a los pies del Cristo, en lo alto del cerro del Castillo.",
    desc: [
      "En lo alto del cerro del Castillo existe una escultura sobre pedestal del Sagrado Corazón de Jesús y, a su pie, el Ayuntamiento ha instalado un mirador desde el que divisar el pueblo desde su parte norte, muy cercano al entramado urbanístico.",
      "A pocos metros se accede al Castillo.",
    ],
  },
  {
    id: "mirador-virgen", cat: "miradores",
    title: "Mirador", titleEm: "de la Virgen",
    img: "assets/patrimonio/opt/mirador-virgen-foto.webp",
    excerpt: "A espaldas del Castillo, vistas del valle del Cabriel y la Playeta.",
    desc: [
      "Se sitúa a espaldas del Castillo, al final de la calle de la Virgen. Desde este mirador se obtienen vistas magníficas del valle del río Cabriel a su paso por este lugar, del propio río, de las huertas, de la zona de la Lastra y la Playeta y de la Serranía Baja conquense.",
    ],
  },
  {
    id: "mirador-hoz-agua", cat: "miradores",
    title: "Mirador", titleEm: "de la Hoz del Agua",
    img: "assets/patrimonio/opt/mirador-hoz-agua.webp",
    excerpt: "Vistas en altura de la Hoz del Agua, con sus paredes de roca y la vega del fondo.",
    desc: [
      "Asomado a la Hoz del Agua, este mirador domina el cañón labrado por el agua entre cantiles de roca caliza, con la vega y los caminos del fondo del valle.",
      "Es uno de los puntos del sendero PR CU-50, salpicado de fuentes y manantiales que afloran en los barrancos.",
    ],
  },
  {
    id: "mirador-hoz-tejo", cat: "miradores",
    title: "Mirador", titleEm: "de la Hoz del Tejo",
    img: "assets/patrimonio/opt/mirador-hoz-tejo.webp",
    excerpt: "Mirador sobre el meandro encajado del Cabriel, entre paredes de roca y aguas verdes.",
    desc: [
      "Mirador asomado a la Hoz del Tejo, donde el río Cabriel describe un cerrado meandro encajado entre altas paredes de roca caliza.",
      "Desde lo alto se contemplan las aguas verdes del cañón, los pinares de las laderas y, al fondo, la lámina del embalse.",
    ],
  },
  {
    id: "mirador-rio-mira", cat: "miradores",
    title: "Mirador", titleEm: "del Río Mira",
    img: "assets/patrimonio/opt/mirador-rio-mira.webp",
    imgPos: "center 85%",
    excerpt: "Balcón sobre la hoz del río Mira, frente a un gran cantil de roca dorada.",
    desc: [
      "Mirador con barandilla de madera asomado a la hoz del río Mira, frente a las imponentes paredes verticales de roca caliza que el agua ha labrado en el cañón.",
      "Es uno de los puntos del sendero PR CU-54, con vistas de los pinares de las laderas y, al fondo, del embalse de Contreras.",
    ],
  },
  {
    id: "mirador-perejil", cat: "miradores",
    title: "Mirador", titleEm: "del Perejil",
    img: "assets/patrimonio/opt/mirador-perejil.webp",
    excerpt: "Vistas abismales del Cabriel, donde el río hace frontera entre Enguídanos y La Pesquera.",
    desc: [
      "Mirador asomado al lugar donde el río Cabriel hace de frontera natural entre Enguídanos y La Pesquera, con vistas abismales del cañón y sus aguas verdes encajadas entre paredes de roca.",
      "Es uno de los puntos del sendero PR CU-54, rodeado de pinares sobre las laderas de la hoz.",
    ],
  },
  {
    id: "molino-golpecillo", cat: "industrial",
    title: "Molino de", titleEm: "«El Golpecillo»",
    img: "assets/patrimonio/opt/molino-golpecillo-foto.webp",
    excerpt: "Molino y batán en ruinas sobre el Guadazaón, junto a un salto de agua.",
    desc: [
      "Antiguo molino y batán a orillas del río Guadazaón, del que se nutría por medio de una canalización construida con arcos y piedras sillares de gran interés, y una edificación —también en piedra sillar— de gran singularidad.",
      "Su estado es de ruina total, pero conserva los tres arcos de medio punto del edificio y la estructura y cimientos de todas las construcciones anejas que allí había. A pocos metros se encuentra el salto en cascada del río Guadazaón, lo que otorga un valor añadido a este enclave.",
    ],
  },
  {
    id: "plaza-casas-solariegas", cat: "monumentos",
    title: "Conjunto de la Plaza", titleEm: "y casas solariegas",
    img: "assets/patrimonio/opt/plaza-casas-solariegas-v2.webp",
    excerpt: "Plaza de 1907 con balcones de madera, fuente y casas solariegas con escudos.",
    desc: [
      "La plaza, que lleva el nombre del alcalde D. Rafael Torrella, tiene una especial importancia por sus balcones de madera, sus puertas y ventanas —hay un portalón adintelado con una inscripción de 1766— y por su fuente, construida en 1907 según su inscripción, en forma de monolito de cuatro lados y pilón circular con cuatro chorros.",
      "De la plaza salen seis calles, encontrándose en una de sus esquinas el Ayuntamiento y en otra la iglesia. Recorriendo la ruta urbana monumental podremos encontrar casas de gran importancia en las calles Cuenca, Virgen y en la propia plaza, así como escudos de gran antigüedad en las calles Espada, Cuenca y Larga.",
    ],
    meta: [{ k: "Fuente", v: "1907" }, { k: "Portalón", v: "1766" }],
  },
  {
    id: "represa-lastra", cat: "industrial",
    title: "Represa", titleEm: "de la Lastra",
    img: "assets/patrimonio/opt/represa-lastra-v2.webp",
    excerpt: "Antigua represa sobre el Cabriel que forma una pequeña playa de baño.",
    desc: [
      "Antigua represa abandonada sobre el río Cabriel que conserva bastante bien la obra de ingeniería propia de este tipo de construcción hidráulica.",
      "En su salida de agua provoca un pequeño ensanche que, en su orilla sur, forma una pequeña playa donde toman el baño quienes hasta allí llegan.",
    ],
  },
  {
    id: "escudo-puerta", cat: "heraldica",
    title: "Escudo de Armas", titleEm: "y puerta",
    img: "assets/patrimonio/opt/escudo-puerta.webp",
    excerpt: "Escudo nobiliario en la clave de un arco de medio punto de piedra sillar.",
    desc: [
      "Otro de los escudos nobiliarios de la villa. El escudo se encuentra en la portada, con arco de medio punto de piedra sillar, sobre la clave.",
      "Falta el tejadillo de protección y urge la limpieza y rehabilitación de toda la fachada.",
    ],
  },
  {
    id: "escudo-larga", cat: "heraldica",
    title: "Escudo de Armas", titleEm: "de la calle Larga",
    img: "assets/patrimonio/opt/escudo-larga-v2.webp",
    excerpt: "Escudo de la calle Larga con la inscripción «AÑO 1659».",
    desc: [
      "Escudo de armas situado en la calle Larga, único vestigio noble que queda en la casa. Debajo del escudo se lee la inscripción del año de construcción: «AÑO 1659».",
      "En la casa contigua se descubre otro escudo, este más moderno, con decoración de un pájaro y la fecha de 1857. Estos dos escudos, junto al de la cercana calle Espada, son los únicos que quedan en el pueblo. Se desconoce a qué familias pertenecieron.",
    ],
    meta: [{ k: "Inscripción", v: "AÑO 1659" }],
  },
  {
    id: "casa-senorial", cat: "monumentos",
    title: "Casa Señorial", titleEm: "del siglo XIX",
    img: "assets/patrimonio/opt/casa-senorial.webp",
    excerpt: "Casa de construcción tradicional con balcón de madera y arco de piedra sillar.",
    desc: [
      "Casa señorial de construcción tradicional, con dos alturas y un balcón de madera en el patio exterior que se abre a la calle mediante un arco de piedra sillar de bella factura. El conjunto de puerta, balcón y ventanas guarda una simetría interesante.",
      "La portada es adintelada y sobre ella reposa un balcón con barandilla de hierro forjado. La puerta es de madera labrada, imitando dos columnas a modo de pilastras, con un medallón central con las iniciales de los antiguos dueños. A su derecha destaca la reja castellana que cubre la ventana.",
      "En su interior conserva todavía las enormes vigas de madera de su estructura y parte de la solería de ladrillo abizcochado. La casa es muy grande y cuenta con patio, corral y antigua bodega.",
    ],
  },
  {
    id: "casa-curato", cat: "monumentos",
    title: "Casa", titleEm: "Curato",
    img: "assets/patrimonio/opt/casa-curato.webp",
    excerpt: "Antigua casa curato con arco de medio punto y escudo religioso sobre la clave.",
    desc: [
      "Antigua casa que, por su escudo, estuvo destinada a casa curato. Tiene puerta con arco de medio punto en piedra sillar que arranca desde dos cornisas fajadas y, sobre la clave, un escudo religioso con cruz.",
      "Está descuidada, cubierta de cal y alterada en sus vanos originarios.",
    ],
  },
];

// ============================================================
//  NATURALEZA — parajes naturales del término de Enguídanos
//  Solo información del paisaje y sus enclaves (sin rutas).
// ============================================================
const NATURALEZA_CATS = {
  agua:     { label: "Parajes de agua", color: { a: "#5a8aa3", b: "#2d5a72" } },
  hoces:    { label: "Hoces y cañones", color: { a: "#9c8a6a", b: "#5a4f3a" } },
  embalses: { label: "Embalses",        color: { a: "#4a7a8e", b: "#243f52" } },
  enclaves: { label: "Enclaves singulares", color: { a: "#7a8a5e", b: "#3f4727" } },
};

// Rutas de senderismo señalizadas que pasan por los parajes (siglas → ficha).
const RUTAS_INFO = {
  "PR CU-50":  { code: "PR CU-50",  name: "Sendero de la Hoz del Agua y Hoz Cerrada", logo: "assets/rutas/logos/mini/pr-cu-50.webp",  pdf: "assets/senderos/pr-cu-50.pdf" },
  "PR CU-53":  { code: "PR CU-53",  name: "Sendero de Las Chorreras",                 logo: "assets/rutas/logos/mini/pr-cu-53.webp",  pdf: "assets/senderos/pr-cu-53.pdf" },
  "PR CU-54":  { code: "PR CU-54",  name: "Sendero de los Cuatro Ríos",              logo: "assets/rutas/logos/mini/pr-cu-54.webp",  pdf: "assets/senderos/pr-cu-54.pdf" },
  "GR 64":     { code: "GR 64",     name: "De Enguídanos a Mira",                    logo: "assets/rutas/logos/mini/gr-64.webp",     pdf: "assets/senderos/gr-64.pdf" },
  "GR 66":     { code: "GR 66",     name: "Valle del Cabriel · Víllora – Enguídanos", logo: "assets/rutas/logos/mini/gr-66.webp",    pdf: "assets/senderos/gr-66.pdf" },
  "BTT CU-02": { code: "BTT CU-02", name: "Ruta de bicicleta de montaña",            logo: "assets/rutas/logos/mini/btt-cu-02.webp", pdf: "assets/senderos/btt-cu-02.pdf" },
};

// Paraje destacado — Monumento Natural. Se muestra como pieza editorial.
const NATURALEZA_DESTACADO = {
  id: "chorreras", cat: "agua",
  title: "Las Chorreras", titleEm: "del Cabriel",
  badge: "Monumento Natural · JCCM",
  img: "assets/chorreras.webp",
  rutas: ["PR CU-53", "GR 66", "BTT CU-02"],
  excerpt: "El río Cabriel labra la roca caliza en cascadas, balsas y saltos de agua turquesa a cinco kilómetros del pueblo.",
  web: { label: "chorrerasdelcabriel.es", href: "https://www.chorrerasdelcabriel.es" },
  desc: [
    "En los alrededores del pueblo de Enguídanos, a cinco kilómetros del centro urbano del municipio, nos encontramos este paraje natural declarado Monumento Natural por la Junta de Comunidades de Castilla-La Mancha.",
    "A destacar de las Chorreras del Cabriel su espectacularidad y la belleza del paisaje por donde discurre el río Cabriel. Pero los amantes de la naturaleza se darán cuenta de que no sólo tiene una belleza estética: en este tramo, el río ha excavado una prolongada pendiente en la roca caliza, ocasionando un paraje con cascadas, corrientes, balsas, rápidos y saltos de agua de color turquesa.",
    "A esto se añade que el río Cabriel es uno de los ríos mejor conservados de Europa, lo que suma a la belleza natural que ya posee el lugar.",
  ],
  meta: [{ k: "Figura", v: "Monumento Natural" }, { k: "Distancia", v: "5 km del pueblo" }, { k: "Río", v: "Cabriel" }],
};

const NATURALEZA = [
  {
    id: "hoz-agua", cat: "hoces",
    title: "Hoz", titleEm: "del Agua",
    img: "assets/hoz-del-agua-v2.webp",
    rutas: ["PR CU-50"],
    excerpt: "Cañón de más de 3 km salpicado de fuentes y manantiales que afloran en los barrancos.",
    desc: [
      "En esta hoz se encuentran abundantes fuentes y manantiales, que afloran en las grietas de los barrancos —ejemplos son Las Fuentecillas, la Fuente Marcial o el Manantial de Villaescusa—. También hay abundantes pinares y un molinillo en el embalse para el riego, de grandes dimensiones.",
      "Esta hoz tiene algo más de 3 km de longitud, con una pendiente interior oeste-este que va de los 950 a los 750 metros. Para los amantes de la geología, en su conexión con el río Cabriel se pueden contemplar escarpadas paredes de roca caliza y aglomerados de diferente dureza que conforman un paisaje quebrado.",
    ],
    meta: [{ k: "Longitud", v: "≈ 3 km" }, { k: "Altitud", v: "950–750 m" }],
  },
  {
    id: "hoz-rio-mira", cat: "hoces",
    title: "Hoz", titleEm: "del Río Mira",
    img: "assets/naturaleza/hoz-rio-mira-2-o.webp",
    rutas: ["PR CU-54", "GR 64", "BTT CU-02"],
    excerpt: "Un pequeño cañón fluvial de paredes verticales en la desembocadura del embalse de Contreras.",
    desc: [
      "En la desembocadura del embalse de Contreras, esta hoz forma uno de los parajes más bonitos de Enguídanos. Se trata de un pequeño cañón fluvial horadado en las paredes verticales de piedra, residiendo su espectacularidad en la altura de éstas.",
    ],
  },
  {
    id: "hoz-cerrada", cat: "hoces",
    title: "Hoz", titleEm: "Cerrada",
    img: "assets/naturaleza/hoz-cerrada-o.webp",
    rutas: ["PR CU-50"],
    excerpt: "Interior rectilíneo y laterales escarpados de hasta 200 m, ya sin curso de agua superficial.",
    desc: [
      "La peculiaridad de esta hoz radica en el contraste de la forma rectilínea de su interior con lo escarpado de sus laterales, con paredes de hasta 200 metros de altura, coronadas por farallones rocosos. Su belleza es concentrada, ya que sólo tiene 2 km de longitud.",
      "Por este paraje ya no fluye el agua: se filtra hacia los arroyos y ríos subterráneos, aflorando al exterior en forma de manantial.",
    ],
    meta: [{ k: "Longitud", v: "≈ 2 km" }, { k: "Paredes", v: "Hasta 200 m" }],
  },
  {
    id: "hoz-san-martin", cat: "hoces",
    title: "Hoz", titleEm: "del Río San Martín",
    img: "assets/naturaleza/hoz-san-martin-o.webp",
    rutas: ["PR CU-54"],
    excerpt: "Profunda hoz con cuchillos rocosos en el límite con Víllora, Lugar de Interés Geológico.",
    desc: [
      "El río San Martín se encaja en los límites de Enguídanos con Víllora en una profunda hoz, con cuchillos de inigualable belleza, declarada Lugar de Interés Geológico.",
    ],
    meta: [{ k: "Figura", v: "Lugar de Interés Geológico" }],
  },
  {
    id: "perejil", cat: "hoces",
    title: "El", titleEm: "Perejil",
    img: "assets/naturaleza/perejil-o.webp",
    rutas: ["PR CU-54", "BTT CU-02"],
    excerpt: "Donde el Cabriel hace frontera natural entre Enguídanos y La Pesquera, con vistas abismales.",
    desc: [
      "Este paraje se encuentra donde el río Cabriel hace de frontera natural entre los pueblos de Enguídanos y La Pesquera. Desde aquí se puede observar el avance del río hacia el pantano de Contreras, con la característica de que la vista es impresionante, ya que en este tramo el cauce del río alcanza unas proporciones abismales.",
    ],
  },
  {
    id: "playeta-lastra", cat: "agua",
    title: "La Playeta", titleEm: "y La Lastra",
    img: "assets/playeta.webp",
    rutas: ["GR 66", "BTT CU-02"],
    excerpt: "Una represa bien conservada sobre el Cabriel forma una pequeña playa de río junto al pueblo.",
    desc: [
      "Cerca del casco urbano de Enguídanos hay una represa abandonada sobre el río Cabriel muy bien conservada. Esta obra de ingeniería provoca, con su salida de agua, un ensanche que en su orilla forma una pequeña playa, aprovechada por vecinos del pueblo y visitantes para comer y refrescarse.",
    ],
  },
  {
    id: "salobral", cat: "agua",
    title: "El", titleEm: "Salobral",
    img: "assets/naturaleza/salobral-o.webp",
    rutas: ["PR CU-54", "GR 64"],
    excerpt: "Antiguo balneario junto al Cerro Cabeza Moya, con un manantial de agua salada en rambla salina.",
    desc: [
      "Ubicado junto al Cerro Cabeza Moya (yacimiento arqueológico celtíbero), se encuentran estos baños, utilizados antiguamente como balneario. Hay un manantial de agua salada en una rambla salina, lugar de importancia natural ya que en él crecen especies vegetales muy características.",
    ],
  },
  {
    id: "embalse-batanejo", cat: "embalses",
    title: "Embalse", titleEm: "del Batanejo",
    img: "assets/naturaleza/embalse-batanejo-o.webp",
    excerpt: "Presa de sillería escalonada sobre el Guadazaón, en una zona LIC de gran serenidad.",
    desc: [
      "La carretera que se dirige a Cardenete cruza la presa que, sobre el río Guadazaón, está construida en piedra de sillería con un diseño de contención escalonada entre los ojos de la propia presa. Es un buen ejemplo de conjunción entre la naturaleza y la mano del hombre.",
      "El río Guadazaón, situado en zona LIC, presenta a su paso un paisaje de gran belleza y serenidad.",
    ],
    meta: [{ k: "Río", v: "Guadazaón" }, { k: "Protección", v: "Zona LIC" }],
  },
  {
    id: "embalse-contreras", cat: "embalses",
    title: "Embalse", titleEm: "de Contreras",
    img: "assets/naturaleza/embalse-contreras-o.webp",
    rutas: ["PR CU-54"],
    excerpt: "Gran embalse de 1972 en la confluencia del Cabriel y el Mira, con presa de 129 metros.",
    desc: [
      "Situado entre los municipios de Villalgordo del Cabriel (Valencia) y La Pesquera, Mira, Enguídanos y Minglanilla (Cuenca), se construyó en 1972 en la confluencia de los ríos Cabriel y Mira.",
      "Tiene una superficie de 2.710 ha, con una capacidad máxima de 943 hm³ y una altura de presa de 129 metros. Se usa para la producción de energía y para abastecer de agua al Canal Júcar-Turia, que suministra agua potable a la ciudad de Valencia.",
    ],
    meta: [{ k: "Año", v: "1972" }, { k: "Superficie", v: "2.710 ha" }, { k: "Capacidad", v: "943 hm³" }, { k: "Presa", v: "129 m" }],
  },
  {
    id: "embalse-villora", cat: "embalses",
    title: "Embalse", titleEm: "de Víllora",
    img: "assets/naturaleza/embalse-villora-o.webp",
    rutas: ["GR 66"],
    excerpt: "Pequeño represamiento del Cabriel que alimenta la central del Salto Lucas de Urquijo.",
    desc: [
      "Con apenas un represamiento de 1 hm³, recoge las aguas del río Cabriel para servir, por un lado, de aprovechamiento hidroeléctrico a la Central del Salto Lucas de Urquijo y, por otro, mediante un canal con trampillas por las que el agua cae al Cabriel, que va cogiendo caudal para descolgarse después por el paraje de Las Chorreras.",
    ],
    meta: [{ k: "Capacidad", v: "≈ 1 hm³" }],
  },
  {
    id: "charandel", cat: "enclaves",
    title: "El", titleEm: "Charandel",
    img: "assets/patrimonio/opt/charandel.webp",
    rutas: ["PR CU-54", "BTT CU-02"],
    excerpt: "Aldea de hortelanos que aprovecha el agua del río Mira hasta para generar su propia electricidad.",
    desc: [
      "Aldea de hortelanos por la que pasa una canalización artificial que aprovecha el agua del río Mira para darle un uso doméstico y de regadío, así como para producir la energía eléctrica de la propia aldea.",
      "Hay instalada una minicentral, con una antigüedad aproximada de 50 años, movida por el cauce artificial antes de ser devuelta al río Narboneta en una caída de unos 4 metros.",
    ],
    meta: [{ k: "Río", v: "Mira" }, { k: "Salto", v: "≈ 4 m" }],
  },
  {
    id: "puente-cortina", cat: "enclaves",
    title: "Puente de la Cortina", titleEm: "· Viaducto Torres Quevedo",
    img: "assets/naturaleza/puente-cortina-o.webp",
    excerpt: "Viaducto ferroviario del siglo XX, de 21 ojos y casi un kilómetro de longitud.",
    desc: [
      "Junto a la vieja y abandonada estación de tren de Enguídanos, en el límite territorial con los pueblos de Narboneta y Mira, se alza esta construcción de ingeniería del siglo XX, de extraordinaria belleza plástica y espectacularidad.",
      "Es un puente de la línea de ferrocarril Madrid-Valencia que cuenta con 21 ojos y una longitud de casi 1 km. Su belleza paisajística y sus sorprendentes proporciones lo transforman en un recurso patrimonial digno de ser visitado y contemplado.",
    ],
    meta: [{ k: "Época", v: "Siglo XX" }, { k: "Ojos", v: "21" }, { k: "Longitud", v: "≈ 1 km" }],
  },
  {
    id: "tunel-yeso", cat: "enclaves",
    title: "Túnel", titleEm: "de Yeso",
    img: "assets/naturaleza/tunel-yeso-o.webp",
    rutas: ["PR CU-54"],
    excerpt: "Galería horadada en la roca de yeso en el antiguo camino a Camporrobles, junto al Puente de Hierro.",
    desc: [
      "Curioso túnel excavado en la roca de yeso a lo largo del antiguo camino que conducía a Camporrobles, en dirección al Cerro Cabeza Moya. Se accede a él una vez cruzado el Puente de Hierro, junto a los restos del antiguo Puente Romano sobre el río Cabriel.",
      "Horadado en la piedra para salvar el paso, sus paredes blanquecinas conservan las marcas del trabajo y la luz del extremo opuesto dibuja su característica boca de salida, en un juego de sombras que sorprende a quien lo recorre.",
    ],
  },
];

// Ríos, fuentes y manantiales — pendiente de descripciones y fotos del Ayuntamiento.
const NATURALEZA_RIOS = [
  { id: "cabriel", name: "Río Cabriel", kind: "río", img: "assets/rio-cabriel.webp" },
  { id: "guadazaon", name: "Río Guadazaón", kind: "río", img: "assets/rio-guadazaon.webp" },
  { id: "narboneta", name: "Río Narboneta", kind: "río", img: "assets/rio-narboneta.webp" },
  { id: "san-martin", name: "Río San Martín", kind: "río", img: "assets/rio-san-martin.webp" },
  { id: "mira", name: "Río Mira", kind: "río", img: "assets/rio-mira.webp" },
];
const NATURALEZA_FUENTES = [
  { id: "san-blas", name: "Fuente de San Blas", kind: "fuente", img: "assets/fuente-san-blas.webp" },
  { id: "carica", name: "Fuente Carica", kind: "fuente" },
  { id: "el-pago", name: "Fuente El Pago", kind: "fuente", img: "assets/fuente-el-pago.webp" },
  { id: "donato", name: "Fuente Donato", kind: "fuente" },
  { id: "teo", name: "Fuente de Teo", kind: "fuente" },
];

export {
  PUEBLO, HIGHLIGHTS, POIS, POI_CAT, AGENDA_CATS, GALERIA, NOTICIAS, ALCALDE,
  EVENTOS, TRAMITES, AREAS_CONTENT, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO,
};
