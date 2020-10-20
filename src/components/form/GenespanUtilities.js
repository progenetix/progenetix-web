import { useGeneSpans } from "../../hooks/api"
import { useEffect, useState } from "react"
import { keyBy } from "lodash"

export function LabeledGeneSpanOptions(inputValue) {
  const { data, isLoading } = useGeneSpans(inputValue)
  const [cachedGenes, setCachedGenes] = useState({})
  useEffect(() => {
    if (data) {
      const genes = keyBy(data.data, "gene_symbol")
      setCachedGenes({ ...genes, ...cachedGenes })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  const options = Object.entries(cachedGenes).map(([, gene]) => {
    const { reference_name, cds_start_min, cds_end_max, gene_symbol } = gene
    return {
      value: `${reference_name}:${cds_start_min}-${cds_end_max}:${gene_symbol}`,
      label: `${gene_symbol} (${reference_name}:${cds_start_min}-${cds_end_max})`
    }
  })
  return { isLoading, options }
}

export function useGeneSpanSelect(inputValue) {
  const { data, error, isLoading } = useGeneSpans(inputValue)
  const getOptionLabel = (o) =>
    `${o.reference_name}:${o.cds_start_min}-${o.cds_end_max}:${o.gene_symbol}`
  let options = []
  if (data) {
    options = data.data.map((g) => ({
      value: g,
      label: getOptionLabel(g)
    }))
  }
  return { isLoading, error, options }
}
