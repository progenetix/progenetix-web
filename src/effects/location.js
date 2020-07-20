import { useEffect, useState } from "react"

export function useSearch() {
  const [search, setSearch] = useState(null)
  useEffect(() => {
    const search = Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    )
    setSearch(search)
  }, [null])
  return search
}
