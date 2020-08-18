import React, { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"

/**
 * https://github.com/vercel/next.js/issues/8259
 * This work around returns a define query only if the component has been mounted.
 * This is necessary when using custom export and no SSR.
 */
export function useReadyRouter() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (testRouterReady(router) && !ready) {
      setReady(true)
    }
  }, [ready, router])

  return ready ? router : undefined
}

export function useUrlQuery() {
  const router = useReadyRouter()

  function getQuery() {
    return (
      router && {
        ...router.query,
        ...Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        )
      }
    )
  }

  const setQuery = useCallback(
    (values) => {
      if (!router) return
      const params = new URLSearchParams(window.location.search)
      Object.entries(values).forEach(([k, v]) => params.set(k, v))
      router.push(`${location.pathname}?${params}`)
    },
    [router]
  )
  return router ? { query: getQuery(), setQuery } : undefined
}

const isDynamicPage = (router) => /\[.+\]/.test(router.route)
const testRouterReady = (router) =>
  !isDynamicPage(router) || router.asPath !== router.route

export const withUrlQuery = (WrappedComponent) => {
  const QueryProvider = (props) => {
    const query = useUrlQuery()
    if (!query) return null //only renders when component
    return (
      <WrappedComponent
        urlQuery={query.query}
        setUrlQuery={query.setQuery}
        {...props}
      />
    )
  }
  return QueryProvider
}
