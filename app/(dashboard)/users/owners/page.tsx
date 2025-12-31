'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService.mock'
import { User } from '@/types/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export default function OwnersPage() {
  const { user } = useAuth()
  const [owners, setOwners] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    const loadOwners = async () => {
      setLoading(true)
      const data = await userService.getOwners()
      setOwners(data)
      setLoading(false)
    }
    loadOwners()
  }, [user, router])

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Propietarios</h1>
          <p className="text-muted-foreground">
            Gestiona propietarios y sus asignaciones
          </p>
        </div>
      </div>

      {loading ? (
        <div>Cargando propietarios...</div>
      ) : owners.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Users className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay propietarios</EmptyTitle>
            <EmptyDescription>
              Comienza agregando propietarios al sistema
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {owners.map((owner) => (
            <Card key={owner.id}>
              <CardHeader>
                <CardTitle>{owner.name}</CardTitle>
                <CardDescription>{owner.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Departamentos Asignados
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


