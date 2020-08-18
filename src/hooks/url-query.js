import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

/**
 * https://github.com/vercel/next.js/issues/8259
 * This work around returns a define query only if the component has been mounted.
 * This is necessary when using custom export and no SSR.
 */
export function useQuery() {
  const router = useRouter()
  const [query, setQuery] = useState(false)
  useEffect(() => {
    if (testRouterReady(router)) {
      setQuery({
        ...router.query,
        ...Object.fromEntries(
          new URLSearchParams(window.location.search).entries()
        )
      })
    }
  }, [router])
  return query ? query : undefined
}

const isDynamicPage = (router) => /\[.+\]/.test(router.route)
const testRouterReady = (router) =>
  !isDynamicPage(router) || router.asPath !== router.route

export const withUrlQuery = (WrappedComponent) => {
  const QueryProvider = (props) => {
    const urlQuery = useQuery()
    if (!urlQuery) return null //only renders when component
    return <WrappedComponent urlQuery={urlQuery} {...props} />
  }
  return QueryProvider
}
