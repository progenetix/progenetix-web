import {
  getDataItemUrl,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import Link from "next/link"

const itemColl = "callsets"
const exampleId = "pgxcs-kftvlijb"

const CallsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds } = urlQuery
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Callset Details" headline="Callset Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <CallsetLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default CallsetDetailsPage

function CallsetLoader({ id, datasetIds }) {
  const { data, error, isLoading } = useDataItemDelivery(
    id,
    itemColl,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <CallsetResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function CallsetResponse({ response, datasetIds }) {
  if (!response.result_sets[0].results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  if (response.meta.errors.length > 0) {
    return (
      <div className="notification is-size-5">
        <div className="message-body">ERROR: {response.meta.errors[0]}</div>
      </div>
    )
  }

  return <Callset callset={response.result_sets[0].results[0]} datasetIds={datasetIds} />
}

function Callset({ callset, datasetIds }) {
  return (
    <section className="content">
      <h3 className="mb-6">
        {callset.id} ({datasetIds})
      </h3>

      {callset.description && (
        <>
          <h5>Description</h5>
          <p>{callset.description}</p>
        </>
      )}

      {callset.biosample_id && (
        <>
          <h5>Biosample</h5>
          <p>
            <Link
              href={`/biosamples/details?id=${callset.biosample_id}&datasetIds=${datasetIds}`}
            >
              {callset.biosample_id}
            </Link>
          </p>
        </>
      )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={getDataItemUrl(callset.id, itemColl, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
