'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Save, ArrowLeft, ArrowRight, Camera, Printer, Pencil, Share2, UserCheck, CalendarDays } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// MOCK DATA for Inspection Items
const MOCK_INVENTORY = {
    mobiliario: [
        { id: 'm1', name: 'Sofá Cama Gris', area: 'Sala', status: 'good' },
        { id: 'm2', name: 'Mesa de Centro', area: 'Sala', status: 'bad', comment: 'Pata rayada levemente' }, // Example of bad item
        { id: 'm3', name: 'Comedor 6 Sillas', area: 'Comedor', status: 'good' },
        { id: 'm4', name: 'Cama King Size', area: 'Recámara Principal', status: 'good' },
    ],
    electrodomesticos: [
        { id: 'e1', name: 'Smart TV 55"', area: 'Sala', status: 'good' },
        { id: 'e2', name: 'Refrigerador Samsung', area: 'Cocina', status: 'good' },
        { id: 'e3', name: 'Microondas', area: 'Cocina', status: 'good' },
        { id: 'e4', name: 'Aire Acondicionado', area: 'Recámara Principal', status: 'good' },
    ],
    decoracion: [
        { id: 'd1', name: 'Cuadro Abstracto Azul', area: 'Sala', found: true },
        { id: 'd2', name: 'Jarrón de Cerámica', area: 'Comedor', found: true },
        { id: 'd3', name: 'Lámpara de Pie', area: 'Sala', found: false },
    ]
}

const MOCK_AREAS = [
    { id: 'a1', name: 'Sala', elements: ['Piso', 'Techo', 'Paredes', 'Ventanas', 'Iluminación'] },
    { id: 'a2', name: 'Cocina', elements: ['Piso', 'Techo', 'Paredes', 'Gabinetes', 'Grifería'] },
    { id: 'a3', name: 'Recámara Principal', elements: ['Piso', 'Techo', 'Paredes', 'Closet', 'Puerta'] },
    { id: 'a4', name: 'Baño', elements: ['Piso', 'Azulejos', 'Inodoro', 'Lavabo', 'Ducha'] },
    { id: 'a5', name: 'Terraza', elements: ['Piso', 'Barandal', 'Techo'] },
]

export default function InspectionPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    // mode: 'edit' | 'view'
    const mode = searchParams.get('mode') === 'view' ? 'view' : 'edit'
    const inspectionId = params.inspectionId as string

    // STATE
    // Initialize with some mock "bad" statuses for demo if in view mode
    const [inventoryState, setInventoryState] = useState<{
        [key: string]: { status: 'good' | 'bad' | 'missing', comment?: string, found?: boolean }
    }>({})

    const [physicalState, setPhysicalState] = useState<{
        [key: string]: { status: 'good' | 'bad', comment?: string }
    }>({})

    // Init Mock Data for Demo Purposes
    useEffect(() => {
        if (mode === 'view') {
            // Pre-load some issues for the "View Report" demo
            setInventoryState({
                'm2': { status: 'bad', comment: 'Rayadura visible en pata derecha.' },
                'd3': { found: false, status: 'missing' } // Item missing
            })
            setPhysicalState({
                'a1-Paredes': { status: 'bad', comment: 'Mancha de humedad en esquina superior.' }
            })
        }
    }, [mode])


    const handleInventoryChange = (id: string, field: string, value: any) => {
        if (mode === 'view') return
        setInventoryState(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }))
    }

    const handlePhysicalChange = (areaId: string, element: string, isGood: boolean) => {
        if (mode === 'view') return
        const key = `${areaId}-${element}`
        setPhysicalState(prev => ({
            ...prev,
            [key]: { ...prev[key], status: isGood ? 'good' : 'bad' }
        }))
    }

    const handlePhysicalComment = (areaId: string, element: string, comment: string) => {
        if (mode === 'view') return
        const key = `${areaId}-${element}`
        setPhysicalState(prev => ({
            ...prev,
            [key]: { ...prev[key], comment }
        }))
    }

    const handleSubmit = () => {
        if (mode === 'view') return
        console.log({ inventoryState, physicalState })
        toast({
            title: "Inspección Guardada",
            description: "El reporte ha sido actualizado exitosamente."
        })
        setTimeout(() => router.push('/apartments'), 1500)
    }

    return (
        <>
            {/* === WEB UI (Hidden on Print) === */}
            <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 print:hidden">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all text-muted-foreground" onClick={() => router.back()}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            {mode === 'view' && (
                                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                    Reporte Finalizado
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            Inspección #{(inspectionId || '001').slice(0, 6)}
                            {mode === 'view' && <span className="text-sm font-normal text-slate-400">(Modo Lectura)</span>}
                        </h1>
                        <div className="flex items-center gap-2 text-slate-500 mt-1 text-sm md:text-base">
                            <span className="font-semibold text-slate-900 dark:text-white">Casa Tortuga • Depto 101</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        {/* METADATA (Visible only in View Mode) */}
                        {mode === 'view' && (
                            <div className="flex items-center gap-6 mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
                                        <UserCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Verificador</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Carlos Rodríguez</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Hora Inicio</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">10:45 AM</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                        {mode === 'view' ? (
                            <>
                                <Button variant="outline" onClick={() => window.open(`/report/inspection/${inspectionId || '001'}`, '_blank')}>
                                    <Printer className="mr-2 h-4 w-4" /> Imprimir Reporte
                                </Button>
                                <Button onClick={() => router.push(`/inspections/${inspectionId}?mode=edit`)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar Reporte
                                </Button>
                            </>
                        ) : (
                            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                                <Save className="h-4 w-4" /> Finalizar Inspección
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="mobiliario" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-slate-100 dark:bg-slate-800 overflow-x-auto flex-wrap">
                        <TabsTrigger value="mobiliario" className="flex-1 min-w-[120px]">Mobiliario</TabsTrigger>
                        <TabsTrigger value="electrodomesticos" className="flex-1 min-w-[120px]">Electrodomésticos</TabsTrigger>
                        <TabsTrigger value="decoracion" className="flex-1 min-w-[120px]">Decoración</TabsTrigger>
                        <TabsTrigger value="fisico" className="flex-1 min-w-[120px]">Estado Físico</TabsTrigger>
                    </TabsList>

                    {/* 1. MOBILIARIO */}
                    <TabsContent value="mobiliario" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mobiliario</CardTitle>
                                {mode !== 'view' && <CardDescription>Verifica que el mobiliario se encuentre en buen estado.</CardDescription>}
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                {MOCK_INVENTORY.mobiliario.map(item => {
                                    const state = inventoryState[item.id] || (item.status === 'bad' ? { status: 'bad', comment: item.comment } : { status: 'good' })
                                    const isGood = state.status === 'good'

                                    return (
                                        <div key={item.id} className={cn(
                                            "flex flex-col sm:flex-row gap-4 p-4 rounded-lg border",
                                            isGood ? 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10'
                                        )}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <Badge variant="secondary" className="text-xs">{item.area}</Badge>
                                                </div>
                                                {/* Only show default state text in Edit mode */}
                                                {mode !== 'view' && <p className="text-sm text-muted-foreground mt-1">Estado predeterminado: Bueno</p>}
                                            </div>

                                            <div className="flex flex-col gap-3 min-w-[200px]">
                                                {mode === 'edit' ? (
                                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                                                        <Label className="cursor-pointer">¿Buen Estado?</Label>
                                                        <Switch
                                                            checked={isGood}
                                                            onCheckedChange={(checked) => handleInventoryChange(item.id, 'status', checked ? 'good' : 'bad')}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end">
                                                        <Badge variant={isGood ? 'outline' : 'destructive'} className={cn("text-sm px-3 py-1", isGood && "text-green-600 border-green-200 bg-green-50")}>
                                                            {isGood ? 'En Buen Estado' : 'Con Daños'}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {!isGood && (
                                                    <div className="animate-in slide-in-from-top-2 fade-in bg-white p-3 rounded border border-red-100 dark:bg-black/20">
                                                        <Label className="text-xs mb-1.5 block text-red-600 dark:text-red-400 font-semibold">Observaciones:</Label>
                                                        {mode === 'edit' ? (
                                                            <>
                                                                <Textarea
                                                                    placeholder="Describa el daño..."
                                                                    className="h-20 text-sm resize-none"
                                                                    value={state.comment || ''}
                                                                    onChange={(e) => handleInventoryChange(item.id, 'comment', e.target.value)}
                                                                />
                                                                <Button variant="outline" size="sm" className="w-full mt-2 gap-2 text-slate-500">
                                                                    <Camera className="h-3 w-3" /> Agregar Foto
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                                                                "{state.comment || 'Sin comentarios'}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                        {mode === 'edit' && (
                            <div className="flex justify-end">
                                <Button onClick={() => document.getElementById('tab-electrodomesticos')?.click()}>
                                    Siguiente: Electrodomésticos <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* 2. ELECTRODOMESTICOS */}
                    <TabsContent value="electrodomesticos" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Electrodomésticos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                {MOCK_INVENTORY.electrodomesticos.map(item => {
                                    const state = inventoryState[item.id] || { status: 'good' }
                                    const isGood = state.status === 'good'

                                    return (
                                        <div key={item.id} className={cn(
                                            "flex flex-col sm:flex-row gap-4 p-4 rounded-lg border",
                                            isGood ? 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900' : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/10'
                                        )}>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <Badge variant="secondary" className="text-xs">{item.area}</Badge>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 min-w-[200px]">
                                                {mode === 'edit' ? (
                                                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                                                        <Label className="cursor-pointer">¿Funciona bien?</Label>
                                                        <Switch
                                                            checked={isGood}
                                                            onCheckedChange={(checked) => handleInventoryChange(item.id, 'status', checked ? 'good' : 'bad')}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end">
                                                        <Badge variant={isGood ? 'outline' : 'outline'} className={cn("text-sm px-3 py-1", isGood ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 border-amber-200 bg-amber-50")}>
                                                            {isGood ? 'Operativo' : 'Falla Reportada'}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {!isGood && (
                                                    <div className="animate-in slide-in-from-top-2 fade-in">
                                                        <Label className="text-xs mb-1.5 block text-amber-600 dark:text-amber-400 font-semibold">Detalle:</Label>
                                                        {mode === 'edit' ? (
                                                            <Textarea
                                                                placeholder="Ej: No enciende..."
                                                                className="h-20 text-sm resize-none"
                                                                value={state.comment || ''}
                                                                onChange={(e) => handleInventoryChange(item.id, 'comment', e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{state.comment || 'Sin comentarios'}"</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 3. DECORACION */}
                    <TabsContent value="decoracion" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Decoración</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {MOCK_INVENTORY.decoracion.map(item => {
                                    const state = inventoryState[item.id] || (item.found === false ? { found: false } : { found: true })
                                    const isFound = state.found !== false // Default true

                                    return (
                                        <div key={item.id} className={cn(
                                            "flex items-center justify-between p-4 border rounded-lg",
                                            !isFound && "bg-red-50 border-red-100"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", isFound ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>
                                                    {isFound ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{item.area}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {mode === 'edit' ? (
                                                    <>
                                                        <span className={`text-sm font-medium ${isFound ? 'text-green-600' : 'text-red-500'}`}>
                                                            {isFound ? 'Presente' : 'Faltante'}
                                                        </span>
                                                        <Switch
                                                            checked={isFound}
                                                            onCheckedChange={(checked) => handleInventoryChange(item.id, 'found', checked)}
                                                        />
                                                    </>
                                                ) : (
                                                    <Badge variant={isFound ? 'outline' : 'destructive'}>
                                                        {isFound ? 'Verificado' : 'FALTANTE'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 4. ESTADO FISICO */}
                    <TabsContent value="fisico" className="space-y-6 mt-6">
                        {MOCK_AREAS.map(area => (
                            <Card key={area.id}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">{area.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {area.elements.map(element => {
                                            const key = `${area.id}-${element}`
                                            const state = physicalState[key] || { status: 'good' }
                                            const isGood = state.status === 'good'

                                            return (
                                                <div key={element} className={cn(
                                                    "p-3 rounded-lg border flex flex-col gap-2",
                                                    isGood ? 'border-slate-100' : 'border-red-200 bg-red-50/50'
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-sm">{element}</span>
                                                        <div className="flex items-center gap-2">
                                                            {!isGood && <span className="text-[10px] text-red-600 font-bold uppercase">Daño</span>}

                                                            {mode === 'edit' ? (
                                                                <Switch
                                                                    className="scale-75"
                                                                    checked={isGood}
                                                                    onCheckedChange={(checked) => handlePhysicalChange(area.id, element, checked)}
                                                                />
                                                            ) : (
                                                                isGood ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(!isGood || (state.comment && mode === 'view')) && (
                                                        mode === 'edit' ? (
                                                            <Textarea
                                                                placeholder="Detalle el problema..."
                                                                className="text-xs h-16 min-h-[60px]"
                                                                value={state.comment || ''}
                                                                onChange={(e) => handlePhysicalComment(area.id, element, e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="text-xs text-red-700 bg-red-50 p-1.5 rounded border border-red-100">
                                                                {state.comment}
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {mode === 'edit' && (
                            <div className="pt-6">
                                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg" onClick={handleSubmit}>
                                    <Save className="mr-2 h-5 w-5" /> Finalizar y Guardar Reporte
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Floating Action Button for Mobile */}
                {mode === 'edit' && (
                    <div className="fixed bottom-6 right-6 sm:hidden">
                        <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                            <Save className="h-6 w-6" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
