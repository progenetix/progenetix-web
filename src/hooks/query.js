import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

/**
 *
 * This work around returns a define query only if the component has been mounted.
 * This is necessary when using custom export and no SSR.
 */
export function useQuery() {
  const router = useRouter()
  const [query, setQuery] = useState(false)
  useEffect(() => {
    setQuery(router.query)
  }, [router])
  return query ? query : undefined
}

export const withQuery = (WrappedComponent) => {
  const QueryProvider = (props) => {
    const urlQuery = useQuery()
    if (!urlQuery) return null //only renders when component
    return <WrappedComponent urlQuery={urlQuery} {...props} />
  }
  return QueryProvider
}
