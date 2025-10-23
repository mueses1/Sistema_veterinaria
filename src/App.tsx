import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Citas from './pages/Citas';
import Perfil from './pages/Perfil';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <Pacientes />
              </ProtectedRoute>
            } />
            
            <Route path="/citas" element={
              <ProtectedRoute>
                <Citas />
              </ProtectedRoute>
            } />
            
            <Route path="/perfil" element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } />
            
            <Route path="/configuracion" element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            } />
            
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
