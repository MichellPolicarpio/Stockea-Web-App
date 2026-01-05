"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import {
  Menu, X, Check, ArrowRight, LayoutDashboard, ShieldCheck,
  Smartphone, Zap, BarChart3, Users, Building, Home, FileText,
  AlertTriangle, Lock, Globe
} from "lucide-react"

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Desplazamiento suave para los anclajes
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Si el usuario quiere hacer login, mostramos la pantalla original (RESTORED ORIGINAL STYLE)
  if (showLogin) {
    return (
      <div className="min-h-screen w-full flex bg-white animate-in fade-in duration-500">

        {/* Botón flotante para volver a la Landing */}
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-md transition-all text-sm font-medium lg:text-slate-500 lg:bg-transparent lg:hover:bg-slate-100 lg:hover:text-slate-900"
        >
          ← Volver al inicio
        </button>

        {/* Columna Izquierda: Visual Corporativo (Solo Desktop) - RESTORED SLATE-900 STYLE */}
        <div className="hidden lg:block relative w-[60%] bg-slate-900 overflow-hidden">
          {/* Fondo base */}
          <div className="absolute inset-0 bg-black" />

          {/* Patrón Grid Sutil */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}>
          </div>

          {/* Gradiente ambiental - Azul Profesional */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900/40 to-black" />

          {/* Orbes Decorativos Abstractos */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-800/10 rounded-full blur-[120px]" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-20 z-10">
            <div className="max-w-xl space-y-6 text-center">

              {/* Logo Principal Grandes */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-2 p-4">
                <img src="/Logo_Stockea.png" alt="Stockea Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-center h-16">
                  <img src="/Stockea_Font.png" alt="Stockea Text" className="h-full w-auto object-contain brightness-0 invert" />
                </div>
                <p className="text-xl text-slate-400 font-light tracking-wide">
                  Audita tu mueble. Cuida tu inversión.
                </p>
              </div>

              <blockquote className="text-2xl font-medium text-white/90 leading-relaxed border-t border-white/10 pt-10">
                "Gestión inteligente de activos y gastos de mantenimiento"
              </blockquote>

              {/* Card de Credenciales para Demo */}
              <div className="mt-12 w-full bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 text-left">
                <h3 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Demo Access
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm font-mono text-slate-300">
                  <div className="flex justify-between px-3 py-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <span>Admin</span>
                    <span className="text-white group-hover:text-blue-200">admin / admin123</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <span>Owner</span>
                    <span className="text-white group-hover:text-blue-200">juan.perez / owner123</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <span>Verifier</span>
                    <span className="text-white group-hover:text-blue-200">carlos.rodriguez / verifier123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-slate-50 lg:bg-white z-10">
          <div className="w-full max-w-[420px] mx-auto mt-24 sm:mt-10">
            {/* Header Móvil */}
            <div className="lg:hidden mb-10 flex flex-col items-center">
              <div className="h-14 w-14 flex items-center justify-center mb-4">
                <img src="/Logo_Stockea.png" alt="Stockea Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex justify-center h-12 mb-2">
                <img src="/Stockea_Font.png" alt="Stockea Text" className="h-full w-auto object-contain" />
              </div>
              <p className="text-slate-500 font-medium text-sm mt-1 tracking-wide">
                Tu inventario, bajo control.
              </p>
            </div>

            <LoginForm />

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center text-xs text-slate-400 gap-6">
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Privacidad</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Términos</span>
              <span className="text-slate-300">|</span>
              <span>Stockea OS v1.2</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- LANDING PAGE ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#041442] selection:text-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/Logo_Stockea.png" alt="Logo" className="h-10 w-10 object-contain" />
            <span className="font-bold text-xl tracking-tight text-[#041442]">Stockea.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#041442] transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-[#041442] transition-colors">Beneficios</button>
            <button onClick={() => scrollToSection('roles')} className="hover:text-[#041442] transition-colors">Para quién es</button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-[#041442] text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:brightness-110 transition-all transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('features')} className="text-left py-2 font-medium text-slate-600">Funcionalidades</button>
            <button onClick={() => scrollToSection('benefits')} className="text-left py-2 font-medium text-slate-600">Beneficios</button>
            <button onClick={() => scrollToSection('roles')} className="text-left py-2 font-medium text-slate-600">Roles</button>
            <button
              onClick={() => setShowLogin(true)}
              className="mt-2 w-full bg-[#041442] text-white py-3 rounded-lg font-bold"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </nav>

      <main className="pt-20">

        {/* HERO SECTION */}
        <section className="relative pt-12 pb-4 lg:pt-8 lg:pb-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Texto Hero */}
            <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-700">
              <div className="hidden lg:inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#041442] text-xs lg:text-sm font-semibold tracking-wide mb-2 lg:mb-4 border border-blue-100">
                🚀 La nueva era de la gestión inmobiliaria
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#041442] leading-[1.1]">
                Stockea: Control Total de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Inventario Inmobiliario</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                Gestiona el inventario de tus propiedades con tecnología profesional. Desde un departamento Airbnb hasta una cadena hotelera completa.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-[#041442] text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-base lg:text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Solicitar Demo Gratuita <ArrowRight className="h-5 w-5" />
                </button>
                <button className="px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-base lg:text-lg text-[#041442] bg-blue-50 hover:bg-blue-100 transition-all border border-blue-200">
                  Ver Video Demostración
                </button>
              </div>
            </div>

            {/* Imagen Hero */}
            <div className="relative animate-in slide-in-from-right-5 fade-in duration-1000 delay-200 flex justify-center">
              <div className="relative w-full max-w-lg lg:max-w-xl">
                {/* (Removed pulse background) */}
                <img
                  src="/GerenteSonrienteTablet.png"
                  alt="Gerente gestionando inventario"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Separator / Espacio en blanco (Antes Social Proof) */}
        <div className="h-24 w-full bg-slate-50/30 border-y border-slate-100/50"></div>

        {/* PROBLEMA / SOLUCIÓN */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-[#041442] mb-6">¿Cansado del caos en tu inventario?</h2>
              <p className="text-xl text-slate-600">Stockea elimina los dolores de cabeza operativos con un sistema centralizado.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Imagen Antes/Después */}
              <div className="order-2 lg:order-1 relative flex items-center justify-center overflow-hidden">
                <img
                  src="/AntesyDespues.png"
                  alt="Antes vs Después de usar Stockea"
                  className="w-full h-auto object-contain max-h-[400px]"
                />
              </div>

              {/* Lista de Problemas */}
              <div className="order-1 lg:order-2 space-y-6">
                {[
                  "Planillas de Excel interminables y desactualizadas",
                  "Pérdida de objetos valiosos sin registro",
                  "Inspecciones manuales que toman horas y generan errores",
                  "Falta de control centralizado entre múltiples propiedades"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0">
                      <X className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-medium text-slate-700">{item}</p>
                  </div>
                ))}

                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-emerald-800 font-bold text-lg flex items-center gap-2">
                    <Check className="h-6 w-6" />
                    Solución: De caos a control en minutos con Stockea.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 space-y-24">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Todo lo que necesitas en un solo lugar</h2>
              <p className="text-xl text-slate-400">Plataforma integral diseñada para la operación hotelera real.</p>
            </div>

            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold">Dashboard Inteligente</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Visualiza en tiempo real la salud de tu inventario. Identifica artículos dañados, porcentajes de ocupación y métricas clave de un vistazo, sin tener que bucear en datos.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/DashboardConGraficas.png"
                  alt="Dashboard Inteligente con Gráficas"
                  className="w-full h-auto object-contain max-h-[350px]"
                />
              </div>
            </div>

            {/* Feature 2 (Reverse) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="h-12 w-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold">Gestión Multinivel</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Organiza desde edificios completos hasta habitaciones individuales. Crea jerarquías lógicas: Edificio → Piso → Departamento → Áreas → Objetos.
                </p>
              </div>
              <div className="lg:order-1 flex flex-col items-center justify-center">
                <img
                  src="/EstructuraDeArbol.png"
                  alt="Estructura de Árbol Multinivel"
                  className="w-full h-auto object-contain max-h-[350px]"
                />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold">Inspecciones Digitales</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Tu equipo de campo realiza inspecciones con checklist inteligentes. Entrada y salida de huéspedes, mantenimiento preventivo, todo documentado profesionalmente desde una tablet o móvil.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/VerificadorConTablet.png"
                  alt="Verificador realizando inspección"
                  className="w-full h-auto object-contain max-h-[350px]"
                />
              </div>
            </div>

            {/* Feature 4 (Reverse) */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold">Reportes Automáticos</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Genera reportes PDF detallados en segundos. Ideales para seguros, auditorías o históricos. Olvida el "copy-paste" manual.
                </p>
              </div>
              <div className="lg:order-1 flex flex-col items-center justify-center">
                <img
                  src="/ReportePDFGigante.png"
                  alt="Reporte PDF Automatizado"
                  className="w-full h-auto object-contain max-h-[350px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ROLES Y PERMISOS */}
        <section id="roles" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#041442] mb-4">Diseñado para equipos reales</h2>
              <p className="text-lg text-slate-600">Cada miembro de tu equipo tiene las herramientas exactas que necesita.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Rol Admin */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Administrador</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Control Total</p>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Gestiona todas las propiedades</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Crea usuarios y permisos</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Reportes financieros</li>
                </ul>
              </div>

              {/* Rol Owner */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">Popular</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-6">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Propietario</h3>
                <p className="text-sm font-bold text-[#041442] uppercase tracking-wide mb-4">Enfocado en Resultados</p>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-500" /> Vista de propiedades propias</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-500" /> Gestión de inventario</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-500" /> Alertas personalizadas</li>
                </ul>
              </div>

              {/* Rol Verificador */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center mb-6">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verificador</h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-4">Operativo en Campo</p>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Inspecciones rápidas móvil</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Actualiza estados y fotos</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Sincronización automática</li>
                </ul>
              </div>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
              <img
                src="/TresPersonajesInteractuando.png"
                alt="Roles del sistema interactuando"
                className="w-full h-auto object-contain max-h-[350px]"
              />
            </div>
          </div>
        </section>

        {/* CASOS DE USO */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#041442]">Perfecto para tu tipo de negocio</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 grayscale hover:grayscale-0 transition-all duration-500 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏨</div>
                <h3 className="font-bold text-xl mb-2">Hoteles Boutique</h3>
                <p className="text-slate-500 text-sm">Controla habitaciones y amenidades con estándares altos.</p>
              </div>
              <div className="text-center p-6 grayscale hover:grayscale-0 transition-all duration-500 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                <h3 className="font-bold text-xl mb-2">Gestores Airbnb</h3>
                <p className="text-slate-500 text-sm">Administra múltiples unidades dispersas fácilmente.</p>
              </div>
              <div className="text-center p-6 grayscale hover:grayscale-0 transition-all duration-500 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
                <h3 className="font-bold text-xl mb-2">Departamentos</h3>
                <p className="text-slate-500 text-sm">Control de inventario por unidad y mantenimiento.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <img
                src="/HotelCasaEdicioApartamentos.png"
                alt="Tipos de Propiedades: Hotel, Airbnb, Departamentos"
                className="w-full h-auto object-contain max-h-[350px]"
              />
            </div>
          </div>
        </section>

        {/* BENEFICIOS / TECNOLOGÍA */}
        <section id="benefits" className="py-24 bg-[#041442] text-white relative overflow-hidden">
          {/* Fondo abstracto */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">Potencia que impulsa tu crecimiento</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-xl">
                  <Zap className="h-8 w-8 text-yellow-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Tecnología Moderna</h4>
                  <p className="text-sm text-white/70">Next.js 14 y TypeScript. Rápido y seguro.</p>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-xl">
                  <LayoutDashboard className="h-8 w-8 text-cyan-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Interfaz Intuitiva</h4>
                  <p className="text-sm text-white/70">Tailwind CSS. Aprende en minutos.</p>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-purple-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Escalable</h4>
                  <p className="text-sm text-white/70">De 1 a 100+ propiedades sin fricción.</p>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-xl">
                  <Globe className="h-8 w-8 text-emerald-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Soporte Español</h4>
                  <p className="text-sm text-white/70">Pensado para LATAM.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <img
                src="/CoheteStockea.png"
                alt="Crecimiento exponencial con Stockea"
                className="w-full h-auto object-contain max-h-[400px] scale-[1.2]"
              />
            </div>
          </div>
        </section>

        {/* ACCESIBILIDAD Y SEGURIDAD */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 space-y-24">

            {/* Accesibilidad */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative min-h-[400px] w-full flex items-center justify-center p-8 group">
                {/* Background Blob decoration */}
                <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-3xl opacity-50 z-0 scale-75"></div>

                {/* MacBook (Base) */}
                <img
                  src="/Macbook_Dashboard.PNG"
                  alt="Desktop Dashboard"
                  className="relative w-[90%] md:w-[80%] z-10 drop-shadow-2xl transition-transform group-hover:scale-[1.02] duration-500"
                />

                {/* iPad (Left Overlay) */}
                <img
                  src="/iPadAcostada_Dashboard.png"
                  alt="Tablet Dashboard"
                  className="absolute bottom-8 left-0 md:-left-4 w-[40%] z-20 drop-shadow-xl rounded-xl border border-slate-200 bg-white transition-transform group-hover:-translate-x-2 duration-500"
                />

                {/* iPhone (Right Overlay) */}
                <img
                  src="/iPhone_Dashboard.png"
                  alt="Mobile Dashboard"
                  className="absolute bottom-4 right-2 md:right-12 w-[18%] z-30 drop-shadow-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 duration-500"
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-[#041442]">Gestiona desde cualquier lugar</h3>
                <p className="text-lg text-slate-600">Stockea funciona en computadoras, tablets y smartphones. Tu equipo accede desde la oficina, el café o en campo.</p>
              </div>
            </div>

            {/* Seguridad */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 flex flex-col items-center justify-center">
                <img
                  src="/BancoBoveda.PNG"
                  alt="Seguridad de alto nivel"
                  className="w-full h-auto object-contain max-h-[350px]"
                />
              </div>
              <div className="lg:order-1 space-y-6">
                <h3 className="text-3xl font-bold text-[#041442]">Tu información, siempre protegida</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><Lock className="h-5 w-5 text-[#041442]" /> Encriptación de datos en tránsito y reposo</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><Lock className="h-5 w-5 text-[#041442]" /> Control granular de permisos</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><Lock className="h-5 w-5 text-[#041442]" /> Respaldos automáticos diarios</li>
                </ul>
              </div>
            </div>

            {/* Planes Placeholders - REMOVED */}

          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#041442]">Comienza a organizar tu inventario hoy</h2>
            <p className="text-xl text-slate-600">Únete a propietarios y administradores que ya confían en Stockea.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-[#041442] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Comenzar Ahora Gratuito
              </button>
              <button className="px-8 py-4 rounded-xl font-bold text-lg text-[#041442] bg-white border border-slate-200 hover:bg-slate-100 transition-all">
                Contactar Ventas
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Sin tarjeta para empezar</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Soporte en español</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Configuración asistida</span>
            </div>

            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
              <img
                src="/GrupoDiversoFestejando.png"
                alt="Equipo celebrando con éxito gestionando su inventario"
                className="w-full h-auto object-contain max-h-[350px]"
              />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#041442] text-slate-300 py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Guías</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>michellpolicarpio@gmail.com</li>
                <li>olwerowski@gmail.com</li>
                <li>+52 229 136 0054</li>
                <li>+52 229 221 3818</li>
                <li>📍 Veracruz, México</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-slate-500">
            © 2026 Stockea. Todos los derechos reservados.
          </div>
        </footer>

      </main>
    </div>
  )
}
