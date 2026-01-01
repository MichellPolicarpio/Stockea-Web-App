'use client'

import { useBuildings } from '@/hooks/useBuildings'
import { apartmentService } from '@/services/apartmentService.mock'
import { useState, useEffect } from 'react'
import { Apartment } from '@/types/apartment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, ArrowRight, Edit, Trash2, Plus, Building as BuildingIcon, MapPin, User, Save } from 'lucide-react'
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

  // Estados para Edición de Edificio
  const [isEditBuildingOpen, setIsEditBuildingOpen] = useState(false)
  const [buildingForm, setBuildingForm] = useState({ name: '', address: '', owner: '' })

  // Estados para Agregar Departamento
  const [isAddApartmentOpen, setIsAddApartmentOpen] = useState(false)
  const [newApartment, setNewApartment] = useState({ number: '', floor: '', status: 'vacant' })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const buildingData = await getBuildingById(buildingId)

        if (buildingData) {
          setBuilding(buildingData)
          setBuildingForm({
            name: buildingData.name,
            address: buildingData.address,
            owner: buildingData.owner || ''
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

  const handleUpdateBuilding = () => {
    if (!building) return
    const updated = { ...building, ...buildingForm }
    setBuilding(updated)
    // Aquí llamaríamos al servicio de backend para persistir
    setIsEditBuildingOpen(false)
    toast({ title: "Edificio actualizado", description: "Los datos han sido guardados." })
  }

  const handleAddApartment = () => {
    if (!newApartment.number) {
      toast({ title: "Error", description: "El número es obligatorio", variant: "destructive" })
      return
    }

    const newItem: Apartment = {
      id: `apt-${Date.now()}`,
      buildingId,
      number: newApartment.number,
      floor: newApartment.floor ? parseInt(newApartment.floor) : 0,
      status: newApartment.status as 'vacant' | 'occupied' | 'maintenance',
      // rooms removed
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setApartments([...apartments, newItem])
    // Persistir mock si fuera necesario
    setIsAddApartmentOpen(false)
    setNewApartment({ number: '', floor: '', status: 'vacant' })
    toast({ title: "Departamento agregado", description: `Depto ${newItem.number} creado.` })
  }

  const handleDeleteApartment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Evitar navegar al hacer click en borrar
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Información del Edificio</DialogTitle>
              <DialogDescription>Modifica los detalles generales del edificio.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Edificio</Label>
                <Input id="name" value={buildingForm.name} onChange={e => setBuildingForm({ ...buildingForm, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={buildingForm.address} onChange={e => setBuildingForm({ ...buildingForm, address: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="owner">Propietario</Label>
                <Select value={buildingForm.owner} onValueChange={val => setBuildingForm({ ...buildingForm, owner: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_OWNERS.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateBuilding}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* LISTA DE DEPARTAMENTOS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departamentos</CardTitle>
            <CardDescription>
              {apartments.length} departamentos en este edificio
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
                  {/* Delete Button Overlay */}
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
