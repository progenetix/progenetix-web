import { sampleUrl, useSample, useSubsethistogram } from "../effects/api"
import { Loader } from "../components/Loader"
import React, { useRef } from "react"
import { useContainerDimensions } from "../effects/containerDimensions"
import { useSearch } from "../effects/location"
import Histogram from "../components/Histogram"

export default function BiosampleDetailsPage() {
  const search = useSearch()
  if (!search) return null
  const { id, datasetIds } = search
  const hasAllParams = id && datasetIds

  return (
    <Layout>
      {!hasAllParams ? (
        <MissingParameters />
      ) : (
        <BiosampleLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
}

function Layout({ children }) {
  return (
    <div>
      <header
        className="has-background-visual-identity"
        style={{ height: "2rem" }}
      />
      <div className="section">
        <div className="container">
          <h1 className="title is-2">Sample Details</h1>
          {children}
        </div>
      </div>
    </div>
  )
}

function MissingParameters() {
  return (
    <div className="notification is-warning">
      This page will only show content if called with a specific biosample ID
      which already exists in the Progenetix or arrayMap `biosamples` database,
      e.g.{" "}
      <a href="/biosample-details?id=PGX_AM_BS_PGkes2003_MB-kes-01?datasetIds=progenetix">
        biosample-details?id=PGX_AM_BS_PGkes2003_MB-kes-01?datasetIds=progenetix
      </a>
      .
    </div>
  )
}

function BiosampleLoader({ id, datasetIds }) {
  const { data, error } = useSample(id, datasetIds)
  const isLoading = !data && !error
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <BiosampleResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function BiosampleResponse({ response, id, datasetIds }) {
  if (!response.biosamples || response.biosamples[datasetIds].length === 0) {
    return (
      <div className="message is-info is-large">
        <div className="message-body">No sample has been found.</div>
      </div>
    )
  }
  if (response.biosamples[datasetIds].length > 1) {
    return (
      <div className="message is-info is-large">
        <div className="message-body">More than one sample has been found.</div>
      </div>
    )
  }

  return (
    <Biosample
      biosample={response.biosamples[datasetIds][0]}
      datasetIds={datasetIds}
    />
  )
}

function Biosample({ biosample, datasetIds }) {
  return (
    <section className="content">
      <div>
        <h3 className="mb-5">
          {biosample.id} ({datasetIds}){" "}
          <a
            rel="noreferrer"
            target="_blank"
            href={sampleUrl(biosample.id, datasetIds)}
          >
            {"{↗}"}
          </a>
        </h3>
      </div>
      <h4>Description</h4>
      <p>{biosample.description}</p>

      <h5>Biocharacteristics</h5>
      <ul>
        {biosample.biocharacteristics.map((biocharacteristic, i) => (
          <li key={i}>
            {biocharacteristic.type.id}: {biocharacteristic.type.label}
          </li>
        ))}
      </ul>

      <h5>Clinical Data</h5>
      {biosample.age_at_collection.age && (
        <ul>
          <li>Age at Collection: {biosample.age_at_collection.age}</li>
        </ul>
      )}

      <h5>Provenance</h5>
      {biosample.provenance.material.type.label && (
        <ul>
          <li>Material: {biosample.provenance.material.type.label}</li>
        </ul>
      )}
    </section>
  )
}
