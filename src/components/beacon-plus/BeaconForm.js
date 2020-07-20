import Field from "../form/Field"
import cn from "classnames"
import {
  INTEGER_RANGE_REGEX,
  useDatasets,
  useFilteringTerms
} from "../../effects/api"
import React, { useState } from "react"
import { markdownToReact } from "../../utils/md"
import { useForm } from "react-hook-form"
import { Loader } from "../Loader"
import ControlledSelect from "../form/ControlledSelect"

export function BeaconForm({
  isLoading,
  onValidFormQuery,
  requestTypesConfig,
  parametersConfig
}) {
  const [requestTypeId, setRequestTypeId] = useState(
    Object.entries(requestTypesConfig)[0][0] // auto select first requestType from the file
  )
  const requestTypeConfig = requestTypesConfig[requestTypeId]

  // merge base parameters config and request config
  const parameters = Object.fromEntries(
    Object.entries(parametersConfig).map(([name, baseConfig]) => {
      const config = {
        name, // add the name to the config!
        ...baseConfig,
        ...(requestTypeConfig?.parameters?.[name] ?? {})
      }
      return [name, config]
    })
  )

  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    setValue,
    clearErrors,
    watch
  } = useForm(parameters)

  const { data: datasets, error: datasetsError } = useSelectDatasets()
  const {
    data: filteringTerms,
    error: filteringTermsError
  } = useSelectFilteringTerms()

  const [example, setExample] = useState(null)

  function handleRequestTypeClicked(requestTypeId) {
    setExample(null)
    const newParams = Object.fromEntries(
      Object.entries(
        requestTypesConfig[requestTypeId].parameters
      ).map(([k, v]) => [k, v?.value])
    )
    reset(newParams)
    setRequestTypeId(requestTypeId)
  }

  function handleExampleClicked(example) {
    setExample(example)
    Object.entries(example.parameters).forEach(([k, parameter]) => {
      if ("value" in parameter) {
        setValue(k, parameter.value)
      }
    })
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

  parameters.datasetIds.options = datasets?.map(({ id: value, label }) => ({
    label,
    value
  }))

  parameters.bioontology.options = filteringTerms && [
    ...parameters.bioontology.options,
    ...filteringTerms.map(({ id: value, label }) => ({
      value,
      label
    }))
  ]

  const fieldProps = { errors, register }
  const selectProps = {
    ...fieldProps,
    setValue,
    watch
  }

  return (
    <Loader
      hasError={datasetsError}
      isLoading={!datasets}
      colored
      loadingMessage="Loading datasets..."
      errorMessage="Could not load datasets"
    >
      {() => (
        <>
          <Tabs
            requestTypesConfig={requestTypesConfig}
            requestType={requestTypeId}
            onRequestTypeClicked={handleRequestTypeClicked}
          />
          <RequestDescription
            requestConfig={requestTypeConfig}
            example={example}
            onExampleClicked={handleExampleClicked}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <SelectField {...parameters.datasetIds} {...selectProps} />
            <SelectField {...parameters.assemblyId} {...selectProps} />
            <SelectField
              {...parameters.includeDatasetResonses}
              {...selectProps}
            />
            <SelectField {...parameters.requestType} {...selectProps} />
            <SelectField {...parameters.referenceName} {...selectProps} />
            <SelectField {...parameters.variantType} {...selectProps} />
            <InputField
              {...fieldProps}
              {...parameters.start}
              rules={{
                validate: checkIntegerRange
              }}
            />
            <InputField
              {...fieldProps}
              {...parameters.end}
              rules={{
                validate: checkIntegerRange
              }}
            />
            <InputField {...fieldProps} {...parameters.referenceBases} />
            <InputField {...fieldProps} {...parameters.alternateBases} />
            <SelectField
              {...parameters.bioontology}
              {...selectProps}
              isLoading={!filteringTerms && !filteringTermsError}
            />
            <SelectField {...parameters.materialtype} {...selectProps} />
            <InputField {...parameters.freeFilters} {...fieldProps} />
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

function InputField({
  name,
  label,
  placeholder,
  isHidden,
  errors,
  register,
  rules
}) {
  return (
    <Field label={label} help={errors[name]?.message} isHidden={isHidden}>
      <input
        name={name}
        className={cn("input", {
          "is-danger": errors[name]
        })}
        ref={register(rules)}
        type="text"
        placeholder={placeholder}
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
  errors,
  isHidden,
  watch,
  setValue,
  register,
  rules,
  ...selectProps
}) {
  return (
    <Field label={label} help={errors[name]?.message} isHidden={isHidden}>
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
