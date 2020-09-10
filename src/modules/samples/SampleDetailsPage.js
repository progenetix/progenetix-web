import { sampleUrl, useExtendedSWR, useSample } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React, { useRef } from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import { svgFetcher } from "../../hooks/fetcher"
import Histogram from "../../components/Histogram"

const SampleDetailsPage = withUrlQuery(({ urlQuery }) => {
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
})

export default SampleDetailsPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific biosample ID
      which already exists in the Progenetix or arrayMap `biosamples` database,
      e.g.{" "}
      <a href="/samples/details?id=PGX_AM_BS_PGkes2003_MB-kes-01&datasetIds=progenetix">
        /samples/details?id=PGX_AM_BS_PGkes2003_MB-kes-01?datasetIds=progenetix
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
      <h5>Diagnostic Classifications</h5>
      <ul>
        {biosample.biocharacteristics.map((biocharacteristic, i) => (
          <li key={i}>
            <a
              href={`/subsets/list?filters=${biocharacteristic.type.id}`}
              rel="noreferrer"
              target="_self"
            >
              {biocharacteristic.type.id}
            </a>
            : {biocharacteristic.type.label}
          </li>
        ))}
      </ul>

      <h5>Clinical Data</h5>
      <ul>
        {biosample.individual_age_at_collection?.age && (
          <>
            <li>
              Age at Collection: {biosample.individual_age_at_collection.age}
            </li>
          </>
        )}
        {biosample.info?.tnm && (
          <>
            <li>TNM: {biosample.info.tnm}</li>
          </>
        )}
        {biosample.info?.death && (
          <>
            <li>
              Death: {biosample.info.death} (at {biosample.info.followup_months}{" "}
              months)
            </li>
          </>
        )}
      </ul>

      <h5>Provenance</h5>
      <ul>
        {biosample.provenance?.material?.type.label && (
          <>
            <li>Material: {biosample.provenance.material.type.label}</li>
          </>
        )}
        {biosample.provenance?.geo?.label && (
          <>
            <li>Origin: {biosample.provenance.geo.label}</li>
          </>
        )}
      </ul>

      <h5>External References</h5>
      <ul>
        {biosample.external_references.map((externalReference, i) => (
          <li key={i}>
            {isPMID(externalReference) ? (
              <a
                href={`/publications/details?id=${externalReference.type.id}&scope=datacollections`}
                rel="noreferrer"
                target="_blank"
              >
                {externalReference.type.id}
              </a>
            ) : (
              externalReference.type.id
            )}
          </li>
        ))}
      </ul>

      <h5>CNV Profile(s)</h5>
      {biosample.info.callset_ids?.map((csid, i) => (
        <CnvHistogramPreview key={i} csid={csid} datasetIds={datasetIds} />
      ))}
    </section>
  )
}

function CnvHistogramPreview({ csid, datasetIds }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const url = `/cgi/api_chroplot.cgi?callsets.id=${csid}$&datasetIds=${datasetIds}&-size_plotimage_w_px=${width}`
  // width > 0 to make sure the component is mounted and avoid double fetch
  const dataEffect = useExtendedSWR(width > 0 && url, svgFetcher)
  return (
    <div ref={componentRef}>
      <Histogram dataEffectResult={dataEffect} />
    </div>
  )
}

function isPMID(externalReference) {
  return externalReference.type.id.includes("PMID:")
}
