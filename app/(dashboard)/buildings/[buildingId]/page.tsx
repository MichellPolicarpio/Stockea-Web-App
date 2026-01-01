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
import { Spinner } from '@/components/ui/spinner'

export default function BuildingDetailPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const { getBuildingById } = useBuildings()
  const [building, setBuilding] = useState<Awaited<ReturnType<typeof getBuildingById>>>(null)
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const buildingData = await getBuildingById(buildingId)

        if (!buildingData) {
          // Si el servicio no devuelve nada, no es una excepción, pero es un "Not Found" lógico
          // Dejamos building en null se manejará abajo
        } else {
          setBuilding(buildingData)
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
        <p className="text-slate-500">No se pudo encontrar el edificio con ID: {buildingId}</p>
        <Button onClick={() => router.push('/buildings')}>
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{building.name}</h1>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-muted-foreground mb-2">No hay departamentos registrados</p>
              <Button variant="outline" size="sm">Registrar primer departamento</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apartment) => (
                <Card key={apartment.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => router.push(`/buildings/${buildingId}/apartments/${apartment.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-500" />
                        Depto {apartment.number}
                      </span>
                      {apartment.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${apartment.status === 'occupied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          apartment.status === 'vacant' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                          {apartment.status === 'occupied' ? 'Ocupado' : apartment.status === 'vacant' ? 'Vacante' : apartment.status}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Piso {apartment.floor || 'PB'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end pt-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
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

