import swr from "swr"
import { svgFetcher } from "./fetcher"
import { keyBy } from "lodash"

// eslint-disable-next-line no-undef
export const basePath = process.env.NEXT_PUBLIC_API_PATH
// eslint-disable-next-line no-undef
export const useProxy = process.env.NEXT_PUBLIC_USE_PROXY === "true"

export function useExtendedSWR(...args) {
  const { data, error, ...other } = swr(...args)
  return { data, error, ...other, isLoading: !data && !error }
}

export const PROGENETIX = "https://progenetix.org"
export const PROGENETIXINFO = "https://info.progenetix.org"

export async function tryFetch(url, fallBack = "N/A") {
  console.info(`Fetching data from ${url}.`)
  try {
    const response = await fetch(url)
    return await response.json()
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
export async function getStaticDatatasets() {
  const url = `${PROGENETIX}/cgi/bycon/bycon/byconplus.py/get-datasetids/`
  const data = await tryFetch(url, null)
  return data.datasets.map((value) => ({
    value: value.id,
    label: value.name
  }))
}

/**
 * When param is null no query will be triggered.
 */
export function useBeaconQuery(queryData) {
  return useExtendedSWR(
    queryData
      ? `${basePath}cgi/bycon/bycon/byconplus.py?${buildQueryParameters(
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
  const coordinates = geoCity.data.geojson.coordinates ?? []
  const [geolongitude, geolatitude] = coordinates
  const geodistance = geodistanceKm ? geodistanceKm * 1000 : 100 * 1000
  return { geolongitude, geolatitude, geodistance }
}

export function makeFilters({ freeFilters, bioontology, materialtype }) {
  const parsedFreeFilters =
    freeFilters
      ?.split(",")
      .map((ff) => ff.trim())
      .filter((v) => v != null && v.length !== 0) ?? []

  return [
    ...(bioontology ?? []),
    ...(materialtype ? [materialtype] : []),
    ...parsedFreeFilters
  ]
}

export function buildQueryParameters(queryData) {
  const {
    start,
    end,
    bioontology,
    materialtype,
    freeFilters,
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
  const filters = makeFilters({ freeFilters, bioontology, materialtype })
  const geoParams = mkGeoParams(geoCity, geodistanceKm) ?? {}
  return new URLSearchParams(
    flattenParams([
      ...Object.entries({ ...otherParams, ...geoParams }),
      ["start", starts],
      ["end", ends],
      ["filters", filters]
    ]).filter(([, v]) => !!v)
  ).toString()
}

export function useDataVisualization(queryData) {
  return useExtendedSWR(
    queryData
      ? `${basePath}cgi/api_process.cgi?${buildDataVisualizationParameters(
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
  return `${basePath}services/publications?filters=${id}&responseFormat=simple&filterPrecision=exact&method=all`
}

export function usePublication(id) {
  const { data: rawData, error, ...other } = useExtendedSWR(
    publicationDataUrl(id)
  )
  const data = rawData && rawData.filter((r) => !!r) // when not defined the api returns an array with null elements.
  return { data, error, ...other }
}

export function usePublicationList({ geoCity, geodistanceKm }) {
  const geoParams = new URLSearchParams({
    ...mkGeoParams(geoCity, geodistanceKm),
    filters: "genomes:>0",
    method: "details",
    responseFormat: "simple"
  }).toString()
  const url = `${basePath}services/publications?${geoParams}`
  return useExtendedSWR(url)
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

export function DataItemDelivery(id, collection, datasetIds) {
  return useExtendedSWR(DataItemUrl(id, collection, datasetIds))
}

export function DataItemUrl(id, collection, datasetIds) {
  return `${basePath}services/deliveries/?datasetIds=${datasetIds}&collection=${collection}&${
    collection == "variants" ? "_id" : "id"
  }=${id}`
}

export function DataItemPageUrl(id, collection, datasetIds) {
  return `${basePath}${collection}/?datasetIds=${datasetIds}&${
    collection == "variants" ? "_id" : "id"
  }=${id}`
}

export function NoResultsHelp(id, collection) {
  const url = DataItemPageUrl(id, collection, "progenetix")
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
    `${basePath}cgi/bycon/services/cytomapper.py?cytoBands=${querytext}`
  return useExtendedSWR(url)
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
  const { data: rawData, ...other } = useCollations({
    filters: "",
    method: "counts",
    datasetIds
  })
  const transformData = (rawData) => keyBy(rawData, "id")
  const data = rawData && transformData(rawData)
  return { data, ...other }
}

export function useCollations({ datasetIds, method, filters }) {
  const url = `${basePath}services/collations/?datasetIds=${datasetIds}&method=${method}&filters=${filters}&responseFormat=simple`
  const { data: rawData, ...other } = useExtendedSWR(url)
  const data = Array.isArray(rawData) ? rawData : null
  return { data, ...other }
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
  return useExtendedSWR(url)
}

export function subsetSVGlink(id, datasetIds) {
  return `${basePath}cgi/api_collationhistogram.cgi?datasetIds=${datasetIds}&id=${id}`
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
  const response = await fetch(`${basePath}cgi/pgx_uploader.cgi`, {
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
  biosamplesdata: "pgx:handover:biosamplesdata",
  progenetixtools: "pgx:handover:progenetixtools",
  variantsdata: "pgx:handover:variantsdata"
}
