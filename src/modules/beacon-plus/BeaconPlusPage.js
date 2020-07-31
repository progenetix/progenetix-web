import React, { useState } from "react"
import { useBeaconQuery } from "../../hooks/api"
import { BeaconForm } from "./BeaconForm"
import { DatasetResultBox } from "./DatasetResultBox"
import requestTypesConfig from "../../../config/beacon-plus/requestTypes.yaml"
import parametersConfig from "../../../config/beacon-plus/parameters.yaml"
import Panel from "../../components/Panel"
import { FaSlidersH } from "react-icons/fa"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/layouts/Layout"

export default function BeaconPlusPage() {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery
  } = useBeaconQuery(query)

  const isLoading = !queryResponse && !queryError && !!query

  const handleValidFormQuery = (formValues) => {
    setSearchCollapsed(true)
    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
  }

  return (
    <Layout
      title="Beacon+"
      headline={
        <>
          Beacon<sup style={{ color: "red" }}>+</sup>
        </>
      }
    >
      <div className="mb-6">
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
      {query && (
        <Results
          isLoading={isLoading}
          response={queryResponse}
          error={queryError}
          query={query}
        />
      )}
    </Layout>
  )
}

function Results({ response, isLoading, error, query }) {
  return (
    <>
      <div className="subtitle ">
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
  filters = filters.filter((f) => f && f.length > 1)
  return (
    <ul className="beacon-plus__query-summary">
      {query.assemblyId && (
        <li>
          <small>Assembly: </small>
          {query.assemblyId}
        </li>
      )}
      {query.referenceName && (
        <li>
          <small>Chro: </small>
          {query.referenceName}
        </li>
      )}
      {query.start && (
        <li>
          <small>Start: </small>
          {query.start}
        </li>
      )}
      {query.end && (
        <li>
          <small>End: </small>
          {query.end}
        </li>
      )}
      {query.variantType && (
        <li>
          <small>Type: </small>
          {query.variantType}
        </li>
      )}
      {query.referenceBases && (
        <li>
          <small>Ref. Base(s): </small>
          {query.referenceBases}
        </li>
      )}
      {query.alternateBases && (
        <li>
          <small>Alt. Base(s): </small>
          {query.alternateBases}
        </li>
      )}
      {filters.length > 0 && (
        <li>
          <small>Filters: </small>
          {filters.join(", ")}
        </li>
      )}
    </ul>
  )
}
