import {
  SITE_DEFAULTS,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { BeaconRESTLink, InternalLink } from "../../components/helpersShared/linkHelpers"

import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"

const itemColl = "callsets"
const exampleId = "pgxcs-kftvlijb"

const CallsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  var datasetIds = SITE_DEFAULTS.DATASETID
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Callset Details" headline="Callset Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <CallsetLoader csId={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default CallsetDetailsPage

function CallsetLoader({ csId, datasetIds }) {
  const { data, error, isLoading } = useDataItemDelivery(
    csId,
    itemColl,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <CallsetResponse response={data} csId={csId} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function CallsetResponse({ response, csId, datasetIds }) {
  if (!response.response.resultSets[0].results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  return <Callset callset={response.response.resultSets[0].results[0]} csId={csId} datasetIds={datasetIds} />
}

function Callset({ callset, csId, datasetIds }) {
  return (

<section className="content">
  <h3 className="mb-6">
    {csId}
  </h3>

  {callset.description && (
    <>
      <h5>Description</h5>
      <p>{callset.description}</p>
    </>
  )}

  {callset.biosampleId && (
    <>
      <h5>Biosample</h5>
      <p>
        <InternalLink
          href={`/biosample?id=${callset.biosampleId}&datasetIds=${datasetIds}`}
          label={callset.biosampleId}
        />
      </p>
    </>
  )}

  <h5>Download</h5>
  <ul>
    <li>Callset data as{" "}
      <BeaconRESTLink
        entryType="analyses"
        idValue={csId}
        datasetIds={datasetIds}
        label="Beacon JSON"
      />
    </li>
    <li>Sample data as{" "}
      <BeaconRESTLink
        entryType="analyses"
        idValue={csId}
        responseType="biosamples"
        datasetIds={datasetIds}
        label="Beacon biosample JSON"
      />
    </li>
    <li>Callset variants as{" "}
      <BeaconRESTLink
        entryType="analyses"
        idValue={csId}
        responseType="variants"
        datasetIds={datasetIds}
        label="Beacon JSON"
      />
    </li>
    <li>Callset variants as{" "}
      <BeaconRESTLink
        entryType="analyses"
        idValue={csId}
        responseType="variants"
        datasetIds={datasetIds}
        output="pgxseg"
        label="Progenetix .pgxseg file"
      />
    </li>
    <li>Callset variants as{" "}
      <BeaconRESTLink
        entryType="analyses"
        idValue={csId}
        responseType="variants"
        datasetIds={datasetIds}
        output="vcf"
        label="(experimental) VCF 4.4 file"
      />
    </li>
  </ul>

</section>)
}
