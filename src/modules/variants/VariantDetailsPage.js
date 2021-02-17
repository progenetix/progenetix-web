import {
  getDataItemUrl,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"

const itemColl = "variants"
const exampleId = "5bab576a727983b2e00b8d32"

const VariantDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { _id, datasetIds } = urlQuery
  const hasAllParams = _id && datasetIds
  return (
    <Layout title="Variant Details" headline="Variant Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <VariantLoader _id={_id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default VariantDetailsPage

function VariantLoader({ _id, datasetIds }) {
  const apiReply = useDataItemDelivery(_id, itemColl, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <VariantResponse
          response={response}
          _id={_id}
          datasetIds={datasetIds}
        />
      )}
    />
  )
}

function VariantResponse({ response, datasetIds }) {
  if (!response.results) {
    return NoResultsHelp(exampleId, itemColl)
  }

  return <Variant variant={response.results[0]} datasetIds={datasetIds} />
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
          href={
            getDataItemUrl(variant._id, itemColl, datasetIds)
          }
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
