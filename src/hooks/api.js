import swr from "swr"
import defaultFetcher, { svgFetcher } from "./fetcher"
import { keyBy } from "lodash"
import { FaExternalLinkAlt, FaLink } from "react-icons/fa"

// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH
// eslint-disable-next-line no-undef
export const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true"
export const PROGENETIX = process.env.NEXT_PUBLIC_PROGENETIX_URL

export function useExtendedSWR(url, fetcher = defaultFetcher) {
  const { data, error, ...other } = swr(url, fetcher)
  return { data, error, ...other, isLoading: !data && !error }
}

export const MAX_HISTO_SAMPLES = 4000
export const PROGENETIXINFO = "https://info.progenetix.org"
export const DOCLINK = "https://docs.progenetix.org"
export const NEWSLINK = `${DOCLINK}/news`
export const USECASESLINK = `${DOCLINK}/use-cases`
export const SERVICEINFOLINK = `${DOCLINK}/services`
export const THISYEAR = new Date().getFullYear()
export const BIOKEYS = ["histologicalDiagnosis", "icdoMorphology", "icdoTopography", "sampledTissue"]

export function useProgenetixApi(...args) {
  const { data, error, ...other } = useExtendedSWR(...args)

  if (data) {
    const errorMessage = findErrorMessage(data)
    // Compatible with the simple responses.
    return { ...other, data, error: errorMessage ?? error }
  }
  // Connection error or http error code
  else if (error) {
    const errorMessage = error.info
      ? findErrorMessage(error.info)
      : error.message
    return { ...other, error: errorMessage }
  } else {
    return { ...other }
  }
}

// Return an error message contained in the payload.
function findErrorMessage(data) {
  return (
    data.error?.errorMessage ||
    (data.errors ? errorsToMessage(data.errors) : null) ||
    null
  )
}

function errorsToMessage(errors) {
  return errors.join(", ")
}

export async function tryFetch(url, fallBack = "N/A") {
  console.info(`Fetching data from ${url}.`)
  try {
    const response = await fetch(url)
    return response.json()
  } catch (e) {
    console.error(`Count not fetch ${url}`)
    if (fallBack) {
      console.info(`Using ${JSON.stringify(fallBack)} as fallBack`)
      return fallBack
    } else {
      throw e
    }
  }
}

/**
 * When param is null no query will be triggered.
 */

// This Beacon query only retrieves the counts & handovers using a custom `output=handoversonly`
// parameter, to avoid "double-loading" of the results.
export function useBeaconQuery(queryData) {
  return useProgenetixApi(
    queryData
      ? `${basePath}beacon/biosamples/?includeHandovers=true&requestedGranularity=record&output=handoversonly&${buildQueryParameters(queryData)}`
      : null
  )
}

export function useAggregatorQuery(queryData) {
  return useProgenetixApi(
    queryData
      ? `${basePath}beacon/aggregator/?requestedGranularity=boolean&${buildQueryParameters(queryData)}`
      : null
  )
}


export function validateBeaconQuery(queryData) {
  try {
    buildQueryParameters(queryData)
    return null
  } catch (e) {
    return e
  }
}

export function mkGeoParams(geoCity, geodistanceKm) {
  if (!geoCity) return null
  const coordinates = geoCity.data.geoLocation.geometry.coordinates ?? []
  const [geolongitude, geolatitude] = coordinates
  const geodistance = geodistanceKm ? geodistanceKm * 1000 : 100 * 1000
  return { geolongitude, geolatitude, geodistance }
}

export function mkGeneParams(gene) {
  if (!gene) return null
  const geneId = gene.data.symbol ?? []
  return { geneId }
}

export function makeFilters({
  freeFilters,
  clinicalClasses,
  bioontology,
  referenceid,
  cohorts,
  sex,
  materialtype
}) {
  const parsedFreeFilters =
    freeFilters
      ?.split(",")
      .map((ff) => ff.trim())
      .filter((v) => v != null && v.length !== 0) ?? []

  return [
    ...(bioontology ?? []),
    ...(clinicalClasses ?? []),
    ...(referenceid ?? []),
    ...(cohorts ? [cohorts] : []),
    ...(sex ? [sex] : []),
    ...(materialtype ? [materialtype] : []),
    ...parsedFreeFilters
  ]
}

export function buildQueryParameters(queryData) {
  const {
    start,
    end,
    bioontology,
    referenceid,
    cohorts,
    sex,
    materialtype,
    freeFilters,
    clinicalClasses,
    geneId,
    geoCity,
    geodistanceKm,
    ...otherParams
  } = queryData
  // positions from the form have to be -1 adjusted (only first value if interval)
  const starts = []
  if (start) {
    const match = INTEGER_RANGE_REGEX.exec(start)
    if (!match) throw new Error("incorrect start range")
    const [, start0, start1] = match
    var s0 = start0 - 1
    s0 = s0.toString()
    starts.push(s0)
    start1 && starts.push(start1)
  }
  const ends = []
  if (end) {
    const match = INTEGER_RANGE_REGEX.exec(end)
    if (!match) throw new Error("incorrect end range")
    const [, end0, end1] = match
    ends.push(end0)
    end1 && ends.push(end1)
  }
  const filters = makeFilters({
    freeFilters,
    clinicalClasses,
    bioontology,
    referenceid,
    cohorts,
    sex,
    materialtype
  })
  const geneParams = mkGeneParams(geneId) ?? {}
  const geoParams = mkGeoParams(geoCity, geodistanceKm) ?? {}
  return new URLSearchParams(
    flattenParams([
      ...Object.entries({ ...otherParams, ...geneParams, ...geoParams }),
      ["start", starts],
      ["end", ends],
      ["filters", filters]
    ]).filter(([, v]) => !!v)
  ).toString()
}

export function useDataVisualization(queryData) {
  return useProgenetixApi(
    queryData
      ? `${basePath}cgi/PGX/cgi/samplePlots.cgi?${buildDataVisualizationParameters(
          queryData
        )}`
      : null
  )
}

export function buildDataVisualizationParameters(queryData) {
  return new URLSearchParams(
    flattenParams([...Object.entries(queryData)]).filter(([, v]) => !!v)
  ).toString()
}

export function publicationDataUrl(id) {
  return `${basePath}services/publications?filters=${id}&method=details`
}

export function usePublication(id) {
  return useProgenetixApi(publicationDataUrl(id))
}

export function usePublicationList({ geoCity, geodistanceKm }) {
  const qParams = new URLSearchParams({
    ...mkGeoParams(geoCity, geodistanceKm),
    filters: "PMID,genomes:>0",
    method: "details"
  }).toString()
  const url = `${basePath}services/publications?${qParams}`
  return useProgenetixApi(url)
}

export function usePublicationWithDataList({ geoCity, geodistanceKm }) {
  const qParams = new URLSearchParams({
    ...mkGeoParams(geoCity, geodistanceKm),
    filters: "PMID,progenetix:>0",
    method: "details"
  }).toString()
  const url = `${basePath}services/publications?${qParams}`
  return useProgenetixApi(url)
}

// ,genomes:>0

export function useProgenetixRefPublicationList({ geoCity, geodistanceKm }) {
  const qParams = new URLSearchParams({
    ...mkGeoParams(geoCity, geodistanceKm),
    filters: "PMID,pgxuse:yes",
    method: "details"
  }).toString()
  const url = `${basePath}services/publications?${qParams}`
  return useProgenetixApi(url)
}


export const ontologymapsBaseUrl = `${basePath}services/ontologymaps?`

export function ontologymapsUrl({ filters, filterPrecision }) {
  let params = new URLSearchParams({ filters: filters })
  if (filterPrecision) {
    params.append("filterPrecision", filterPrecision)
  }
  return `${ontologymapsBaseUrl}${params.toString()}`
}

export function ontologymapsPrefUrl({ prefixes, filters }) {
  return `${ontologymapsBaseUrl}filters=${prefixes},${filters}&filterPrecision=start`
}

export function useDataItemDelivery(id, entity, datasetIds) {
  return useProgenetixApi(getDataItemUrl(id, entity, datasetIds))
}

export function getDataItemUrl(id, entity, datasetIds) {
  return `${basePath}beacon/${entity}/${id}/?datasetIds=${datasetIds}`
}

export function useServiceItemDelivery(id, entity, datasetIds) {
  return useProgenetixApi(getServiceItemUrl(id, entity, datasetIds))
}

export function getServiceItemUrl(id, collection, datasetIds) {
  return `${basePath}services/${collection}?id=${id}&datasetIds=${datasetIds}`
}

export function getDataItemPageUrl(id, entity, datasetIds) {
  return `${basePath}${entity}/?datasetIds=${datasetIds}&${
    entity == "variants" ? "_id" : "id"
  }=${id}`
}

export function NoResultsHelp(id, entity) {
  const url = getDataItemPageUrl(id, entity, "progenetix")
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific biosample ID
      which already exists in the Progenetix or arrayMap{" "}
      <strong>{entity}</strong> database, e.g. <a href={url}>{url}</a>.
    </div>
  )
}

export function useCytomapper(querytext) {
  const url =
    querytext &&
    querytext.length > 0 &&
    `${basePath}services/cytomapper/?cytoBands=${querytext}`
  return useProgenetixApi(url)
}

export function useSubsethistogram({ datasetIds, id, filter, size, chr2plot }) {
  const svgbaseurl = subsetSVGlink(id, datasetIds)
  const params = []
  filter && params.push(["filter", filter])
  size && params.push(["-size_plotimage_w_px", size])
  chr2plot && params.push(["chr2plot", chr2plot])
  const searchQuery = new URLSearchParams(params).toString()
  return useExtendedSWR(size > 0 && `${svgbaseurl}&${searchQuery}`, svgFetcher)
}

// method is "counts" / "child_terms" for smaller payloads
export function useCollationsById({ datasetIds }) {
  const { data, ...other } = useCollations({
    filters: "",
    method: "counts",
    datasetIds
  })

  if (data) {
    const mappedResults = keyBy(data.response.results, "id")
    return {
      data: {
        ...data,
        results: mappedResults
      },
      ...other
    }
  }
  return { data, ...other }
}

export function useCollations({ datasetIds, method, filters }) {
  const url = `${basePath}services/collations/?datasetIds=${datasetIds}&method=${method}&filters=${filters}`
  return useProgenetixApi(url)
}

export function useCollationsByType({ datasetIds, method, collationTypes }) {
  const url = `${basePath}services/collations/?datasetIds=${datasetIds}&method=${method}&collationTypes=${collationTypes}`
  return useProgenetixApi(url)
}

export function sampleSearchPageFiltersLink({
  datasetIds,
  sampleFilterScope,
  filters
}) {
  return `/biosamples/?${sampleFilterScope}=${filters}&datasetIds=${datasetIds}`
}

export function useGeoCity({ city }) {
  const url = city ?`${basePath}services/geolocations?city=${city}` : null
  return useProgenetixApi(url)
}

export function useGeneSymbol({ geneId }) {
  const url = geneId ? `${basePath}services/genespans/?geneId=${geneId}&filterPrecision=start&method=genespan` :null
  return useProgenetixApi(url)
}

export function subsetSVGlink(id, datasetIds) {
  return `${basePath}services/collationPlots/?datasetIds=${datasetIds}&id=${id}`
}

export function subsetIdLink(id) {
  return `${basePath}services/ids/${id}`
}

export function subsetPgxsegLink(id) {
  return `${basePath}services/intervalFrequencies/?&output=pgxseg&filters=${id}`
}

export function ExternalLink({ href, label, onClick }) {
  return (
    <a href={href} rel="noreferrer" target="_blank" onClick={onClick}>
      {label} <FaExternalLinkAlt className="icon has-text-info is-small" />
    </a>
  )
}

export function Link({ href, label, onClick }) {
  return (
    <a href={href} onClick={onClick}>
      {label} <FaLink className="icon has-text-grey-light is-small" />
    </a>
  )
}

export function referenceLink(externalReference) {
  if (externalReference.id.includes("cellosaurus:")) {
    return (
      "https://web.expasy.org/cellosaurus/" +
      externalReference.id.replace("cellosaurus:", "")
    )
  } else if (externalReference.id.includes("PMID:")) {
    return "/publication/?id=" + externalReference.id
  } else if (externalReference.id.includes("geo:")) {
    return (
      "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=" +
      externalReference.id.replace("geo:", "")
    )
  } else if (externalReference.id.includes("arrayexpress:")) {
    return (
      "https://www.ebi.ac.uk/arrayexpress/experiments/" +
      externalReference.id.replace("arrayexpress:", "")
    )
  } else if (externalReference.id.includes("cbioportal")) {
    return (
      "https://www.cbioportal.org/study/summary?id=" +
      externalReference.id.replace("cbioportal:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("TCGA-")) {
    return (
      "https://portal.gdc.cancer.gov/projects/" +
      externalReference.id.replace("pgx:", "")
    )
  } else if (externalReference.id.includes("biosample")) {
    return (
      "https://www.ebi.ac.uk/biosamples/samples/" +
      externalReference.id.replace("biosample:", "")
    )
  } else if (externalReference.id.includes("MedGen")) {
    return (
      "https://www.ncbi.nlm.nih.gov/medgen/" +
      externalReference.id.replace("MedGen:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("MONDO")) {
    return (
      "https://monarchinitiative.org/disease/MONDO:" +
      externalReference.id.replace("MONDO:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("OMIM")) {
    return (
      "https://omim.org/clinicalSynopsis/" +
      externalReference.id.replace("OMIM:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("Orphanet")) {
    return (
      "https://www.orpha.net/consor/cgi-bin/OC_Exp.php?lng=EN&Expert=" +
      externalReference.id.replace("Orphanet:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("MeSH")) {
    return (
      "https://www.ncbi.nlm.nih.gov/mesh/?term=" +
      externalReference.id.replace("MeSH:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("HP")) {
    return (
      "https://hpo.jax.org/app/browse/term/" +
      externalReference.id.replace("Human Phenotype Ontology:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("SNOMED CT")) {
    return (
      "https://snomedbrowser.com/Codes/Details/" +
      externalReference.id.replace("SNOMED CT:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("dbSNP")) {
    return (
      "https://www.ncbi.nlm.nih.gov/snp/rs" +
      externalReference.id.replace("dbSNP:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("ClinGen")) {
    return (
      "http://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_caid?caid=" +
      externalReference.id.replace("ClinGen:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("ClinVar")) {
    return (
      "https://www.ncbi.nlm.nih.gov/clinvar/variation/" +
      externalReference.id.replace("ClinVar:", "").toLowerCase()
    )
  } else if (externalReference.id.includes("HGNC")) {
    return (
      "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/" +
      externalReference.id.replace("HGNC:", "").toLowerCase()
    )
  } else {
    return null
  }
}

export function pluralizeWord(word, count) {
  if (count > 1) {
    word = word + "s"
  }
  return word
}

export async function uploadFile(formData) {
  // Default options are marked with *
  const response = await fetch(`${basePath}services/uploader/`, {
    method: "POST",
    headers: {},
    body: formData
  })
  return response.json()
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

export const checkIntegerRange = (value) => {
  if (!value) return
  const match = INTEGER_RANGE_REGEX.exec(value)
  if (!match) return "Input should be a range (ex: 1-5) or a single value"
  const [, range0Str, range1Str] = match
  const range0 = Number.parseInt(range0Str)
  const range1 = Number.parseInt(range1Str)
  if (range1 && range0 > range1)
    return "Incorrect range input, max should be greater than min"
}

export function replaceWithProxy(
  url,
  useProxyOpt = useProxy,
  basePathOpt = basePath
) {
  if (!url) return false
  if (!useProxyOpt) return url
  return url.toString().replace(new URL(url).origin + "/", basePathOpt)
}

export function epmcId(publicationId) {
  return publicationId.split(":")[1]
}

export function epmcUrl(publicationId) {
  return `http://www.europepmc.org/abstract/MED/${epmcId(publicationId)}`
}

export function EpmcLink({ publicationId }) {
  return (
    <a href={epmcUrl(publicationId)} rel="noreferrer" target="_BLANK">
      <img src="/img/icon_EPMC_16.gif" />
    </a>
  )
}
