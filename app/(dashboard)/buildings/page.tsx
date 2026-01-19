'use client'

import { useState, useRef, useEffect } from 'react'
import { useBuildings } from '@/hooks/useBuildings'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from "@/components/ui/slider"
import { Building2, ArrowRight, Plus, Upload, Home, MapPin, Building as BuildingIcon, User, Layers, MoveVertical, ChevronDown, List, LayoutGrid } from 'lucide-react'
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
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
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
import { mockApartments } from '@/mocks/apartments.mock'

export default function BuildingsPage() {
    const { user } = useAuth()
    const { buildings, loading, refetch } = useBuildings()
    const router = useRouter()
    const isMobile = useIsMobile()

    // Estado para modo de vista: 'cards' (Propiedades) o 'list' (Todos los departamentos)
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

    // Estado para forzar re-renderizado al detectar cambios
    const [tick, setTick] = useState(0)
    const [mounted, setMounted] = useState(false)

    // Estado del Modal
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Estado para expansión de acordeón
    const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(null)

    // Estado del Formulario
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        ownerId: '',
        totalApartments: '',
        imageUrl: null as string | null,
        imagePos: 50 // Posición vertical (0-100%)
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
                    setFormData(prev => ({
                        ...prev,
                        imageUrl: ev.target?.result as string,
                        imagePos: 50 // Resetear posición al cambiar imagen
                    }))
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

            // Guardar imagen y posición en caché local para persistencia simulada
            if (newBuilding?.id) {
                if (formData.imageUrl) {
                    localStorage.setItem(`building-image-${newBuilding.id}`, formData.imageUrl)
                }
                // Guardar posición siempre (si hay imagen)
                localStorage.setItem(`building-pos-${newBuilding.id}`, formData.imagePos.toString())

                // Forzar repintado
                setTimeout(forceUpdate, 50)
                setTimeout(forceUpdate, 500)
            }

            // Reset form
            setFormData({
                name: '',
                address: '',
                ownerId: '',
                totalApartments: '',
                imageUrl: null,
                imagePos: 50
            })
            setIsAddOpen(false)
            refetch()
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
        return <div>Cargando propiedades...</div>
    }

    // FUNCIÓN DE RENDERIZADO DEL FORMULARIO
    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6 py-4 px-1">

            {/* Upload de Imagen con Ajuste de Posición */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Fotografía de la Propiedad
                    </Label>
                    {formData.imageUrl && (
                        <span className="text-xs text-blue-600 font-medium animate-pulse">
                            ¡Arrastra el slider para ajustar el encuadre!
                        </span>
                    )}
                </div>

                <div className="relative">
                    <div
                        className="group border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-900/30 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center shadow-sm hover:shadow-md"
                        onClick={(e) => {
                            // Evitar click si se está usando el slider
                            if ((e.target as HTMLElement).closest('.position-slider')) return;
                            fileInputRef.current?.click()
                        }}
                    >
                        {formData.imageUrl ? (
                            <>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                                    style={{ objectPosition: `center ${formData.imagePos}%` }}
                                />

                                {/* Overlay hover para cambiar imagen */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px] z-10 pointer-events-none">
                                    <Upload className="h-6 w-6 mb-2" />
                                    <span className="font-semibold text-xs">Click para cambiar imagen</span>
                                </div>

                                {/* Slider Overlay - Siempre visible si hay imagen */}
                                <div className="absolute right-4 top-4 bottom-4 w-1.5 bg-black/20 backdrop-blur-sm rounded-full overflow-visible flex flex-col items-center justify-center z-20 position-slider group/slider"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Custom Vertical Slider implementation using standard input range rotated or generic slider styled */}
                                    <div className="h-full relative w-6 flex items-center justify-center">
                                        <Slider
                                            orientation="vertical"
                                            value={[100 - formData.imagePos]} // Invertimos para que arriba sea 0% (top) y abajo 100% (bottom) visualmente, o ajustamos logica
                                            max={100}
                                            step={1}
                                            onValueChange={(vals) => setFormData({ ...formData, imagePos: 100 - vals[0] })}
                                            className="h-full py-2 cursor-grab active:cursor-grabbing"
                                        />
                                    </div>
                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                        Posición
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-12 z-20 text-[10px] text-white/80 bg-black/30 px-2 rounded pointer-events-none">
                                    <MoveVertical className="inline w-3 h-3 mr-1" /> Ajustar vertical
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center p-4 text-center space-y-2">
                                <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-full shadow-inner flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                                        Subir imagen
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        JPG, PNG, WEBP (Max 5MB)
                                    </p>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nombre</Label>
                    <div className="relative group">
                        <div className="absolute left-3 top-2.5 p-0.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <BuildingIcon className="h-4 w-4" />
                        </div>
                        <Input
                            id="name"
                            placeholder="Ej. Torre Altamira"
                            className="pl-10 h-10 text-sm bg-white shadow-sm focus-visible:ring-blue-500 border-slate-200"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="apartments" className="text-sm font-semibold text-slate-700">Departamentos</Label>
                    <div className="relative group">
                        <div className="absolute left-3 top-2.5 p-0.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Layers className="h-4 w-4" />
                        </div>
                        <Input
                            id="apartments"
                            type="number"
                            placeholder="0"
                            className="pl-10 h-10 text-sm bg-white shadow-sm focus-visible:ring-blue-500 border-slate-200"
                            value={formData.totalApartments}
                            onChange={(e) => setFormData({ ...formData, totalApartments: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold text-slate-700">Ubicación</Label>
                <div className="relative group">
                    <div className="absolute left-3 top-2.5 p-0.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <Input
                        id="address"
                        placeholder="Dirección completa"
                        className="pl-10 h-10 text-sm bg-white shadow-sm focus-visible:ring-blue-500 border-slate-200"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="owner" className="text-sm font-semibold text-slate-700">Propietario</Label>
                <Select
                    value={formData.ownerId}
                    onValueChange={(val) => setFormData({ ...formData, ownerId: val })}
                >
                    <SelectTrigger className="w-full pl-10 h-10 relative bg-white shadow-sm border-slate-200">
                        <div className="absolute left-3 top-2.5 p-0.5 text-slate-400 transition-colors">
                            <User className="h-4 w-4" />
                        </div>
                        <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                        {owners.map(owner => (
                            <SelectItem key={owner.id} value={owner.id} className="cursor-pointer">
                                {owner.name}
                            </SelectItem>
                        ))}
                        {owners.length === 0 && <SelectItem value="none" disabled>No hay propietarios</SelectItem>}
                    </SelectContent>
                </Select>
            </div>

            {/* Actions Footer - Compact & Right Aligned on Desktop */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 mt-6">
                {isMobile ? (
                    <DrawerClose asChild>
                        <Button type="button" variant="outline" className="w-full sm:w-auto h-10 text-sm">Cancelar</Button>
                    </DrawerClose>
                ) : (
                    <Button type="button" variant="outline" className="w-full sm:w-auto h-10 text-sm" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium text-sm px-6"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Propiedad'}
                </Button>
            </div>
        </form>
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto p-4 pb-24 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* View Toggles */}
                <div className="flex w-full sm:w-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className={`flex-1 sm:flex-none h-8 px-3 rounded-md gap-2 ${viewMode === 'cards' ? 'bg-white shadow-sm dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="text-xs font-medium">Propiedades</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={`flex-1 sm:flex-none h-8 px-3 rounded-md gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List className="h-4 w-4" />
                        <span className="text-xs font-medium">Departamentos</span>
                    </Button>
                </div>

                {isMobile ? (
                    <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DrawerTrigger asChild>
                            <Button className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all btn-airbnb-effect text-white border-0">
                                <Plus className="mr-2 h-4 w-4" /> Agregar Propiedad
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Agregar Nueva Propiedad</DrawerTitle>
                                <DrawerDescription>
                                    Ingrese los detalles de la propiedad.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4 pb-8 overflow-y-auto max-h-[80vh]">
                                {renderForm()}
                            </div>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="shadow-lg hover:shadow-xl transition-all btn-airbnb-effect text-white border-0">
                                <Plus className="mr-2 h-4 w-4" /> Agregar Propiedad
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]" key={isAddOpen ? 'open' : 'closed'}>
                            <DialogHeader>
                                <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
                                <DialogDescription>
                                    Ingrese los detalles de la propiedad.
                                </DialogDescription>
                            </DialogHeader>
                            {renderForm()}
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {buildings.length === 0 ? (
                <Empty>
                    <EmptyMedia>
                        <Building2 className="h-12 w-12" />
                    </EmptyMedia>
                    <EmptyHeader>
                        <EmptyTitle>No hay propiedades</EmptyTitle>
                        <EmptyDescription>
                            Comienza agregando tu primera propiedad al sistema
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : viewMode === 'list' ? (
                /* LIST VIEW (Table of all apartments) */
                <Card className="overflow-hidden border-slate-200 dark:border-slate-800 min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Depto</th>
                                    <th className="px-6 py-3 font-medium">Piso</th>
                                    <th className="px-6 py-3 font-medium">Edificio</th>
                                    <th className="px-6 py-3 font-medium">Dirección</th>
                                    <th className="px-6 py-3 font-end text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {mockApartments.map(apt => {
                                    const building = buildings.find(b => b.id === apt.buildingId)
                                    // Image logic for table row
                                    const cachedImg = mounted && building ? localStorage.getItem(`building-image-${building.id}`) : null
                                    const displayImage = cachedImg || building?.imageUrl

                                    return (
                                        <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                {apt.number}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {apt.floor}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                        {displayImage ? (
                                                            <img src={displayImage} alt={building?.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <Building2 className="h-5 w-5 text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium">{building?.name || 'Desconocido'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-500 truncate max-w-[200px]">
                                                {building?.address}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 h-8 font-medium"
                                                    onClick={() => router.push(`/buildings/${apt.buildingId}`)}
                                                >
                                                    Ver Edificio
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {mockApartments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No hay departamentos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col gap-4" onMouseEnter={forceUpdate}>
                    {buildings.map((building) => {
                        // Leer directamente del storage para sincronización instantánea
                        const cachedImg = mounted ? localStorage.getItem(`building-image-${building.id}`) : null
                        const cachedPos = mounted ? localStorage.getItem(`building-pos-${building.id}`) : null

                        const displayImage = cachedImg || building.imageUrl
                        const displayPos = cachedPos ? `center ${cachedPos}%` : 'center'

                        // Estado de expansión local para este card
                        const isExpanded = expandedBuildingId === building.id;

                        // Filtrar departamentos de este edificio
                        const buildingApartments = mockApartments.filter(a => a.buildingId === building.id);

                        return (
                            <div key={building.id} className="w-full">
                                <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                                    <div
                                        className="flex flex-col sm:flex-row h-full sm:h-52 cursor-pointer group/card"
                                        onClick={() => router.push(`/buildings/${building.id}`)}
                                    >

                                        {/* Left: Image (Horizontal Layout) */}
                                        <div className="w-full sm:w-64 h-48 sm:h-full overflow-hidden bg-slate-100 flex-shrink-0 relative border-r border-slate-100 dark:border-slate-800">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={building.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                                    style={{ objectPosition: displayPos }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                    <Building2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Content */}
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover/card:text-blue-600 transition-colors">{building.name}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" /> {building.address}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-blue-600"
                                                >
                                                    <ArrowRight className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                        <Home className="h-3.5 w-3.5" />
                                                        <span>{building.totalApartments} Deptos</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setExpandedBuildingId(isExpanded ? null : building.id)
                                                    }}
                                                    className={`gap-1.5 transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                                >
                                                    <span className="text-sm font-medium">Ver Departamentos</span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Section: Apartments List */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-in slide-in-from-top-2 duration-200">
                                            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {buildingApartments.length > 0 ? (
                                                    buildingApartments.map(apt => (
                                                        <div
                                                            key={apt.id}
                                                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center gap-3 shadow-sm hover:border-blue-300 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                                                            onClick={() => router.push(`/buildings/${building.id}/apartments/${apt.id}`)}
                                                        >
                                                            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                                <Home className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                            </div>
                                                            <span className="font-medium text-sm text-slate-700 dark:text-slate-200">Depto {apt.number}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full py-4 text-center text-slate-500 text-sm italic">
                                                        No hay departamentos registrados aún.
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-6 pb-4 flex justify-end">
                                                <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => router.push(`/buildings/${building.id}`)}>
                                                    Gestionar todos los departamentos &rarr;
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
