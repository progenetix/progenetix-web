import { sampleUrl, useSample } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React from "react"
import { useQuery } from "../../hooks/query"
import { Layout } from "../../components/layouts/Layout"

export default function BiosampleDetailsPage() {
  const urlQuery = useQuery()
  if (!urlQuery) return null // query will only be defined after first mount

  const { id, datasetIds } = urlQuery
  const hasAllParams = id && datasetIds

  return (
    <Layout title="Sample Details" headline="Sample Details">
      {!hasAllParams ? (
        <NoResultsHelp />
      ) : (
        <BiosampleLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
}

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific biosample ID
      which already exists in the Progenetix or arrayMap `biosamples` database,
      e.g.{" "}
      <a href="/biosamples/PGX_AM_BS_PGkes2003_MB-kes-01?datasetIds=progenetix">
        biosample-details?id=PGX_AM_BS_PGkes2003_MB-kes-01?datasetIds=progenetix
      </a>
      .
    </div>
  )
}

function BiosampleLoader({ id, datasetIds }) {
  const { data, error, isLoading } = useSample(id, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <BiosampleResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function BiosampleResponse({ response, datasetIds }) {
  if (!response.biosamples || response.biosamples[datasetIds].length === 0) {
    return <NoResultsHelp />
  }
  if (response.biosamples[datasetIds].length > 1) {
    return (
      <div className="notification is-size-5">
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
      <h3 className="mb-6">
        {biosample.id} ({datasetIds}){" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={sampleUrl(biosample.id, datasetIds)}
        >
          {"{↗}"}
        </a>
      </h3>
      {biosample.description && (
        <>
          <h5>Description</h5>
          <p>{biosample.description}</p>
        </>
      )}
      <h5>Biocharacteristics</h5>
      <ul>
        {biosample.biocharacteristics.map((biocharacteristic, i) => (
          <li key={i}>
            {biocharacteristic.type.id}: {biocharacteristic.type.label}
          </li>
        ))}
      </ul>

      {biosample.age_at_collection?.age && (
        <>
          <h5>Clinical Data</h5>
          <ul>
            <li>Age at Collection: {biosample.age_at_collection.age}</li>
          </ul>
        </>
      )}

      {biosample.provenance?.material.type.label && (
        <>
          <h5>Provenance</h5>
          <ul>
            <li>Material: {biosample.provenance.material.type.label}</li>
          </ul>
        </>
      )}
    </section>
  )
}
