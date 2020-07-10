import React, { useState } from "react"
import { useForm } from "react-hook-form"
import requestTypesConfig from "../../config/beacon-plus/requestTypes.yaml"
import examplesConfig from "../../config/beacon-plus/examples.yaml"
import { useBeaconQuery } from "../api/bycon"
import { markdownToReact } from "../utils/md"
import Nav from "../components/Nav"
import { BeaconForm } from "../components/beacon-plus/BeaconForm"
import { DatasetResultBox } from "../components/beacon-plus/DatasetResultBox"

export default function BeaconPlus() {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    clearErrors,
    getValues
  } = useForm()
  const [query, setQuery] = useState(null) // actual valid query
  // could be the example of the requestType as they have the same shape and effect
  const [requestConfig, setRequestConfig] = useState(null)
  const {
    data: queryResponse,
    error: queryError,
    mutate: mutateQuery
  } = useBeaconQuery(query)

  const isLoading = !queryResponse && !queryError && !!query

  const onSubmit = (formValues) => {
    clearErrors()
    // At this stage individual parameters are already validated.
    const {
      requestType,
      variantType,
      referenceBases,
      alternateBases,
      start,
      startMax,
      endMin,
      end
    } = formValues

    const missingParameters = []

    if (requestType === "variantAlleleRequest") {
      if (!referenceBases || !alternateBases || !start) {
        missingParameters.push("referenceBases", "alternateBases", "start")
      }
    } else if (requestType === "variantCNVrequest") {
      if (!start || !startMax || !endMin || !end) {
        missingParameters.push("start", "startMax", "endMin", "end")
      }
    } else if (requestType === "variantRangeRequest") {
      if (referenceBases && alternateBases) {
        const error = {
          type: "manual",
          message: "Ref. Base(s) and Alt. Base(s) are mutually exclusive."
        }
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
        setError(name, { type: "manual", message: "Parameter is missig" })
      )
      return
    }

    mutateQuery(null) // mutateQuery and clear current results
    setQuery(formValues)
  }

  const setRequestType = (requestType) => {
    reset({})
    setRequestConfig(requestType)
  }

  const setExample = (example) => {
    const newParams = Object.fromEntries(
      Object.entries(example.parameters).map(([k, v]) => [k, v.examplevalue])
    )

    reset(newParams)
    setRequestConfig(example)
  }

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container mb-5">
          <div className="notification is-info is-light">
            {requestConfig?.description ? (
              markdownToReact(requestConfig?.description)
            ) : (
              <span>
                This forward looking Beacon interface implements additional,
                planned features beyond the current Beacon specifications.
                Further information can be found through the{" "}
                <a href="http://beacon-project.io/">ELIXIR Beacon website</a>.
              </span>
            )}
          </div>
          <RequestConfig
            setExample={setExample}
            setRequestType={setRequestType}
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

function RequestConfig({ setRequestType, setExample }) {
  return (
    <>
      <div className="buttons">
        {Object.entries(requestTypesConfig).map(([id, value]) => (
          <button
            key={id}
            className="button is-light is-info"
            onClick={() => setRequestType(value)}
          >
            {value.label}
          </button>
        ))}
      </div>
      <div className="buttons">
        {Object.entries(examplesConfig).map(([id, value]) => (
          <button
            key={id}
            className="button is-light"
            onClick={() => setExample(value)}
          >
            {value.label}
          </button>
        ))}
      </div>
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
  return (
    <>
      <span>Assembly: {query.assemblyId}</span> |{" "}
      <span>Chro: {query.referenceName}</span> |{" "}
      <span>Filters: {filters.join(", ")}</span>
    </>
  )
}
