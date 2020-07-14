import useSWR from "swr"

// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH
// eslint-disable-next-line no-undef
export const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true"

export function useDatasets() {
  return useSWR(`${basePath}cgi/bycon/bin/byconplus.py/get-datasetids/`)
}

export function useFilteringTerms(prefixes) {
  return useSWR(
    `${basePath}cgi/bycon/bin/byconplus.py/filtering_terms?filters=${prefixes}`
  )
}

/**
 * When param is null no query will be triggered.
 */
export function useBeaconQuery(queryData) {
  return useSWR(
    queryData
      ? `${basePath}cgi/bycon/bin/byconplus.py?${buildQueryParameters(
          queryData
        )}`
      : null
  )
}

export function buildQueryParameters(queryData) {
  const { start, end, ...otherParams } = queryData
  // positions from the form have to be -1 adjusted (only first value if interval)
  const starts = start.split("-")
  starts[0] = starts[0] - 1
  const ends = end.split("-")
  if (ends[0] > 0) {
    ends[0] = ends[0] - 1
  }

  return new URLSearchParams(
    flattenParams([
      ...Object.entries(otherParams),
      ["start", starts],
      ["end", ends]
    ])
  ).toString()
}

// Transforms [[k1, v1], [k2, [v2, v3]]] into [[k1, v1], [k2, v2], [k3, v3]]
function flattenParams(paramArray) {
  return paramArray.flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v) => [key, v])
    } else {
      return [[key, value]]
    }
  })
}

export function replaceWithProxy(url) {
  if (!useProxy) return url
  if (!new URL(url).hostname.includes("progenetix.org")) return url
  return url.replace("https://beacon.progenetix.org/", basePath)
}

export const HANDOVER_IDS = {
  cnvhistogram: "pgx:handover:cnvhistogram",
  biosamplesdata: "pgx:handover:biosamplesdata",
  progenetixtools: "pgx:handover:progenetixtools"
}
