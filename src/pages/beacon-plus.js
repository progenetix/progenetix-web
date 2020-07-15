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

  const [example, setExample] = useState(null)

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
    setExample(null)
    const newParams = Object.fromEntries(
      Object.entries(
        requestTypesConfig[requestTypeId].parameters
      ).map(([k, v]) => [k, v?.value])
    )
    reset(newParams)
    setRequestType(requestTypeId)
  }

  const handleExampleClicked = (example) => {
    setExample(example)
    Object.entries(example.parameters).forEach(([k, v]) => setValue(k, v.value))
  }

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container mb-5">
          <Tabs
            requestType={requestType}
            onRequestTypeClicked={handleRequestTypeClicked}
          />
          <RequestDescription
            requestConfig={requestConfig}
            example={example}
            onExampleClicked={handleExampleClicked}
          />
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

function Tabs({ requestType, onRequestTypeClicked }) {
  return (
    <div className="tabs">
      <ul>
        {Object.entries(requestTypesConfig).map(([id, value]) => (
          <li
            className={cn({ "is-active": id === requestType })}
            key={id}
            onClick={() => onRequestTypeClicked(id)}
          >
            <a>{value.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RequestDescription({ requestConfig, onExampleClicked, example }) {
  return (
    <>
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
                    className="button is-info is-outlined"
                    onClick={() => onExampleClicked(value)}
                  >
                    {value.label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </article>

      {example?.description && (
        <article className="message is-info">
          <div className="message-body">
            <div className="content">
              {markdownToReact(example?.description)}
            </div>
          </div>
        </article>
      )}
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

function validateForm(formValues) {
  const {
    requestType,
    variantType,
    referenceBases,
    alternateBases,
    start,
    end
  } = formValues

  const errors = []
  const setMissing = (name) =>
    errors.push([name, { type: "manual", message: "Parameter is missing" }])

  if (requestType === "variantAlleleRequest") {
    if (!referenceBases || !alternateBases || !start) {
      !referenceBases && setMissing("referenceBases")
      !alternateBases && setMissing("alternateBases")
      !start && setMissing("start")
    }
  } else if (requestType === "variantCNVrequest") {
    if (!start || !end || !variantType) {
      !start && setMissing("start")
      !end && setMissing("end")
      !variantType && setMissing("variantType")
    }
  } else if (requestType === "variantRangeRequest") {
    if (variantType && (referenceBases || alternateBases)) {
      const error = {
        type: "manual",
        message: "Use either Variant Type or Ref. Base(s) and Alt. Base(s)."
      }
      errors.push(["variantType", error])
      errors.push(["referenceBases", error])
      errors.push(["alternateBases", error])
    }
    if (!variantType && !(referenceBases || alternateBases)) {
      setMissing("variantType")
      setMissing("referenceBases")
      setMissing("alternateBases")
    }
  } else if (requestType === "variantFusionRequest") {
    //
  }
  return errors
}

function handleFormSubmit(clearErrors, setError, mutateQuery, setQuery) {
  return (formValues) => {
    clearErrors()
    // At this stage individual parameters are already validated.
    const errors = validateForm(formValues)
    if (errors.length > 0) {
      errors.forEach(([name, error]) => setError(name, error))
      return
    }
    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
  }
}
