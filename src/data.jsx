import PUEBLO from './data/pueblo.json'
import HIGHLIGHTS from './data/highlights.json'
import POIS from './data/pois.json'
import POI_CAT from './data/poi-cats.json'
import AGENDA_CATS from './data/agenda-cats.json'
import EVENTOS from './data/eventos.json'
import PATRIMONIO from './data/patrimonio.json'
import PATRIMONIO_CATS from './data/patrimonio-cats.json'
import _naturaleza from './data/naturaleza.json'
import NATURALEZA_CATS from './data/naturaleza-cats.json'
import NATURALEZA_RIOS from './data/naturaleza-rios.json'
import NATURALEZA_FUENTES from './data/naturaleza-fuentes.json'
import RUTAS_INFO from './data/rutas.json'
import GALERIA from './data/galeria.json'
import NOTICIAS from './data/noticias.json'
import AREAS_CONTENT from './data/areas-content.json'
import TRAMITES from './data/tramites.json'
import ALCALDE from './data/alcalde.json'
export { MES_ABBR, parseEvDate, expandEventos } from './utils/eventos.js'

const NATURALEZA = _naturaleza.items
const NATURALEZA_DESTACADO = _naturaleza.destacado

export {
  PUEBLO, HIGHLIGHTS, POIS, POI_CAT, AGENDA_CATS, GALERIA, NOTICIAS, ALCALDE,
  EVENTOS, TRAMITES, AREAS_CONTENT, PATRIMONIO, PATRIMONIO_CATS,
  NATURALEZA, NATURALEZA_CATS, NATURALEZA_DESTACADO, NATURALEZA_RIOS, NATURALEZA_FUENTES, RUTAS_INFO,
}
