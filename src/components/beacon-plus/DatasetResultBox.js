import React, { useState } from "react"
import { HANDOVER_IDS, replaceWithProxy } from "../../api/bycon"
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa"
import { initiateSaveAsJson } from "../../utils/download"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"

export function DatasetResultBox({ data, query }) {
  const selectableHandovers = data.datasetHandover.filter(
    // exclude cnvhistogram
    ({ handoverType: { id } }) => id !== HANDOVER_IDS.progenetixtools
  )
  const [selectedHandoverId, setSelectedHandoverId] = useState(
    selectableHandovers[0]?.handoverType?.id
  )
  const selectedHandover = data.datasetHandover.find(
    ({ handoverType: { id } }) => id === selectedHandoverId
  )
  const progenetixtools = data.datasetHandover.find(
    ({ handoverType: { id } }) => id === HANDOVER_IDS.progenetixtools
  )

  let handoverComponent
  if (selectedHandover?.handoverType?.id === HANDOVER_IDS.cnvhistogram) {
    handoverComponent = <CnvHistogramPreview url={selectedHandover.url} />
  } else if (
    selectedHandover?.handoverType?.id === HANDOVER_IDS.biosamplesdata
  ) {
    const url = replaceWithProxy(selectedHandover.url)
    handoverComponent = <BiosamplesDataTable url={url} />
  } else if (selectedHandover?.handoverType?.id) {
    handoverComponent = <div>Not yet implemented...</div>
  }
  return (
    <div className="box">
      <h2 className="is-size-3 mb-3 has-text-dark">{data.datasetId}</h2>
      <div className="columns">
        <div className="column is-narrow">
          <div>
            <b>Variants: </b>
            {data.variantCount}
          </div>
          <div>
            <b>Calls: </b>
            {data.callCount}
          </div>
          <div>
            <b>Samples:</b>
            {data.sampleCount}
          </div>
        </div>
        <div className="column is-narrow">
          <div>
            <b>
              <i>f</i>
              <sub>alleles</sub>:{" "}
            </b>
            {data.frequency}
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
        </div>
        <div className="column is-right">
          <button
            onClick={() => initiateSaveAsJson(data, "query.json")}
            className="button"
          >
            <FaDownload className="icon is-small" />
            <span>Download JSON</span>
          </button>
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
      {handoverComponent}
    </div>
  )
}

function CnvHistogramPreview({ url }) {
  return <img src={url} />
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
