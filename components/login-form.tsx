"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, ArrowRight, UserPlus, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export function LoginForm() {
    const router = useRouter()
    const { login } = useAuth()

    // Estados del formulario y UI
    const [isRegister, setIsRegister] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showSplash, setShowSplash] = useState(false)

    // Refs para navegación con teclado
    const passwordRef = useRef<HTMLInputElement>(null)

    // Login Data
    const [loginData, setLoginData] = useState({ username: "", password: "" })

    // Register Data
    const [registerData, setRegisterData] = useState({
        fullName: "",
        email: "",
        role: "verifier", // defecto
        password: "",
        confirmPassword: ""
    })

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!loginData.username.trim() || !loginData.password.trim()) {
            setError("Ingrese sus credenciales para continuar")
            return
        }
        setLoading(true)
        setError("")

        try {
            await login(loginData)
            setShowSplash(true)
            setTimeout(() => {
                router.push("/")
                router.refresh()
            }, 3000)
        } catch (err) {
            setError("Credenciales incorrectas. Pruebe con 'admin' / 'admin123'")
            setLoading(false)
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Simulación de validación
        if (!registerData.fullName || !registerData.email || !registerData.password) {
            setError("Todos los campos son obligatorios")
            return
        }
        if (registerData.password !== registerData.confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        setLoading(true)
        setError("")

        // Simulación de API call
        setTimeout(() => {
            setLoading(false)
            // Auto login simulado o volver al login
            alert("Cuenta registrada con éxito (Simulación). Ahora inicie sesión.")
            setIsRegister(false)
            setLoginData({ username: registerData.email.split('@')[0], password: "" })
        }, 1500)
    }

    // Mini Splash Screen de transición
    if (showSplash) {
        return (
            <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="flex flex-col items-center animate-pulse">
                    <div className="bg-slate-900 dark:bg-white p-4 rounded-2xl mb-6 shadow-2xl">
                        <svg className="w-12 h-12 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M4 4h16v16H4z" />
                            <path d="M10 10l4 4" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">StockBnB<span className="text-blue-600">.</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Iniciando sesión...</p>
                    <div className="h-1 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 animate-[loading_1s_ease-in-out_infinite]" />
                    </div>
                </div>
                <style jsx>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="relative w-full overflow-hidden">
            {/* Contenedor deslizante */}
            <div
                className={cn(
                    "flex transition-transform duration-500 ease-in-out w-[200%]",
                    isRegister ? "-translate-x-1/2" : "translate-x-0"
                )}
            >
                {/* --- LOGIN PANEL (50%) --- */}
                <div className="w-1/2 px-1">
                    <div className="space-y-6">


                        <div className="hidden lg:block space-y-2 text-center sm:text-left">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido</h1>
                            <p className="text-slate-500 text-sm">Ingrese a su cuenta corporativa</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Usuario</Label>
                                    <Input
                                        placeholder="usuario o correo"
                                        value={loginData.username}
                                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                passwordRef.current?.focus();
                                            }
                                        }}
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="text-sm font-medium text-slate-700">Contraseña</Label>
                                        <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
                                            ¿Olvidó su contraseña?
                                        </button>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        ref={passwordRef}
                                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && !isRegister && (
                                <Alert variant="destructive" className="py-2 text-sm bg-red-50 border-red-100 text-red-800">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Iniciar Sesión"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">O</span></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                            onClick={() => { setError(""); setIsRegister(true); }}
                        >
                            Crear una cuenta nueva
                        </Button>
                    </div>
                </div>

                {/* --- REGISTER PANEL (50%) --- */}
                <div className="w-1/2 px-1">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center sm:text-left">
                            <button
                                onClick={() => { setError(""); setIsRegister(false); }}
                                className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Volver al login
                            </button>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Crear Cuenta</h1>
                            <p className="text-slate-500 text-sm">Registro de nuevo personal</p>
                        </div>

                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-600 uppercase">Nombre</Label>
                                    <Input
                                        placeholder="Nombre"
                                        value={registerData.fullName}
                                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                        className="h-10 bg-slate-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-600 uppercase">Apellido</Label>
                                    <Input placeholder="Apellido" className="h-10 bg-slate-50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600 uppercase">Correo Profesional</Label>
                                <Input
                                    type="email"
                                    placeholder="nombre@empresa.com"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    className="h-10 bg-slate-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600 uppercase">Contraseña</Label>
                                <Input
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    className="h-10 bg-slate-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-600 uppercase">Confirmar</Label>
                                <Input
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                    className="h-10 bg-slate-50"
                                />
                            </div>

                            {error && isRegister && (
                                <Alert variant="destructive" className="py-2 text-sm bg-red-50 border-red-100 text-red-800">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Registrar Usuario"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
