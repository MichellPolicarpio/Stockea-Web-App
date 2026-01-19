'use client'

import * as React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
import { History as HistoryIcon, LogOut, User as UserIcon, Menu, Bell, Search, Settings, HelpCircle, Users, LayoutDashboard, FileText, Building2, Calendar, ClipboardList, Wrench, DollarSign, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { LucideIcon } from 'lucide-react'

interface DashboardHeaderProps {
    sidebarCollapsed: boolean
    onToggleSidebar?: () => void
    onLogout: () => void
}

export function Header({ sidebarCollapsed, onToggleSidebar, onLogout }: DashboardHeaderProps) {
    const { user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const searchParams = useSearchParams()

    // Calcular tab activo basado en URL
    const activeTab = React.useMemo(() => {
        if (pathname.includes('/inspections')) return 'maintenance'
        if (searchParams.get('view') === 'accounting') return 'accounting'
        return 'inventory'
    }, [pathname, searchParams])

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
                <span className="md:hidden text-lg truncate">Propiedades</span>
                <span className="hidden md:inline">Gestión de Propiedades</span>
            </div>
        )
        if (pathname.startsWith('/users')) return (
            <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span className="md:hidden">Usuarios</span>
                <span className="hidden md:inline">Gestión de Usuarios</span>
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
                <span className="md:hidden">Ayuda</span>
                <span className="hidden md:inline">Centro de Ayuda</span>
            </div>
        )
        if (pathname.startsWith('/apartments')) return (
            <span>{user.role === 'owner' ? 'Mis Propiedades' : 'Asignaciones'}</span>
        )
        if (pathname.startsWith('/inspections')) return (
            <div className="flex items-center gap-2">
                <HistoryIcon className="hidden md:block h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span>Historial</span>
            </div>
        )
        return 'Panel'
    }

    const title = getPageTitle()

    const handleLogout = () => {
        onLogout()
    }

    // Iniciales para el avatar
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <>
            <header
                className={`fixed top-0 right-0 h-[95px] z-40 transition-all duration-300 left-0 ${sidebarCollapsed ? "md:left-20" : "md:left-64"} flex items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md support-[backdrop-filter]:bg-white/60`}
            >
                <div className="w-full max-w-[99%] mx-auto flex flex-col justify-end px-4 h-full gap-6 ">

                    {/* ROW 1: Title and Controls */}
                    <div className="flex items-center justify-between w-full relative">

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

                        {/* CENTER: Mobile Dropdown Toggle (< XL) - ALIGNED RIGHT ON MOBILE - ONLY ON DASHBOARD */}
                        {pathname === '/' && (
                            <div className="absolute right-[88px] top-1/2 -translate-y-1/2 xl:hidden flex items-center z-50">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="rounded-full h-10 w-10 p-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                            {activeTab === 'inventory' && <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                            {activeTab === 'accounting' && <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                            {activeTab === 'maintenance' && <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center" className="w-[180px] p-1.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl">
                                        <DropdownMenuItem onClick={() => router.push('/?view=inventory')} className={`rounded-lg mb-1 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer ${activeTab === 'inventory' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span className="font-medium">Inventario</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push('/?view=accounting')} className={`rounded-lg mb-1 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer ${activeTab === 'accounting' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}>
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            <span className="font-medium">Contabilidad</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push('/inspections')} className={`rounded-lg focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer ${activeTab === 'maintenance' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}>
                                            <Wrench className="mr-2 h-4 w-4" />
                                            <span className="font-medium">Mantenimiento</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* CENTER: Main Navigation Toggle - ONLY ON DASHBOARD */}
                        {pathname === '/' && (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700 backdrop-blur-sm shadow-inner">
                                {/* Animated Background Pill */}
                                <div
                                    className="absolute top-1 bottom-1 left-1 w-32 bg-white dark:bg-slate-600 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                    style={{
                                        transform: `translateX(${activeTab === 'inventory' ? 0 : activeTab === 'accounting' ? '128px' : '256px'})`
                                    }}
                                />

                                <button
                                    onClick={() => router.push('/?view=inventory')}
                                    className={`relative z-10 w-32 py-1.5 text-sm font-semibold transition-colors duration-200 ${activeTab === 'inventory' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Inventario
                                </button>
                                <button
                                    onClick={() => router.push('/?view=accounting')}
                                    className={`relative z-10 w-32 py-1.5 text-sm font-semibold transition-colors duration-200 ${activeTab === 'accounting' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Contabilidad
                                </button>
                                <button
                                    onClick={() => router.push('/inspections')}
                                    className={`relative z-10 w-32 py-1.5 text-sm font-semibold transition-colors duration-200 ${activeTab === 'maintenance' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Mantenimiento
                                </button>
                            </div>
                        )}

                        {/* RIGHT: Search, Notifications, Profile */}
                        <div className="flex items-center gap-1">

                            {/* Search Input (Minimalist) */}
                            <div className="hidden md:flex items-center relative mr-14 xl:mr-2">
                                <Search className="h-4 w-4 text-slate-400 absolute left-3" />
                                <Input
                                    placeholder="Search"
                                    className="pl-9 h-10 w-64 xl:w-52 2xl:w-64 border-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-950 dark:text-white transition-colors placeholder:text-slate-400"
                                />
                            </div>

                            {/* Notification Center */}
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                                        <Bell className="h-6 w-6" strokeWidth={2} />
                                        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 pointer-events-none" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[92vw] sm:w-80 p-0 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 mt-2 bg-white dark:bg-slate-950">
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