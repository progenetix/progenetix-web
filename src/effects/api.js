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
  const {
    start,
    end,
    bioontology,
    materialtype,
    freeFilters,
    ...otherParams
  } = queryData

  // positions from the form have to be -1 adjusted (only first value if interval)
  const starts = []
  if (start) {
    const match = INTEGER_RANGE_REGEX.exec(start)
    if (!match) throw new Error("incorrect start range")
    const [, start0, start1] = match
    starts.push(start0 - 1)
    start1 && starts.push(start1)
  }
  const ends = []
  if (end) {
    const match = INTEGER_RANGE_REGEX.exec(end)
    if (!match) throw new Error("incorrect end range")
    const [, end0, end1] = match
    ends.push(end0 > 0 ? end0 - 1 : end0)
    end1 && ends.push(end1)
  }
  let parsedFreeFilters = freeFilters?.split(",").map((ff) => ff.trim()) ?? []

  const filters = [
    bioontology ?? [],
    materialtype ?? [],
    parsedFreeFilters
  ].flat()

  return new URLSearchParams(
    flattenParams([
      ...Object.entries(otherParams),
      ["start", starts],
      ["end", ends],
      ["filters", filters]
    ])
  ).toString()
}

export function usePublication(id) {
  return useSWR(
    `${basePath}do/api/apidb=progenetix&apiscope=publications&apimethod=publicationdetails&id=${id}`
  )
}

export function useSubsethistogram({ datasetIds, id, filter, scope, size }) {
  const params = [
    ["datasetIds", datasetIds],
    ["id", id],
    ["-size_plotimage_w_px", size]
  ]
  filter && params.push(["filter", filter])
  scope && params.push(["scope", scope])
  const searchQuery = new URLSearchParams(params).toString()
  return useSWR(
    `${basePath}cgi/pgx_subsethistogram.cgi?${searchQuery}`,
    (...args) => fetch(...args).then((r) => r.text())
  )
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

export const INTEGER_RANGE_REGEX = /^(\d+)(?:[-,;])?(\d+)?$/

export function replaceWithProxy(url) {
  if (!useProxy) return url
  if (!new URL(url).hostname.includes("progenetix.org")) return url
  return url.replace("https://beacon.progenetix.org/", basePath)
}

export const HANDOVER_IDS = {
  cnvhistogram: "pgx:handover:cnvhistogram",
  biosamplesdata: "pgx:handover:biosamplesdata",
  progenetixtools: "pgx:handover:progenetixtools",
  variantsdata: "pgx:handover:variantsdata"
}
