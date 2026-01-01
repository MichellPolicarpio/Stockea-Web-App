'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apartmentService } from '@/services/apartmentService.mock'
import { inventoryService } from '@/services/inventoryService.mock'
import { Apartment } from '@/types/apartment'
import { InventoryItem } from '@/types/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, CheckSquare, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InventoryManager } from '@/components/apartments/InventoryManager'
import { AreaEvaluator } from '@/components/apartments/AreaEvaluator'
import { ApartmentDashboard } from '@/components/apartments/ApartmentDashboard'
import { Spinner } from '@/components/ui/spinner'

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
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Departamento {apartment.number}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <span className="capitalize">{apartment.status === 'occupied' ? 'Ocupado' : apartment.status === 'vacant' ? 'Vacante' : apartment.status}</span>
            <span>•</span>
            <span>Piso {apartment.floor}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-lg w-full md:w-auto flex overflow-x-auto">
          <TabsTrigger value="info" className="flex-1 md:flex-none gap-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
            <LayoutDashboard className="h-4 w-4" /> Información General
          </TabsTrigger>
          <TabsTrigger id="inventory-tab-trigger" value="inventory" className="flex-1 md:flex-none gap-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
            <Package className="h-4 w-4" /> Inventario
          </TabsTrigger>
          <TabsTrigger id="areas-tab-trigger" value="areas" className="flex-1 md:flex-none gap-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800">
            <CheckSquare className="h-4 w-4" /> Evaluación Áreas Físicas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Inmueble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium text-lg">{apartment.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Piso</p>
                  <p className="font-medium text-lg">{apartment.floor || 'PB'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado Actual</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${apartment.status === 'occupied' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    apartment.status === 'vacant' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {apartment.status === 'occupied' ? 'Ocupado' : apartment.status === 'vacant' ? 'Vacante' : apartment.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Actualización</p>
                  <p className="font-medium">{apartment.updatedAt ? new Date(apartment.updatedAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ApartmentDashboard apartmentId={apartmentId} inventory={inventory} />
        </TabsContent>

        <TabsContent value="inventory" className="animate-in fade-in slide-in-from-right-4 duration-300">
          <Card>
            <CardContent className="pt-6">
              <InventoryManager initialItems={inventory} apartmentId={apartmentId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="animate-in fade-in slide-in-from-right-4 duration-300">
          <AreaEvaluator apartmentId={apartmentId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

