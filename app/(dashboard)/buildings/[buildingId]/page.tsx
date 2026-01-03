'use client'

import { useBuildings } from '@/hooks/useBuildings'
import { apartmentService } from '@/services/apartmentService.mock'
import { useState, useRef, useEffect } from 'react'
import { Apartment } from '@/types/apartment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, ArrowRight, Edit, Trash2, Plus, Building as BuildingIcon, MapPin, User, Save, Upload, X, MoveVertical, AlignStartVertical, AlignCenterVertical, AlignEndVertical, Monitor, ArrowUp, ArrowDown } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const MOCK_OWNERS = [
  "Victor Alejandro Olvera Mendez",
  "Michell Alexis Policarpio Moran",
  "Luis Fernando Garcia Hrernandez",
  "Ana Maria Lopez",
  "Carlos Eduardo Ruiz",
  "Sofia Isabel Torres",
  "Jorge Ramirez",
  "Elena Castillo"
]

export default function BuildingDetailPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const { getBuildingById } = useBuildings()
  const [building, setBuilding] = useState<Awaited<ReturnType<typeof getBuildingById>>>(null)
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Ref para editar foto
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para Edición de Edificio
  const [isEditBuildingOpen, setIsEditBuildingOpen] = useState(false)

  // Posiciones posibles: 0, 25, 50, 75, 100
  const [buildingForm, setBuildingForm] = useState({
    name: '',
    address: '',
    owner: '',
    imageUrl: null as string | null,
    imagePosition: 50 // Por defecto centro (50%)
  })

  // Estados para Agregar Departamento
  const [isAddApartmentOpen, setIsAddApartmentOpen] = useState(false)
  const [newApartment, setNewApartment] = useState({ number: '', floor: '', status: 'vacant' })

  // Helper para convertir a Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const buildingData = await getBuildingById(buildingId)

        if (buildingData) {
          // Intentar recuperar imagen y posición guardada en localStorage
          const savedPos = localStorage.getItem(`building-pos-${buildingId}`)
          const savedImage = localStorage.getItem(`building-image-${buildingId}`)

          const initialPos = savedPos ? parseInt(savedPos) : 50
          const initialImage = savedImage || buildingData.imageUrl

          // Actualizar estado local del edificio para visualización inmediata
          const mergedBuilding = {
            ...buildingData,
            imageUrl: initialImage // Usar la guardada si existe
          }
          setBuilding(mergedBuilding)

          setBuildingForm({
            name: buildingData.name,
            address: buildingData.address,
            owner: buildingData.owner || '',
            imageUrl: initialImage || null,
            imagePosition: initialPos
          })
          const apartmentsData = await apartmentService.getByBuildingId(buildingId)
          setApartments(apartmentsData)
        }
      } catch (err) {
        console.error("Failed to load building data:", err)
        setError("Error al cargar la información del edificio.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [buildingId, getBuildingById])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Convertir a Base64 para persistencia
        const base64 = await fileToBase64(file)
        setBuildingForm(prev => ({ ...prev, imageUrl: base64 }))
      } catch (e) {
        console.error("Error conversion base64", e)
        toast({ title: "Error", description: "No se pudo procesar la imagen", variant: "destructive" })
      }
    }
  }

  const handleUpdateBuilding = () => {
    if (!building) return
    const updated = {
      ...building,
      name: buildingForm.name,
      address: buildingForm.address,
      owner: buildingForm.owner,
      imageUrl: buildingForm.imageUrl || undefined,
    }
    setBuilding(updated)

    // Guardar simulación de posición e IMAGEN
    localStorage.setItem(`building-pos-${buildingId}`, buildingForm.imagePosition.toString())
    if (buildingForm.imageUrl) {
      localStorage.setItem(`building-image-${buildingId}`, buildingForm.imageUrl)
    } else {
      localStorage.removeItem(`building-image-${buildingId}`)
    }

    // Notificar a otras vistas (como la lista de edificios) que hubo cambios
    window.dispatchEvent(new Event('building-updated'))

    // Persistir cambios simulados
    setIsEditBuildingOpen(false)
    toast({ title: "Edificio actualizado", description: "Los datos han sido guardados en caché." })
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBuildingForm(prev => ({ ...prev, imageUrl: null }))
  }

  const handleAddApartment = () => {
    if (!newApartment.number) {
      // ...
      toast({ title: "Error", description: "El número es obligatorio", variant: "destructive" })
      return
    }

    const newItem: Apartment = {
      id: `apt-${Date.now()}`,
      buildingId,
      number: newApartment.number,
      floor: newApartment.floor ? parseInt(newApartment.floor) : 0,
      status: newApartment.status as 'vacant' | 'occupied' | 'maintenance',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setApartments([...apartments, newItem])
    setIsAddApartmentOpen(false)
    setNewApartment({ number: '', floor: '', status: 'vacant' })
    toast({ title: "Departamento agregado", description: `Depto ${newItem.number} creado.` })
  }

  const handleDeleteApartment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("¿Estás seguro de eliminar este departamento?")) {
      setApartments(apartments.filter(a => a.id !== id))
      toast({ title: "Departamento eliminado", variant: "destructive" })
    }
  }


  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edificio no encontrado</h2>
        <Button onClick={() => router.push('/buildings')}>Volver a edificios</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER CON EDICIÓN */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                {building.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{building.address}</span>
              </div>
              {building.owner && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                  <User className="h-4 w-4" />
                  <span>Propietario: {building.owner}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isEditBuildingOpen} onOpenChange={setIsEditBuildingOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar Edificio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] overflow-visible">
            <DialogHeader>
              <DialogTitle>Editar Edificio</DialogTitle>
              <DialogDescription>Actualiza la foto y detalles del edificio.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">

              {/* SECCIÓN DE FOTO MEJORADA */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex justify-between items-center">
                  Fotografía de Portada
                </Label>

                <div className="relative group">
                  {/* Preview Box */}
                  <div
                    className={cn(
                      "relative w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 transition-all duration-300",
                      buildingForm.imageUrl ? "border-solid border-slate-200 dark:border-slate-700 shadow-sm" : "hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
                    )}
                    onClick={() => !buildingForm.imageUrl && fileInputRef.current?.click()}
                  >
                    {buildingForm.imageUrl ? (
                      <img
                        src={buildingForm.imageUrl}
                        alt="Edificio"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ objectPosition: `center ${buildingForm.imagePosition}%` }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                          Haz clic para subir foto
                        </span>
                      </div>
                    )}

                    {/* Overlay de acciones */}
                    {buildingForm.imageUrl && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 text-xs gap-2 bg-white/90 hover:bg-white text-slate-900"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-3 w-3" /> Cambiar
                        </Button>

                        <div className="flex flex-col items-end gap-2">
                          {/* Controles de Posición de 5 niveles */}
                          <div className="bg-black/60 rounded-lg p-1 flex flex-col gap-1 backdrop-blur-sm border border-white/10">
                            <p className="text-[10px] text-white/70 text-center font-medium px-1">Ajuste</p>

                            {[0, 25, 50, 75, 100].map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setBuildingForm(prev => ({ ...prev, imagePosition: pos })) }}
                                className={cn(
                                  "w-6 h-4 rounded-sm transition-all border border-transparent",
                                  buildingForm.imagePosition === pos
                                    ? "bg-blue-500 border-blue-400 shadow-sm scale-110"
                                    : "bg-white/20 hover:bg-white/40"
                                )}
                                title={`Posición ${pos}%`}
                              />
                            ))}
                          </div>

                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 mt-2"
                            onClick={handleRemoveImage}
                            title="Eliminar Foto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" value={buildingForm.name} onChange={e => setBuildingForm({ ...buildingForm, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="owner">Propietario</Label>
                  <Select value={buildingForm.owner} onValueChange={val => setBuildingForm({ ...buildingForm, owner: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_OWNERS.map(owner => (
                        <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección Completa</Label>
                <Input id="address" value={buildingForm.address} onChange={e => setBuildingForm({ ...buildingForm, address: e.target.value })} />
              </div>

            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsEditBuildingOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdateBuilding}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departamentos</CardTitle>
            <CardDescription>
              {apartments.length} departamentos registrados
            </CardDescription>
          </div>

          <Dialog open={isAddApartmentOpen} onOpenChange={setIsAddApartmentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Depto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Departamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Número</Label>
                  <Input placeholder="Ej. 101" className="col-span-3" value={newApartment.number} onChange={e => setNewApartment({ ...newApartment, number: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Piso</Label>
                  <Input type="number" placeholder="0" className="col-span-3" value={newApartment.floor} onChange={e => setNewApartment({ ...newApartment, floor: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Estado</Label>
                  <Select value={newApartment.status} onValueChange={val => setNewApartment({ ...newApartment, status: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacante</SelectItem>
                      <SelectItem value="occupied">Ocupado</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddApartment}>Registrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {apartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-muted-foreground mb-2">No hay departamentos registrados</p>
              <Button variant="outline" size="sm" onClick={() => setIsAddApartmentOpen(true)}>Registrar primer departamento</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apartment) => (
                <Card key={apartment.id} className="hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden" onClick={() => router.push(`/buildings/${buildingId}/apartments/${apartment.id}`)}>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm"
                      onClick={(e) => handleDeleteApartment(e, apartment.id)}
                      title="Eliminar departamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2 font-semibold">
                        <BuildingIcon className="h-4 w-4 text-blue-500" />
                        Depto {apartment.number}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${apartment.status === 'occupied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        apartment.status === 'vacant' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                        {apartment.status === 'occupied' ? 'Ocupado' : apartment.status === 'vacant' ? 'Vacante' : apartment.status}
                      </span>
                      <span className="text-xs text-muted-foreground border-l pl-2 border-slate-300 dark:border-slate-700">
                        Piso {apartment.floor}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline flex items-center font-medium">
                        Ver detalles <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
