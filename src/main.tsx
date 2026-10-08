import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Fontes auto-hospedadas (variáveis); o navegador baixa só o subconjunto latino via unicode-range.
import '@fontsource-variable/source-serif-4/opsz.css'
import '@fontsource-variable/source-sans-3/wght.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
