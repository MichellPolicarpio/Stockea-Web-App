'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useInventory } from '@/hooks/useInventory'
import { useInspectionForm } from '@/hooks/useInspectionForm'
import { inspectionService } from '@/services/inspectionService.mock'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Save } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function NewInspectionPage() {
  const params = useParams()
  const apartmentId = params.apartmentId as string
  const { user } = useAuth()
  const { items, loading: inventoryLoading } = useInventory(apartmentId)
  const {
    items: formItems,
    notes,
    generalNotes,
    hasIssues,
    updateItemStatus,
    updateItemNotes,
    setGeneralNotes,
    getFormData,
  } = useInspectionForm(apartmentId, items)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== 'verifier') {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      const formData = getFormData()
      await inspectionService.create({
        ...formData,
        verifierId: user!.id,
      })
      router.push(`/dashboard/apartments/${apartmentId}/inspections`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar inspección')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'verifier') {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nueva Inspección</h1>
          <p className="text-muted-foreground">
            Verifica el estado de los items del inventario
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {inventoryLoading ? (
        <div>Cargando inventario...</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const status = formItems[item.id] || 'ok'
            const itemNotes = notes[item.id] || ''

            return (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Estado</Label>
                    <RadioGroup
                      value={status}
                      onValueChange={(value) =>
                        updateItemStatus(item.id, value as 'ok' | 'issue' | 'missing')
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ok" id={`${item.id}-ok`} />
                        <Label htmlFor={`${item.id}-ok`} className="cursor-pointer">
                          OK
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="issue" id={`${item.id}-issue`} />
                        <Label htmlFor={`${item.id}-issue`} className="cursor-pointer">
                          Problema
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="missing" id={`${item.id}-missing`} />
                        <Label htmlFor={`${item.id}-missing`} className="cursor-pointer">
                          Faltante
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {(status === 'issue' || status === 'missing') && (
                    <div>
                      <Label htmlFor={`notes-${item.id}`}>Notas (requerido)</Label>
                      <Textarea
                        id={`notes-${item.id}`}
                        value={itemNotes}
                        onChange={(e) => updateItemNotes(item.id, e.target.value)}
                        placeholder="Describe el problema o razón del faltante"
                        required
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {hasIssues && (
            <Card>
              <CardHeader>
                <CardTitle>Notas Generales</CardTitle>
                <CardDescription>
                  Información adicional sobre la inspección
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Notas generales sobre la inspección (opcional)"
                />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar Inspección'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

