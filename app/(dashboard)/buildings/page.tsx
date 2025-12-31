'use client'

import { useBuildings } from '@/hooks/useBuildings'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, ArrowRight, Plus } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export default function BuildingsPage() {
  const { user } = useAuth()
  const { buildings, loading } = useBuildings()
  const router = useRouter()

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center p-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder a esta página
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (loading) {
    return <div>Cargando edificios...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" /> Agregar Edificio
        </Button>
      </div>

      {buildings.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Building2 className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay edificios</EmptyTitle>
            <EmptyDescription>
              Comienza agregando tu primer edificio al sistema
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <Card key={building.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {building.name}
                </CardTitle>
                <CardDescription>{building.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {building.totalApartments} departamentos
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/buildings/${building.id}`)}
                  >
                    Ver detalles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


