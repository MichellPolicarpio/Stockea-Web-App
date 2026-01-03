'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User as UserIcon, Menu, Bell, Search, Settings, HelpCircle, Users, LayoutDashboard, FileText, Building2, Calendar, ClipboardList } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { LucideIcon } from 'lucide-react'

interface DashboardHeaderProps {
    sidebarCollapsed: boolean
    onToggleSidebar?: () => void
}

export function Header({ sidebarCollapsed, onToggleSidebar }: DashboardHeaderProps) {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

    if (!user) return null

    // Título simple basado en la página actual
    const getPageTitle = () => {
        if (pathname === '/') return (
            <div className="flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>Panel</span>
            </div>
        )
        if (pathname.startsWith('/buildings')) return (
            <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span className="md:hidden">Edificios</span>
                <span className="hidden md:inline">Gestión de Edificios</span>
            </div>
        )
        if (pathname.startsWith('/users')) return (
            <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>Usuarios</span>
            </div>
        )
        if (pathname.startsWith('/reports')) return (
            <div className="flex items-center gap-2">
                <Calendar className="hidden md:block h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>Programación</span>
            </div>
        )
        if (pathname.startsWith('/settings')) return (
            <div className="flex items-center gap-2">
                <Settings className="hidden md:block h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>Configuración</span>
            </div>
        )
        if (pathname.startsWith('/profile')) return 'Mi Perfil'
        if (pathname.startsWith('/help')) return (
            <div className="flex items-center gap-2">
                <HelpCircle className="h-8 w-8 text-[#0D94B1]" />
                <span>Ayuda</span>
            </div>
        )
        if (pathname.startsWith('/apartments')) return (
            <div className="flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>{user.role === 'owner' ? 'Mis Propiedades' : 'Asignaciones'}</span>
            </div>
        )
        return 'Panel'
    }

    const title = getPageTitle()

    const handleLogout = () => {
        setIsLoggingOut(true)
        setTimeout(() => {
            logout()
            // Router push is handled by auth context usually, but we keep it safe
            router.push('/login')
            router.refresh()
        }, 1500)
    }

    // Iniciales para el avatar
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <>
            {/* LOGOUT SPLASH SCREEN */}
            {isLoggingOut && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="bg-slate-900 dark:bg-white p-4 rounded-2xl mb-6 shadow-2xl">
                            <svg className="w-12 h-12 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M4 4h16v16H4z" />
                                <path d="M10 10l4 4" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Stokea<span className="text-blue-600">.</span></h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Cerrando sesión...</p>
                    </div>
                </div>
            )}

            <header
                className={`fixed top-0 right-0 h-[100px] z-40 transition-all duration-300 left-0 ${sidebarCollapsed ? "md:left-20" : "md:left-64"} flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md support-[backdrop-filter]:bg-white/60`}
            >
                <div className="w-full flex flex-col justify-end px-8 h-full gap-6 pb-1">

                    {/* ROW 1: Title and Controls */}
                    <div className="flex items-center justify-between w-full">

                        {/* LEFT: Title */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Toggle */}
                            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden text-slate-900 dark:text-white">
                                <Menu className="h-6 w-6" />
                            </Button>

                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {title}
                            </h1>
                        </div>

                        {/* RIGHT: Search, Notifications, Profile */}
                        <div className="flex items-center gap-6">

                            {/* Search Input (Minimalist) */}
                            <div className="hidden md:flex items-center relative">
                                <Search className="h-4 w-4 text-slate-400 absolute left-3" />
                                <Input
                                    placeholder="Search"
                                    className="pl-9 h-10 w-64 border-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-950 dark:text-white transition-colors placeholder:text-slate-400"
                                />
                            </div>

                            {/* Notification Center */}
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-full h-10 w-10">
                                        <Bell className="h-5 w-5" strokeWidth={1.5} />
                                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-950 pointer-events-none" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 mt-2 bg-white dark:bg-slate-950">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Notificaciones</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">Marcar leídas</span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        <DropdownMenuItem className="flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">Nueva inspección asignada</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Se te ha asignado la inspección del Edificio Altavista, Depto 402.</p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1">Hace 2 min</span>
                                            </div>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <div className="h-8 w-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">Reporte Pendiente</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">El reporte mensual de mantenimiento requiere tu aprobación.</p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1">Hace 1 hora</span>
                                            </div>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className="flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-900 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                            <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">Sincronización completa</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Los datos del offline se han subido correctamente.</p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1">Hace 3 horas</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                    <div className="p-2 border-t border-slate-50 dark:border-slate-800 text-center">
                                        <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 dark:text-slate-400 h-8 font-normal hover:text-slate-900 dark:hover:text-white">
                                            Ver todas las notificaciones
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Profile Avatar */}
                            <DropdownMenu
                                modal={false}
                                open={isMenuOpen}
                                onOpenChange={setIsMenuOpen}
                            >
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-full h-10 w-10 p-0 border border-slate-200 dark:border-slate-700">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
                                            <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">{initials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                    <DropdownMenuItem className="text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-900" onClick={() => router.push('/profile')}>Perfil</DropdownMenuItem>
                                    <DropdownMenuItem className="text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-900" onClick={() => router.push('/settings')}>Configuración</DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </div>

                    {/* ROW 2: The Full Width Line */}
                    <div className="h-[2px] w-full bg-black dark:bg-slate-700 rounded-full block opacity-90 transition-all" />

                </div>
            </header>
        </>
    )
}
