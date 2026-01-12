'use client'

import { useState, useEffect } from 'react'
import { InventoryItem, InventoryCategoryType, InventoryStatus } from '@/types/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle2, Camera, ImageIcon, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { AreaConfigurator } from './AreaConfigurator'
import { CheckSquare } from 'lucide-react'

interface InventoryManagerProps {
    initialItems: InventoryItem[]
    apartmentId: string
    onUpdate?: (items: InventoryItem[]) => void
}

const CATEGORIES: InventoryCategoryType[] = ['Mobiliario', 'Electrodomesticos', 'Electronica', 'Cocina y Utensilios', 'Decoracion', 'Otros']
const STATUSES: { value: InventoryStatus; label: string; color: string }[] = [
    { value: 'ok', label: 'Buen Estado', color: 'text-green-600' },
    { value: 'damaged', label: 'Dañado', color: 'text-red-600' },
    { value: 'missing', label: 'Faltante', color: 'text-orange-600' },
    { value: 'needs_replacement', label: 'Requiere Reemplazo', color: 'text-amber-600' }
]

export function InventoryManager({ initialItems, apartmentId, onUpdate }: InventoryManagerProps) {
    const [items, setItems] = useState<InventoryItem[]>(initialItems)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAreasOpen, setIsAreasOpen] = useState(false)
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
        category: 'Mobiliario',
        status: 'ok',
        quantity: 1,
        image: undefined
    })
    const [editingId, setEditingId] = useState<string | null>(null) // New State
    const { toast } = useToast()

    // Cargar desde localStorage al montar
    useEffect(() => {
        const saved = localStorage.getItem(`inventory_${apartmentId}`)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setItems(parsed)
            } catch (e) {
                console.error("Error cargando inventario local:", e)
            }
        }
    }, [apartmentId])

    const handleSaveItem = () => {
        if (!newItem.name || !newItem.category) return

        let updatedItems: InventoryItem[]

        if (editingId) {
            // Update existing
            updatedItems = items.map(item =>
                item.id === editingId
                    ? { ...item, ...newItem, updatedAt: new Date() } as InventoryItem
                    : item
            )
            toast({ title: "Objeto actualizado", description: "Cambios guardados correctamente." })
        } else {
            // Create new
            const item: InventoryItem = {
                id: `item-${Date.now()}`,
                apartmentId,
                name: newItem.name,
                description: newItem.description || '',
                category: newItem.category as InventoryCategoryType,
                status: newItem.status as InventoryStatus,
                quantity: newItem.quantity || 1,
                notes: newItem.notes || '',
                image: newItem.image,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            updatedItems = [...items, item]
            toast({ title: "Objeto agregado", description: "Se ha añadido al inventario." })
        }

        setItems(updatedItems)
        localStorage.setItem(`inventory_${apartmentId}`, JSON.stringify(updatedItems))
        onUpdate?.(updatedItems)

        setIsDialogOpen(false)
        setEditingId(null)
        setNewItem({ category: 'Mobiliario', status: 'ok', quantity: 1, name: '', description: '', image: undefined })
    }

    const handleEditClick = (item: InventoryItem) => {
        setNewItem({
            name: item.name,
            category: item.category,
            status: item.status,
            quantity: item.quantity,
            notes: item.notes,
            description: item.description,
            image: item.image
        })
        setEditingId(item.id)
        setIsDialogOpen(true)
    }

    const handleDeleteItem = (id: string) => {
        const updated = items.filter(i => i.id !== id)
        setItems(updated)
        // Guardar en LocalStorage
        localStorage.setItem(`inventory_${apartmentId}`, JSON.stringify(updated))

        onUpdate?.(updated)
        toast({
            title: "Objeto eliminado",
            variant: "destructive"
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validación simple de tamaño (ej. < 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast({ title: "Imagen muy grande", description: "Sube una imagen menor a 2MB.", variant: "destructive" })
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setNewItem(prev => ({ ...prev, image: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setNewItem(prev => ({ ...prev, image: undefined }))
    }

    const getStatusInfo = (status: InventoryStatus) => STATUSES.find(s => s.value === status)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Gestión de Inventario</h3>
                <div className="flex gap-2">
                    {/* Botón Gestión de Áreas */}
                    <Dialog open={isAreasOpen} onOpenChange={setIsAreasOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                                <CheckSquare className="h-4 w-4" />
                                <span className="hidden sm:inline">Gestionar Áreas</span>
                                <span className="sm:hidden">Áreas</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto w-full p-0 gap-0">
                            <DialogHeader className="p-6 pb-2 border-b">
                                <DialogTitle>Evaluación de Áreas Físicas</DialogTitle>
                            </DialogHeader>
                            <div className="p-6">
                                <AreaConfigurator apartmentId={apartmentId} />
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Botón Agregar Item */}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setEditingId(null)
                            setNewItem({ category: 'Mobiliario', status: 'ok', quantity: 1, name: '', description: '', image: undefined })
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 shadow-sm">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Agregar Objeto</span>
                                <span className="sm:hidden">Nuevo</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Editar Objeto' : 'Nuevo Objeto de Inventario'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                {/* Image Upload Area */}
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
                                            {newItem.image ? (
                                                <img src={newItem.image} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                <>
                                                    <Camera className="h-8 w-8 text-slate-400 mb-2" />
                                                    <span className="text-xs text-slate-500">Subir foto</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        {newItem.image && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Nombre</Label>
                                        <Input
                                            className="col-span-3"
                                            value={newItem.name || ''}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                            placeholder="Ej. Sofá cama"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Categoría</Label>
                                        <Select
                                            value={newItem.category}
                                            onValueChange={val => setNewItem({ ...newItem, category: val as InventoryCategoryType })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Estado</Label>
                                        <Select
                                            value={newItem.status}
                                            onValueChange={val => setNewItem({ ...newItem, status: val as InventoryStatus })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Cantidad</Label>
                                        <Input
                                            type="number"
                                            className="col-span-3"
                                            value={newItem.quantity}
                                            onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Notas</Label>
                                        <Input
                                            className="col-span-3"
                                            value={newItem.notes || ''}
                                            onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                                            placeholder="Detalles adicionales..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSaveItem}>{editingId ? 'Guardar Cambios' : 'Guardar Objeto'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="Mobiliario" className="w-full">
                <TabsList className="w-full flex flex-wrap h-auto justify-start gap-1 bg-transparent p-0">
                    {CATEGORIES.map(cat => (
                        <TabsTrigger
                            key={cat}
                            value={cat}
                            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400 border border-transparent data-[state=active]:border-blue-200 dark:data-[state=active]:border-blue-800 rounded-md px-3 py-1.5"
                        >
                            {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {CATEGORIES.map(cat => {
                    const catItems = items.filter(i => i.category === cat)
                    return (
                        <TabsContent key={cat} value={cat} className="mt-4">
                            {catItems.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No hay objetos registrados en esta categoría.
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {catItems.map(item => {
                                        const status = getStatusInfo(item.status)
                                        return (
                                            <Card key={item.id} className="overflow-hidden">
                                                <CardContent className="p-4 flex items-center justify-between">
                                                    <div className="flex items-start gap-3">
                                                        {/* Thumbnail Image Logic */}
                                                        <div className="h-16 w-16 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <ImageIcon className="h-6 w-6 text-slate-300" />
                                                            )}
                                                        </div>

                                                        <div className="mt-1">
                                                            {item.status === 'ok' ? (
                                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <AlertCircle className={`h-5 w-5 ${item.status === 'damaged' ? 'text-red-500' : 'text-amber-500'}`} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{item.name} <span className="text-xs text-muted-foreground ml-2">x{item.quantity}</span></h4>
                                                            <div className="flex gap-2 text-sm mt-1">
                                                                <span className={status?.color}>{status?.label}</span>
                                                                {item.notes && <span className="text-muted-foreground">• {item.notes}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditClick(item)}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteItem(item.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}
