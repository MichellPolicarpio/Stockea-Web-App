'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { inspectionService } from '@/services/inspectionService.mock'
import { Inspection } from '@/types/inspection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardList } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export default function InspectionsHistoryPage() {
  const { user } = useAuth()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'verifier') return

    const loadInspections = async () => {
      setLoading(true)
      const data = await inspectionService.getByVerifierId(user.id)
      setInspections(data)
      setLoading(false)
    }
    loadInspections()
  }, [user])

  if (user?.role !== 'verifier') {
    return (
      <div className="flex items-center justify-center p-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los verificadores pueden acceder a esta página
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="bg-slate-900 text-white">
          <ClipboardList className="mr-2 h-4 w-4" /> Nueva Inspección
        </Button>
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
              Aún no has realizado ninguna inspección
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
                      Departamento: {inspection.apartmentId}
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
                  {inspection.completedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de completado</p>
                      <p className="font-medium">
                        {new Date(inspection.completedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
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


