import { DependencyList, useEffect, useMemo, useState } from 'react'

export interface UseAsyncRequestOptions<T> {
  /**
   * Whether the request should fire immediately on mount / deps change.
   * Defaults to true to mimic `useEffect` behaviour.
   */
  immediate?: boolean
  /**
   * Optional transformer to post-process the resolved data.
   */
  mapData?: (raw: T) => T
}

export interface UseAsyncRequestState<T> {
  data?: T
  loading: boolean
  error?: Error
  refresh: () => Promise<void>
}

/**
 * Small utility hook to wrap async calls with loading + error states.
 * Keeps page components focused on rendering logic rather than repetitive
 * `useEffect` boilerplate.
 */
export function useAsyncRequest<T>(
  request: () => Promise<T>,
  deps: DependencyList = [],
  options: UseAsyncRequestOptions<T> = {},
): UseAsyncRequestState<T> {
  const { immediate = true, mapData } = options
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState<boolean>(Boolean(immediate))
  const [error, setError] = useState<Error | undefined>()

  const refresh = useMemo(() => {
    return async () => {
      setLoading(true)
      setError(undefined)
      try {
        const result = await request()
        setData(mapData ? mapData(result) : result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      refresh()
    }
  }, [immediate, refresh])

  return { data, loading, error, refresh }
}
