import useSWR from "swr"

export function useDatasets() {
  return useSWR("api/cgi/bycon/bin/byconplus.py/get-datasetids/")
}

export function useFilteringTerms(prefixes) {
  return useSWR(
    `api/cgi/bycon/bin/byconplus.py/filtering_terms?prefixes=${prefixes}`
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
    return `api/cgi/bycon/bin/byconplus.py?${datasetsQuery}&assemblyId=${assemblyId}&includeDatasetResponses=ALL&requestType=${requestType}&referenceName=${referenceName}&${filtersQuery}`
  }

  return useSWR(queryData ? buildQuery() : null)
}
