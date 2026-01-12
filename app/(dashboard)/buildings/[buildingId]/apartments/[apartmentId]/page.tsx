'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apartmentService } from '@/services/apartmentService.mock'
import { inventoryService } from '@/services/inventoryService.mock'
import { useBuildings } from '@/hooks/useBuildings'
import { Apartment } from '@/types/apartment'
import { InventoryItem } from '@/types/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, CheckSquare, LayoutDashboard, DollarSign, Wrench } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InventoryManager } from '@/components/apartments/InventoryManager'
import { AccountingDashboard } from '@/components/apartments/AccountingDashboard'
import { AreaConfigurator } from '@/components/apartments/AreaConfigurator'
import { ApartmentDashboard } from '@/components/apartments/ApartmentDashboard'
import { Spinner } from '@/components/ui/spinner'

export default function ApartmentDetailPage() {
  const params = useParams()
  const buildingId = params.buildingId as string
  const apartmentId = params.apartmentId as string
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [buildingName, setBuildingName] = useState<string>('')
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const { getBuildingById } = useBuildings()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const apartmentData = await apartmentService.getById(apartmentId)
      setApartment(apartmentData)

      const buildingData = await getBuildingById(buildingId)
      if (buildingData) setBuildingName(buildingData.name)

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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 pb-24 md:p-8">
      <Tabs defaultValue="info" className="space-y-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Departamento {apartment.number}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{buildingName}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>Piso {apartment.floor}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-2 xl:pb-0 -mx-4 px-4 xl:mx-0 xl:px-0 flex justify-center xl:block">
            <TabsList className="bg-slate-200/60 dark:bg-slate-800 p-1.5 rounded-full inline-flex h-auto items-center border border-slate-300/60 dark:border-slate-700 shadow-sm backdrop-blur-md">
              <TabsTrigger value="info" className="rounded-full px-3 md:px-4 py-2 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Información General</span>
              </TabsTrigger>
              <TabsTrigger id="inventory-tab-trigger" value="inventory" className="rounded-full px-3 md:px-4 py-2 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300">
                <Package className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Inventario</span>
              </TabsTrigger>
              <TabsTrigger value="accounting" className="rounded-full px-3 md:px-4 py-2 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300">
                <DollarSign className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Contabilidad</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="rounded-full px-3 md:px-4 py-2 gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300">
                <Wrench className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Mantenimiento</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="info" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-200">Información del Inmueble</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Número</p>
                  <p className="font-bold text-2xl text-slate-900 dark:text-white">{apartment.number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Piso</p>
                  <p className="font-bold text-2xl text-slate-900 dark:text-white">{apartment.floor || 'PB'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Actualizado</p>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">{apartment.updatedAt ? new Date(apartment.updatedAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ApartmentDashboard apartmentId={apartmentId} inventory={inventory} />
        </TabsContent>

        <TabsContent value="inventory" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="pt-6">
              <InventoryManager initialItems={inventory} apartmentId={apartmentId} />
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="accounting" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AccountingDashboard apartmentId={apartmentId} />
        </TabsContent>

        <TabsContent value="maintenance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
              <Wrench className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sección de Mantenimiento</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
              Próximamente podrás registrar reportes, reparaciones y seguimiento de mantenimiento.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

