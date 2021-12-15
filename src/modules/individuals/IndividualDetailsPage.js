import {
  getDataItemUrl,
  useDataItemDelivery,
  NoResultsHelp
} from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
// import Link from "next/link"

const itemColl = "individuals"
const exampleId = "pgxind-kftx266l"

const IndividualDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id, datasetIds } = urlQuery
  if (! datasetIds) {
    datasetIds = "progenetix"
  }
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Individual Details" headline="Individual Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <IndividualLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default IndividualDetailsPage

function IndividualLoader({ id, datasetIds }) {
  const apiReply = useDataItemDelivery(id, itemColl, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <IndividualResponse
          response={response}
          id={id}
          datasetIds={datasetIds}
        />
      )}
    />
  )
}

function IndividualResponse({ response, datasetIds }) {
  if (!response.response.resultSets[0].results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  return <Individual individual={response.response.resultSets[0].results[0]} datasetIds={datasetIds} />
}

function Individual({ individual, datasetIds }) {
  return (
    <section className="content">
      <h3 className="mb-6">
        {individual.id} ({datasetIds})
      </h3>

      {individual.description && (
        <>
          <h5>Description</h5>
          <p>{individual.description}</p>
        </>
      )}

      {individual.sex && (
        <>
          <h5>Genotypic Sex</h5>
          <p>{individual.sex.label}</p>
        </>
      )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={
            getDataItemUrl(individual.id, itemColl, datasetIds) +
            "&responseFormat=simple"
          }
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
