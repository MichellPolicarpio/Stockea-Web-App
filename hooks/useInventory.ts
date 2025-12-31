'use client'

import { useState, useEffect } from 'react'
import { InventoryItem } from '@/types/inventory'
import { inventoryService } from '@/services/inventoryService.mock'

export function useInventory(apartmentId?: string) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (apartmentId) {
      loadInventory()
    }
  }, [apartmentId])

  const loadInventory = async () => {
    if (!apartmentId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryService.getByApartmentId(apartmentId)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario')
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await inventoryService.create(item)
      setItems(prev => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear item')
      throw err
    }
  }

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const updated = await inventoryService.update(id, updates)
      if (updated) {
        setItems(prev => prev.map(item => item.id === id ? updated : item))
      }
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar item')
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const success = await inventoryService.delete(id)
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar item')
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    refetch: loadInventory,
    createItem,
    updateItem,
    deleteItem,
  }
}


