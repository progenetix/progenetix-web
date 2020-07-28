import useSWR from "swr"
import { svgFetcher } from "./fetcher"
// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH
// eslint-disable-next-line no-undef
export const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true"

export function useDatasets() {
  return useSWR(`${basePath}cgi/bycon/bin/byconplus.py/get-datasetids/`)
}

export function useFilteringTerms(prefixes, datasetIds = []) {
  const params = new URLSearchParams(
    flattenParams([
      ["filters", prefixes],
      ["datasetIds", datasetIds]
    ])
  ).toString()
  return useSWR(
    `${basePath}cgi/bycon/bin/byconplus.py/filtering_terms?${params}`
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

export function publicationUrl(id) {
  return `${basePath}do/api/apidb=progenetix&apiscope=publications&apimethod=publicationdetails&id=${id}`
}

export function usePublication(id) {
  const { data: rawData, error } = useSWR(publicationUrl(id))
  const data = rawData && rawData.filter((r) => !!r) // when not defined the api returns an array with null elements.
  return { data, error }
}

export function sampleUrl(id, datasetIds) {
  return `${basePath}cgi/bycon/bin/byconplus.py?scope=biosamples&id=${id}&datasetIds=${datasetIds}`
}

export function useSample(id, datasetIds) {
  return useSWR(sampleUrl(id, datasetIds))
}

export function useGeneSpans(querytext) {
  const url =
    querytext &&
    querytext.length > 0 &&
    `${basePath}cgi/genespans.cgi?db=progenetix&collection=genespans&querytext=${querytext}`
  return useSWR(url, (...args) =>
    fetch(...args)
      .then((res) => res.text())
      .then((t) => {
        // data returned is not JSON
        const sanitized = t.startsWith("(") ? t.slice(1, -3) : t
        return JSON.parse(sanitized)
      })
  )
}
export function useCytomapper(querytext) {
  const url =
    querytext &&
    querytext.length > 0 &&
    `${basePath}cgi/bycon/bin/cytomapper.py?featureClass=P&cytoBands=1${querytext}`
  return useSWR(url)
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
    svgFetcher
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

export function replaceWithProxy(
  url,
  useProxyOpt = useProxy,
  basePathOpt = basePath
) {
  if (!useProxyOpt) return url
  return url.toString().replace(new URL(url).origin + "/", basePathOpt)
}

export const HANDOVER_IDS = {
  cnvhistogram: "pgx:handover:cnvhistogram",
  biosamplesdata: "pgx:handover:biosamplesdata",
  progenetixtools: "pgx:handover:progenetixtools",
  variantsdata: "pgx:handover:variantsdata"
}
