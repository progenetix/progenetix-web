import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useBeaconQuery, useDatasets, useFilteringTerms } from "../api/bycon"
import Field from "../components/Field"
import DataFetchSelect from "../components/DataFetchSelect"
import BiosamplesDataTable from "../components/BiosamplesDataTable"
import CnvHistogram from "../components/CnvHistogram"
import Nav from "../components/Nav"
import requestTypesConfig from "../../config/beacon-plus/requestTypes.yaml"
import examplesConfig from "../../config/beacon-plus/examples.yaml"
import { markdownToReact } from "../md"

export default function BeaconPlus() {
  const { register, handleSubmit, errors, getValues, reset } = useForm()
  const [query, setQuery] = useState(null) // actual valid query
  // could be the example of the requestType as they have the same shape and effect
  const [requestConfig, setRequestConfig] = useState(null)
  const { data, error, mutate } = useBeaconQuery(query)

  const resultType = getValues("resultType")
  const isLoading = !data && !error && !!query
  const onSubmit = (formValues) => {
    mutate(null) // mutate and clear current results
    setQuery(formValues)
  }

  const setRequestType = (requestType) => {
    reset()
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
        <div className="container">
          <article className="message is-dark">
            <div className="message-body">
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
          </article>
          <div className="buttons">
            {Object.entries(requestTypesConfig).map(([id, value]) => (
              <button
                key={id}
                className={`button`}
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
                className={`button`}
                onClick={() => setExample(value)}
              >
                {value.label}
              </button>
            ))}
          </div>
          <Form
            requestConfig={requestConfig}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            errors={errors}
          />
        </div>
      </section>
      <section className="section">
        <div className="container">
          {!isLoading ? (
            data && <Results data={data} type={resultType} />
          ) : (
            <div className="is-medium">Loading...</div>
          )}
        </div>
      </section>
    </>
  )
}

function Form({ requestConfig, handleSubmit, onSubmit, register, errors }) {
  const parameters = requestConfig?.parameters ?? {}
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!parameters.datasetIds?.hide && (
        <DataFetchSelect
          name="datasetIds"
          label="Dataset"
          required
          autoSelectFirst
          useFetch={useSelectDatasets}
          register={register}
          errors={errors}
        />
      )}
      {!parameters.assemblyId?.hide && (
        <Field label="Genome Assembly" required>
          <div className="select is-fullwidth">
            <select name="assemblyId" ref={register({ required: true })}>
              <option value="GRCh38">GRCh38 / hg38</option>
            </select>
          </div>
        </Field>
      )}
      {!parameters.includeDatasetResonses?.hide && (
        <Field label="Dataset Responses">
          <div className="select is-fullwidth">
            <select
              name="includeDatasetResponses"
              ref={register({ required: true })}
            >
              <option value="HIT">Datasets With Hits</option>
              <option value="ALL" selected="selected">
                All Selected Datasets
              </option>
              <option value="MISS">Datasets Without Hits</option>
            </select>
          </div>
        </Field>
      )}
      {!parameters.requestType?.hide && (
        <Field label="Variant Request Type">
          <div className="select is-fullwidth">
            <select
              id="requestType"
              name="requestType"
              ref={register({ required: true })}
            >
              <option value="variantAlleleRequest">variantAlleleRequest</option>
              <option value="variantCNVrequest" selected="selected">
                variantCNVrequest
              </option>
              <option value="variantRangeRequest">variantRangeRequest</option>
              <option value="variantFusionRequest">variantFusionRequest</option>
            </select>
          </div>
        </Field>
      )}
      {!parameters.referenceName?.hide && (
        <Field label="Reference name" required>
          <div className="select is-fullwidth">
            <select name="referenceName" ref={register({ required: true })}>
              {referenceNames.map((rn) => (
                <option key={rn} value={rn}>
                  {rn}
                </option>
              ))}
            </select>
          </div>
        </Field>
      )}
      {!parameters.variantType?.hide && (
        <Field label="(structural) variantType">
          <div className="select is-fullwidth" ref={register}>
            <select name="variantType">
              <option value="DEL">DEL (Deletion)</option>
              <option value="DUP">DUP (Duplication)</option>
              <option value="BND">BND (Break/Fusion)</option>
            </select>
          </div>
        </Field>
      )}
      {!parameters.start?.hide && (
        <Field label="Start">
          <input
            name="start"
            ref={register}
            className="input"
            type="text"
            placeholder={
              parameters.start?.placeholder ??
              "exact position or start of interval"
            }
          />
        </Field>
      )}
      {!parameters.end?.hide && (
        <Field label="End">
          <input
            name="end"
            ref={register}
            className="input"
            type="text"
            placeholder="example: 7577166"
          />
        </Field>
      )}
      {!parameters.referenceBases?.hide && (
        <Field label="Ref. Base(s)">
          <input
            name="referenceBases"
            ref={register}
            className="input"
            type="text"
            placeholder="example: G"
          />
        </Field>
      )}
      {!parameters.alternateBases?.hide && (
        <Field label="Alt. Base(s)">
          <input
            name="alternateBases"
            ref={register}
            className="input"
            type="text"
            placeholder="example: A"
          />
        </Field>
      )}
      {!parameters.filters?.hide && (
        <DataFetchSelect
          name="filters"
          label="Bio-ontology"
          useFetch={useSelectFilteringTerms}
          register={register}
          errors={errors}
        />
      )}
      <div className="field is-horizontal">
        <div className="field-label" />
        <div className="field-body">
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-primary">
                Beacon Query
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

function Results({ data, type }) {
  const noResults = <div>No results</div>
  if (
    !data.datasetAlleleResponses ||
    data.datasetAlleleResponses.length === 0
  ) {
    return noResults
  } else if (type === "biosamplesData") {
    const response = data.datasetAlleleResponses[0].datasetHandover.find(
      ({ handoverType: { id } }) => id === "pgx:handover:biosamplesdata"
    )
    if (!response) {
      return noResults
    }
    // replace url because cors on dev
    const url = response.url.replace("http://progenetix.org", "api/progenetix")
    return <BiosamplesDataTable url={url} />
  } else if (type === "cnvHistogram") {
    const response = data.datasetAlleleResponses[0].datasetHandover.find(
      ({ handoverType: { id } }) => id === "pgx:handover:cnvhistogram"
    )
    if (!response) {
      return noResults
    }

    // replace url because cors on dev
    const url = document.location.host.includes(".progenetix.org")
      ? response.url
      : response.url.replace("http://progenetix.org", "api/progenetix")
    return <CnvHistogram url={url} />
  } else return <div>To be implemented...</div>
}

// Maps datasets hook to data usable by DataFetchSelect
function useSelectDatasets() {
  const { data, error } = useDatasets()
  return {
    data:
      data &&
      data.datasets.map((value) => ({
        id: value.id,
        label: value.name
      })),
    error
  }
}

// Maps FilteringTerms hook to data usable by DataFetchSelect
function useSelectFilteringTerms() {
  const { data, error } = useFilteringTerms("NCIT")
  return {
    data:
      data &&
      data.filteringTerms.map((value) => ({
        id: value.id,
        label: `${value.id}: ${value.label}`
      })),
    error
  }
}

const referenceNames = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "X",
  "Y"
]
