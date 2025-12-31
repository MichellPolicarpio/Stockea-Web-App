'use client'

import { useAuth } from '@/hooks/useAuth'
import { useApartments } from '@/hooks/useApartments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import Link from 'next/link'

export default function ApartmentsPage() {
  const { user } = useAuth()
  const { apartments, loading } = useApartments(user)
  const router = useRouter()

  if (!user) return null

  const isVerifier = user.role === 'verifier'
  const isOwner = user.role === 'owner'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
      </div>

      {loading ? (
        <div>Cargando departamentos...</div>
      ) : apartments.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Home className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>
              {isVerifier ? 'No hay departamentos asignados' : 'No tienes departamentos'}
            </EmptyTitle>
            <EmptyDescription>
              {isVerifier
                ? 'No tienes departamentos asignados para verificar'
                : 'No tienes departamentos registrados'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
              <CardContent className="space-y-2">
                {isVerifier && (
                  <Link href={`/apartments/${apartment.id}/inspections/new`}>
                    <Button className="w-full">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Nueva Verificación
                    </Button>
                  </Link>
                )}
                <Link href={`/apartments/${apartment.id}/inventory`}>
                  <Button variant="outline" className="w-full">
                    Ver Inventario
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/apartments/${apartment.id}/inspections`}>
                  <Button variant="outline" className="w-full">
                    Ver Inspecciones
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


