import { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Swal from 'sweetalert2';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  licencia: string;
  direccion: string;
  biografia: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  licencia?: string;
  direccion?: string;
  biografia?: string;
}

const Perfil = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    especialidad: user?.especialidad || '',
    licencia: user?.licencia || '',
    direccion: user?.direccion || '',
    biografia: user?.biografia || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Actualizar el usuario en el contexto
      const updatedUser = {
        ...user,
        ...formData,
        id: user?.id || '',
        name: formData.nombre
      };
      
      login(updatedUser);
      setIsEditing(false);
      
      Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tu información se ha guardado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      especialidad: user?.especialidad || '',
      licencia: user?.licencia || '',
      direccion: user?.direccion || '',
      biografia: user?.biografia || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">
              Gestiona tu información personal y profesional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información básica */}
            <div className="lg:col-span-1">
              <Card title="Información Básica" className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{user?.nombre}</h3>
                  <p className="text-gray-600">{user?.rol || 'Veterinario'}</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-500">✅</span>
                    <span>Cuenta verificada</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-blue-500">🏥</span>
                    <span>Veterinario certificado</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-purple-500">⭐</span>
                    <span>Miembro desde 2024</span>
                  </div>
                </div>

                {!isEditing && (
                  <Button
                    variant="primary"
                    className="w-full mt-6"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Editar Perfil
                  </Button>
                )}
              </Card>

              {/* Estadísticas rápidas */}
              <Card title="Estadísticas" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pacientes atendidos</span>
                    <span className="font-bold text-blue-600">
                      {JSON.parse(localStorage.getItem('pacientes') || '[]').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Citas programadas</span>
                    <span className="font-bold text-green-600">
                      {JSON.parse(localStorage.getItem('citas') || '[]').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Años de experiencia</span>
                    <span className="font-bold text-purple-600">5+</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Formulario de perfil */}
            <div className="lg:col-span-2">
              <Card title={isEditing ? "Editar Información" : "Información Detallada"}>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información personal */}
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        👤 Información Personal
                      </h4>
                    </div>

                    <Input
                      label="Nombre Completo"
                      name="nombre"
                      placeholder="Ingresa tu nombre completo"
                      value={formData.nombre}
                      onChange={handleChange}
                      error={errors.nombre}
                      required
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    <Input
                      label="Teléfono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      error={errors.telefono}
                      placeholder="(555) 123-4567"
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    <Input
                      label="Dirección"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Calle, Ciudad, Estado"
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    {/* Información profesional */}
                    <div className="md:col-span-2 mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                        🏥 Información Profesional
                      </h4>
                    </div>

                    <Input
                      label="Especialidad"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      placeholder="Ej: Medicina General, Cirugía, Dermatología"
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    <Input
                      label="Número de Licencia"
                      name="licencia"
                      value={formData.licencia}
                      onChange={handleChange}
                      placeholder="Ej: VET-12345"
                      className={!isEditing ? 'bg-gray-50' : ''}
                      disabled={!isEditing}
                    />

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 uppercase font-bold mb-2">
                        Biografía Profesional
                      </label>
                      <textarea
                        name="biografia"
                        value={formData.biografia}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Cuéntanos sobre tu experiencia, formación y áreas de interés..."
                        className={`border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
                        }`}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  {isEditing && (
                    <div className="flex space-x-4 mt-8 pt-6 border-t">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                      >
                        💾 Guardar Cambios
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        ❌ Cancelar
                      </Button>
                    </div>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;