'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (!loading && !user && !isLoggingOut) {
      router.push('/login')
    }
  }, [user, loading, router, isLoggingOut])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      router.push('/login')
      router.refresh()
    }, 3000)
  }, [logout, router])

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center animate-pulse scale-100 lg:scale-125 transition-transform duration-500">
          <div className="bg-slate-900 dark:bg-white p-4 lg:p-6 rounded-2xl mb-14 lg:mb-16 shadow-2xl">
            <svg className="w-12 h-12 lg:w-16 lg:h-16 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M4 4h16v16H4z" />
              <path d="M10 10l4 4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="h-20 lg:h-32 mb-4 lg:mb-8 flex items-center justify-center">
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
          <p className="text-slate-500 dark:text-slate-400 font-medium lg:text-lg">Cerrando sesión...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Spinner className="h-8 w-8 text-slate-900 dark:text-white" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <div className="print:hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggleSidebar}
          onLogout={handleLogout}
        />
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />
      </div>
      <main
        className={`pt-[110px] md:pt-[130px] transition-all duration-300 min-h-screen flex flex-col print:m-0 print:p-0 print:pt-0 ${sidebarCollapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
          }`}
      >
        <div className="flex-1 px-8 pb-8 print:p-0">
          {children}
        </div>
      </main>
    </div>
  )
}
