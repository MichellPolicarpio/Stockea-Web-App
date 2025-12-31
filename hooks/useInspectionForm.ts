'use client'

import { useState, useEffect } from 'react'
import { InspectionItem, InspectionItemStatus } from '@/types/inspection'
import { InventoryItem } from '@/types/inventory'

export function useInspectionForm(apartmentId: string, inventoryItems: InventoryItem[]) {
  const [items, setItems] = useState<Record<string, InspectionItemStatus>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [generalNotes, setGeneralNotes] = useState('')
  const [hasIssues, setHasIssues] = useState(false)

  // Inicializar items con estado 'ok'
  useEffect(() => {
    const initialItems: Record<string, InspectionItemStatus> = {}
    inventoryItems.forEach(item => {
      initialItems[item.id] = 'ok'
    })
    setItems(initialItems)
  }, [inventoryItems])

  const updateItemStatus = (itemId: string, status: InspectionItemStatus) => {
    setItems(prev => ({
      ...prev,
      [itemId]: status,
    }))
    
    // Actualizar hasIssues
    const newItems = { ...items, [itemId]: status }
    const hasAnyIssue = Object.values(newItems).some(s => s !== 'ok')
    setHasIssues(hasAnyIssue)
    
    // Limpiar notas si el estado vuelve a 'ok'
    if (status === 'ok') {
      setNotes(prev => {
        const newNotes = { ...prev }
        delete newNotes[itemId]
        return newNotes
      })
    }
  }

  const updateItemNotes = (itemId: string, note: string) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: note,
    }))
  }

  const getFormData = () => {
    const inspectionItems = Object.entries(items).map(([inventoryItemId, status]) => ({
      inventoryItemId,
      status,
      notes: notes[inventoryItemId] || undefined,
    }))

    return {
      apartmentId,
      status: 'completed' as const,
      items: inspectionItems,
      generalNotes: generalNotes || undefined,
      completedAt: new Date(),
    }
  }

  const reset = () => {
    const initialItems: Record<string, InspectionItemStatus> = {}
    inventoryItems.forEach(item => {
      initialItems[item.id] = 'ok'
    })
    setItems(initialItems)
    setNotes({})
    setGeneralNotes('')
    setHasIssues(false)
  }

  return {
    items,
    notes,
    generalNotes,
    hasIssues,
    updateItemStatus,
    updateItemNotes,
    setGeneralNotes,
    getFormData,
    reset,
  }
}

