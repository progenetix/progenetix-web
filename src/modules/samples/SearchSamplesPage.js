import React, { useState } from "react"
import { Layout } from "../../components/layouts/Layout"
import { useBeaconQuery } from "../../hooks/api"
import { BiosamplesSearchForm } from "../../components/biosamples/BiosamplesSearchForm"
import parametersConfig from "../../../config/samples-search/parameters.yaml"
import requestTypesConfig from "../../../config/samples-search/progenetix_requestTypes.yaml"
import Panel from "../../components/Panel"
import { FaSlidersH } from "react-icons/fa"
import { BiosamplesResults } from "../../components/biosamples/BiosamplesResults"

export default function SearchSamplesPage() {
  return (
    <Layout title="Search Samples" headline="Search Samples">
      <SearchSamples />
    </Layout>
  )
}

const datasets = [
  { label: "progenetix", value: "progenetix" },
  { label: "arraymap", value: "arraymap" }
]

function SearchSamples() {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery,
    isLoading: isQueryLoading
  } = useBeaconQuery(query)

  const isLoading = isQueryLoading && !!query

  const handleValidFormQuery = (formValues) => {
    setSearchCollapsed(true)
    setQuery(formValues)
    mutateQuery(null) // mutateQuery and clear current results
  }

  return (
    <>
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
                </button>
              )}
            </>
          }
        >
          <BiosamplesSearchForm
            datasets={datasets}
            requestTypesConfig={requestTypesConfig}
            parametersConfig={parametersConfig}
            isQuerying={isLoading}
            onValidFormQuery={handleValidFormQuery}
          />
        </Panel>
      </div>
      <div className="mb-6">
        {query && (
          <BiosamplesResults
            isLoading={isLoading}
            response={queryResponse}
            error={queryError}
            query={query}
          />
        )}
      </div>
    </>
  )
}
