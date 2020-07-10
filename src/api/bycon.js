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
    `${basePath}cgi/bycon/bin/byconplus.py/filtering_terms?prefixes=${prefixes}&datasetIds=progenetix`
  )
}

/**
 * When param is null no query will be triggered.
 * TODO: better predefinition of the parameters being used or possible (no hard coding)
 */

export function useBeaconQuery(queryData) {
  function buildQuery() {
    const { datasetIds, assemblyId, requestType, referenceName, bioontology, variantType, referenceBases, alternateBases, start, end } = queryData
    const datasetsQuery = datasetIds.map((d) => `datasetIds=${d}`).join("&")
    const filtersQuery = bioontology.map((f) => `filters=${f}`).join("&")
    var starts = start.split("-")
    starts[0] = starts[0] - 1
    var ends = end.split("-")
    if (ends[0] > 0) {
      ends[0] = ends[0] - 1
    }
    const startsQuery = starts.map((s) => `start=${s}`).join("&")
    const endsQuery = ends.map((e) => `end=${e}`).join("&")
    // const requestType = `variantAlleleRequest`
    return `${basePath}cgi/bycon/bin/byconplus.py?${datasetsQuery}&${filtersQuery}&${startsQuery}&${endsQuery}&assemblyId=${assemblyId}&referenceBases=${referenceBases}&alternateBases=${alternateBases}&includeDatasetResponses=ALL&requestType=${requestType}&variantType=${variantType}&referenceName=${referenceName}`
  }

  return useSWR(queryData ? buildQuery() : null)
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
