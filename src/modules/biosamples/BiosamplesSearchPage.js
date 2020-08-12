import React, { useState } from "react"
import { Layout } from "../../components/layouts/Layout"
import { useBeaconQuery } from "../../hooks/api"
import { BiosamplesSearchForm } from "../../components/biosamples/BiosamplesSearchForm"
import requestTypesConfig from "../../../config/beacon-plus/requestTypes.yaml"
import parametersConfig from "../../../config/beacon-plus/parameters.yaml"
import Panel from "../../components/Panel"
import { FaSlidersH } from "react-icons/fa"
import { BiosamplesResults } from "../../components/biosamples/BiosamplesResults"

export default function BiosamplesSearchPage() {
  return (
    <Layout title="Sample search" headline="Sample search">
      <BiosamplesSearch />
    </Layout>
  )
}

function BiosamplesSearch() {
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
    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
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
            requestTypesConfig={requestTypesConfig}
            parametersConfig={parametersConfig}
            isLoading={isLoading}
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
