'use client'

import { useEffect, useState } from 'react'
import { InventoryItem, InventoryStatus } from '@/types/inventory'
import { AreaEvaluation } from '@/types/area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2, Package, Home, AlertTriangle } from 'lucide-react'

interface ApartmentDashboardProps {
    apartmentId: string
    inventory: InventoryItem[]
}

export function ApartmentDashboard({ apartmentId, inventory }: ApartmentDashboardProps) {
    const [areaStats, setAreaStats] = useState({
        total: 0,
        good: 0,
        issues: 0,
        issueCount: 0
    })

    // Calcular estadísticas de Inventario
    const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0)

    // Conteo por estado
    const statusCounts = inventory.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + item.quantity
        return acc
    }, {} as Record<InventoryStatus, number>)

    const goodItems = statusCounts['ok'] || 0
    const damagedItems = (statusCounts['damaged'] || 0) + (statusCounts['needs_replacement'] || 0) + (statusCounts['missing'] || 0)
    const healthPercentage = totalItems > 0 ? (goodItems / totalItems) * 100 : 100

    // Conteo por Categoría
    const paramCategoryCounts = inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity
        return acc
    }, {} as Record<string, number>)

    // Ordenar categorías por cantidad
    const topCategories = Object.entries(paramCategoryCounts)
        .sort(([, a], [, b]) => b - a)

    // Leer estadísticas de Áreas desde LocalStorage
    useEffect(() => {
        const savedAreas = localStorage.getItem(`areas_list_${apartmentId}`)
        const savedEvals = localStorage.getItem(`area_evaluations_${apartmentId}`)

        if (savedAreas && savedEvals) {
            try {
                const areasList = JSON.parse(savedAreas) as string[]
                const evalsMap = JSON.parse(savedEvals) as Record<string, { good: boolean, issues: string[] }>

                let good = 0
                let issues = 0
                let totalIssuesCount = 0

                areasList.forEach(area => {
                    const evaluation = evalsMap[area]
                    // Si no hay evaluación, asumimos que está pendiente o bien (depende de lógica), aquí solo contamos lo evaluado explícitamente si existe en el mapa
                    if (evaluation) {
                        if (evaluation.good) {
                            good++
                        } else {
                            issues++
                            totalIssuesCount += evaluation.issues?.length || 0
                        }
                    } else {
                        // Area existe pero no se ha guardado estado -> asumimos Default (Good) o ignoramos
                        good++
                    }
                })

                setAreaStats({
                    total: areasList.length,
                    good,
                    issues,
                    issueCount: totalIssuesCount
                })
            } catch (e) {
                console.error("Error calculando stats de áreas", e)
            }
        }
    }, [apartmentId])

    return (
        <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventario Total</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems} <span className="text-xs font-normal text-muted-foreground">objetos</span></div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {inventory.length} registros individuales
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estado del Inventario</CardTitle>
                        {healthPercentage < 80 ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(healthPercentage)}% <span className="text-xs font-normal text-muted-foreground">buen estado</span></div>
                        <Progress value={healthPercentage} className="h-2 mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Áreas con Detalles</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{areaStats.issues} <span className="text-xs font-normal text-muted-foreground">de {areaStats.total} áreas</span></div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {areaStats.issueCount} desperfectos reportados
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Objetos Críticos</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{damagedItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dañados, faltantes o requieren cambio
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Desglose por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCategories.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No hay datos de inventario.</p>
                            ) : (
                                topCategories.map(([cat, count]) => (
                                    <div key={cat} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{cat}</span>
                                            <span className="text-muted-foreground">{count} ({Math.round((count / totalItems) * 100)}%)</span>
                                        </div>
                                        <Progress value={(count / totalItems) * 100} className="h-2" />
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Resumen de Estado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4" /> Buen Estado
                                </span>
                                <span className="font-bold">{statusCounts['ok'] || 0}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-4 w-4" /> Requiere Reemplazo
                                </span>
                                <span className="font-bold">{statusCounts['needs_replacement'] || 0}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                                    <AlertTriangle className="h-4 w-4" /> Dañado
                                </span>
                                <span className="font-bold">{statusCounts['damaged'] || 0}</span>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                                    <AlertTriangle className="h-4 w-4" /> Faltante
                                </span>
                                <span className="font-bold">{statusCounts['missing'] || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
