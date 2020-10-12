import {
  basePath,
  DataItemUrl,
  referenceLink,
  useExtendedSWR,
  DataItemDelivery
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React, { useRef } from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import { svgFetcher } from "../../hooks/fetcher"
import Histogram from "../../components/Histogram"
import Link from "next/link"

const itemColl = "biosamples"

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
      which already exists in the Progenetix or arrayMap <strong>{itemColl}</strong> database,
      e.g.{" "}
      <a href="/samples/details?id=pgxbs-kftvir6m&datasetIds=progenetix">
        /samples/details?id=pgxbs-kftvir6m&datasetIds=progenetix
      </a>
      .
    </div>
  )
}

function BiosampleLoader({ id, datasetIds }) {
  const { data, error, isLoading } = DataItemDelivery(id, itemColl, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <BiosampleResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function BiosampleResponse({ response, datasetIds }) {
  if (!response.data) {
    return <NoResultsHelp />
  }

  return (
    <Biosample
      biosample={response.data}
      datasetIds={datasetIds}
    />
  )
}

function Biosample({ biosample, datasetIds }) {
  return (
    <section className="content">
      <h3 className="mb-6">
        {biosample.id} ({datasetIds})
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
            <Link href={`/subsets/list?filters=${biocharacteristic.type.id}`}>
              <a>{biocharacteristic.type.id}</a>
            </Link>
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
        {biosample.data_use_conditions?.id && (
          <>
            <li>Data Use Conditions: {biosample.data_use_conditions.id} ({biosample.data_use_conditions?.label})</li>
          </>
        )}
      </ul>

      <h5>External References</h5>
      <ul>
        {biosample.external_references.map((externalReference, i) => (
          <li key={i}>
            {referenceLink(externalReference) ? (
              <Link href={referenceLink(externalReference)}>
                <a>{externalReference.type.id}</a>
              </Link>
            ) : (
              externalReference.type.id
            )}
          </li>
        ))}
      </ul>

      {biosample.info.callset_ids?.length > 0 && (
        <>
          <h5>CNV Profile(s)</h5>
          {biosample.info.callset_ids?.map((csid, i) => (
            <CnvHistogramPreview key={i} csid={csid} datasetIds={datasetIds} />
          ))}
        </>
      )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={DataItemUrl(biosample.id, itemColl, datasetIds)+"&responseFormat=simple"}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}

function CnvHistogramPreview({ csid, datasetIds }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const url = `${basePath}cgi/api_chroplot.cgi?callsets.id=${csid}$&datasetIds=${datasetIds}&-size_plotimage_w_px=${width}`
  // width > 0 to make sure the component is mounted and avoid double fetch
  const dataEffect = useExtendedSWR(width > 0 && url, svgFetcher)
  return (
    <div ref={componentRef} className="mb-4">
      <Histogram dataEffectResult={dataEffect} />
    </div>
  )
}
