import React, { useState } from "react"
import { useBeaconQuery } from "../effects/api"
import Nav from "../components/Nav"
import { BeaconForm } from "../components/beacon-plus/BeaconForm"
import { DatasetResultBox } from "../components/beacon-plus/DatasetResultBox"
import requestTypesConfig from "../../config/beacon-plus/requestTypes.yaml"
import parametersConfig from "../../config/beacon-plus/parameters.yaml"
import Panel from "../components/Panel"
import { FaSlidersH } from "react-icons/fa"
import { Loader } from "../components/Loader"

export default function BeaconPlus() {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery
  } = useBeaconQuery(query)

  const isLoading = !queryResponse && !queryError && !!query

  const handleValidFormQuery = (formValues) => {
    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
    setSearchCollapsed(true)
  }

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container mb-5">
          <Panel
            isOpened={!searchCollapsed}
            heading={
              <>
                <span>Search</span>
                {searchCollapsed && (
                  <button className="button ml-3">
                    <FaSlidersH
                      onClick={() => setSearchCollapsed(false)}
                      className="icon has-text-info"
                    />
                    {/*<span>Edit</span>*/}
                  </button>
                )}
              </>
            }
          >
            <BeaconForm
              requestTypesConfig={requestTypesConfig}
              parametersConfig={parametersConfig}
              isLoading={isLoading}
              onValidFormQuery={handleValidFormQuery}
            />
          </Panel>
        </div>
        <div className="container">
          {query && (
            <Results
              isLoading={isLoading}
              response={queryResponse}
              error={queryError}
              query={query}
            />
          )}
        </div>
      </section>
    </>
  )
}

function Results({ response, isLoading, error, query }) {
  return (
    <>
      <span className="is-size-3">Results</span>
      <div className="mb-4">
        <QuerySummary query={query} />
      </div>
      <Loader isLoading={isLoading} hasError={error} colored background>
        <AlleleResponses
          datasetAlleleResponses={response?.datasetAlleleResponses}
          query={query}
        />
      </Loader>
    </>
  )
}

function AlleleResponses({ datasetAlleleResponses, query }) {
  if (!(datasetAlleleResponses?.length >= 0)) {
    return (
      <div className="notification">
        No results could be found for this query.
      </div>
    )
  }
  return datasetAlleleResponses.map((r, i) => (
    <DatasetResultBox key={i} data={r} query={query} />
  ))
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
