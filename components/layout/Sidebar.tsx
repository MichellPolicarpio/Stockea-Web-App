'use client'

import { useState, useEffect } from 'react' // Added useEffect for hydration safety
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getMenuByRole } from '@/lib/permissions'
import {
    Moon,
    Sun,
    LogOut,
    HelpCircle,
    PanelLeftClose,
    PanelLeftOpen,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { useTheme } from 'next-themes'

interface DashboardSidebarProps {
    collapsed: boolean
    onToggle: () => void
    onLogout: () => void
}

export function Sidebar({ collapsed, onToggle, onLogout }: DashboardSidebarProps) {
    const { user } = useAuth()
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()

    // Mount safety to avoid hydration mismatch
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    if (!user) return null

    const menuItems = getMenuByRole(user.role)

    return (
        <>
            {/* Overlay Móvil */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 z-50 flex flex-col transition-all duration-300 border-r border-gray-100 dark:border-slate-800",
                    collapsed ? "w-20 items-center" : "w-64",
                    "md:translate-x-0",
                    collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
                )}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={onToggle}
                    className="md:hidden absolute top-9 right-4 z-[60] text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* LOGO SECTION - STOCKEA BRANDING with Matching Line */}
                <div className={cn("flex flex-col justify-between w-full h-24", collapsed ? "items-center" : "px-6")}>
                    {/* Logo Content - Centered Vertically */}
                    <div className="flex-1 flex items-center w-full">
                        <div className={cn("flex items-center gap-1 md:gap-0 w-full overflow-hidden", collapsed ? "justify-center" : "pl-2")}>
                            {/* Logo Image */}
                            <div className={cn(
                                "flex-shrink-0 flex items-center justify-center transition-all",
                                collapsed ? "w-10 h-10" : "w-8 h-8 md:w-10 md:h-10"
                            )}>
                                <img
                                    src="/Logo_Stockea.png"
                                    alt="Stockea Logo"
                                    className="w-full h-full object-contain dark:brightness-0 dark:invert"
                                />
                            </div>

                            {/* Brand Name */}
                            {/* Brand Name Image */}
                            {!collapsed && (
                                <div className="flex-1 flex items-center h-10 opacity-100 transition-opacity mt-2 ml-0 md:-ml-2">
                                    <img
                                        src="/Stockea_Font.png"
                                        alt="Stockea Font"
                                        className="h-9 md:h-12 w-auto object-contain dark:brightness-0 dark:invert"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* THE MATCHING SEPARATOR LINE (2px black) */}
                    <div className={cn("h-[2px] w-full bg-black dark:bg-slate-700 opacity-90 transition-all", collapsed ? "w-12" : "w-full")} />
                </div>

                {/* Spacer after line before menu starts */}
                <div className="h-6" />

                {/* MENU ITEMS */}
                <nav className={cn("flex-1 space-y-2 overflow-y-auto custom-scrollbar w-full", collapsed ? "px-2" : "px-4")}>
                    {menuItems.map((item) => {
                        let isActive = false
                        if (item.url) {
                            if (item.url === '/') {
                                isActive = pathname === '/'
                            } else {
                                isActive = pathname !== '/' && pathname.startsWith(item.url || '###')
                            }
                        }
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.title}
                                href={item.url || '#'}
                                onClick={() => {
                                    // Auto-close on mobile with delay
                                    if (window.innerWidth < 768) {
                                        setTimeout(onToggle, 150)
                                    }
                                }}
                                className={cn(
                                    "group flex items-center rounded-lg transition-all duration-200 min-h-[44px]", // Altura mínima para click target
                                    collapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "gap-3 px-3 py-2.5 w-full",
                                    isActive
                                        ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 font-semibold shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-700"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                                )}
                                title={collapsed ? item.title : undefined}
                            >
                                {Icon && (
                                    <Icon className={cn(
                                        "transition-colors flex-shrink-0",
                                        collapsed ? "h-6 w-6" : "h-5 w-5", // Icono ligeramente más grande colapsado para énfasis
                                        isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                    )} strokeWidth={2} />
                                )}

                                {!collapsed && (
                                    <span className="whitespace-nowrap text-sm font-medium">
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        )
                    })}

                    {/* Spacer */}
                    <div className="mt-8"></div>

                    <Link
                        href="/help"
                        className={cn(
                            "group flex items-center rounded-lg transition-all duration-200 min-h-[44px]",
                            collapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "gap-3 px-3 py-2.5 w-full text-sm font-medium",
                            pathname === '/help'
                                ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 font-semibold shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-700"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                        title="Ayuda y Soporte"
                    >
                        <HelpCircle className={cn(
                            "flex-shrink-0 transition-colors",
                            collapsed ? "h-6 w-6" : "h-5 w-5",
                            pathname === '/help'
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        )} strokeWidth={2} />
                        {!collapsed && <span>Ayuda y Soporte</span>}
                    </Link>
                </nav>

                {/* BOTTOM SECTION */}
                <div className={cn(
                    "mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 w-full",
                    collapsed ? "p-2 bg-transparent dark:bg-transparent border-none flex flex-col items-center gap-4 pb-6" : "p-4"
                )}>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className={cn(
                            "flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[40px]",
                            collapsed ? "w-10 h-10" : "w-full gap-2 px-2 py-2 text-xs font-medium mb-4"
                        )}
                        title="Cerrar Sesión"
                    >
                        <LogOut className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                        {!collapsed && <span>Cerrar Sesión</span>}
                    </button>

                    {/* Minimalist Dark Mode Toggle */}
                    {mounted && (
                        <div className={cn(
                            "flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1",
                            collapsed ? "flex-col w-12 border-slate-200 dark:border-slate-800 shadow-sm" : "justify-between w-full"
                        )}>
                            <div
                                onClick={() => setTheme('light')}
                                className={cn(
                                    "flex items-center justify-center rounded-md transition-all cursor-pointer",
                                    collapsed ? "w-10 h-10 mb-1" : "flex-1 gap-2 px-3 py-1.5 text-xs font-medium",
                                    theme === 'light' ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                )}
                            >
                                <Sun className={cn(collapsed ? "h-5 w-5" : "h-3.5 w-3.5")} />
                                {!collapsed && "Light"}
                            </div>
                            <div
                                onClick={() => setTheme('dark')}
                                className={cn(
                                    "flex items-center justify-center rounded-md transition-all cursor-pointer",
                                    collapsed ? "w-10 h-10" : "flex-1 gap-2 px-3 py-1.5 text-xs font-medium",
                                    theme === 'dark' ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                )}
                            >
                                <Moon className={cn(collapsed ? "h-5 w-5" : "h-3.5 w-3.5")} />
                                {!collapsed && "Dark"}
                            </div>
                        </div>
                    )}

                </div>

                {/* Toggle Collapse Button (Desktop Only) - RESTORED & FIXED */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "hidden md:flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all z-50 absolute",
                        "-right-3 top-16 p-1.5 rounded-full" // Posición fija y constante
                    )}
                    title={collapsed ? "Expandir" : "Colapsar"}
                >
                    {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-3 w-3" />}
                </button>

            </aside>
        </>
    )
}
