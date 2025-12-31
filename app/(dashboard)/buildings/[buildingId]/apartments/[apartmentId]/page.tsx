'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apartmentService } from '@/services/apartmentService.mock'
import { inventoryService } from '@/services/inventoryService.mock'
import { Apartment } from '@/types/apartment'
import { InventoryItem } from '@/types/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

export default function ApartmentDetailPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const apartmentId = params.apartmentId as string
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const apartmentData = await apartmentService.getById(apartmentId)
      setApartment(apartmentData)
      const inventoryData = await inventoryService.getByApartmentId(apartmentId)
      setInventory(inventoryData)
      setLoading(false)
    }
    loadData()
  }, [apartmentId])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!apartment) {
    return (
      <div>
        <p>Departamento no encontrado</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Departamento {apartment.number}</h1>
          <p className="text-muted-foreground">
            Estado: {apartment.status}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Número</p>
              <p className="font-medium">{apartment.number}</p>
            </div>
            {apartment.floor && (
              <div>
                <p className="text-sm text-muted-foreground">Piso</p>
                <p className="font-medium">{apartment.floor}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium capitalize">{apartment.status}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={`/dashboard/apartments/${apartmentId}/inventory`} className="block">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Ver Inventario ({inventory.length})
              </Button>
            </Link>
            <Link href={`/dashboard/apartments/${apartmentId}/inspections`} className="block">
              <Button variant="outline" className="w-full">
                Ver Inspecciones
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

