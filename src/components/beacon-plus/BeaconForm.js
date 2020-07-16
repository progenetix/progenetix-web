import Field from "../form/Field"
import cn from "classnames"
import {
  INTEGER_RANGE_REGEX,
  useDatasets,
  useFilteringTerms
} from "../../api/bycon"
import React, { useState } from "react"
import { markdownToReact } from "../../utils/md"
import { useForm } from "react-hook-form"
import { Loader } from "../Loader"
import ControlledSelect from "../form/ControlledSelect"

export function BeaconForm({
  isLoading,
  onValidFormQuery,
  requestTypesConfig
}) {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    setValue,
    clearErrors,
    watch
  } = useForm()
  const { data: datasets, error: datasetsError } = useSelectDatasets()
  const {
    data: filteringTerms,
    error: filteringTermsError
  } = useSelectFilteringTerms()
  const [requestType, setRequestType] = useState(
    Object.entries(requestTypesConfig)[0][0] // auto select first requestType from the file
  )
  const [example, setExample] = useState(null)

  const requestConfig = requestTypesConfig[requestType]
  const parameters = requestConfig?.parameters ?? {}

  function handleRequestTypeClicked(requestTypeId) {
    setExample(null)
    const newParams = Object.fromEntries(
      Object.entries(
        requestTypesConfig[requestTypeId].parameters
      ).map(([k, v]) => [k, v?.value])
    )
    reset(newParams)
    setRequestType(requestTypeId)
  }

  function handleExampleClicked(example) {
    setExample(example)
    Object.entries(example.parameters).forEach(([k, v]) => setValue(k, v.value))
  }

  function onSubmit(formValues) {
    clearErrors()
    // At this stage individual parameters are already validated.
    const errors = validateForm(formValues)
    if (errors.length > 0) {
      errors.forEach(([name, error]) => setError(name, error))
      return
    }
    onValidFormQuery(formValues)
  }

  const selectProps = { parameters, errors, watch, setValue, register }

  return (
    <Loader
      hasError={datasetsError || filteringTermsError}
      isLoading={!datasets || !filteringTerms}
      colored
      loadingMessage="Loading form data..."
      errorMessage="Could not load form data."
    >
      {() => (
        <>
          <Tabs
            requestTypesConfig={requestTypesConfig}
            requestType={requestType}
            onRequestTypeClicked={handleRequestTypeClicked}
          />
          <RequestDescription
            requestConfig={requestConfig}
            example={example}
            onExampleClicked={handleExampleClicked}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <SelectField
              name="datasetIds"
              label="Dataset"
              rules={{ required: true }}
              options={datasets.map(({ id: value, label }) => ({
                label,
                value
              }))}
              isMulti
              {...selectProps}
            />
            <SelectField
              name="assemblyId"
              label="Genome Assembly"
              defaultValue="GRCh38"
              options={[{ value: "GRCh38", label: "GRCh38 / hg38" }]}
              {...selectProps}
            />
            <SelectField
              name="includeDatasetResonses"
              label="Dataset Responses"
              defaultValue="ALL"
              options={[
                { value: "HIT", label: "Datasets With Hits" },
                { value: "ALL", label: "All Selected Datasets" },
                { value: "MISS", label: "Datasets Without Hits" }
              ]}
              {...selectProps}
            />
            <SelectField
              name="requestType"
              label="Variant Request Type"
              defaultValue={
                parameters.requestType?.value ?? "variantAlleleRequest"
              }
              options={[
                {
                  value: "variantAlleleRequest",
                  label: "variantAlleleRequest"
                },
                { value: "variantCNVrequest", label: "variantCNVrequest" },
                { value: "variantRangeRequest", label: "variantRangeRequest" },
                { value: "variantFusionRequest", label: "variantFusionRequest" }
              ]}
              {...selectProps}
            />
            <SelectField
              name="referenceName"
              label="Reference name"
              defaultValue={REFERENCE_NAMES[0]}
              options={REFERENCE_NAMES.map((value) => ({
                label: value,
                value
              }))}
              {...selectProps}
            />
            <SelectField
              name="variantType"
              label="(Structural) Variant"
              defaultValue=""
              options={[
                {
                  value: "",
                  label: "No structural variant specified"
                },
                { value: "DEL", label: "DEL (Deletion)" },
                { value: "DUP", label: "DUP (Duplication)" },
                { value: "BND", label: "BND (Break/Fusion)" }
              ]}
              {...selectProps}
            />
            <InputField
              name="start"
              label="Start"
              parameters={parameters}
              errors={errors}
              register={register({
                validate: checkIntegerRange
              })}
            />
            <InputField
              name="end"
              label="End Position"
              parameters={parameters}
              errors={errors}
              register={register({
                validate: checkIntegerRange
              })}
            />
            <InputField
              name="referenceBases"
              label="Ref. Base(s)"
              parameters={parameters}
              errors={errors}
              register={register}
            />
            <InputField
              name="alternateBases"
              label="Alt. Base(s)"
              parameters={parameters}
              errors={errors}
              register={register}
            />
            <SelectField
              name="bioontology"
              label="Bio-ontology"
              isMulti
              options={[
                {
                  value: "",
                  label: noSelection
                },
                ...filteringTerms.map(({ id: value, label }) => ({
                  value,
                  label
                }))
              ]}
              {...selectProps}
            />
            <SelectField
              name="materialtype"
              label="Biosample Type"
              defaultValue=""
              options={[
                { value: "", label: noSelection },
                { value: "EFO:0009656", label: "neoplastic sample" },
                { value: "EFO:0009654", label: "reference sample" }
              ]}
              {...selectProps}
            />
            <InputField
              name="freeFilters"
              label="Filters"
              parameters={parameters}
              errors={errors}
              register={register}
            />
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
        </>
      )}
    </Loader>
  )
}

function Tabs({ requestTypesConfig, requestType, onRequestTypeClicked }) {
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

function InputField({ name, label, parameters, errors, register }) {
  return (
    <Field
      label={label}
      help={errors[name]?.message}
      hidden={parameters[name]?.hide}
    >
      <input
        name={name}
        className={cn("input", {
          "is-danger": errors[name]
        })}
        ref={register}
        type="text"
        placeholder={parameters[name]?.placeholder}
      />
    </Field>
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

export const checkIntegerRange = (value) => {
  if (!value) return
  const match = INTEGER_RANGE_REGEX.exec(value)
  if (!match) return "Input should be a range (ex: 1-5) or a single value"
  const [, range0, range1] = match
  if (range1 && range0 > range1)
    return "Incorrect range input, max should be greater than min"
}

function SelectField({
  name,
  label,
  parameters,
  errors,
  watch,
  setValue,
  register,
  rules,
  ...selectProps
}) {
  return (
    <Field
      label={label}
      help={errors[name]?.message}
      hidden={parameters[name]?.hide}
    >
      <ControlledSelect
        className={cn("is-fullwidth", errors[name] && "is-danger")}
        name={name}
        watch={watch}
        setValue={setValue}
        register={register}
        rules={rules}
        {...selectProps}
      />
    </Field>
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
  const { data, error } = useFilteringTerms("NCIT,icdom")
  return {
    data:
      data &&
      data.filteringTerms.map((value) => ({
        id: value.id,
        label: `${value.id}: ${value.label} (${value.count})`
      })),
    error
  }
}

const noSelection = "(no selection)"

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
