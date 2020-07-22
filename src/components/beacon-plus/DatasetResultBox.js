import React, { useRef, useState } from "react"
import { HANDOVER_IDS, replaceWithProxy } from "../../effects/api"
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa"
import { initiateSaveAsJson } from "../../utils/download"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import useSWR from "swr"
import { useContainerDimensions } from "../../effects/containerDimensions"
import Histogram from "../Histogram"
import { svgFetcher } from "../../effects/fetcher"

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
    // exclude cnvhistogram
    ({ handoverType: { id } }) => id !== HANDOVER_IDS.progenetixtools
  )
  const [selectedHandoverId, setSelectedHandoverId] = useState(
    selectableHandovers[0]?.handoverType?.id
  )
  const selectedHandover = datasetHandover.find(
    ({ handoverType: { id } }) => id === selectedHandoverId
  )
  const progenetixtools = datasetHandover.find(
    ({ handoverType: { id } }) => id === HANDOVER_IDS.progenetixtools
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
          <div>
            <a href={ucscHref(query)} rel="noreferrer" target="_blank">
              UCSC region
            </a>{" "}
            <FaExternalLinkAlt className="icon has-text-info is-small" />
          </div>
          {progenetixtools && (
            <div>
              <a href={progenetixtools.url} rel="noreferrer" target="_blank">
                {progenetixtools.handoverType.label}
              </a>{" "}
              <FaExternalLinkAlt className="icon has-text-info is-small" />
            </div>
          )}
          <div>
            <a
              onClick={() =>
                initiateSaveAsJson(datasetAlleleResponse, "query.json")
              }
              rel="noreferrer"
              target="_blank"
            >
              Download JSON
            </a>{" "}
            <FaDownload className="icon has-text-info is-small" />
          </div>
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
