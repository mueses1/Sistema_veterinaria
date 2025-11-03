import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/ui/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Swal from 'sweetalert2';

const Configuracion = () => {
  const user = useAuthStore((state) => state.user);
  
  // Estados para diferentes secciones de configuraci贸n
  const [clinicaConfig, setClinicaConfig] = useState({
    nombre: 'VetClinic Pro',
    direccion: 'Av. Principal 123, Ciudad',
    telefono: '(555) 123-4567',
    email: 'info@vetclinic.com',
    horarioApertura: '08:00',
    horarioCierre: '18:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  });

  const [notificacionesConfig, setNotificacionesConfig] = useState({
    emailNuevoPaciente: true,
    emailNuevaCita: true,
    recordatoriosCitas: true,
    reportesDiarios: false,
    alertasVacunacion: true
  });

  const [sistemaConfig, setSistemaConfig] = useState({
    tema: 'claro',
    idioma: 'es',
    formatoFecha: 'dd/mm/yyyy',
    formatoHora: '24h',
    autoguardado: true,
    backupAutomatico: true
  });

  const [seguridadConfig, setSeguridadConfig] = useState({
    sesionExpira: '8',
    requiereCambioPassword: false,
    autenticacionDosFactor: false,
    logActividades: true
  });

  // Cargar configuraci贸n desde localStorage
  useEffect(() => {
    const savedClinica = localStorage.getItem('clinicaConfig');
    const savedNotificaciones = localStorage.getItem('notificacionesConfig');
    const savedSistema = localStorage.getItem('sistemaConfig');
    const savedSeguridad = localStorage.getItem('seguridadConfig');

    if (savedClinica) setClinicaConfig(JSON.parse(savedClinica));
    if (savedNotificaciones) setNotificacionesConfig(JSON.parse(savedNotificaciones));
    if (savedSistema) setSistemaConfig(JSON.parse(savedSistema));
    if (savedSeguridad) setSeguridadConfig(JSON.parse(savedSeguridad));
  }, []);

  // Guardar configuraci贸n
  const guardarConfiguracion = (tipo, config) => {
    localStorage.setItem(`${tipo}Config`, JSON.stringify(config));
    
    Swal.fire({
      title: 'Configuraci贸n guardada',
      text: 'Los cambios se han aplicado correctamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Exportar configuraci贸n
  const exportarConfiguracion = () => {
    const configuracionCompleta = {
      clinica: clinicaConfig,
      notificaciones: notificacionesConfig,
      sistema: sistemaConfig,
      seguridad: seguridadConfig,
      exportadoEn: new Date().toISOString(),
      usuario: user?.nombre
    };

    const dataStr = JSON.stringify(configuracionCompleta, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `configuracion-vetclinic-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Resetear configuraci贸n
  const resetearConfiguracion = () => {
    Swal.fire({
      title: '驴Resetear configuraci贸n?',
      text: 'Esto restaurar谩 todas las configuraciones a sus valores por defecto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'S铆, resetear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar localStorage
        localStorage.removeItem('clinicaConfig');
        localStorage.removeItem('notificacionesConfig');
        localStorage.removeItem('sistemaConfig');
        localStorage.removeItem('seguridadConfig');
        
        // Resetear estados
        setClinicaConfig({
          nombre: 'VetClinic Pro',
          direccion: 'Av. Principal 123, Ciudad',
          telefono: '(555) 123-4567',
          email: 'info@vetclinic.com',
          horarioApertura: '08:00',
          horarioCierre: '18:00',
          diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
        });
        
        setNotificacionesConfig({
          emailNuevoPaciente: true,
          emailNuevaCita: true,
          recordatoriosCitas: true,
          reportesDiarios: false,
          alertasVacunacion: true
        });
        
        setSistemaConfig({
          tema: 'claro',
          idioma: 'es',
          formatoFecha: 'dd/mm/yyyy',
          formatoHora: '24h',
          autoguardado: true,
          backupAutomatico: true
        });
        
        setSeguridadConfig({
          sesionExpira: '8',
          requiereCambioPassword: false,
          autenticacionDosFactor: false,
          logActividades: true
        });

        Swal.fire('Configuraci贸n reseteada', 'Todas las configuraciones han sido restauradas', 'success');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Configuraci贸n</h1>
              <p className="text-gray-600 mt-2">
                Personaliza el sistema seg煤n tus necesidades
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={exportarConfiguracion}
              >
                馃摜 Exportar
              </Button>
              <Button
                variant="danger"
                onClick={resetearConfiguracion}
              >
                馃攧 Resetear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuraci贸n de la Cl铆nica */}
            <Card title="馃彞 Informaci贸n de la Cl铆nica">
              <div className="space-y-4">
                <Input
                  label="Nombre de la Cl铆nica"
                  value={clinicaConfig.nombre}
                  onChange={(e) => setClinicaConfig({...clinicaConfig, nombre: e.target.value})}
                />
                <Input
                  label="Direcci贸n"
                  value={clinicaConfig.direccion}
                  onChange={(e) => setClinicaConfig({...clinicaConfig, direccion: e.target.value})}
                />
                <Input
                  label="Tel茅fono"
                  value={clinicaConfig.telefono}
                  onChange={(e) => setClinicaConfig({...clinicaConfig, telefono: e.target.value})}
                />
                <Input
                  label="Email"
                  type="email"
                  value={clinicaConfig.email}
                  onChange={(e) => setClinicaConfig({...clinicaConfig, email: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Hora de Apertura"
                    type="time"
                    value={clinicaConfig.horarioApertura}
                    onChange={(e) => setClinicaConfig({...clinicaConfig, horarioApertura: e.target.value})}
                  />
                  <Input
                    label="Hora de Cierre"
                    type="time"
                    value={clinicaConfig.horarioCierre}
                    onChange={(e) => setClinicaConfig({...clinicaConfig, horarioCierre: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">
                    D铆as Laborales
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                      <label key={dia} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={clinicaConfig.diasLaborales.includes(dia)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClinicaConfig({
                                ...clinicaConfig,
                                diasLaborales: [...clinicaConfig.diasLaborales, dia]
                              });
                            } else {
                              setClinicaConfig({
                                ...clinicaConfig,
                                diasLaborales: clinicaConfig.diasLaborales.filter(d => d !== dia)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="capitalize text-sm">{dia}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => guardarConfiguracion('clinica', clinicaConfig)}
                >
                  馃捑 Guardar Informaci贸n de Cl铆nica
                </Button>
              </div>
            </Card>

            {/* Configuraci贸n de Notificaciones */}
            <Card title="馃敂 Notificaciones">
              <div className="space-y-4">
                {[
                  { key: 'emailNuevoPaciente', label: 'Email al registrar nuevo paciente', icon: '馃摟' },
                  { key: 'emailNuevaCita', label: 'Email al programar nueva cita', icon: '馃搮' },
                  { key: 'recordatoriosCitas', label: 'Recordatorios de citas', icon: '鈴�' },
                  { key: 'reportesDiarios', label: 'Reportes diarios autom谩ticos', icon: '馃搳' },
                  { key: 'alertasVacunacion', label: 'Alertas de vacunaci贸n', icon: '馃拤' }
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificacionesConfig[item.key]}
                      onChange={(e) => setNotificacionesConfig({
                        ...notificacionesConfig,
                        [item.key]: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => guardarConfiguracion('notificaciones', notificacionesConfig)}
                >
                  馃捑 Guardar Notificaciones
                </Button>
              </div>
            </Card>

            {/* Configuraci贸n del Sistema */}
            <Card title="鈿欙笍 Sistema">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">Tema</label>
                  <select
                    value={sistemaConfig.tema}
                    onChange={(e) => setSistemaConfig({...sistemaConfig, tema: e.target.value})}
                    className="border-2 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="claro">馃尀 Claro</option>
                    <option value="oscuro">馃寵 Oscuro</option>
                    <option value="auto">馃攧 Autom谩tico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">Idioma</label>
                  <select
                    value={sistemaConfig.idioma}
                    onChange={(e) => setSistemaConfig({...sistemaConfig, idioma: e.target.value})}
                    className="border-2 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="es">馃嚜馃嚫 Espa帽ol</option>
                    <option value="en">馃嚭馃嚫 English</option>
                    <option value="pt">馃嚙馃嚪 Portugu锚s</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">Formato de Fecha</label>
                  <select
                    value={sistemaConfig.formatoFecha}
                    onChange={(e) => setSistemaConfig({...sistemaConfig, formatoFecha: e.target.value})}
                    className="border-2 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">Formato de Hora</label>
                  <select
                    value={sistemaConfig.formatoHora}
                    onChange={(e) => setSistemaConfig({...sistemaConfig, formatoHora: e.target.value})}
                    className="border-2 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="24h">24 Horas (14:30)</option>
                    <option value="12h">12 Horas (2:30 PM)</option>
                  </select>
                </div>

                {[
                  { key: 'autoguardado', label: 'Autoguardado autom谩tico', icon: '馃捑' },
                  { key: 'backupAutomatico', label: 'Backup autom谩tico diario', icon: '馃攧' }
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={sistemaConfig[item.key]}
                      onChange={(e) => setSistemaConfig({
                        ...sistemaConfig,
                        [item.key]: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => guardarConfiguracion('sistema', sistemaConfig)}
                >
                  馃捑 Guardar Sistema
                </Button>
              </div>
            </Card>

            {/* Configuraci贸n de Seguridad */}
            <Card title="馃敀 Seguridad">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 uppercase font-bold mb-2">
                    Expiraci贸n de Sesi贸n (horas)
                  </label>
                  <select
                    value={seguridadConfig.sesionExpira}
                    onChange={(e) => setSeguridadConfig({...seguridadConfig, sesionExpira: e.target.value})}
                    className="border-2 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 hora</option>
                    <option value="4">4 horas</option>
                    <option value="8">8 horas</option>
                    <option value="24">24 horas</option>
                    <option value="never">Nunca</option>
                  </select>
                </div>

                {[
                  { key: 'requiereCambioPassword', label: 'Requerir cambio de contrase帽a cada 90 d铆as', icon: '馃攽' },
                  { key: 'autenticacionDosFactor', label: 'Autenticaci贸n de dos factores', icon: '馃洝锔�' },
                  { key: 'logActividades', label: 'Registrar log de actividades', icon: '馃摑' }
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={seguridadConfig[item.key]}
                      onChange={(e) => setSeguridadConfig({
                        ...seguridadConfig,
                        [item.key]: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => guardarConfiguracion('seguridad', seguridadConfig)}
                >
                  馃捑 Guardar Seguridad
                </Button>
              </div>
            </Card>
          </div>

          {/* Informaci贸n del sistema */}
          <Card title="鈩癸笍 Informaci贸n del Sistema" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-bold text-gray-800">Versi贸n</h4>
                <p className="text-blue-600">v1.0.0</p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-800">脷ltima Actualizaci贸n</h4>
                <p className="text-green-600">23/10/2025</p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-gray-800">Usuario Actual</h4>
                <p className="text-purple-600">{user?.nombre}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;