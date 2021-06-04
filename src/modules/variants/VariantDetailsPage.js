import {
  getDataItemUrl,
  HANDOVER_IDS,
  useDataItemDelivery,
  replaceWithProxy,
  useProgenetixApi,
  NoResultsHelp
} from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"

const itemColl = "variants"
const exampleId = "5bab576a727983b2e00b8d32"

const VariantDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds } = urlQuery
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Variant Details" headline="Variant Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <VariantLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default VariantDetailsPage

function VariantLoader({ id, datasetIds }) {
  const apiReply = useDataItemDelivery(id, itemColl, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <>
        <VariantResponse
          response={response}
          id={id}
          datasetIds={datasetIds}
        />
        <VariantsInterpretationResponse
          response={response}
          datasetIds={datasetIds}
        />
        </>
      )}
    />
  )
}

function VariantResponse({ response, datasetIds }) {
  if (!response.result_sets[0].results[0]) {
    return NoResultsHelp(exampleId, itemColl)
  }
  return <Variant variant={response.result_sets[0].results[0]} datasetIds={datasetIds} />
}

function VariantsInterpretationResponse({ response, datasetIds }) {
  
  const handoverById = (givenId) => response.result_sets[0].results_handovers.find(({ handoverType: { id } }) => id === givenId)
  const variantsAnnotationsHandover = handoverById(HANDOVER_IDS.variantsannotations)
  const variantsAnnotationsReply= useProgenetixApi(
    variantsAnnotationsHandover && replaceWithProxy(variantsAnnotationsHandover.url)
  )
  return <VariantInterpretation ho={variantsAnnotationsHandover} apiReply={variantsAnnotationsReply} datasetIds={datasetIds} />

}

function Variant({ variant, datasetIds }) {
  return (
    <section className="content">
      <h3 className="mb-6">
        {variant.id} ({datasetIds})
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
          href={getDataItemUrl(variant.id, itemColl, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}

// replace this with a table

function VariantInterpretation({ ho, apiReply, datasetIds }) {
  return (
    <WithData
      apiReply={apiReply}
      datasetIds={datasetIds}
      render={(response) => (
        <section className="content">
        <hr/>
        <h3 className="mb-6">
          {response.result_sets[0].results[0].id}
        </h3>
        <ul>
          <li>Cytoband: {response.result_sets[0].results[0].cytoband}</li>
          <li>Gene ID: {response.result_sets[0].results[0].gene_id}</li>
        </ul>
        <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={ho.url}
        >
          {"{JSON↗}"}
        </a>
        </h5>
        </section>
      )}
    />
  )
}
