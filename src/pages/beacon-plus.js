import React, { useState } from "react"
import { useForm } from "react-hook-form"
import requestTypesConfig from "../../config/beacon-plus/requestTypes.yaml"
import { useBeaconQuery } from "../api/bycon"
import { markdownToReact } from "../utils/md"
import Nav from "../components/Nav"
import { BeaconForm } from "../components/beacon-plus/BeaconForm"
import { DatasetResultBox } from "../components/beacon-plus/DatasetResultBox"
import cn from "classnames"

export default function BeaconPlus() {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    setValue,
    clearErrors
  } = useForm()
  const [query, setQuery] = useState(null) // actual valid query

  const [requestType, setRequestType] = useState(
    Object.entries(requestTypesConfig)[0][0] // auto select first requestType from the file
  )
  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery
  } = useBeaconQuery(query)

  const isLoading = !queryResponse && !queryError && !!query

  const requestConfig = requestTypesConfig[requestType]

  const onSubmit = handleFormSubmit(
    clearErrors,
    setError,
    mutateQuery,
    setQuery
  )

  const handleRequestTypeClicked = (requestTypeId) => {
    const newParams = Object.fromEntries(
      Object.entries(
        requestTypesConfig[requestTypeId].parameters
      ).map(([k, v]) => [k, v?.value])
    )
    reset(newParams)
    setRequestType(requestTypeId)
  }

  const handleExampleClicked = (example) =>
    Object.entries(example.parameters).forEach(([k, v]) => setValue(k, v.value))

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container mb-5">
          <div className="content mb-6">
            This forward looking Beacon interface implements additional, planned
            features beyond the current Beacon specifications. <br />
            Further information can be found through the{" "}
            <a href="http://beacon-project.io/">ELIXIR Beacon website</a>.
          </div>
          <div className="tabs is-fullwidth">
            <ul>
              {Object.entries(requestTypesConfig).map(([id, value]) => (
                <li
                  className={cn({ "is-active": id === requestType })}
                  key={id}
                  onClick={() => handleRequestTypeClicked(id)}
                >
                  <a>{value.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <article className="message">
            <div className="message-body">
              <div className="content">
                {requestConfig.description &&
                  markdownToReact(requestConfig?.description)}
                <div className="buttons">
                  {Object.entries(requestConfig.examples || []).map(
                    ([id, value]) => (
                      <button
                        key={id}
                        className="button"
                        onClick={() => handleExampleClicked(value)}
                      >
                        {value.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>
          <BeaconForm
            requestConfig={requestConfig}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
            isLoading={isLoading}
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

function handleFormSubmit(clearErrors, setError, mutateQuery, setQuery) {
  return (formValues) => {
    clearErrors()
    // At this stage individual parameters are already validated.
    const {
      requestType,
      variantType,
      referenceBases,
      alternateBases,
      start,
      end
    } = formValues

    const missingParameters = []

    if (requestType === "variantAlleleRequest") {
      if (!referenceBases || !alternateBases || !start) {
        missingParameters.push("referenceBases", "alternateBases", "start")
      }
    } else if (requestType === "variantCNVrequest") {
      if (!start || !end || !variantType) {
        missingParameters.push("start", "end", "variantType")
      }
    } else if (requestType === "variantRangeRequest") {
      if (variantType && (referenceBases || alternateBases)) {
        const error = {
          type: "manual",
          message: "Use either Variant Type or Ref. Base(s) and Alt. Base(s)."
        }
        setError("variantType", error)
        setError("referenceBases", error)
        setError("alternateBases", error)
        return
      }
      if (!variantType && !(referenceBases || alternateBases)) {
        missingParameters.push(
          "variantType",
          "referenceBases",
          "alternateBases"
        )
      }
    } else if (requestType === "variantFusionRequest") {
      //
    }
    if (missingParameters.length > 0) {
      missingParameters.forEach((name) =>
        setError(name, { type: "manual", message: "Parameter is missing" })
      )
      return
    }

    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
  }
}
