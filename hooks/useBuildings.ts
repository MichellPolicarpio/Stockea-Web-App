'use client'

import { useState, useEffect } from 'react'
import { Building } from '@/types/building'
import { buildingService } from '@/services/buildingService.mock'

export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await buildingService.getAll()
      setBuildings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar edificios')
    } finally {
      setLoading(false)
    }
  }

  const getBuildingById = async (id: string) => {
    try {
      return await buildingService.getById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar edificio')
      return null
    }
  }

  return {
    buildings,
    loading,
    error,
    refetch: loadBuildings,
    getBuildingById,
  }
}


