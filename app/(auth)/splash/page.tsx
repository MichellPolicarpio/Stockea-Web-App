'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const LOADING_STEPS = [
  { message: 'Inicializando motor...', delay: 0 },
  { message: 'Verificando credenciales...', delay: 1200 },
  { message: 'Sincronizando inventario...', delay: 2500 },
  { message: 'Optimizando recursos...', delay: 3800 },
]

export default function SplashPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const { user } = useAuth()
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    // Animación inicial del logo
    setTimeout(() => setShowLogo(true), 100)

    // Si no hay usuario, enviar a login tras la intro
    if (!user) {
      const timer = setTimeout(() => router.push('/login'), 2500)
      return () => clearTimeout(timer)
    }

    // Secuencia de pasos de carga
    const stepIntervals = LOADING_STEPS.map((step, index) => {
      return setTimeout(() => {
        setCurrentStep(index)
      }, step.delay)
    })

    // Redirección final al dashboard
    const finalRedirect = setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 5200)

    return () => {
      stepIntervals.forEach(clearTimeout)
      clearTimeout(finalRedirect)
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center overflow-hidden z-[100]">

      {/* Background sutil con patrón de puntos */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      <div className="relative z-10 flex flex-col items-center">

        {/* LOGO ANIMATION CONTAINER */}
        <div className="flex items-center gap-4 mb-20">
          {/* Isotipo: Cuadrado negro que gira y se transforma */}
          <div className={`w-12 h-12 bg-black flex items-center justify-center transition-all duration-1000 ease-out ${showLogo ? 'rotate-0 opacity-100 scale-100' : 'rotate-45 opacity-0 scale-50'}`}>
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M4 4h16v16H4z" className="animate-[dash_2s_ease-in-out_infinite]" />
              <path d="M16 8l-8 8M8 8l8 8" className={`${showLogo ? 'opacity-100 delay-500 duration-500 transition-opacity' : 'opacity-0'}`} />
            </svg>
          </div>

          {/* Logotipo Animado (Video) */}
          <div className={`h-16 flex items-center transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            <video
              autoPlay
              muted
              playsInline
              className="h-full w-auto object-contain"
            >
              <source src="/videos/StockeaLetrasAnimadas.mov" type="video/quicktime" />
              <source src="/videos/StockeaLetrasAnimadas.mov" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* LOADING INDICATOR & STATUS */}
        <div className="w-64 space-y-4">
          {/* Barra de progreso ultra-minimalista */}
          <div className="h-1 w-full bg-slate-100 overflow-hidden relative">
            <div className="absolute inset-0 bg-black animate-[loading_2.5s_ease-in-out_infinite]" />
          </div>

          {/* Mensajes de estado dinámicos */}
          <div className="h-6 flex justify-between items-center text-xs font-mono uppercase tracking-wider text-slate-500">
            <span className="animate-pulse">&gt; {LOADING_STEPS[currentStep]?.message}</span>
            <span>{Math.min((currentStep + 1) * 25, 100)}%</span>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[10px] text-slate-400 font-mono tracking-widest uppercase opacity-60">
        Powered by Stockea OS
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `}</style>
    </div>
  )
}
