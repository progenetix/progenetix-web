import useSWR from "swr"

// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH

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
 */
export function useBeaconQuery(queryData) {
  function buildQuery() {
    const { datasetIds, assemblyId, referenceName, filters } = queryData
    const datasetsQuery = datasetIds.map((d) => `datasetIds=${d}`).join("&")
    const filtersQuery = filters.map((f) => `filters=${f}`).join("&")
    const requestType = `variantAlleleRequest`
    return `${basePath}cgi/bycon/bin/byconplus.py?${datasetsQuery}&assemblyId=${assemblyId}&includeDatasetResponses=ALL&requestType=${requestType}&referenceName=${referenceName}&${filtersQuery}`
  }

  return useSWR(queryData ? buildQuery() : null)
}
