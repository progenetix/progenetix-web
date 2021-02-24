import cn from "classnames"
import {
  checkIntegerRange,
  makeFilters,
  useCollations,
  validateBeaconQuery
} from "../../hooks/api"
import React, { useEffect, useMemo, useState } from "react"
import { markdownToReact } from "../../utils/md"
import { useForm } from "react-hook-form"
import {
  CytoBandsUtility,
  FormUtilitiesButtons,
  GeneSpansUtility,
  useFormUtilities
} from "./BiosamplesFormUtilities"
import PropTypes from "prop-types"
import { merge, transform } from "lodash"
import SelectField from "../form/SelectField"
import InputField from "../form/InputField"
import useDeepCompareEffect from "use-deep-compare-effect"
import { withUrlQuery } from "../../hooks/url-query"
import { GeoCitySelector } from "./GeoCitySelector"
import { GeneSymbolSelector } from "./GeneSymbolSelector"
import ChromosomePreview from "./ChromosomePreview"

export const BiosamplesSearchForm = withUrlQuery(
  ({ urlQuery, setUrlQuery, ...props }) => (
    <Form {...props} urlQuery={urlQuery} setUrlQuery={setUrlQuery} />
  )
)
export default BiosamplesSearchForm

BiosamplesSearchForm.propTypes = {
  datasets: PropTypes.array.isRequired,
  cytoBands: PropTypes.object.isRequired,
  isQuerying: PropTypes.bool.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  requestTypesConfig: PropTypes.object.isRequired,
  parametersConfig: PropTypes.object.isRequired
}

function urlQueryToFormParam(urlQuery, key, parametersConfig) {
  const isMulti = !!parametersConfig[key]?.isMulti ?? false
  const value = urlQuery[key]
  if (value == null) return value
  if (isMulti) {
    return value?.split(",").filter((v) => v?.trim().length ?? -1 > 0)
  } else return value
}

function useAutoExecuteSearch({
  autoExecuteSearch,
  initialValues,
  setSearchQuery,
  setError
}) {
  useEffect(() => {
    if (autoExecuteSearch) {
      // At this stage individual parameters are already validated.
      const values = initialValues
      const errors = validateForm(values)
      if (errors.length > 0) {
        errors.forEach(([name, error]) => setError(name, error))
      } else {
        setSearchQuery(values)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoExecuteSearch])
}

function useIsFilterlogicWarningVisible(watch) {
  const filterLogic = watch("filterLogic")
  const bioontology = watch("bioontology")
  const cohorts = watch("cohorts")
  const freeFilters = watch("freeFilters")
  const genotypicSex = watch("genotypicSex")
  const materialtype = watch("materialtype")
  const filters = makeFilters({
    freeFilters,
    bioontology,
    cohorts,
    genotypicSex,
    materialtype
  })
  return filterLogic === "AND" && filters.length > 1
}

export function Form({
  datasets,
  cytoBands,
  isQuerying,
  setSearchQuery,
  requestTypesConfig,
  parametersConfig,
  urlQuery,
  setUrlQuery
}) {
  const autoExecuteSearch = urlQuery.executeSearch === "true"
  const displayTabs = Object.keys(requestTypesConfig).length > 1
  // auto select first requestType from the file or from the query
  const defaultRequestTypeId =
    Object.entries(requestTypesConfig).find(
      ([k]) => k === urlQuery.requestTypeId
    )?.[0] ?? Object.entries(requestTypesConfig)[0][0]

  const [requestTypeId, setRequestTypeId] = useState(defaultRequestTypeId)

  const requestTypeConfig = requestTypesConfig[requestTypeId]

  const [example, setExample] = useState(null)
  let parameters = useMemo(
    () =>
      makeParameters(parametersConfig, requestTypeConfig, example, datasets),
    [datasets, example, parametersConfig, requestTypeConfig]
  )

  const initialValues = transform(parameters, (r, v, k) => {
    r[k] =
      urlQueryToFormParam(urlQuery, k, parametersConfig) ??
      v.defaultValue ??
      null
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
  } = useForm({ defaultValues: initialValues })

  Object.keys(errors).length && console.info("Found errors in form", errors)

  // reset form when default values changes
  useDeepCompareEffect(() => reset(initialValues), [initialValues])

  const { data: subsetsResponse, isLoading: isSubsetsDataLoading } = useSubsets(
    watch
  )
  const subsetsOptions = subsetsResponse?.results.map((value) => ({
    value: value.id,
    label: `${value.id}: ${value.label} (${value.count})`
  }))
  parameters = merge({}, parameters, {
    bioontology: { options: subsetsOptions }
  })

  const {
    cytoBandPanelOpen,
    onCytoBandClick,
    onCytoBandCloseClick,
    geneSpansPanelOpen,
    onGeneSpansClick,
    onGeneSpansCloseClick
  } = useFormUtilities()

  const onSubmit = onSubmitHandler({
    clearErrors,
    setError,
    setSearchQuery
  })

  // shortcuts
  const fieldProps = { errors, register }
  const selectProps = {
    ...fieldProps,
    control
  }
  useAutoExecuteSearch({
    autoExecuteSearch,
    initialValues,
    setSearchQuery,
    setError
  })

  const isFilterlogicWarningVisible = useIsFilterlogicWarningVisible(watch)
  const geoCity = watch("geoCity")
  const showGeoDistance = !parameters.geoCity.isHidden && geoCity != null

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
        <div className="buttons">
          <ExamplesButtons
            onExampleClicked={handleExampleClicked(
              reset,
              setExample,
              setUrlQuery
            )}
            requestTypeConfig={requestTypeConfig}
          />
          {requestTypeId == "progenetix" || requestTypeId == "allFieldsRequest" || requestTypeId ==  "variantRangeRequest" && (
            <FormUtilitiesButtons
              onCytoBandClick={onCytoBandClick}
              cytoBandPanelOpen={cytoBandPanelOpen}
              onGeneSpansClick={onGeneSpansClick}
              geneSpansPanelOpen={geneSpansPanelOpen}
            />
          ) }
        </div>
        <ExampleDescription example={example} />
        <RequestTypeDescription requestConfig={requestTypeConfig} />
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
          {errors?.global?.message && (
            <div className="notification is-warning">
              {errors.global.message}
            </div>
          )}
          <SelectField {...parameters.datasetIds} {...selectProps} />
          <SelectField {...parameters.cohorts} {...selectProps} />
          <SelectField {...parameters.assemblyId} {...selectProps} />
          <SelectField {...parameters.requestType} {...selectProps} />
          <SelectField
            {...parameters.includeDatasetResponses}
            {...selectProps}
          />
          {!parameters.geneSymbol.isHidden && (
            <GeneSymbolSelector {...parameters.geneSymbol} {...selectProps} />
          ) }
          <div className="columns my-0">
            <SelectField
              className={cn(
                !parameters.referenceName.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.referenceName}
              {...selectProps}
            />
            <SelectField
              className={cn(
                !parameters.variantType.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.variantType}
              {...selectProps}
            />
          </div>
          <div className="columns my-0">
            <InputField
              className={cn(
                !parameters.start.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.start}
              rules={{
                validate: checkIntegerRange
              }}
            />
            <InputField
              className={cn(!parameters.end.isHidden && "column", "py-0 mb-3")}
              {...fieldProps}
              {...parameters.end}
              rules={{
                validate: checkIntegerRange
              }}
            />
          </div>
          <div className="columns my-0">
            <InputField
              className={cn(
                !parameters.varMinLength.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.varMinLength}
              rules={{
                validate: checkIntegerRange
              }}
            />
            <InputField
              className={cn(
                !parameters.varMaxLength.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.varMaxLength}
              rules={{
                validate: checkIntegerRange
              }}
            />
          </div>
          <div className="columns my-0">
            <InputField
              className={cn(
                !parameters.referenceBases.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.referenceBases}
            />
            <InputField
              className={cn(
                !parameters.alternateBases.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.alternateBases}
            />
          </div>
          <SelectField
            {...parameters.bioontology}
            {...selectProps}
            isLoading={isSubsetsDataLoading}
          />
          <div className="columns my-0">
            <SelectField
              className={cn(
                !parameters.genotypicSex.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.genotypicSex}
              {...selectProps}
            />
            <SelectField
              className={cn(
                !parameters.materialtype.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.materialtype}
              {...selectProps}
            />
          </div>
          <div className="columns my-0">
            <InputField
              className="column py-0 mb-3"
              {...parameters.freeFilters}
              {...fieldProps}
            />
            <SelectField
              className="column py-0 mb-3"
              {...parameters.filterLogic}
              {...selectProps}
              label={
                <span>
                  <span>{parameters.filterLogic.label}</span>
                  <FilterLogicWarning isVisible={isFilterlogicWarningVisible} />
                </span>
              }
            />
          </div>
          <InputField {...parameters.accessid} {...fieldProps} />
          <InputField {...parameters.filterPrecision} {...fieldProps} />
          {!parameters.geoCity.isHidden && (
            <div className="columns my-0">
              <GeoCitySelector
                className={cn("column", "py-0 mb-3")}
                {...parameters.geoCity}
                {...selectProps}
              />
              <div
                className={cn("column", "py-0 mb-3", {
                  "is-invisible": !showGeoDistance,
                  "animate__fadeIn animate__animated": showGeoDistance
                })}
              >
                <InputField {...parameters.geodistanceKm} {...fieldProps} />
              </div>
            </div>
          )}
          <ChromosomePreview watch={watch} cytoBands={cytoBands} />
          <div className="field mt-5">
            <div className="control">
              <button
                type="submit"
                className={cn("button", "is-primary", {
                  "is-loading": isQuerying
                })}
              >
                Query Database
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
    <div>
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
  const mergedConfigs = merge(
    {}, // important to not mutate the object
    parametersConfig,
    requestTypeConfig?.parameters,
    example?.parameters ?? {}
  )
  // add name the list
  let parameters = transform(mergedConfigs, (r, v, k) => {
    r[k] = { name: k, ...v }
  })

  parameters = merge({}, parameters, { datasetIds: { options: datasets } })
  return parameters
}

function onSubmitHandler({ clearErrors, setError, setSearchQuery }) {
  return (values) => {
    clearErrors()
    // At this stage individual parameters are already validated.
    const errors = validateForm(values)
    if (errors.length > 0) {
      errors.forEach(([name, error]) => setError(name, error))
    } else {
      setSearchQuery(values)
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
      // if (!variantType && !(referenceBases || alternateBases)) {
      //   setMissing("variantType")
      //   setMissing("referenceBases")
      //   setMissing("alternateBases")
      // }
  }

  const queryError = validateBeaconQuery(formValues)
  if (queryError) {
    const error = {
      type: "manual",
      message: "Cannot build the beacon query."
    }
    errors.push(["global", error])
  }

  return errors
}

const handleExampleClicked = (reset, setExample, setUrlQuery) => (example) => {
  setUrlQuery({}, { replace: true })
  setExample(example)
}

const handleRequestTypeClicked = (setExample, setRequestTypeId) => (
  requestTypeId
) => {
  setExample(null)
  setRequestTypeId(requestTypeId)
}

// Maps FilteringTerms hook to apiReply usable by DataFetchSelect
function useSubsets(watchForm) {
  const datasetIds = watchForm("datasetIds")
  const { data, ...other } = useCollations({
    datasetIds,
    method: "children",
    filters: "NCIT,icdom,icdot"
  })
  return { data, ...other }
}

function FilterLogicWarning({ isVisible }) {
  return (
    <span
      className={cn(
        "has-background-warning has-text-weight-normal ml-2 px-1",
        "is-inline-flex animate__animated animate__headShake",
        { "is-hidden": !isVisible }
      )}
    >
      Multiple term selected !
    </span>
  )
}
