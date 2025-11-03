import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { migrateOldData } from './utils/migrateData'

// Migrar datos antiguos de localStorage al inicio de la aplicación
migrateOldData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
