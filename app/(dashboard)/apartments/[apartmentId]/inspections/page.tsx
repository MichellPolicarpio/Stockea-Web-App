'use client'

import { useState, useEffect } from 'react'
import { inspectionService } from '@/services/inspectionService.mock'
import { Inspection } from '@/types/inspection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ClipboardList, Plus } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export default function InspectionsPage() {
  const params = useParams()
  const apartmentId = params.apartmentId as string
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadInspections = async () => {
      setLoading(true)
      const data = await inspectionService.getByApartmentId(apartmentId)
      setInspections(data)
      setLoading(false)
    }
    loadInspections()
  }, [apartmentId])

  const canCreate = user?.role === 'verifier'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Inspecciones</h1>
            <p className="text-muted-foreground">
              Historial de verificaciones del departamento
            </p>
          </div>
        </div>
        {canCreate && (
          <Link href={`/dashboard/apartments/${apartmentId}/inspections/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Inspección
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div>Cargando inspecciones...</div>
      ) : inspections.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <ClipboardList className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay inspecciones</EmptyTitle>
            <EmptyDescription>
              {canCreate
                ? 'Comienza creando una nueva inspección para este departamento'
                : 'Este departamento no tiene inspecciones registradas'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <Card key={inspection.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Inspección #{inspection.id.slice(-6)}</CardTitle>
                    <CardDescription>
                      {inspection.completedAt
                        ? new Date(inspection.completedAt).toLocaleDateString('es-ES')
                        : 'Pendiente'}
                    </CardDescription>
                  </div>
                  <Badge variant={inspection.status === 'completed' ? 'default' : 'secondary'}>
                    {statusLabels[inspection.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Items verificados</p>
                    <p className="font-medium">{inspection.items.length}</p>
                  </div>
                  {inspection.generalNotes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notas generales</p>
                      <p className="text-sm">{inspection.generalNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

