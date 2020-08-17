import cn from "classnames"
import {
  INTEGER_RANGE_REGEX,
  useDatasets,
  useFilteringTerms
} from "../../hooks/api"
import React, { useEffect, useMemo, useState } from "react"
import { markdownToReact } from "../../utils/md"
import { useForm } from "react-hook-form"
import { Loader } from "../Loader"
import {
  CytoBandsUtility,
  FormUtilitiesButtons,
  GeneSpansUtility,
  useFormUtilities
} from "./BiosamplesFormUtilities"
import PropTypes from "prop-types"
import SelectField from "../form/SelectField"
import InputField from "../form/InputField"
import _ from "lodash"
import useDeepCompareEffect from "use-deep-compare-effect"
import { useQuery } from "../../hooks/query"

BiosamplesSearchForm.propTypes = {
  isQuerying: PropTypes.bool.isRequired,
  onValidFormQuery: PropTypes.func.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired
}

export function BiosamplesSearchForm({
  isQuerying,
  onValidFormQuery,
  requestTypesConfig,
  parametersConfig
}) {
  const urlQuery = useQuery()

  const {
    data: datasets,
    error: datasetsError,
    isLoading: datasetIsLoading
  } = useSelectDatasets()
  return (
    <Loader
      hasError={datasetsError}
      isLoading={datasetIsLoading || !urlQuery}
      loadingMessage="Loading datasets..."
      errorMessage="Could not load datasets"
    >
      {() => (
        <Form
          datasets={datasets}
          isQuerying={isQuerying}
          onValidFormQuery={onValidFormQuery}
          requestTypesConfig={requestTypesConfig}
          parametersConfig={parametersConfig}
          urlQuery={urlQuery}
        />
      )}
    </Loader>
  )
}

function urlQueryToFormParam(urlQuery, k) {
  const value = urlQuery[k]
  if (value?.indexOf(",")) return value?.split(",")
  else return value
}

export function Form({
  datasets,
  isQuerying,
  onValidFormQuery,
  requestTypesConfig,
  parametersConfig,
  urlQuery
}) {
  const autoExecuteSearch = urlQuery.executeSearch
  const displayTabs = Object.keys(requestTypesConfig).length > 1
  // auto select first requestType from the file or from the query
  const defaultRequestTypeId =
    Object.entries(requestTypesConfig).find(
      ([k]) => k === urlQuery.requestTypeId
    ) ?? Object.entries(requestTypesConfig)[0][0]
  const [requestTypeId, setRequestTypeId] = useState(defaultRequestTypeId)

  const requestTypeConfig = requestTypesConfig[requestTypeId]

  const [example, setExample] = useState(null)
  let parameters = useMemo(
    () =>
      makeParameters(parametersConfig, requestTypeConfig, example, datasets),
    [datasets, example, parametersConfig, requestTypeConfig]
  )

  const defaultValues = _.transform(parameters, (r, v, k) => {
    r[k] = urlQueryToFormParam(urlQuery, k) ?? v.defaultValue ?? null
  })

  const {
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    setValue,
    clearErrors,
    watch,
    control
  } = useForm({ defaultValues })

  Object.keys(errors).length && console.info("Found errors in form", errors)

  // reset form when default values changes
  useDeepCompareEffect(() => reset(defaultValues), [defaultValues])

  const {
    data: filteringTerms,
    error: filteringTermsError
  } = useSelectFilteringTerms(watch)

  parameters = _.merge({}, parameters, {
    bioontology: { options: filteringTerms }
  })

  const {
    cytoBandPanelOpen,
    onCytoBandClick,
    onCytoBandCloseClick,
    geneSpansPanelOpen,
    onGeneSpansClick,
    onGeneSpansCloseClick
  } = useFormUtilities()

  const onSubmit = onSubmitHandler(
    clearErrors,
    setError,
    onValidFormQuery,
    requestTypeId
  )

  // shortcuts
  const fieldProps = { errors, register }
  const selectProps = {
    ...fieldProps,
    control
  }

  useEffect(() => {
    if (autoExecuteSearch) {
      onValidFormQuery(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExecuteSearch])

  return (
    <>
      {displayTabs && (
        <Tabs
          requestTypesConfig={requestTypesConfig}
          requestType={requestTypeId}
          onRequestTypeClicked={handleRequestTypeClicked(
            setExample,
            setRequestTypeId
          )}
        />
      )}
      <div>
        <ExamplesButtons
          onExampleClicked={handleExampleClicked(reset, setExample)}
          requestTypeConfig={requestTypeConfig}
        />
        <ExampleDescription example={example} />
        <RequestTypeDescription requestConfig={requestTypeConfig} />
        <FormUtilitiesButtons
          onCytoBandClick={onCytoBandClick}
          cytoBandPanelOpen={cytoBandPanelOpen}
          onGeneSpansClick={onGeneSpansClick}
          geneSpansPanelOpen={geneSpansPanelOpen}
        />
        {cytoBandPanelOpen && (
          <CytoBandsUtility
            onClose={onCytoBandCloseClick}
            setFormValue={setValue}
          />
        )}
        {geneSpansPanelOpen && (
          <GeneSpansUtility
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
          <div className="columns">
            <div className="column">
              <InputField {...parameters.freeFilters} {...fieldProps} />
            </div>
            <div className="column">
              <SelectField {...parameters.filterLogic} {...selectProps} />
            </div>
          </div>
          <InputField {...parameters.accessid} {...fieldProps} />
          <div className="field mt-5">
            <div className="control">
              <button
                type="submit"
                className={cn("button", "is-primary", {
                  "is-loading": isQuerying
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
    requestConfig.description && (
      <article className="message">
        <div className="message-body">
          <div className="content">
            {markdownToReact(requestConfig?.description)}
          </div>
        </div>
      </article>
    )
  )
}

function ExamplesButtons({ requestTypeConfig, onExampleClicked }) {
  return (
    <div className="buttons">
      {Object.entries(requestTypeConfig?.examples || []).map(([id, value]) => (
        <button
          key={id}
          className="button is-light"
          onClick={() => onExampleClicked(value)}
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

function makeParameters(
  parametersConfig,
  requestTypeConfig,
  example,
  datasets
) {
  // merge base parameters config and request config
  const mergedConfigs = _.merge(
    {}, // important to not mutate the object
    parametersConfig,
    requestTypeConfig?.parameters,
    example?.parameters ?? {}
  )
  // add name the list
  let parameters = _.transform(mergedConfigs, (r, v, k) => {
    r[k] = { name: k, ...v }
  })

  parameters = _.merge({}, parameters, { datasetIds: { options: datasets } })
  return parameters
}

function saveFormValuesInUrl(formValues, requestTypeId) {
  const params = new URLSearchParams(formValues)
  params.set("requestTypeId", requestTypeId)
  window.history.replaceState({}, "", `${location.pathname}?${params}`)
}

function onSubmitHandler(
  clearErrors,
  setError,
  onValidFormQuery,
  requestTypeId
) {
  return (formValues) => {
    clearErrors()
    if (formValues.accessid) {
      onValidFormQuery(formValues)
    } else {
      // At this stage individual parameters are already validated.
      const errors = validateForm(formValues)
      if (errors.length > 0) {
        errors.forEach(([name, error]) => setError(name, error))
      } else {
        saveFormValuesInUrl(formValues, requestTypeId)
        onValidFormQuery(formValues)
      }
    }
  }
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

const handleExampleClicked = (reset, setExample) => (example) => {
  reset({ bioontology: [] })
  setExample(example)
}

const handleRequestTypeClicked = (setExample, setRequestTypeId) => (
  requestTypeId
) => {
  setExample(null)
  setRequestTypeId(requestTypeId)
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
  const { data, ...other } = useDatasets()
  return {
    data:
      data &&
      data.datasets.map((value) => ({
        value: value.id,
        label: value.name
      })),
    ...other
  }
}

// Maps FilteringTerms hook to data usable by DataFetchSelect
function useSelectFilteringTerms(watchForm) {
  const datasetIds = watchForm("datasetIds")
  const { data, ...other } = useFilteringTerms("NCIT,icdom", datasetIds)
  return {
    data:
      data &&
      data.filteringTerms.map((value) => ({
        value: value.id,
        label: `${value.id}: ${value.label} (${value.count})`
      })),
    ...other
  }
}
