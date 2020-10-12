import {
  DataItemUrl,
  DataItemDelivery
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
// import Link from "next/link"

const itemColl = "individuals"

const IndividualDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds } = urlQuery
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Individual Details" headline="Individual Details">
      {!hasAllParams ? (
        <NoResultsHelp />
      ) : (
        <IndividualLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default IndividualDetailsPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific individual ID
      which already exists in the Progenetix or arrayMap <strong>{itemColl}</strong> database,
      e.g.{" "}
      <a href="/individuals/details?id=pgxind-kftx266l&datasetIds=progenetix">
        /individuals/details?id=pgxind-kftx266l&datasetIds=progenetix
      </a>
      .
    </div>
  )
}

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
    <Individual
      individual={response.data}
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
              {biocharacteristic.type.id} : {biocharacteristic.type.label}
          </li>
        ))}
      </ul>

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={DataItemUrl(individual.id, itemColl, datasetIds)+"&responseFormat=simple"}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
