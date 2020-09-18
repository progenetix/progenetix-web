import React, { useState } from "react"
import { useBeaconQuery } from "../../hooks/api"
import Panel from "../Panel"
import { FaSlidersH } from "react-icons/fa"
import { BiosamplesSearchForm } from "./BiosamplesSearchForm"
import { BiosamplesResults } from "./BiosamplesResults"
import PropTypes from "prop-types"

BiosamplesSearchPanel.propTypes = {
  datasets: PropTypes.array.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired
}

export default function BiosamplesSearchPanel({
  datasets,
  requestTypesConfig,
  parametersConfig
}) {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery,
    isLoading: isQueryLoading
  } = useBeaconQuery(query)

  const isLoading = isQueryLoading && !!query

  const onValidFormQuery = (formValues) => {
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
              <span>Search Samples</span>
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
            setSearchQuery={onValidFormQuery}
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
