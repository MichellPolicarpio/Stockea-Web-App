'use client'

import { useInventory } from '@/hooks/useInventory'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Package } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

const statusLabels: Record<string, string> = {
  ok: 'Buen estado',
  damaged: 'Dañado',
  missing: 'Faltante',
  needs_replacement: 'Requiere reemplazo',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ok: 'default',
  damaged: 'destructive',
  missing: 'destructive',
  needs_replacement: 'secondary',
}

export default function InventoryPage() {
  const params = useParams()
  const apartmentId = params.apartmentId as string
  const { items, loading } = useInventory(apartmentId)
  const { user } = useAuth()
  const router = useRouter()

  const canEdit = user?.role === 'admin' || user?.role === 'owner'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Inventario</h1>
            <p className="text-muted-foreground">
              Gestión de items del departamento
            </p>
          </div>
        </div>
        {canEdit && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Item
          </Button>
        )}
      </div>

      {loading ? (
        <div>Cargando inventario...</div>
      ) : items.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Package className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay items en el inventario</EmptyTitle>
            <EmptyDescription>
              {canEdit
                ? 'Comienza agregando items al inventario de este departamento'
                : 'Este departamento no tiene items registrados'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant={statusColors[item.status] || 'default'}>
                    {statusLabels[item.status] || item.status}
                  </Badge>
                </div>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Cantidad</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  {item.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Descripción</p>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  )}
                  {item.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notas</p>
                      <p className="text-sm">{item.notes}</p>
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

