import DataFetchSelect from "../DataFetchSelect"
import Field from "../Field"
import cn from "classnames"
import { useDatasets, useFilteringTerms } from "../../api/bycon"

export function Form({
  requestConfig,
  handleSubmit,
  onSubmit,
  register,
  errors,
  isLoading
}) {
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
              {REFERENCE_NAMES.map((rn) => (
                <option key={rn} value={rn}>
                  {rn}
                </option>
              ))}
            </select>
          </div>
        </Field>
      )}
      {!parameters.variantType?.hide && (
        <Field label="(Structural) Variant">
          <div className="select is-fullwidth" ref={register}>
            <select name="variantType">
              <option value="">Not a structural variant</option>
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
          name="bioontology"
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
              <button
                type="submit"
                className={cn("button", "is-primary", {
                  "is-loading": isLoading
                })}
              >
                Beacon Query
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
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

const REFERENCE_NAMES = [
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
