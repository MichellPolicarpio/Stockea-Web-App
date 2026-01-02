'use client'

import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Building as BuildingIcon
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock Data (Shared or similar to Dashboard)
const MOCK_ASSIGNMENTS = [
  { id: 1, building: 'Casa Tortuga', apartment: '101', date: '2024-10-15', status: 'pending', priority: 'high', address: 'Av. Costera 123', notes: 'Revisión anual' },
  { id: 2, building: 'Villa Sol', apartment: '304', date: '2024-10-16', status: 'pending', priority: 'medium', address: 'Calle Sol 45', notes: 'Entrega de llaves' },
  { id: 3, building: 'Casa Bamba', apartment: '002', date: '2024-10-10', status: 'overdue', priority: 'high', address: 'Blvd. Las Palmas 88', notes: 'Reporte de daños previo' },
  { id: 4, building: 'El Palmar', apartment: 'PH-1', date: '2024-10-20', status: 'completed', priority: 'low', address: 'Zona Hotelera Km 5', notes: 'Limpieza finalizada' },
  // Owner specific mock
  { id: 5, building: 'Casa Tortuga', apartment: '102', date: '2024-10-25', status: 'completed', priority: 'low', address: 'Av. Costera 123', notes: 'Mantenimiento Preventivo' },
]

export default function AssignedApartmentsPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Filter logic: Owner sees ONLY their specific unit (Casa Tortuga 102 for demo)
  const assignments = user.role === 'owner'
    ? MOCK_ASSIGNMENTS.filter(a => a.building === 'Casa Tortuga' && a.apartment === '102')
    : MOCK_ASSIGNMENTS.filter(a => a.apartment !== '102') // Verifiers see the rest

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900'
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900'
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'pending': return 'Pendiente'
      case 'overdue': return 'Atrasado'
      default: return status
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {user.role === 'owner' ? 'Mis Propiedades' : 'Departamentos Asignados'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'owner' ? 'Visualiza el estado y reportes de tus inmuebles.' : 'Gestiona tus visitas y reportes de inspección.'}
          </p>
        </div>
        {/* Search / Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar edificio o depto..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assignments.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-all group flex flex-col h-full border-t-4" style={{
            borderTopColor: item.status === 'overdue' ? '#ef4444' : item.status === 'completed' ? '#10b981' : '#3b82f6'
          }}>
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start mb-1">
                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", getStatusColor(item.status))}>
                  {getStatusLabel(item.status)}
                </Badge>
                {item.priority === 'high' && (
                  <div className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </div>
                )}
              </div>
              <CardTitle className="text-base font-bold flex items-center justify-between leading-tight">
                <span className="truncate" title={item.building}>{item.building}</span>
              </CardTitle>
              <CardDescription className="text-sm font-medium text-slate-900 dark:text-white">
                Depto {item.apartment}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-1 space-y-3 text-xs text-slate-500">
              {/* Date & Time info */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
                <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 w-10 h-10 flex-shrink-0 shadow-sm">
                  <span className="text-[8px] font-bold uppercase text-slate-400">OCT</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Programado</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {new Date(item.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <BuildingIcon className="h-3 w-3 text-slate-400 mt-0.5" />
                  <span className="italic text-slate-600 dark:text-slate-400 line-clamp-1">{item.notes}</span>
                </div>
              </div>
            </CardContent>

            <div className="p-4 pt-0 mt-auto flex gap-2">
              {item.status === 'completed' ? (
                <>
                  <Button
                    className="flex-1 h-8 text-xs gap-1"
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/inspections/${item.id}?mode=view`)}
                  >
                    <span className="truncate">Ver Reporte</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button
                    className="h-8 w-8 px-0 text-slate-400 hover:text-blue-600"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/inspections/${item.id}?mode=edit`)}
                    title="Editar Reporte"
                  >
                    <span className="sr-only">Editar</span>
                    {/* Pencil Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full h-8 text-xs gap-1 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/inspections/${item.id}?mode=edit`)}
                >
                  Iniciar Inspección
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>
          </Card>
        ))}  </div>
    </div>
  )
}
