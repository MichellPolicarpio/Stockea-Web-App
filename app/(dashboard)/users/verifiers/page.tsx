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

export default function VerifiersPage() {
  const { user } = useAuth()
  const [verifiers, setVerifiers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    const loadVerifiers = async () => {
      setLoading(true)
      const data = await userService.getVerifiers()
      setVerifiers(data)
      setLoading(false)
    }
    loadVerifiers()
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
          <h1 className="text-3xl font-bold">Verificadores</h1>
          <p className="text-muted-foreground">
            Gestiona verificadores y sus asignaciones
          </p>
        </div>
      </div>

      {loading ? (
        <div>Cargando verificadores...</div>
      ) : verifiers.length === 0 ? (
        <Empty>
          <EmptyMedia>
            <Users className="h-12 w-12" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No hay verificadores</EmptyTitle>
            <EmptyDescription>
              Comienza agregando verificadores al sistema
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {verifiers.map((verifier) => (
            <Card key={verifier.id}>
              <CardHeader>
                <CardTitle>{verifier.name}</CardTitle>
                <CardDescription>{verifier.email}</CardDescription>
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


