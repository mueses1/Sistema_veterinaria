# Sistema de Veterinaria - VetClinic Pro

## 👥 Equipo de Desarrollo

**Proyecto desarrollado colaborativamente por:**
- **Dev Nicolas Mueses** - Arquitectura, Autenticación y Componentes Base
- **Dev Ilian Gonzalez** - Funcionalidades Principales y UI Avanzada

## 📋 Descripción

Sistema integral de gestión veterinaria desarrollado con React, React Router DOM y componentes reutilizables. Incluye autenticación completa, gestión de pacientes, sistema de citas, perfiles de usuario y configuraciones avanzadas.

## 🚀 Características Implementadas

### ✅ Seis Pantallas/Rutas Funcionales

1. **`/login`** - Sistema de autenticación con validación
2. **`/dashboard`** - Panel principal con estadísticas en tiempo real
3. **`/pacientes`** - Gestión completa de pacientes con grid responsive
4. **`/citas`** - Sistema avanzado de programación y gestión de citas
5. **`/perfil`** - Página de perfil personal y profesional
6. **`/configuracion`** - Configuraciones completas del sistema

### ✅ Componentes Reutilizables y Escalables

1. **`Button`** - Botón con múltiples variantes y tamaños
2. **`Input`** - Campo de entrada con validación avanzada
3. **`Card`** - Contenedor flexible con múltiples configuraciones
4. **`Modal`** - Ventana modal con efectos modernos
5. **`Navbar`** - Barra de navegación con diseño glassmorphism

### ✅ Gestión de Estado Avanzada

- **`useState`** - Estados locales optimizados
- **`useContext`** - Context API para autenticación global
- **`localStorage`** - Persistencia completa de datos
- **Estado reactivo** - Actualizaciones en tiempo real

## 🛠️ Tecnologías Utilizadas

- React 
- React 
- Tailwind CSS
- SweetAlert2
- Vite

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx          # Componente botón reutilizable
│   │   ├── Input.jsx           # Componente input reutilizable
│   │   ├── Card.jsx            # Componente card reutilizable
│   │   ├── Modal.jsx           # Componente modal reutilizable
│   │   └── Navbar.jsx          # Componente navbar reutilizable
│   ├── Formulario.jsx          # Formulario de pacientes
│   ├── ListadoPacientes.jsx    # Lista de pacientes
│   ├── Paciente.jsx            # Componente individual de paciente
│   └── ProtectedRoute.jsx      # Componente de rutas protegidas
├── context/
│   └── AuthContext.jsx         # Context para autenticación
├── pages/
│   ├── Login.jsx               # Página de login
│   ├── Dashboard.jsx           # Página principal
│   ├── Pacientes.jsx           # Página de gestión de pacientes
│   └── Citas.jsx               # Página de gestión de citas
└── App.jsx                     # Componente principal con rutas
```

## 🔐 Sistema de Autenticación

- **Login simulado** con validación de formulario
- **Context API** para manejo global del estado de autenticación
- **Rutas protegidas** que redirigen al login si no está autenticado
- **Credenciales de prueba**: cualquier email válido + contraseña de 6+ caracteres

## 📊 Funcionalidades

### Dashboard

- Estadísticas en tiempo real
- Resumen de pacientes y citas
- Acciones rápidas
- Actividad reciente

### Gestión de Pacientes

- CRUD completo de pacientes
- Búsqueda en tiempo real
- Estadísticas de pacientes
- Modal para agregar/editar

### Sistema de Citas

- Programación de citas
- Estados de citas (pendiente, completada, cancelada, en proceso)
- Vinculación con pacientes existentes
- Estadísticas por estado

## 🎨 Componentes Reutilizables

### Button

```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Texto del botón
</Button>
```

### Input

```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errorMessage}
  required
/>
```

### Card

```jsx
<Card title="Título de la tarjeta" className="custom-class">
  Contenido de la tarjeta
</Card>
```

### Modal

```jsx
<Modal isOpen={showModal} onClose={closeModal} title="Título">
  Contenido del modal
</Modal>
```

## 🚀 Instalación y Uso

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**

   ```bash
   npm run dev
   ```

3. **Acceder a la aplicación:**
   - URL: http://localhost:5174
   - Credenciales: cualquier email válido + contraseña 6+ caracteres

## 🔄 Flujo de Datos

1. **AuthContext** maneja el estado global de autenticación
2. **localStorage** persiste datos de pacientes y citas
3. **useState** maneja estados locales de formularios y modales
4. **Props** pasan datos entre componentes padre e hijo

## 📱 Responsive Design

- Diseño completamente responsive con Tailwind CSS
- Adaptable a dispositivos móviles, tablets y desktop
- Grid system flexible para diferentes tamaños de pantalla

## 🎯 Próximas Mejoras

- Integración con API backend
- Autenticación real con JWT
- Notificaciones push
- Reportes y gráficos
- Sistema de roles y permisos

## 👨‍💻 División del Trabajo

### Developer A - Arquitectura y Autenticación
**Responsabilidades:**
- ✅ Configuración inicial del proyecto y dependencias
- ✅ Sistema de autenticación completo (AuthContext)
- ✅ Componentes UI base reutilizables (Button, Input, Card)
- ✅ Configuración de React Router y rutas protegidas
- ✅ Página de Login con validaciones
- ✅ Componente ProtectedRoute para seguridad

**Archivos principales:**
```
src/context/AuthContext.jsx
src/components/ui/Button.jsx
src/components/ui/Input.jsx
src/components/ui/Card.jsx
src/components/ProtectedRoute.jsx
src/pages/Login.jsx
```

### Developer B - Funcionalidades y UI Avanzada
**Responsabilidades:**
- ✅ Dashboard con estadísticas y actividades recientes
- ✅ Sistema completo de gestión de pacientes
- ✅ Gestión avanzada de citas con estados
- ✅ Componentes UI avanzados (Modal, Navbar moderno)
- ✅ Páginas de perfil y configuración
- ✅ Integración de funcionalidades existentes

**Archivos principales:**
```
src/pages/Dashboard.jsx
src/pages/Pacientes.jsx
src/pages/Citas.jsx
src/pages/Perfil.jsx
src/pages/Configuracion.jsx
src/components/ui/Modal.jsx
src/components/ui/Navbar.jsx
```
