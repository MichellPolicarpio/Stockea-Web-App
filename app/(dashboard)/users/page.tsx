'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, MoreHorizontal, Loader2, Trash2, Shield, UserPlus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const { user } = useAuth()
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button className="bg-slate-900 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Propietarios
            </CardTitle>
            <CardDescription>
              Gestiona propietarios y asigna departamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/users/owners">
              <Button variant="outline" className="w-full">
                Gestionar Propietarios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Verificadores
            </CardTitle>
            <CardDescription>
              Gestiona verificadores y asigna departamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/users/verifiers">
              <Button variant="outline" className="w-full">
                Gestionar Verificadores
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


