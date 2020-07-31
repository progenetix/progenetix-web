import { useEffect, useState } from "react"
import { useRouter } from "next/router"

/**
 *
 * This work around returns a define query only if the component has been mounted.
 * This is necessary when using custom export and no SSR.
 * @param shouldUpdate defines if the component should rerender when the location is updated.
 */
export function useQuery(shouldUpdate = false) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [shouldUpdate ? router : null])
  return ready ? router.query : undefined
}
