import React, { useState } from "react"
import { useBeaconQuery } from "../../hooks/api"
import Panel from "../Panel"
// import { FaSlidersH } from "react-icons/fa"
import { BiosamplesSearchForm } from "./BiosamplesSearchForm"
import { BiosamplesResults } from "./BiosamplesResults"
import PropTypes from "prop-types"
// import cn from "classnames"

BiosamplesSearchPanel.propTypes = {
  datasets: PropTypes.array.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired
}

export default function BiosamplesSearchPanel({
  datasets,
  requestTypesConfig,
  parametersConfig,
  cytoBands
}) {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(false)

  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery,
    isLoading: isQueryLoading
  } = useBeaconQuery(query)

  const clearQuery = () => {
    setQuery(null)
    mutateQuery(null)
  }
  const isLoading = isQueryLoading && !!query
  const onValidFormQuery = (formValues) => {
    setSearchCollapsed(true)
    clearQuery()
    setQuery(formValues)
  }

  // button className="button ml-3"
  //    className="icon has-text-info"

  return (
    <>
      <div className="mb-6">
        <Panel
          isOpened={!searchCollapsed}
          heading={
            <div>
              <div className="columns">
                <div className="column">Search Samples</div>
                {searchCollapsed && (
                  <div className="column">
                    <button
                      className="button is-info mb-5"
                      onClick={() => {
                        clearQuery()
                        setSearchCollapsed(false)
                      }}
                    >
                      Modify Query
                    </button>
                  </div>
                )}
              </div>
            </div>
          }
        >
          <BiosamplesSearchForm
            cytoBands={cytoBands}
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
