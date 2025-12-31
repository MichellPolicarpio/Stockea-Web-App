'use client'

import { useState, useEffect } from 'react'
import { Apartment } from '@/types/apartment'
import { User } from '@/types/user'
import { apartmentService } from '@/services/apartmentService.mock'

export function useApartments(user?: User | null) {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadApartments()
    }
  }, [user])

  const loadApartments = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await apartmentService.getAccessibleApartments(user)
      setApartments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar departamentos')
    } finally {
      setLoading(false)
    }
  }

  const getByBuildingId = async (buildingId: string) => {
    try {
      return await apartmentService.getByBuildingId(buildingId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar departamentos')
      return []
    }
  }

  const getById = async (id: string) => {
    try {
      return await apartmentService.getById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar departamento')
      return null
    }
  }

  return {
    apartments,
    loading,
    error,
    refetch: loadApartments,
    getByBuildingId,
    getById,
  }
}


