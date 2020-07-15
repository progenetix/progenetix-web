import React, { useState } from "react"
import { useBeaconQuery } from "../api/bycon"
import Nav from "../components/Nav"
import { BeaconForm } from "../components/beacon-plus/BeaconForm"
import { DatasetResultBox } from "../components/beacon-plus/DatasetResultBox"

export default function BeaconPlus() {
  const [query, setQuery] = useState(null) // actual valid query

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery
  } = useBeaconQuery(query)

  const isLoading = !queryResponse && !queryError && !!query

  const handleValidFormQuery = (formValues) => {
    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
  }

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container mb-5">
          <BeaconForm
            isLoading={isLoading}
            onValidFormQuery={handleValidFormQuery}
          />
        </div>
        <div className="container">
          <Results response={queryResponse} error={queryError} query={query} />
        </div>
      </section>
    </>
  )
}

function Results({ response, error, query }) {
  if (!response && !error) {
    return null
  } else if (error) {
    return (
      <div className="notification is-warning">
        An error occurred while performing the query. Please retry.
      </div>
    )
  } else if (!(response?.datasetAlleleResponses?.length >= 0)) {
    return (
      <div className="notification">
        No results could be found for this query.
      </div>
    )
  } else
    return (
      <>
        <span className="is-size-3">Results</span>
        <div className="mb-4">
          <QuerySummary query={query} />
        </div>
        {response.datasetAlleleResponses.map((r, i) => (
          <DatasetResultBox key={i} data={r} query={query} />
        ))}
      </>
    )
}

function QuerySummary({ query }) {
  let filters = []
  if (query.bioontology) {
    filters = [...filters, ...query.bioontology]
  }
  if (query.materialtype) {
    filters = [...filters, query.materialtype]
  }
  if (query.freeFilters) {
    filters = [...filters, query.freeFilters]
  }
  // TODO: Only show each parameter if it has a value
  return (
    <>
      <span>Assembly: {query.assemblyId}</span> |{" "}
      <span>Chro: {query.referenceName}</span> |{" "}
      <span>Start: {query.start}</span> | <span>End: {query.end}</span> |{" "}
      <span>Type: {query.variantType}</span> |{" "}
      <span>Ref. Base(s): {query.referenceBases}</span> |{" "}
      <span>Alt. Base(s): {query.alternateBases}</span> |{" "}
      <span>Filters: {filters.join(", ")}</span>
    </>
  )
}
