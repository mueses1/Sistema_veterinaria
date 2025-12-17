import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { migrateOldData } from './utils/migrateData'

// Migrar datos antiguos de localStorage al inicio de la aplicación
migrateOldData();

import { GoogleOAuthProvider } from '@react-oauth/google';

// El Client ID se debe configurar en el archivo .env del frontend
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
