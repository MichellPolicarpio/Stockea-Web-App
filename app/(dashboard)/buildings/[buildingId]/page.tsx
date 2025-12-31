'use client'

import { useBuildings } from '@/hooks/useBuildings'
import { apartmentService } from '@/services/apartmentService.mock'
import { useState, useEffect } from 'react'
import { Apartment } from '@/types/apartment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function BuildingDetailPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const { getBuildingById } = useBuildings()
  const [building, setBuilding] = useState<Awaited<ReturnType<typeof getBuildingById>>>(null)
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const buildingData = await getBuildingById(buildingId)
      setBuilding(buildingData)
      const apartmentsData = await apartmentService.getByBuildingId(buildingId)
      setApartments(apartmentsData)
      setLoading(false)
    }
    loadData()
  }, [buildingId, getBuildingById])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!building) {
    return (
      <div>
        <p>Edificio no encontrado</p>
        <Button onClick={() => router.push('/dashboard/buildings')}>
          Volver a edificios
        </Button>
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
          <h1 className="text-3xl font-bold">{building.name}</h1>
          <p className="text-muted-foreground">{building.address}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departamentos</CardTitle>
          <CardDescription>
            {apartments.length} departamentos en este edificio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apartments.length === 0 ? (
            <p className="text-muted-foreground">No hay departamentos registrados</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apartment) => (
                <Card key={apartment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Departamento {apartment.number}
                    </CardTitle>
                    <CardDescription>
                      {apartment.floor && `Piso ${apartment.floor}`}
                      {apartment.status && ` • ${apartment.status}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/buildings/${buildingId}/apartments/${apartment.id}`}>
                      <Button variant="outline" className="w-full">
                        Ver detalles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
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

