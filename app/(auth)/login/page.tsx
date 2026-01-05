"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-white">

      {/* Columna Izquierda: Visual Corporativo (Solo Desktop) */}
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
              "Audita tu mueble, cuida tu inversión."
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

      {/* Columna Derecha: Formulario Sliding */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-slate-50 lg:bg-white z-10 transition-colors duration-500">
        <div className="w-full max-w-[420px] mx-auto mt-24 sm:mt-32">
          {/* Header Móvil */}
          <div className="lg:hidden mb-10 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
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

          {/* Componente del Formulario con Sliding Logic */}
          <LoginForm />

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center text-xs text-slate-400 gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
            <span className="text-slate-300">|</span>
            <span>Stockea OS v1.2</span>
          </div>
        </div>
      </div>

    </div>
  )
}
