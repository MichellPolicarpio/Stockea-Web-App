# Sistema de Inventarios

Aplicación web moderna para gestión de inventarios y verificaciones por edificios y departamentos, desarrollada con Next.js 14+, TypeScript y Tailwind CSS.

## Características

- 🔐 Autenticación simulada con roles (Admin, Propietario, Verificador)
- 🏢 Gestión de edificios y departamentos
- 📦 Sistema de inventario por departamento
- ✅ Formularios de inspección y verificación
- 👥 Gestión de usuarios y asignaciones
- 📊 Reportes y estadísticas
- 🎨 Interfaz moderna y responsive

## Roles del Sistema

### Administrador (Admin)
- Acceso completo al sistema
- Gestión de edificios y departamentos
- Gestión de usuarios (propietarios y verificadores)
- Asignación de departamentos
- Acceso a reportes y configuración

### Propietario (Owner)
- Acceso solo a sus departamentos asignados
- Gestión de inventario de sus departamentos
- Visualización de reportes
- Verificación de inspecciones realizadas

### Verificador (Verifier)
- Acceso a departamentos asignados para verificar
- Creación de formularios de inspección
- Historial de inspecciones realizadas
- Solo lectura del inventario

## Tecnologías

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

## Estructura del Proyecto

```
app/
├── (auth)/          # Rutas de autenticación
│   ├── login/       # Página de login
│   └── splash/      # Pantalla de carga
├── dashboard/        # Dashboard principal
│   ├── buildings/   # Gestión de edificios
│   ├── apartments/  # Gestión de departamentos
│   ├── users/       # Gestión de usuarios
│   ├── reports/    # Reportes
│   └── settings/   # Configuración
components/
├── ui/              # Componentes UI base
├── layout/          # Componentes de layout
├── inventory/       # Componentes de inventario
└── inspections/     # Componentes de inspección
services/            # Servicios mock
hooks/               # Hooks personalizados
types/               # Tipos TypeScript
mocks/               # Datos mock
lib/                 # Utilidades
```

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar en producción
npm start
```

## Uso

1. Accede a la aplicación en `http://localhost:3000`
2. Selecciona un rol en la página de login:
   - **Admin**: Acceso completo
   - **Owner**: Acceso a departamentos propios
   - **Verifier**: Acceso para crear inspecciones
3. Navega por el dashboard según tu rol

## Notas

- Todos los datos son simulados (mocks)
- No hay conexión a base de datos real
- La autenticación es simulada usando localStorage
- Los datos se resetean al recargar la página

## Próximos Pasos

- Integración con Supabase
- Autenticación real
- Persistencia de datos
- Funcionalidades adicionales según requerimientos


