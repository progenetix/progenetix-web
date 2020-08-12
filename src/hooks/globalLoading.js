import React, { useContext, useEffect, useState } from "react"

export const LoadingContext = React.createContext()

export function useGlobalLoading(fetchEffect, loadingKey) {
  const loadingCtx = useContext(LoadingContext)
  const { data, error, isLoading } = fetchEffect()
  useEffect(() => {
    loadingCtx?.setIsLoading(loadingKey, isLoading)
  }, [isLoading, loadingCtx, loadingKey])
  return { data, error }
}

export function useContextLoadingMap(loadable) {
  const [loadingMap, setLoadingMap] = useState({})
  const handleSetIsLoading = (key, isLoading) =>
    setLoadingMap({ ...loadingMap, [key]: isLoading })
  const loadingStarted = Object.entries(loadingMap).length > 0
  const somethingIsLoading =
    (loadable && !loadingStarted) ||
    Object.entries(loadingMap).find(([, isLoading]) => isLoading)
  return { handleSetIsLoading, somethingIsLoading }
}
