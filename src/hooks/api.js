import swr from "swr"
import defaultFetcher, { svgFetcher } from "./fetcher"
import { keyBy } from "lodash"
import { FaExternalLinkAlt } from "react-icons/fa"

// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH
// eslint-disable-next-line no-undef
export const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true"

export function useExtendedSWR(url, fetcher = defaultFetcher) {
  const { data, error, ...other } = swr(url, fetcher)
  return { data, error, ...other, isLoading: !data && !error }
}

export const PROGENETIX = "https://progenetix.org"
export const PROGENETIXINFO = "https://info.progenetix.org"
export const ABOUTLINK = `${PROGENETIXINFO}/categories/about.html`
export const DOCLINK = `${PROGENETIXINFO}/categories/documentation.html`
export const NEWSLINK = `${PROGENETIXINFO}/categories/news.html`
export const YEAR = new Date().getFullYear()

export function useProgenetixApi(...args) {
  const { data, error, ...other } = useExtendedSWR(...args)

  if (data) {
    const errorMessage = findErrorMessage(data)
    // Compatible with the simple responses.
    const mappedData = data.response ?? { results: data }
    return { ...other, data: mappedData, error: errorMessage ?? error }
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
    data.response?.error?.error_message ||
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

// This function gets called at build time on server-side.
// const url = `${PROGENETIX}/cgi/bycon/beaconServer/datasets.py`
// 
// export async function getStaticDatatasets() {
//   const url = `http://127.0.0.1/cgi/bycon/beaconServer/datasets.py`
//   const data = await tryFetch(url, null)
//   return data.response.results.map((value) => ({
//     value: value.id,
//     label: value.name
//   }))
// }

/**
 * When param is null no query will be triggered.
 */
export function useBeaconQuery(queryData) {
  return useProgenetixApi(
    queryData
      ? `${basePath}cgi/bycon/beaconServer/byconplus.py?${buildQueryParameters(
          queryData
        )}`
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
  const coordinates = geoCity.data.geo_location.geometry.coordinates ?? []
  const [geolongitude, geolatitude] = coordinates
  const geodistance = geodistanceKm ? geodistanceKm * 1000 : 100 * 1000
  return { geolongitude, geolatitude, geodistance }
}

export function mkGeneParams(gene) {
  if (!gene) return null
  const geneSymbol = gene.data.gene_symbol ?? []
  return { geneSymbol }
}

export function makeFilters({
  freeFilters,
  bioontology,
  cohorts,
  genotypicSex,
  materialtype
}) {
  const parsedFreeFilters =
    freeFilters
      ?.split(",")
      .map((ff) => ff.trim())
      .filter((v) => v != null && v.length !== 0) ?? []

  return [
    ...(bioontology ?? []),
    ...(cohorts ? [cohorts] : []),
    ...(genotypicSex ? [genotypicSex] : []),
    ...(materialtype ? [materialtype] : []),
    ...parsedFreeFilters
  ]
}

export function buildQueryParameters(queryData) {
  const {
    start,
    end,
    bioontology,
    cohorts,
    genotypicSex,
    materialtype,
    freeFilters,
    geneSymbol,
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
    bioontology,
    cohorts,
    genotypicSex,
    materialtype
  })
  const geneParams = mkGeneParams(geneSymbol) ?? {}
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
  const geoParams = new URLSearchParams({
    ...mkGeoParams(geoCity, geodistanceKm),
    filters: "PMID,genomes:>0",
    method: "details"
  }).toString()
  const url = `${basePath}services/publications?${geoParams}`
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

export function useDataItemDelivery(id, collection, datasetIds) {
  return useProgenetixApi(getDataItemUrl(id, collection, datasetIds))
}

export function getDataItemUrl(id, collection, datasetIds) {
  return `${basePath}services/deliveries/?datasetIds=${datasetIds}&collection=${collection}&${
    collection == "variants" ? "_id" : "id"
  }=${id}`
}

export function getDataItemPageUrl(id, collection, datasetIds) {
  return `${basePath}${collection}/?datasetIds=${datasetIds}&${
    collection == "variants" ? "_id" : "id"
  }=${id}`
}

export function NoResultsHelp(id, collection) {
  const url = getDataItemPageUrl(id, collection, "progenetix")
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific biosample ID
      which already exists in the Progenetix or arrayMap{" "}
      <strong>{collection}</strong> database, e.g. <a href={url}>{url}</a>.
    </div>
  )
}

export function useCytomapper(querytext) {
  const url =
    querytext &&
    querytext.length > 0 &&
    `${basePath}/services/cytomapper/?cytoBands=${querytext}`
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

export function useCollationsById({ datasetIds }) {
  const { data, ...other } = useCollations({
    filters: "",
    method: "counts",
    datasetIds
  })

  if (data) {
    const mappedResults = keyBy(data.results, "id")
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

export function sampleSearchPageFiltersLink({
  datasetIds,
  sampleFilterScope,
  filters
}) {
  return `/biosamples/search?${sampleFilterScope}=${filters}&datasetIds=${datasetIds}&filterLogic=OR`
}

export function useGeoCity({ city }) {
  const url = `${basePath}services/geolocations?city=${city}`
  return useProgenetixApi(url)
}

export function useGeneSymbol({ geneSymbol }) {
  const url = `${basePath}services/genespans/?geneSymbol=${geneSymbol}&filterPrecision=start`
  return useProgenetixApi(url)
}

export function subsetSVGlink(id, datasetIds) {
  return `${basePath}cgi/PGX/cgi/collationPlots.cgi?datasetIds=${datasetIds}&id=${id}`
}

export function subsetIdlink(id) {
  return `${basePath}services/ids/${id}`
}

export function ExternalLink({ href, label, onClick }) {
  return (
    <a href={href} rel="noreferrer" target="_blank" onClick={onClick}>
      {label} <FaExternalLinkAlt className="icon has-text-info is-small" />
    </a>
  )
}

export function referenceLink(externalReference) {
  if (externalReference.id.includes("cellosaurus:")) {
    return (
      "https://web.expasy.org/cgi-bin/cellosaurus/search?input=" +
      externalReference.id.replace("cellosaurus:", "")
    )
  } else if (externalReference.id.includes("PMID:")) {
    return "/publications/details?id=" + externalReference.id
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
  } else if (externalReference.id.includes("cBP")) {
    return (
      "https://www.cbioportal.org/study/summary?id=" +
      externalReference.id.replace("cBP-", "").toLowerCase()
    )
  } else if (externalReference.id.includes("TCGA-")) {
    return (
      "https://portal.gdc.cancer.gov/projects/" +
      externalReference.id.replace("tcga:", "")
    )
  } else if (externalReference.id.includes("biosample")) {
    return (
      "https://www.ebi.ac.uk/biosamples/samples/" +
      externalReference.id.replace("biosample:", "")
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
  const response = await fetch(`${basePath}cgi/PGX/cgi/uploader.cgi`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data"
    },
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
  if (!useProxyOpt) return url
  return url.toString().replace(new URL(url).origin + "/", basePathOpt)
}

export const HANDOVER_IDS = {
  cnvhistogram: "pgx:handover:cnvhistogram",
  biosamples: "pgx:handover:biosamples",
  variants: "pgx:handover:variants"
}
