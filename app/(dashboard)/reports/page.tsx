'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon, ClipboardCheck, User, Building as BuildingIcon, Home, Trash2, Edit, AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBuildings } from '@/hooks/useBuildings'
import { apartmentService } from '@/services/apartmentService.mock'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock Data
const MOCK_VERIFIERS = [
  "Juan Pérez",
  "Maria González",
  "Carlos Rodriguez",
  "Ana Martinez",
  "Roberto Sanchez"
]

interface Assignment {
  id: string
  verifier: string
  date: string // Store as string for JSON serialization
  buildingId: string
  buildingName: string
  apartmentId: string
  apartmentNumber: string
  status: 'pending' | 'completed'
}

export default function ReportsPage() {
  // Hooks
  const { buildings } = useBuildings()
  const { toast } = useToast()

  // Form State (New Assignment)
  const [selectedVerifier, setSelectedVerifier] = useState<string>('')
  const [date, setDate] = useState<Date>()
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('')
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>('')

  // Data State
  const [apartments, setApartments] = useState<{ id: string, number: string }[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loadingApts, setLoadingApts] = useState(false)

  // Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingAssignment, setPendingAssignment] = useState<Assignment | null>(null)

  // Edit/Delete State
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editDate, setEditDate] = useState<Date>()
  const [editVerifier, setEditVerifier] = useState('')

  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Load Assignments from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('reports_assignments')
    if (saved) {
      try {
        setAssignments(JSON.parse(saved))
      } catch (e) {
        console.error("Error parsing assignments", e)
      }
    }
  }, [])

  // Save Assignments to LocalStorage
  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem('reports_assignments', JSON.stringify(assignments))
    }
  }, [assignments])

  // Load Apartments when Building changes
  useEffect(() => {
    if (selectedBuildingId) {
      setLoadingApts(true)
      apartmentService.getByBuildingId(selectedBuildingId)
        .then(data => {
          setApartments(data.map(apt => ({ id: apt.id, number: apt.number })))
        })
        .finally(() => setLoadingApts(false))
    } else {
      setApartments([])
    }
  }, [selectedBuildingId])


  // 1. Prepare Creation (Validation)
  const handlePreCreate = () => {
    if (!selectedVerifier || !date || !selectedBuildingId || !selectedApartmentId) {
      toast({ title: "Faltan datos", description: "Completa todos los campos.", variant: "destructive" })
      return
    }

    const building = buildings.find(b => b.id === selectedBuildingId)
    const apartment = apartments.find(a => a.id === selectedApartmentId)

    const draft: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      verifier: selectedVerifier,
      date: date.toISOString(),
      buildingId: selectedBuildingId,
      buildingName: building?.name || 'Desconocido',
      apartmentId: selectedApartmentId,
      apartmentNumber: apartment?.number || '?',
      status: 'pending'
    }

    setPendingAssignment(draft)
    setIsConfirmOpen(true)
  }

  // 2. Confirm Creation
  const handleConfirmCreate = () => {
    if (!pendingAssignment) return

    setAssignments(prev => [pendingAssignment, ...prev])
    setIsConfirmOpen(false)
    setPendingAssignment(null)

    // Reset parts of form
    setSelectedApartmentId('')

    toast({ title: "Asignación creada", description: "La verificación ha sido programada exitosamente." })
  }

  // 3. Delete
  const handleDelete = () => {
    if (!deleteId) return
    setAssignments(prev => prev.filter(a => a.id !== deleteId))
    setDeleteId(null)
    toast({ title: "Asignación eliminada", variant: "default" })
  }

  // 4. Edit Start
  const handleEditStart = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setEditDate(new Date(assignment.date))
    setEditVerifier(assignment.verifier)
    setIsEditOpen(true)
  }

  // 5. Edit Save
  const handleEditSave = () => {
    if (!editingAssignment || !editDate || !editVerifier) return

    const updatedAssignments = assignments.map(a =>
      a.id === editingAssignment.id
        ? { ...a, date: editDate.toISOString(), verifier: editVerifier }
        : a
    )

    setAssignments(updatedAssignments)
    setIsEditOpen(false)
    setEditingAssignment(null)
    toast({ title: "Cambios guardados", description: "La asignación ha sido actualizada." })
  }

  // 6. Toggle Status
  const handleToggleStatus = (id: string) => {
    const updated = assignments.map(a =>
      a.id === id ? { ...a, status: (a.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed' } : a
    )
    setAssignments(updated)
    toast({ title: "Estado actualizado" })
  }

  // Estadísticas
  const total = assignments.length
  const pending = assignments.filter(a => a.status === 'pending').length
  const completed = assignments.filter(a => a.status === 'completed').length


  return (
    <div className="space-y-6 animate-in fade-in duration-500">


      {/* KPI STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Totales */}
        <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-900 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Total
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </CardHeader>
          <CardContent className="z-10 relative pt-0 pb-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{total}</div>
            <p className="text-xs text-slate-500">Asignaciones globales</p>
          </CardContent>
        </Card>

        {/* Pendientes */}
        <Card className="bg-white dark:bg-slate-950 border-amber-100 dark:border-amber-900/30 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-amber-50 to-transparent dark:from-amber-900/20 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider">
              Pendientes
            </CardTitle>
            <CircleDashed className="h-4 w-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
          </CardHeader>
          <CardContent className="z-10 relative pt-0 pb-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{pending}</div>
            <p className="text-xs text-amber-500/80">Por verificar</p>
          </CardContent>
        </Card>

        {/* Completadas */}
        <Card className="bg-white dark:bg-slate-950 border-green-100 dark:border-green-900/30 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-green-50 to-transparent dark:from-green-900/20 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-semibold text-green-600 dark:text-green-500 uppercase tracking-wider">
              Completas
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-400 group-hover:text-green-600 transition-colors" />
          </CardHeader>
          <CardContent className="z-10 relative pt-0 pb-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">{completed}</div>
            <p className="text-xs text-green-500/80">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulario de Asignación */}
        <Card className="md:col-span-1 border-blue-100 dark:border-blue-900 shadow-md h-fit">
          <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <ClipboardCheck className="h-5 w-5" />
              Programar Verificación
            </CardTitle>
            <CardDescription>
              Asigna un verificador a una inspección de inventario.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">

            <div className="space-y-2">
              <Label>Verificador Asignado</Label>
              <Select value={selectedVerifier} onValueChange={setSelectedVerifier}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar personal" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_VERIFIERS.map(verifier => (
                    <SelectItem key={verifier} value={verifier}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {verifier}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label>Fecha Programada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center w-full",
                        caption_label: "text-sm font-medium",
                        nav: "flex items-center justify-between absolute inset-x-0 top-0 w-full px-2 z-10",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-slate-100 dark:border-slate-800 rounded-md shadow-sm bg-white dark:bg-slate-900",
                        nav_button_previous: "static",
                        nav_button_next: "static",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                        day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white font-semibold",
                        day_today: "bg-slate-100 text-accent-foreground",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Edificio</Label>
                <Select value={selectedBuildingId} onValueChange={setSelectedBuildingId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map(building => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Departamento</Label>
                <Select value={selectedApartmentId} onValueChange={setSelectedApartmentId} disabled={!selectedBuildingId || loadingApts}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={loadingApts ? "Cargando..." : "Seleccionar"} />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map(apt => (
                      <SelectItem key={apt.id} value={apt.id}>
                        Depto {apt.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white h-10" onClick={handlePreCreate}>
              Continuar
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Asignaciones */}
        <Card className="md:col-span-1 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Asignaciones Recientes</CardTitle>
            <CardDescription>
              {assignments.length} verificaciones programadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <ClipboardCheck className="h-10 w-10 mb-2 opacity-20" />
                <p>No hay asignaciones creadas.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {assignments.map(assign => (
                  <div key={assign.id} className={cn(
                    "flex flex-col p-4 rounded-lg border shadow-sm transition-all group",
                    assign.status === 'completed' ? "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 opacity-75" : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:shadow-md"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(assign.id)}
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors",
                            assign.status === 'completed'
                              ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                              : "border-slate-300 text-transparent hover:border-blue-400 hover:text-slate-300"
                          )}
                          title={assign.status === 'completed' ? "Marcar como pendiente" : "Marcar como completada"}
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        </button>
                        <div>
                          <h4 className={cn("font-semibold text-sm leading-none", assign.status === 'completed' && "text-muted-foreground line-through")}>{assign.verifier}</h4>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wide font-medium",
                            assign.status === 'completed' ? "text-green-600 dark:text-green-500" : "text-amber-500"
                          )}>
                            {assign.status === 'pending' ? 'Pendiente' : 'Completado'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600" onClick={() => handleEditStart(assign)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600" onClick={() => setDeleteId(assign.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <BuildingIcon className="h-3.5 w-3.5" />
                        <span className="truncate">{assign.buildingName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Home className="h-3.5 w-3.5" />
                        <span>Depto {assign.apartmentNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 col-span-2 border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="font-medium text-slate-900 dark:text-slate-200">
                          {format(new Date(assign.date), 'PPP', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CONFIRMATION DIALOG (Create) */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Asignación</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor verifica los detalles antes de crear la asignación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingAssignment && (
            <div className="bg-muted/50 p-4 rounded-md space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Verificador:</span>
                <span className="font-medium">{pendingAssignment.verifier}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{format(new Date(pendingAssignment.date), 'PPP', { locale: es })}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Ubicación:</span>
                <span className="font-medium text-right">{pendingAssignment.buildingName}<br />Depto {pendingAssignment.apartmentNumber}</span>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCreate} className="bg-blue-600 hover:bg-blue-700">Confirmar y Crear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" /> Eliminar Asignación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta asignación? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Asignación</DialogTitle>
            <DialogDescription>Modifica el verificador o la fecha de la inspección.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Verificador</Label>
              <Select value={editVerifier} onValueChange={setEditVerifier}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_VERIFIERS.map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editDate ? format(editDate, "PPP", { locale: es }) : <span>Seleccionar</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editDate}
                    onSelect={setEditDate}
                    initialFocus
                    className="rounded-md border shadow-sm p-4"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
