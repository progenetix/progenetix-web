import React, { useRef, useState } from "react"
import {
  MAX_HISTO_SAMPLES,
  HANDOVER_IDS,
  replaceWithProxy,
  ExternalLink,
  useProgenetixApi,
  useExtendedSWR
} from "../../hooks/api"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import VariantsInterpretationsDataTable from "./VariantsInterpretationsDataTable"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import Histogram from "../Histogram"
import { Infodot } from "../Infodot"
import { svgFetcher } from "../../hooks/fetcher"
import BiosamplesStatsDataTable from "./BiosamplesStatsDataTable"
import { WithData } from "../Loader"
import { openJsonInNewTab } from "../../utils/files"
import dynamic from "next/dynamic"
import { getVisualizationLink } from "../../modules/data-visualization/DataVisualizationPage"

const handoversInTab = [
  HANDOVER_IDS.cnvhistogram,
  HANDOVER_IDS.biosamples,
  HANDOVER_IDS.variants,
  HANDOVER_IDS.variantsinterpretations
]

const TABS = {
  results: "Results",
  samples: "Biosamples",
  samplesMap: "Biosamples Map",
  variants: "Variants",
  variantsinterpretations: "Variant Interpretations"
}

export function DatasetResultBox({ data: responseSet, query }) {
  const {
    id,
    results_handovers,
    info
  } = responseSet

  const handoverById = (givenId) =>
    results_handovers.find(({ handoverType: { id } }) => id === givenId)

  const genericHandovers = results_handovers.filter(
    ({ handoverType: { id } }) => !handoversInTab.includes(id)
  )

  const biosamplesHandover = handoverById(HANDOVER_IDS.biosamples)
  const biosamplesReply = useProgenetixApi(
    biosamplesHandover && replaceWithProxy(biosamplesHandover.url)
  )
  
  const variantsHandover = handoverById(HANDOVER_IDS.variants)
  const variantsReply = useProgenetixApi(
    variantsHandover && replaceWithProxy(variantsHandover.url)
  )
  const variantsInterpretationsHandover = handoverById(HANDOVER_IDS.variantsinterpretations)
  const variantsInterpretationsReply = useProgenetixApi(
    variantsInterpretationsHandover && replaceWithProxy(variantsInterpretationsHandover.url)
  )

  let histogramUrl
  let visualizationLink
  if (handoverById(HANDOVER_IDS.cnvhistogram)) {
    if (info.counts.sampleCount <= MAX_HISTO_SAMPLES) {
      histogramUrl = handoverById(HANDOVER_IDS.cnvhistogram).url
      let visualizationAccessId = new URLSearchParams(
        new URL(histogramUrl).search
      ).get("accessid")
      visualizationLink = getVisualizationLink(visualizationAccessId, info.counts.sampleCount)
    }
  }

  // main / samples / variants
  const tabNames = []
  tabNames.push(TABS.results)

  biosamplesHandover && tabNames.push(TABS.samples)

  biosamplesReply?.data?.result_sets[0].results?.some(
    (biosample) => !!biosample.provenance?.geo_location
  ) && tabNames.push(TABS.samplesMap)

  if (handoverById(HANDOVER_IDS.variants)) tabNames.push(TABS.variants)
  if (handoverById(HANDOVER_IDS.variantsinterpretations)) tabNames.push(TABS.variantsinterpretations)
  
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
  } else if (selectedTab === TABS.variantsinterpretations) {
    tabComponent = (
      <VariantsInterpretationsDataTable apiReply={variantsInterpretationsReply} datasetId={id} />
    )
  }

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{id}</h2>
      <div className="columns">
        <div className="column is-one-fourth">
          <div>
            <b>Samples: </b>
            {info.counts.sampleCount}
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
        <div className="column is-one-fourth">
          {genericHandovers.map((handover, i) => (
            <GenericHandover key={i} handover={handover} />
          ))}
        </div>
        <div className="column is-one-fourth">
          {info.counts.variantCount > 0 ? (
            <div>
              <UCSCRegion query={query} />
            </div>
          ) : null}
          <ExternalLink
            label="JSON Response"
            onClick={() => openJsonInNewTab(responseSet)}
          />
        </div>
        {visualizationLink && (
          <div className="column is-one-fourth">
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
  let ucscgenome = query.assemblyId
  if (ucscgenome === "GRCh36") {
    ucscgenome = "hg18"
  } else if (ucscgenome === "GRCh37") {
    ucscgenome = "hg19"
  } else if (ucscgenome === "GRCh38") {
    ucscgenome = "hg38"
  }
  let ucscstart = query.start
  let ucscend = query.end
  if (query.start > 0) {
    ucscstart = query.start
    ucscend = query.start
  }
  return `http://www.genome.ucsc.edu/cgi-bin/hgTracks?db${ucscgenome}&position=chr${query.referenceName}%3A${ucscstart}%2D${ucscend}`
}

function GenericHandover({ handover }) {
  return (
    <div>
      <ExternalLink
        href={handover.url}
        label={handover.handoverType.label}
        download
      />
      <Infodot infoText={handover.description} />
    </div>
  )
}

const BiosamplesMap = dynamic(() => import("./BioSamplesMap"), {
  ssr: false
})
