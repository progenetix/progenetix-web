import { DataItemUrl, DataItemDelivery, NoResultsHelp } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
// import Link from "next/link"

const itemColl = "individuals"
const exampleId = "pgxind-kftx266l"

const IndividualDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds } = urlQuery
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
  const { data, error, isLoading } = DataItemDelivery(id, itemColl, datasetIds)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <IndividualResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function IndividualResponse({ response, datasetIds }) {
  if (!response.response.results) {
    return NoResultsHelp(exampleId, itemColl)
  }
  if (response.meta.errors.length > 0) {
    return (
      <div className="notification is-size-5">
        <div className="message-body">ERROR: {response.meta.errors[0]}</div>
      </div>
    )
  }

  return (
    <Individual
      individual={response.response.results[0]}
      datasetIds={datasetIds}
    />
  )
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

      <h5>Biocharacteristics</h5>
      <ul>
        {individual.biocharacteristics.map((biocharacteristic, i) => (
          <li key={i}>
            {biocharacteristic.id} : {biocharacteristic.label}
          </li>
        ))}
      </ul>

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={
            DataItemUrl(individual.id, itemColl, datasetIds) +
            "&responseFormat=simple"
          }
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
