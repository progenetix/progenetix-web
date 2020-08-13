import React, { useState } from "react"
import { useBeaconQuery } from "../../hooks/api"
import { BiosamplesSearchForm } from "../../components/biosamples/BiosamplesSearchForm"
import requestTypesConfig from "../../../config/beacon-plus/requestTypes.yaml"
import parametersConfig from "../../../config/beacon-plus/parameters.yaml"
import Panel from "../../components/Panel"
import { FaSlidersH } from "react-icons/fa"
import Nav from "./Nav"
import { BiosamplesResults } from "../../components/biosamples/BiosamplesResults"

export default function BeaconPlusPage() {
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
      <Nav />
      <div className="section">
        <div className="BeaconPlus__container">
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
              isQuerying={isLoading}
              onValidFormQuery={handleValidFormQuery}
            />
          </Panel>
        </div>
      </div>
      <div className="section pt-0">
        <div className="BeaconPlus__container">
          {query && (
            <BiosamplesResults
              isLoading={isLoading}
              response={queryResponse}
              error={queryError}
              query={query}
            />
          )}
        </div>
      </div>
    </>
  )
}
