export function sampleSelectUrl({ subsets, datasetIds }) {
  const samples = subsets
    .flatMap((subset) => [subset.id, ...(subset?.child_terms ?? [])])
    .join(",")

  return `/samples/search?bioontology=${samples}&datasetIds=${datasetIds}&filterLogic=OR&executeSearch=true`
}
