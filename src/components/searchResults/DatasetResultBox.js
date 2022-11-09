import React, { useRef, useState } from "react"
import {
  MAX_HISTO_SAMPLES,
  replaceWithProxy,
  ExternalLink,
  useProgenetixApi,
  useExtendedSWR
} from "../../hooks/api"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import Histogram from "../Histogram"
// import Link from "next/link"
// import { Infodot } from "../Infodot"
import { svgFetcher } from "../../hooks/fetcher"
import BiosamplesStatsDataTable from "./BiosamplesStatsDataTable"
import { WithData } from "../Loader"
import { openJsonInNewTab } from "../../utils/files"
import dynamic from "next/dynamic"
import { getVisualizationLink } from "../../modules/service-pages/dataVisualizationPage"

const HANDOVER_IDS = {
  cnvhistogram: "pgx:handover:cnvhistogram",
  biosamples: "pgx:handover:biosamples",
  biosamplestable: 'pgx:handover:biosamplestable',
  biosamplevariants: "pgx:handover:biosamplevariants",
  annotatedvariants: "pgx:handover:annotatedvariants",
  biosamplepgxsegvariants: "pgx:handover:biosamplevariants:pgxseg",
  phenopackets: "pgx:handover:phenopackets",
  UCSClink: "pgx:handover:bedfile2ucsc",
  variants: "pgx:handover:variants"
}

const TABS = {
  results: "Results",
  samples: "Biosamples",
  samplesMap: "Biosamples Map",
  variants: "Variants",
  annotatedvariants: "Annotated Variants"
}

export function DatasetResultBox({ data: responseSet, query }) {
  const {
    id,
    resultsHandovers,
    info,
    resultsCount,
    paginatedResultsCount
  } = responseSet

  const handoverById = (givenId) =>
    resultsHandovers.find(({ handoverType: { id } }) => id === givenId)

  // const genericHandovers = resultsHandovers.filter(
  //   ({ handoverType: { id } }) => !handoversInTab.includes(id)
  // )

  const biosamplesHandover = handoverById(HANDOVER_IDS.biosamples)
  const biosamplesReply = useProgenetixApi(
    biosamplesHandover && replaceWithProxy(biosamplesHandover.url)
  )
  const paginatedHandovers = biosamplesHandover.pages
  const paginatedBiosTableHandovers = handoverById(HANDOVER_IDS.biosamplestable).pages
  const paginatedBiosVarsHandovers = handoverById(HANDOVER_IDS.biosamplevariants).pages
  const paginatedBiosVarsPgxsegHandovers = handoverById(HANDOVER_IDS.biosamplepgxsegvariants).pages
  const paginatedPhenopacketsHandovers = handoverById(HANDOVER_IDS.phenopackets).pages

  const variantsHandover = handoverById(HANDOVER_IDS.variants)
  const variantsReply = useProgenetixApi(
    variantsHandover && replaceWithProxy(variantsHandover.url)
  )

  const annotatedvariantsHandover = handoverById(HANDOVER_IDS.annotatedvariants)
  const annotatedvariantsReply = useProgenetixApi(
    annotatedvariantsHandover && replaceWithProxy(annotatedvariantsHandover.url)
  )

  const UCSCbedHandoverURL = handoverById(HANDOVER_IDS.UCSClink) === undefined ? false : handoverById(HANDOVER_IDS.UCSClink).url

  // the histogram is only rendered under some conditions:
  // * handover is needed, obviously
  // * not rendered if alternateBases was used since then frequencies are off => may get changed...

  let histogramUrl
  let visualizationLink
  if (handoverById(HANDOVER_IDS.cnvhistogram)) {
    if (! query.alternateBases) {
      if (paginatedResultsCount <= MAX_HISTO_SAMPLES) {
        histogramUrl = handoverById(HANDOVER_IDS.cnvhistogram).url
        let visualizationAccessId = new URLSearchParams(
          new URL(histogramUrl).search
        ).get("accessid")
        let visualizationSkip = new URLSearchParams(
          new URL(histogramUrl).search
        ).get("skip")
        let visualizationLimit = new URLSearchParams(
          new URL(histogramUrl).search
        ).get("limit")
        visualizationLink = getVisualizationLink(visualizationAccessId, visualizationSkip, visualizationLimit, paginatedResultsCount)
      }
    }
  }

  // main / samples / variants
  const tabNames = []
  tabNames.push(TABS.results)

  biosamplesHandover && tabNames.push(TABS.samples)

  biosamplesReply?.data?.response?.resultSets[0].results?.some(
    (biosample) => !!biosample.provenance?.geoLocation
  ) && tabNames.push(TABS.samplesMap)

  if (handoverById(HANDOVER_IDS.variants)) tabNames.push(TABS.variants)
  if (handoverById(HANDOVER_IDS.annotatedvariants)) tabNames.push(TABS.annotatedvariants)

  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  let tabComponent
  if (selectedTab === TABS.results) {
    tabComponent = (
      <ResultsTab
        variantType={query.alternateBases}
        histogramUrl={histogramUrl}
        biosamplesReply={biosamplesReply}
        variantCount={info.counts.variantCount}
        datasetId={id}
      />
    )
  } else if (selectedTab === TABS.samples) {
    tabComponent = (
      <BiosamplesDataTable apiReply={biosamplesReply} datasetId={id} />
    )
  } else if (selectedTab === TABS.samplesMap) {
    tabComponent = (
      <div>
        <h2 className="subtitle has-text-dark">Sample Origins</h2>
        <p>
          The map represents the origins of the matched samples, as derived from
          the original publication or resource repository. In the majority of
          cases this will correspond to the proxy information of the
          corresponding author&apos;s institution. Additional information can be
          found in the{" "}
          <ExternalLink
            href="https://info.progenetix.org/geolocations.html"
            label="Geographic Coordinates documentation"
          />
          {"."}
        </p>
        <BiosamplesMap apiReply={biosamplesReply} datasetId={id} />
      </div>
    )
  } else if (selectedTab === TABS.variants) {
    tabComponent = (
      <VariantsDataTable apiReply={variantsReply} datasetId={id} />
    )
  } else if (selectedTab === TABS.annotatedvariants) {
    tabComponent = (
      <VariantsDataTable apiReply={annotatedvariantsReply} datasetId={id} />
    )
  }

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{id}</h2>
      <div className="columns">
        <div className="column is-one-third">
          <div>
            <b>Matched Samples: </b>
            {resultsCount}
          </div>
          <div>
            <b>Retrieved Samples: </b>
            {paginatedResultsCount}
          </div>
          {info.counts.variantCount > 0 ? (
            <div>
              <div>
                <b>Variants: </b>
                {info.counts.variantCount}
              </div>
              <div>
                <b>Calls: </b>
                {info.counts.callCount}
              </div>
            </div>
          ) : null}
        </div>
{/*        <div className="column is-one-fourth">
          {genericHandovers.map((handover, i) => (
            <GenericHandover key={i} handover={handover} />
          ))}
        </div>
*/}        
        <div className="column is-one-third">
          {info.counts.variantCount > 0 ? (
            <div>
              <UCSCRegion query={query} />
            </div>
          ) : null}
          {info.counts.variantCount > 0 ? (
            <div>
              <ExternalLink
                label="Variants in UCSC"
                href={UCSCbedHandoverURL}
              />
            </div>
          ) : null}
          <div>
            <ExternalLink
              label="Dataset Responsen (JSON)"
              onClick={() => openJsonInNewTab(responseSet)}
            />
          </div>
        </div>
        {visualizationLink && (
          <div className="column is-one-third">
            <a className="button is-info mb-5" href={visualizationLink}>
              Visualization options
            </a>
          </div>
        )}
      </div>
      {tabNames?.length > 0 ? (
        <div className="tabs is-boxed ">
          <ul>
            {tabNames.map((tabName, i) => (
              <li
                className={cn({
                  "is-active": selectedTab === tabName
                })}
                key={i}
                onClick={() => setSelectedTab(tabName)}
              >
                <a>{tabName}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {tabComponent ? <div>{tabComponent}</div> : null}
      <hr/>
      <div className="tabs">
        <div>
          <b>Download Sample Data (TSV)</b>
          <br/>
          <ul>
            {paginatedBiosTableHandovers.map((handover, i) => (
              <PagedLink key={i} handover={handover} />
            ))}
          </ul>
        </div>
      </div>
      <div className="tabs">
        <div>
          <b>Download Sample Data (JSON)</b>
          <br/>
          <ul>
            {paginatedHandovers.map((handover, i) => (
              <PagedLink key={i} handover={handover} />
            ))}
          </ul>
        </div>
      </div>
      <div className="tabs">
        <div>
          <b>Download Sample Variants (JSON)</b>
          <br/>
          <ul>
            {paginatedBiosVarsHandovers.map((handover, i) => (
              <PagedLink key={i} handover={handover} />
            ))}
          </ul>
        </div>
      </div>
      <div className="tabs ">
        <div>
          <b>Download Sample Variants (pgxseg)</b>
          <br/>
          <ul>
            {paginatedBiosVarsPgxsegHandovers.map((handover, i) => (
              <PagedLink key={i} handover={handover} />
            ))}
          </ul>
        </div>
      </div>
      <div className="tabs">
        <div>
          <b>Download Phenopackets (JSON)</b>
          <br/>
          <ul>
            {paginatedPhenopacketsHandovers.map((handover, i) => (
              <PagedLink key={i} handover={handover} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ResultsTab({
  histogramUrl,
  biosamplesReply,
  alternateBases,
  variantCount,
  datasetId
}) {
  return (
    <div>
      {histogramUrl && shouldShowHistogram(alternateBases) && (
        <div className="mb-4">
          <CnvHistogramPreview url={histogramUrl} />
        </div>
      )}
      <WithData
        apiReply={biosamplesReply}
        background
        render={(biosamplesResponse) => (
          <BiosamplesStatsDataTable
            biosamplesResponse={biosamplesResponse}
            variantCount={variantCount}
            datasetId={datasetId}
          />
        )}
      />
    </div>
  )
}

function shouldShowHistogram(alternateBases) {
  return (
    alternateBases == null || alternateBases === "N" || alternateBases === ""
  )
}

function CnvHistogramPreview({ url: urlString }) {
  const url = new URL(urlString)
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  url.search = new URLSearchParams([
    ...url.searchParams.entries(),
    ["-size_plotimage_w_px", width]
  ]).toString()
  let withoutOrigin = replaceWithProxy(url)
  // width > 0 to make sure the component is mounted and avoid double fetch
  const dataEffect = useExtendedSWR(width > 0 && withoutOrigin, svgFetcher)
  return (
    <div ref={componentRef}>
      <Histogram apiReply={dataEffect} />
    </div>
  )
}

function UCSCRegion({ query }) {
  return <ExternalLink href={ucscHref(query)} label=" UCSC region" />
}

function ucscHref(query) {

  let ucscstart = query.start
  let ucscend = query.end
  if (query.start > 0) {
    ucscstart = query.start
    ucscend = query.start
  }

  return `http://www.genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr${query.referenceName}%3A${ucscstart}%2D${ucscend}`
}

// function GenericHandover({ handover }) {
//   return (
//     <div>
//       <ExternalLink
//         href={handover.url}
//         label={handover.handoverType.label}
//         download
//       />
//       <Infodot infoText={handover.description} />
//     </div>
//   )
// }

function PagedLink({ handover }) {
  return (
    <li>
      <ExternalLink
        href={handover.url}
        label={handover.handoverType.label}
        download
      />
    </li>
  )
}


const BiosamplesMap = dynamic(() => import("./BioSamplesMap"), {
  ssr: false
})
