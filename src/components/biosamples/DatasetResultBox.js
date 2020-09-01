import React, { useRef, useState } from "react"
import { HANDOVER_IDS, replaceWithProxy, useExtendedSWR } from "../../hooks/api"
import { FaExternalLinkAlt } from "react-icons/fa"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import Histogram from "../Histogram"
import { svgFetcher } from "../../hooks/fetcher"
import BiosamplesStatsDataTable from "./BiosamplesStatsDataTable"
import { WithData } from "../Loader"
import { openJsonInNewTab } from "../../utils/files"

const handoversInTab = [
  HANDOVER_IDS.cnvhistogram,
  HANDOVER_IDS.biosamplesdata,
  HANDOVER_IDS.variantsdata
]

const TABS = {
  results: "Results",
  samples: "Biosamples",
  variants: "Variants"
}

export function DatasetResultBox({ data: datasetAlleleResponse, query }) {
  const {
    datasetId,
    datasetHandover,
    variantCount,
    callCount,
    sampleCount,
    frequency
  } = datasetAlleleResponse

  const handoverById = (givenId) =>
    datasetHandover.find(({ handoverType: { id } }) => id === givenId)

  const genericHandovers = datasetHandover.filter(
    ({ handoverType: { id } }) => !handoversInTab.includes(id)
  )

  const biosamplesHandover = handoverById(HANDOVER_IDS.biosamplesdata)

  const biosamplesDataResults = useExtendedSWR(
    biosamplesHandover && replaceWithProxy(biosamplesHandover.url)
  )

  // main / samples / variants
  const tabNames = []
  if (handoverById(HANDOVER_IDS.cnvhistogram)) tabNames.push(TABS.results)
  if (biosamplesHandover) tabNames.push(TABS.samples)
  if (handoverById(HANDOVER_IDS.variantsdata)) tabNames.push(TABS.variants)
  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  let tabComponent
  if (selectedTab === TABS.results) {
    const histogramUrl = handoverById(HANDOVER_IDS.cnvhistogram).url
    tabComponent = (
      <ResultsTab
        variantType={query.variantType}
        histogramUrl={histogramUrl}
        biosamplesDataResults={biosamplesDataResults}
        variantCount={variantCount}
      />
    )
  } else if (selectedTab === TABS.samples) {
    tabComponent = (
      <BiosamplesDataTable
        dataEffectResult={biosamplesDataResults}
        datasetId={datasetId}
      />
    )
  } else if (selectedTab === TABS.variants) {
    const handover = handoverById(HANDOVER_IDS.variantsdata)
    const url = replaceWithProxy(handover.url)
    tabComponent = <VariantsDataTable url={url} />
  }

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{datasetId}</h2>
      <div className="columns">
        <div className="column is-one-fifth">
          <div>
            <b>Variants: </b>
            {variantCount}
          </div>
          <div>
            <b>Calls: </b>
            {callCount}
          </div>
          <div>
            <b>Samples: </b>
            {sampleCount}
          </div>
          <div>
            <b>
              <i>f</i>
              <sub>alleles</sub>:{" "}
            </b>
            {frequency}
          </div>
        </div>
        <div className="column is-one-fifth">
          {genericHandovers.map((handover, i) => (
            <GenericHandover key={i} handover={handover} />
          ))}
          <div>
            <UCSCRegion query={query} />
          </div>
        </div>
        <div className="column is-narrow">
          <ExternalLink
            label="JSON Response"
            onClick={() => openJsonInNewTab(datasetAlleleResponse)}
          />
        </div>
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
  biosamplesDataResults,
  variantType,
  variantCount
}) {
  const visualizationAccessId = new URLSearchParams(
    new URL(histogramUrl).search
  ).get("accessid")

  return (
    <div>
      <div className="mb-2">
        See more{" "}
        <a href={`/data-visualization?accessid=${visualizationAccessId}`}>
          visualization options
        </a>
        .
      </div>
      {shouldShowHistogram(variantType) && (
        <div className="mb-4">
          <CnvHistogramPreview url={histogramUrl} />
        </div>
      )}{" "}
      <WithData
        dataEffectResult={biosamplesDataResults}
        background
        render={(data) => (
          <BiosamplesStatsDataTable
            biosamplesResponse={data}
            variantCount={variantCount}
          />
        )}
      />
    </div>
  )
}

function shouldShowHistogram(variantType) {
  return variantType === "DEL" || variantType === "DUP"
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
      <Histogram dataEffectResult={dataEffect} />
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
      <ExternalLink href={handover.url} label={handover.handoverType.label} />
    </div>
  )
}
function ExternalLink({ href, label, onClick }) {
  return (
    <a href={href} rel="noreferrer" target="_blank" onClick={onClick}>
      {label} <FaExternalLinkAlt className="icon has-text-info is-small" />
    </a>
  )
}
