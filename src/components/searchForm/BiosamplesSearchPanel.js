import React, { useState } from "react"
import { useBeaconQuery } from "../../hooks/api"
import Panel from "../Panel"
import cn from "classnames"
// import { FaSlidersH } from "react-icons/fa"
import { BiosamplesSearchForm } from "./BiosamplesSearchForm"
import { BiosamplesResults } from "../searchResults/BiosamplesResults"
import PropTypes from "prop-types"
// import cn from "classnames"

BiosamplesSearchPanel.propTypes = {
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired,
  collapsed: false
}

export default function BiosamplesSearchPanel({
  requestTypesConfig,
  parametersConfig,
  cytoBands,
  collapsed,
  useUtilitiesButtons = true
}) {
  const [query, setQuery] = useState(null) // actual valid query
  const [searchCollapsed, setSearchCollapsed] = useState(collapsed)

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

  return  (
    <>
      <Panel
        isOpened={!searchCollapsed}
        heading={
            <div className="columns">
              {(searchCollapsed && (
                <>
                <div className="column">
                  <button
                    className={cn("button", "is-primary")}
                    onClick={() => {
                      clearQuery()
                      setSearchCollapsed(false)
                    }}
                  >
                    Edit Query
                  </button>
                </div>
                </>
              ))
              ||
              null
            }
            </div>
        }
      >
        <BiosamplesSearchForm
          cytoBands={cytoBands}
          requestTypesConfig={requestTypesConfig}
          parametersConfig={parametersConfig}
          isQuerying={isLoading}
          setSearchQuery={onValidFormQuery}
          useUtilitiesButtons={useUtilitiesButtons}
        />
      </Panel>
      {query && (
        <BiosamplesResults
          isLoading={isLoading}
          response={queryResponse}
          error={queryError}
          query={query}
        />
      )}
    </>
  )
}
