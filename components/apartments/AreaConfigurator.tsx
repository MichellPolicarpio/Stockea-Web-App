'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Home, LayoutTemplate } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'

interface AreaConfiguratorProps {
    apartmentId: string
}

const PREDEFINED_AREAS = [
    'Sala', 'Cocina', 'Comedor', 'Recámara Principal', 'Recámara 2', 'Baño Principal', 'Baño Visitas', 'Pasillo', 'Patio', 'Terraza', 'Cuarto de Lavado'
]

export function AreaConfigurator({ apartmentId }: AreaConfiguratorProps) {
    const [areas, setAreas] = useState<string[]>([])
    const [newAreaName, setNewAreaName] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const { toast } = useToast()

    // Cargar áreas guardadas
    useEffect(() => {
        const savedAreas = localStorage.getItem(`areas_list_${apartmentId}`)
        if (savedAreas) {
            try {
                setAreas(JSON.parse(savedAreas))
            } catch (e) {
                console.error("Error loading areas", e)
            }
        } else {
            // Default inicial si no hay nada
            setAreas(['Sala', 'Cocina', 'Comedor', 'Recámara'])
        }
    }, [apartmentId])

    // Auto-save cada vez que cambia la lista
    useEffect(() => {
        if (areas.length > 0) {
            localStorage.setItem(`areas_list_${apartmentId}`, JSON.stringify(areas))
        }
    }, [areas, apartmentId])

    const handleAddArea = () => {
        if (!newAreaName.trim()) return
        const name = newAreaName.trim()

        if (areas.includes(name)) {
            toast({ title: "Esta área ya existe", variant: "destructive" })
            return
        }

        setAreas([...areas, name])
        setNewAreaName('')
        setIsAddOpen(false)
        toast({ title: "Área agregada", description: `Se ha añadido ${name}.` })
    }

    const handleDeleteArea = (nameToDelete: string) => {
        setAreas(areas.filter(a => a !== nameToDelete))
        toast({ title: "Área eliminada", variant: "destructive" })
    }

    const handleQuickAdd = (name: string) => {
        if (areas.includes(name)) return
        setAreas([...areas, name])
        toast({ title: "Área agregada", description: `Se ha añadido ${name}.` })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Espacios</CardTitle>
                    <CardDescription>
                        Define las áreas físicas que componen este departamento.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Lista Actual */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Áreas Registradas ({areas.length})</h3>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" /> Agregar Área Personalizada
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Nueva Área</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label>Nombre del Área</Label>
                                        <Input
                                            placeholder="Ej. Estudio, Balcón..."
                                            value={newAreaName}
                                            onChange={e => setNewAreaName(e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddArea}>Agregar</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {areas.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                No se han configurado áreas para este departamento.
                            </div>
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {areas.map((area) => (
                                    <div key={area} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border shadow-sm">
                                                <LayoutTemplate className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="font-medium">{area}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteArea(area)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sugerencias Rápidas */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Sugerencias Comunes</h4>
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_AREAS.filter(pa => !areas.includes(pa)).map(area => (
                                <button
                                    key={area}
                                    onClick={() => handleQuickAdd(area)}
                                    className="px-3 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="h-3 w-3" /> {area}
                                </button>
                            ))}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
