import {
  SITE_DEFAULTS,
  BIOKEYS,
  getDataItemUrl,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { Link, referenceLink } from "../../components/helpersShared/linkHelpers"
import { WithData } from "../../components/Loader"
import React from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import { ShowJSON } from "../../components/RawData"
import { CnvHistogramPreview } from "../../components/Histogram"
import { pluralizeWord }  from "../../components/helpersShared/labelHelpers"

const itemColl = "biosamples"
const exampleId = "pgxbs-kftvir6m"

const SampleDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  var datasetIds = SITE_DEFAULTS.DATASETID
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Sample Details" headline="Sample Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <BiosampleLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default SampleDetailsPage

function BiosampleLoader({ id, datasetIds }) {
  const apiReply = useDataItemDelivery(id, itemColl, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <BiosampleResponse
          response={response}
          id={id}
          datasetIds={datasetIds}
        />
      )}
    />
  )
}

function BiosampleResponse({ response, datasetIds }) {
  if (!response.response.resultSets[0].results) {
    return NoResultsHelp(exampleId, itemColl)
  }

  return <Biosample biosample={response.response.resultSets[0].results[0]} datasetIds={datasetIds} />
}

function Biosample({ biosample, datasetIds }) {
  const biosId = biosample.id
  return (
    <section className="content">
    
      <h3 className="mb-6">
        {biosId} ({SITE_DEFAULTS.DATASETLABEL})
      </h3>

      {biosample.description && (
        <>
          <h5>Description</h5>
          <p>{biosample.description}</p>
        </>
      )}

      <h5>Diagnostic Classifications </h5>
      <ul>
      {BIOKEYS.map(bioc => (
        <li key={bioc}>
          {biosample[bioc].label}{": "}
          <Link
            href={`/subsets/biosubsets?filters=${biosample[bioc].id}&datasetIds=${ datasetIds }`}
            label={biosample[bioc].id}
          />
        </li>
      ))}      
      </ul>

      <>
      <h5>Clinical Data</h5>
      <ul>
        {biosample.individualAgeAtCollection?.age && (
          <li>
            Age at Collection: {biosample.individualAgeAtCollection.age}
          </li>
        )}
        {biosample.info?.tnm && (
          <li>TNM: {biosample.info.tnm}</li>
        )}
        {biosample.info?.death && (
          <li>
            Death: {biosample.info.death} (at {biosample.info.followup_months}{" "}
            months)
          </li>
        )}
      </ul>
      </>

      <>
      <h5>Provenance</h5>
      <ul>
        {biosample.provenance?.material?.label && (
          <>
            <li>Material: {biosample.biosampleStatus.label}</li>
          </>
        )}
        {biosample.provenance?.geoLocation?.properties?.label && (
          <>
            <li>
              Origin: {biosample.provenance.geoLocation.properties.label}
            </li>
          </>
        )}
        {biosample.dataUseConditions?.id && (
          <>
            <li>
              Data Use Conditions: {biosample.dataUseConditions.id} (
              {biosample.dataUseConditions?.label})
            </li>
          </>
        )}
      </ul>
      </>

      {biosample.individualId && (
        <>
          <h5>Individual</h5>
          <ul>
            <li>Progenetix entry:{" "}
              <Link
                href={`/individual/?id=${biosample.individualId}&datasetIds=${ datasetIds }`}
                label={biosample.individualId}
              />
            </li>
          </ul>
        </>
      )}

      {biosample.externalReferences && (
        <>
        <h5>External References</h5>
        <ul>
          {biosample.externalReferences.map((externalReference, i) => (
            <li key={i}>
              {externalReference?.description}{" "}
              {referenceLink(externalReference) ? (
                <Link
                  href={referenceLink(externalReference)}
                  label={`: ${externalReference.id}`}
                />
              ) : (
                externalReference.id
              )}
            </li>
          ))}
        </ul>
        </>
      )}

      { biosample.info && biosample.info.callsetIds?.length > 0 && (
        <>
          <h5>CNV {pluralizeWord("Plot", biosample.info.callsetIds.length)}</h5>
          {biosample.info?.callsetIds.map((csid, i) => (
            <CnvHistogramPreview key={i} csid={csid} datasetIds={datasetIds} />
          ))}
        </>
      )}

      <ShowJSON data={biosample} />

      <h5>
        Download Data as Beacon v2{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={
            getDataItemUrl(biosample.id, itemColl, datasetIds) +
            "&responseFormat=simple"
          }
        >
          {"{JSON↗}"}
        </a>
      </h5>

    </section>
  )
}


