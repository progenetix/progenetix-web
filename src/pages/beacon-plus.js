import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useDatasets, useFilteringTerms, useBeaconQuery } from "../api/bycon"
import Field from "../components/Field"
import DataFetchSelect from "../components/DataFetchSelect"
import BiosamplesDataTable from "../components/BiosamplesDataTable"
import CnvHistogram from "../components/CnvHistogram"
import Nav from "../components/Nav"

export default function BeaconPlus() {
  const { register, handleSubmit, errors, getValues } = useForm()
  const resultType = getValues("resultType")
  const [query, setQuery] = useState(null) // actual valid query
  const { data, error, mutate } = useBeaconQuery(query)
  const isLoading = !data && !error && !!query
  const onSubmit = (formValues) => {
    mutate(null) // mutate and clear current results
    const { datasetIds, assemblyId, referenceName, filters } = formValues
    setQuery({ datasetIds, assemblyId, referenceName, filters })
  }

  return (
    <>
      <Nav />
      <section className="section">
        <div className="container">
          <Form
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

function Form({ handleSubmit, onSubmit, register, errors }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DataFetchSelect
        name="datasetIds"
        label="Dataset"
        required
        autoSelectFirst
        useFetch={useSelectDatasets}
        register={register}
        errors={errors}
      />
      <Field label="Genome Assembly" required>
        <div className="select is-fullwidth">
          <select name="assemblyId" ref={register({ required: true })}>
            <option value="GRCh38">GRCh38 / hg38</option>
          </select>
        </div>
      </Field>
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
      <Field label="Start">
        <input
          name="start"
          ref={register}
          className="input"
          type="text"
          placeholder="example: 7577121"
        />
      </Field>
      <Field label="End">
        <input
          name="end"
          ref={register}
          className="input"
          type="text"
          placeholder="example: 7577166"
        />
      </Field>
      <Field label="Ref. Base(s)">
        <input
          name="referenceBases"
          ref={register}
          className="input"
          type="text"
          placeholder="example: G"
        />
      </Field>
      <Field label="Alt. Base(s)">
        <input
          name="alternateBases"
          ref={register}
          className="input"
          type="text"
          placeholder="example: A"
        />
      </Field>
      <DataFetchSelect
        name="filters"
        label="Bio-ontology"
        useFetch={useSelectFilteringTerms}
        register={register}
        errors={errors}
      />
      <Field label="Result type" required>
        <div className="select is-fullwidth">
          <select name="resultType" ref={register({ required: true })}>
            <option value="biosamplesData">Biosamples Data</option>
            <option value="cnvHistogram">CNV Histogram</option>
          </select>
        </div>
      </Field>

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
