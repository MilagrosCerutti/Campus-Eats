import { useCallback } from 'react'
import { useFetch } from '@/lib/useFetch'
import adminService from '../services/adminService'

export function useResumen() {
  const fetchFn = useCallback(() => adminService.getResumen(), [])
  const { data: resumen, isLoading, error, refetch } = useFetch(fetchFn)
  return { resumen, isLoading, error, refetch }
}
