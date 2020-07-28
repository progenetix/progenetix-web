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
import {
  CytoBandsControlPanel,
  FormControlsButtons,
  GeneSpansControlPanel,
  useFormControlPanels
} from "./FormControls"
import PropTypes from "prop-types"
import SelectField from "../form/SelectField"
import InputField from "../form/InputField"

BeaconForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onValidFormQuery: PropTypes.func.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired
}

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
  const parameters = mergeParameters(parametersConfig, requestTypeConfig)

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
  } = useSelectFilteringTerms(watch)

  const [example, setExample] = useState(null)

  const {
    cytoBandPanelOpen,
    onCytoBandClick,
    onCytoBandCloseClick,
    geneSpansPanelOpen,
    onGeneSpansClick,
    onGeneSpansCloseClick
  } = useFormControlPanels()

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

  // shortcuts
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
      loadingMessage="Loading datasets..."
      errorMessage="Could not load datasets"
    >
      {() => {
        return (
          <>
            <Tabs
              requestTypesConfig={requestTypesConfig}
              requestType={requestTypeId}
              onRequestTypeClicked={handleRequestTypeClicked}
            />
            <div>
              <ExamplesButtons
                handleExampleClicked={handleExampleClicked}
                requestTypeConfig={requestTypeConfig}
              />
              <ExampleDescription example={example} />
              <RequestTypeDescription requestConfig={requestTypeConfig} />
              <FormControlsButtons
                onCytoBandClick={onCytoBandClick}
                cytoBandPanelOpen={cytoBandPanelOpen}
                onGeneSpansClick={onGeneSpansClick}
                geneSpansPanelOpen={geneSpansPanelOpen}
              />
              {cytoBandPanelOpen && (
                <CytoBandsControlPanel
                  onClose={onCytoBandCloseClick}
                  setFormValue={setValue}
                />
              )}
              {geneSpansPanelOpen && (
                <GeneSpansControlPanel
                  onClose={onGeneSpansCloseClick}
                  setFormValue={setValue}
                />
              )}
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
                <div className="field mt-5">
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
              </form>
            </div>
          </>
        )
      }}
    </Loader>
  )
}

Tabs.propTypes = {
  requestType: PropTypes.string.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  onRequestTypeClicked: PropTypes.func.isRequired
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

RequestTypeDescription.propTypes = {
  requestConfig: PropTypes.object.isRequired
}

function RequestTypeDescription({ requestConfig }) {
  return (
    <article className="message">
      <div className="message-body">
        <div className="content">
          {requestConfig.description &&
            markdownToReact(requestConfig?.description)}
        </div>
      </div>
    </article>
  )
}

function ExamplesButtons({ requestTypeConfig, handleExampleClicked }) {
  return (
    <div className="buttons">
      {Object.entries(requestTypeConfig.examples || []).map(([id, value]) => (
        <button
          key={id}
          className="button is-light"
          onClick={() => handleExampleClicked(value)}
        >
          {value.label}
        </button>
      ))}
    </div>
  )
}

function ExampleDescription({ example }) {
  return example?.description ? (
    <article className="message is-info">
      <div className="message-body">
        <div className="content">{markdownToReact(example?.description)}</div>
      </div>
    </article>
  ) : null
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
function useSelectFilteringTerms(watchForm) {
  const datasetIds = watchForm("datasetIds")
  const { data, error } = useFilteringTerms("NCIT,icdom", datasetIds)
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

function mergeParameters(parametersConfig, requestTypeConfig) {
  return Object.fromEntries(
    Object.entries(parametersConfig).map(([name, baseConfig]) => {
      const config = {
        name, // add the name to the config!
        ...baseConfig,
        ...(requestTypeConfig?.parameters?.[name] ?? {})
      }
      return [name, config]
    })
  )
}
