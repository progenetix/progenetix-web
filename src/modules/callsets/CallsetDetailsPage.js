import {
  callsetUrl,
  useCallset
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"

const CallsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds } = urlQuery
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Callset Details" headline="Callset Details">
      {!hasAllParams ? (
        <NoResultsHelp />
      ) : (
        <CallsetLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default CallsetDetailsPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific callset ID
      which already exists in the Progenetix or arrayMap `callsets` database,
      e.g.{" "}
      <a href="/callsets/details?id=pgxcs-kftvlijb&datasetIds=progenetix">
        /callsets/details?id=pgxcs-kftvlijb&datasetIds=progenetix
      </a>
      .
    </div>
  )
}

function CallsetLoader({ id, datasetIds }) {
  const { data, error, isLoading } = useCallset(id, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <CallsetResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function CallsetResponse({ response, datasetIds }) {
  if (!response.data) {
    return <NoResultsHelp />
  }
  if (response.errors.length > 1) {
    return (
      <div className="notification is-size-5">
        <div className="message-body">The request returned errors.</div>
      </div>
    )
  }

  return (
    <Callset
      callset={response.data}
      datasetIds={datasetIds}
    />
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
          href={callsetUrl(callset.id, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
