import React from 'react'
import ReactDOM from 'react-dom/client'

// Fuentes serif (titulares — opciones del TweaksPanel)
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/dm-serif-display/400-italic.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/400-italic.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/libre-caslon-text/400.css'
import '@fontsource/libre-caslon-text/400-italic.css'

// Fuentes sans-serif (cuerpo — opciones del TweaksPanel)
import '@fontsource-variable/manrope'
import '@fontsource-variable/inter'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/work-sans'
import '@fontsource/lato/300.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'

// Monoespaciada
import '@fontsource-variable/jetbrains-mono'

import './styles.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
