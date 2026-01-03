'use client'

import { useState, useRef, useEffect } from 'react'
import { useBuildings } from '@/hooks/useBuildings'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ArrowRight, Plus, Upload, Home, MapPin, Building as BuildingIcon, User, Layers } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Importar servicio para crear (ya que el hook solo lee por ahora)
import { buildingService } from '@/services/buildingService.mock'
// Importar mocks de usuarios para la lista de dueños
import { mockUsers } from '@/mocks/users.mock'

export default function BuildingsPage() {
    const { user } = useAuth()
    const { buildings, loading, refetch } = useBuildings()
    const router = useRouter()

    // Estado para forzar re-renderizado al detectar cambios
    const [tick, setTick] = useState(0)
    const [mounted, setMounted] = useState(false)

    // Estado del Modal
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Estado del Formulario
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        ownerId: '',
        totalApartments: '',
        imageUrl: null as string | null
    })

    // Ref para input file
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Filtrar dueños
    const owners = mockUsers.filter(u => u.role === 'owner')

    const forceUpdate = () => setTick(prev => prev + 1)

    // Montaje y listeners
    useEffect(() => {
        setMounted(true)

        // Escuchar eventos de actualización y foco para repintar
        window.addEventListener('building-updated', forceUpdate)
        window.addEventListener('focus', forceUpdate)
        // También storage event para cambios en otras pestañas reales
        window.addEventListener('storage', forceUpdate)

        return () => {
            window.removeEventListener('building-updated', forceUpdate)
            window.removeEventListener('focus', forceUpdate)
            window.removeEventListener('storage', forceUpdate)
        }
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const reader = new FileReader()
                reader.onload = (ev) => {
                    setFormData(prev => ({ ...prev, imageUrl: ev.target?.result as string }))
                }
                reader.readAsDataURL(file)
            } catch (e) {
                console.error("Error", e)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const newBuilding = await buildingService.create({
                name: formData.name,
                address: formData.address,
                owner: formData.ownerId,
                totalApartments: parseInt(formData.totalApartments) || 0,
                imageUrl: formData.imageUrl || undefined
            })

            // Guardar imagen en caché local para persistencia simulada
            if (formData.imageUrl && newBuilding?.id) {
                localStorage.setItem(`building-image-${newBuilding.id}`, formData.imageUrl)
                // Forzar repintado
                setTimeout(forceUpdate, 50)
                setTimeout(forceUpdate, 500) // Doble check por si el mock tarda
            }

            // Reset form
            setFormData({
                name: '',
                address: '',
                ownerId: '',
                totalApartments: '',
                imageUrl: null
            })
            setIsAddOpen(false)
            refetch() // Recargar lista
        } catch (error) {
            console.error("Error al crear edificio", error)
        } finally {
            setIsSubmitting(false)
        }
    }


    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center p-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-xl font-bold mb-2">Acceso Denegado</h2>
                            <p className="text-muted-foreground">No tienes permisos para acceder a esta página</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (loading) {
        return <div>Cargando edificios...</div>
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-end">

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg hover:shadow-xl transition-all">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Edificio
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Edificio</DialogTitle>
                            <DialogDescription>
                                Ingrese los detalles de la propiedad para registrarla en el sistema.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">

                            {/* Upload de Imagen */}
                            <div className="space-y-2">
                                <Label>Fotografía del Edificio</Label>
                                <div
                                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative overflow-hidden group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.imageUrl ? (
                                        <>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium flex items-center">
                                                    <Upload className="mr-2 h-4 w-4" /> Cambiar imagen
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                                <BuildingIcon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">Haz clic para subir una imagen</p>
                                                <p className="text-xs text-slate-500">PNG, JPG hasta 5MB</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Edificio</Label>
                                    <div className="relative">
                                        <BuildingIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="Ej. Casa Tortuga"
                                            className="pl-9"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apartments">Nº de Departamentos</Label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="apartments"
                                            type="number"
                                            placeholder="0"
                                            className="pl-9"
                                            value={formData.totalApartments}
                                            onChange={(e) => setFormData({ ...formData, totalApartments: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección Completa</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="address"
                                        placeholder="Calle, Número, Colonia, Ciudad"
                                        className="pl-9"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner">Propietario Asignado (Opcional)</Label>
                                <Select
                                    value={formData.ownerId}
                                    onValueChange={(val) => setFormData({ ...formData, ownerId: val })}
                                >
                                    <SelectTrigger className="w-full pl-9 relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                                        <SelectValue placeholder="Seleccionar un propietario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {owners.map(owner => (
                                            <SelectItem key={owner.id} value={owner.id}>
                                                {owner.name} ({owner.email})
                                            </SelectItem>
                                        ))}
                                        {owners.length === 0 && <SelectItem value="none" disabled>No hay propietarios registrados</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar Edificio'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {buildings.length === 0 ? (
                <Empty>
                    <EmptyMedia>
                        <Building2 className="h-12 w-12" />
                    </EmptyMedia>
                    <EmptyHeader>
                        <EmptyTitle>No hay edificios</EmptyTitle>
                        <EmptyDescription>
                            Comienza agregando tu primer edificio al sistema
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" onMouseEnter={forceUpdate}>
                    {buildings.map((building) => {
                        // Leer directamente del storage para sincronización instantánea
                        // Usamos 'tick' como dependencia invisible para obligar el re-render
                        const cachedImg = mounted ? localStorage.getItem(`building-image-${building.id}`) : null
                        const cachedPos = mounted ? localStorage.getItem(`building-pos-${building.id}`) : null

                        const displayImage = cachedImg || building.imageUrl
                        const displayPos = cachedPos ? `center ${cachedPos}%` : 'center'

                        return (
                            <Card key={building.id} className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group border-slate-200 dark:border-slate-800">
                                {/* Imagen de Preview */}
                                <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt={building.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            style={{ objectPosition: displayPos }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                            <Building2 className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                </div>

                                <CardContent className="p-5">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">{building.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 line-clamp-1">
                                                <MapPin className="h-3 w-3 shrink-0" /> {building.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Home className="h-4 w-4" />
                                                <span>{building.totalApartments} Deptos</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 p-0 h-auto font-medium hover:bg-transparent hover:text-blue-700 hover:underline"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/buildings/${building.id}`)
                                                }}
                                            >
                                                Ver detalles
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
