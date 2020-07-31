import React, { useRef, useState } from "react"
import { HANDOVER_IDS, replaceWithProxy } from "../../hooks/api"
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa"
import { initiateSaveAsJson } from "../../utils/download"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import useSWR from "swr"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import Histogram from "../../components/Histogram"
import { svgFetcher } from "../../hooks/fetcher"

const handoversInTab = [
  HANDOVER_IDS.cnvhistogram,
  HANDOVER_IDS.biosamplesdata,
  HANDOVER_IDS.variantsdata
]

export function DatasetResultBox({ data: datasetAlleleResponse, query }) {
  const {
    datasetId,
    datasetHandover,
    variantCount,
    callCount,
    sampleCount,
    frequency
  } = datasetAlleleResponse

  const handoverContainerRef = useRef()
  const { width: handoverWidth } = useContainerDimensions(handoverContainerRef)

  const selectableHandovers = datasetHandover.filter(
    ({ handoverType: { id } }) => handoversInTab.includes(id)
  )
  const genericHandovers = datasetHandover.filter(
    ({ handoverType: { id } }) => !handoversInTab.includes(id)
  )

  const [selectedHandoverId, setSelectedHandoverId] = useState(
    selectableHandovers[0]?.handoverType?.id
  )
  const selectedHandover = datasetHandover.find(
    ({ handoverType: { id } }) => id === selectedHandoverId
  )

  let handoverComponent
  if (selectedHandover?.handoverType?.id === HANDOVER_IDS.cnvhistogram) {
    handoverComponent = (
      <CnvHistogramPreview url={selectedHandover.url} width={handoverWidth} />
    )
  } else if (
    selectedHandover?.handoverType?.id === HANDOVER_IDS.biosamplesdata
  ) {
    const url = replaceWithProxy(selectedHandover.url)
    handoverComponent = <BiosamplesDataTable url={url} datasetId={datasetId} />
  } else if (selectedHandover?.handoverType?.id === HANDOVER_IDS.variantsdata) {
    const url = replaceWithProxy(selectedHandover.url)
    handoverComponent = <VariantsDataTable url={url} />
  }

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{datasetId}</h2>
      <div className="columns">
        <div className="column is-narrow">
          <div>
            <b>Variants: </b>
            {variantCount}
          </div>
          <div>
            <b>Calls: </b>
            {callCount}
          </div>
          <div>
            <b>Samples:</b>
            {sampleCount}
          </div>
        </div>
        <div className="column is-narrow">
          <div>
            <b>
              <i>f</i>
              <sub>alleles</sub>:{" "}
            </b>
            {frequency}
          </div>
        </div>
        <div className="column is-narrow">
          {genericHandovers.map((handover, i) => (
            <GenericHandover key={i} handover={handover} />
          ))}
        </div>
        <div className="column">
          <UCSCRegion query={query} />
        </div>
        <div className="column is-narrow">
          <Download datasetAlleleResponse={datasetAlleleResponse} />
        </div>
      </div>
      {selectableHandovers?.length > 0 ? (
        <div className="tabs is-boxed ">
          <ul>
            {selectableHandovers.map((handover, i) => (
              <li
                className={cn({
                  "is-active": selectedHandoverId === handover.handoverType.id
                })}
                key={i}
                onClick={() => setSelectedHandoverId(handover.handoverType.id)}
              >
                <a title={handover.description}>
                  {handover.handoverType.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {selectableHandovers?.length > 0 ? (
        <div ref={handoverContainerRef}>
          {handoverWidth && handoverComponent}
        </div>
      ) : null}
    </div>
  )
}

function CnvHistogramPreview({ url: urlString, width }) {
  const url = new URL(urlString)
  url.search = new URLSearchParams([
    ...url.searchParams.entries(),
    ["-size_plotimage_w_px", width]
  ]).toString()
  let withoutOrigin = replaceWithProxy(url)
  const dataEffect = useSWR(withoutOrigin, svgFetcher)
  return <Histogram dataEffect={dataEffect} />
}

function UCSCRegion({ query }) {
  return (
    <div>
      <a href={ucscHref(query)} rel="noreferrer" target="_blank">
        UCSC region
      </a>{" "}
      <FaExternalLinkAlt className="icon has-text-info is-small" />
    </div>
  )
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

function Download({ datasetAlleleResponse }) {
  return (
    <button
      className="button is-info is-light"
      onClick={() => initiateSaveAsJson(datasetAlleleResponse, "query.json")}
    >
      <span className="icon">
        <FaDownload />
      </span>
      <span>Download JSON</span>
    </button>
  )
}

function GenericHandover({ handover }) {
  return (
    <div>
      <a href={handover.url} rel="noreferrer" target="_blank">
        {handover.handoverType.label}
      </a>{" "}
      <FaExternalLinkAlt className="icon has-text-info is-small" />
    </div>
  )
}
