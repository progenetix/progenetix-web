import { min } from "lodash"

export function sampleSelectUrl({ subsets, datasetIds }) {
  const samples = subsets.map(({ id }) => id).join(",")
  return `/samples/search?freeFilters=${samples}&datasetIds=${datasetIds}&filterLogic=OR&executeSearch=true`
}

export function canSearch(subset) {
  // Only necessary for NCIT
  if (!subset.id.includes("NCIT:")) return true
  const minDepth = subset.hierarchy_paths
    ? min(subset.hierarchy_paths?.map((hp) => hp.depth))
    : 999
  return minDepth >= 2
}
