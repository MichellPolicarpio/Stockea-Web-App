'use client'

import { useAuth } from '@/hooks/useAuth'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Home, ClipboardList } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { apartments, loading: apartmentsLoading } = useApartments(user)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user.role === 'admin' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Edificios
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {buildingsLoading ? '...' : buildings.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Edificios registrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Departamentos
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apartmentsLoading ? '...' : apartments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Departamentos en el sistema
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'owner' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mis Departamentos
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apartmentsLoading ? '...' : apartments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Departamentos asignados
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === 'verifier' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Departamentos Asignados
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apartmentsLoading ? '...' : apartments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Departamentos a verificar
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}


