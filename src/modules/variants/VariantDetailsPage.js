import {
  variantUrl,
  useVariant
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"

const VariantDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { _id, datasetIds } = urlQuery
  const hasAllParams = _id && datasetIds
  return (
    <Layout title="Variant Details" headline="Variant Details">
      {!hasAllParams ? (
        <NoResultsHelp />
      ) : (
        <VariantLoader _id={_id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default VariantDetailsPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific variant _ID
      which already exists in the Progenetix or arrayMap `variants` database,
      e.g.{" "}
      <a href="/variants/details?_id=5bab576a727983b2e00b8d32&datasetIds=progenetix">
        /variants/details?_id=5bab576a727983b2e00b8d32?datasetIds=progenetix
      </a>
      .
    </div>
  )
}

function VariantLoader({ _id, datasetIds }) {
  const { data, error, isLoading } = useVariant(_id, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <VariantResponse response={data} _id={_id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function VariantResponse({ response, datasetIds }) {
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
    <Variant
      variant={response.data}
      datasetIds={datasetIds}
    />
  )
}

function Variant({ variant, datasetIds }) {
  return (
    <section className="content">
      <h3 className="mb-6">
        {variant._id} ({datasetIds})
      </h3>

      {variant.digest && (
        <>
          <h5>Digest</h5>
          <p>{variant.digest}</p>
        </>
      )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={variantUrl(variant._id, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
