import {
  SITE_DEFAULTS,
  BIOKEYS,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { BeaconRESTLink, InternalLink, ReferenceLink } from "../../components/helpersShared/linkHelpers"
import { WithData } from "../../components/Loader"
import React from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import { ShowJSON } from "../../components/RawData"
import { CallsetHistogram } from "../../components/SVGloaders"
import { pluralizeWord }  from "../../components/helpersShared/labelHelpers"

const itemColl = "biosamples"
const exampleId = "pgxbs-kftvir6m"

const SampleDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  var datasetIds = SITE_DEFAULTS.DATASETID
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Sample Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <BiosampleLoader biosId={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default SampleDetailsPage

function BiosampleLoader({ biosId, datasetIds }) {
  const apiReply = useDataItemDelivery(biosId, itemColl, datasetIds)

  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <BiosampleResponse
          response={response}
          biosId={biosId}
          datasetIds={datasetIds}
        />
      )}
    />
  )
}

function BiosampleResponse({ response, biosId, datasetIds }) {
  if (!response.response.resultSets[0].results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  return <Biosample biosample={response.response.resultSets[0].results[0]} biosId={biosId} datasetIds={datasetIds} />
}

function Biosample({ biosample, biosId, datasetIds }) {

  return (

<section className="content">

  <h2 className="mb-6">
    Sample Details for <i>{biosId}</i>
  </h2>

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
      <InternalLink
        href={`/subset/?id=${biosample[bioc].id}&datasetIds=${ datasetIds }`}
        label={biosample[bioc].id}
      />
    </li>
  ))}      
  </ul>

  {biosample.celllineInfo && (
    <>
    <h5>Cell Line Info</h5>
    <ul>
    {biosample.celllineInfo.id && (
      <li>
        Instance of {" "}
        <InternalLink
          href={`/cellline/?id=${biosample.celllineInfo.id}&datasetIds=${ datasetIds }`}
          label={biosample.celllineInfo.id}
        />
      </li>
    )}
    </ul>
    </>
  )}

  {biosample.provenance && (
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
  )}

  {biosample.individualId && (
    <>
      <h5>Individual</h5>
      <ul>
        <li>Progenetix entry:{" "}
          <InternalLink
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
          {externalReference.description && (
            `${externalReference.description}: `
          )}
          {externalReference.label && (
            `${externalReference.label}: `
          )}
          {ReferenceLink(externalReference) ? (
            <InternalLink
              href={ReferenceLink(externalReference)}
              label={`${externalReference.id}`}
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
        <CallsetHistogram key={i} csid={csid} datasetIds={datasetIds} />
      ))}
    </>
  )}

  <h5>Download</h5>
  <ul>
    <li>Sample data as{" "}
      <BeaconRESTLink
        entryType="biosamples"
        idValue={biosId}
        datasetIds={datasetIds}
        label="Beacon JSON"
      />
    </li>
    <li>Sample data as{" "}
      <BeaconRESTLink
        entryType="biosamples"
        idValue={biosId}
        responseType="phenopackets"
        datasetIds={datasetIds}
        label="Beacon Phenopacket JSON"
      />
    </li>
    <li>Sample variants as{" "}
      <BeaconRESTLink
        entryType="biosamples"
        idValue={biosId}
        responseType="variants"
        datasetIds={datasetIds}
        label="Beacon JSON"
      />
    </li>
    <li>Sample variants as{" "}
      <BeaconRESTLink
        entryType="biosamples"
        idValue={biosId}
        responseType="variants"
        datasetIds={datasetIds}
        output="pgxseg"
        label="Progenetix .pgxseg file"
      />
    </li>
    <li>Sample variants as{" "}
      <BeaconRESTLink
        entryType="biosamples"
        idValue={biosId}
        responseType="variants"
        datasetIds={datasetIds}
        output="vcf"
        label="(experimental) VCF 4.4 file"
      />
    </li>
  </ul>

  <ShowJSON data={biosample} />

</section>
  )
}


