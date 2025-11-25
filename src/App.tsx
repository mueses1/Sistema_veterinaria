import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardCliente from './pages/DashboardCliente';
import Pacientes from './pages/Pacientes';
import Citas from './pages/Citas';
import Perfil from './pages/Perfil';
import Configuracion from './pages/Configuracion';
import Landing from './pages/Landing';
import Productos from './pages/Productos';
import CatalogoProductos from './pages/CatalogoProductos';
import SobreNosotros from './pages/SobreNosotros';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';
import { applyThemeClass, loadStoredTheme } from './utils/theme';

const API_BASE_URL = 'http://localhost:8000/api/v1';

function App() {
  useEffect(() => {
    const storedTheme = loadStoredTheme();
    if (storedTheme) {
      applyThemeClass(storedTheme);
      return;
    }

    const loadInitialTheme = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/`);
        if (!res.ok) {
          applyThemeClass('claro');
          return;
        }
        const data = await res.json();
        const tema = data?.sistema?.tema;

        if (tema === 'oscuro') {
          applyThemeClass('oscuro');
        } else {
          applyThemeClass('claro');
        }
      } catch {
        applyThemeClass('claro');
      }
    };

    loadInitialTheme();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo-productos" element={<CatalogoProductos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/cliente-dashboard"
          element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute requireAdmin>
              <Pacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citas"
          element={
            <ProtectedRoute requireAdmin>
              <Citas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <ProtectedRoute requireAdmin>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
