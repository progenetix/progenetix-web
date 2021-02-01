import { DataItemUrl, DataItemDelivery, NoResultsHelp } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"

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
  const { data, error, isLoading } = DataItemDelivery(id, itemColl, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <CallsetResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function CallsetResponse({ response, datasetIds }) {
  if (!response.response.results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  if (response.meta.errors.length > 1) {
    return (
      <div className="notification is-size-5">
        <div className="message-body">The request returned errors.</div>
      </div>
    )
  }

  return (
    <Callset callset={response.response.results[0]} datasetIds={datasetIds} />
  )
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

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={
            DataItemUrl(callset.id, itemColl, datasetIds) +
            "&responseFormat=simple"
          }
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
