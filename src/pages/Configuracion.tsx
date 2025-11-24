import { useState, useEffect } from 'react';

import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Swal from 'sweetalert2';
import { applyThemeClass, loadStoredTheme } from '../utils/theme';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const Configuracion = () => {
  const [tema, setTema] = useState<'claro' | 'oscuro'>(() => loadStoredTheme() ?? 'claro');

  // Cargar configuración desde la API (solo tema del sistema)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/`);
        if (!response.ok) return;

        const data = await response.json();
        if (data.sistema?.tema) {
          setTema(data.sistema.tema);
        } else {
          setTema('claro');
        }
      } catch (error) {
        console.error('Error cargando configuración desde la API', error);
      }
    };

    fetchSettings();
  }, []);

  // Sincronizar la clase del tema cada vez que cambie el estado local
  useEffect(() => {
    applyThemeClass(tema);
  }, [tema]);

  const guardarTema = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sistema: { tema },
        }),
      });

      if (!res.ok) {
        throw new Error('Error guardando tema');
      }

      Swal.fire({
        title: 'Tema actualizado',
        text: 'La preferencia de tema se ha guardado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el tema. Intenta de nuevo.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
            <p className="text-gray-600 mt-2">
              Elige el modo de apariencia que prefieras para el sistema.
            </p>
          </div>

          <Card title="Modo de apariencia">
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Selecciona entre modo claro u oscuro. Esta preferencia se guardará en el servidor para
                que puedas mantener la misma experiencia visual desde cualquier dispositivo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTema('claro');
                  }}

                  className={`border rounded-lg p-4 text-left transition-all duration-200 ${
                    tema === 'claro'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">Modo claro</span>
                    <span className="text-lg">🌤️</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Fondos claros, ideal para entornos bien iluminados y uso durante el día.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTema('oscuro');
                  }}

                  className={`border rounded-lg p-4 text-left transition-all duration-200 ${
                    tema === 'oscuro'
                      ? 'border-indigo-500 bg-gray-900 text-gray-100 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Modo oscuro</span>
                    <span className="text-lg">🌙</span>
                  </div>
                  <p className={`text-sm ${tema === 'oscuro' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Tonos oscuros que reducen el brillo de la pantalla, ideal para la noche.
                  </p>
                </button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  className="px-6"
                  onClick={guardarTema}
                >
                  Guardar cambios
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;