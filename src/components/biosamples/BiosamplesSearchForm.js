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
  const referenceid = watch("referenceid")
  const clinicalClasses = watch("clinicalClasses")
  const cohorts = watch("cohorts")
  const freeFilters = watch("freeFilters")
  const genotypicSex = watch("genotypicSex")
  const materialtype = watch("materialtype")
  const filters = makeFilters({
    freeFilters,
    bioontology,
    referenceid,
    clinicalClasses,
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

  const requestTypeId = Object.entries(requestTypesConfig)[0][0]
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
  
  // biosubsets lookup
  const { data: biosubsetsResponse, isLoading: isBioSubsetsDataLoading } = useBioSubsets(
    watch
  )
  
  const biosubsetsOptions = biosubsetsResponse?.results.map((value) => ({
    value: value.id,
    label: `${value.id}: ${value.label} (${value.count})`
  }))
  
  parameters = merge({}, parameters, {
    bioontology: { options: biosubsetsOptions }
  })
  
  // referenceid lookup
  const { data: refsubsetsResponse, isLoading: isRefSubsetsDataLoading } = useReferencesSubsets(
    watch
  )
  
  const refsubsetsOptions = refsubsetsResponse?.results.map((value) => ({
    value: value.id,
    label: `${value.id}: ${value.label} (${value.count})`
  }))
    
  parameters = merge({}, parameters, {
    referenceid: { options: refsubsetsOptions }
  })
  
// clinical lookup
const { data: clinicalResponse, isLoading: isClinicalDataLoading } = useClinicalSubsets(
  watch
)

const clinicalOptions = clinicalResponse?.results.map((value) => ({
  value: value.id,
  label: `${value.id}: ${value.label} (${value.count})`
}))
  
parameters = merge({}, parameters, {
  clinicalClasses: { options: clinicalOptions }
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

  // {parameters.geneSymbol.isHidden && (
  // ) }

  const isFilterlogicWarningVisible = useIsFilterlogicWarningVisible(watch)
  const geoCity = watch("geoCity")
  const showGeoDistance = !parameters.geoCity.isHidden && geoCity != null

  return (
    <>
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
          <FormUtilitiesButtons
            onCytoBandClick={onCytoBandClick}
            cytoBandPanelOpen={cytoBandPanelOpen}
            onGeneSpansClick={onGeneSpansClick}
            geneSpansPanelOpen={geneSpansPanelOpen}
          />
        </div>
        <ExampleDescription example={example} />
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
          <SelectField {...parameters.assemblyId} {...selectProps} />
          {!parameters.geneSymbol.isHidden && (
            <GeneSymbolSelector {...parameters.geneSymbol} {...selectProps} />
          )}
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
          <div className="columns my-0">
            <SelectField
              className={cn(
                !parameters.referenceid.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.referenceid}
              {...selectProps}
              isLoading={isRefSubsetsDataLoading}
            />
            <InputField
              className={cn(
                !parameters.cohorts.isHidden && "column",
                "py-0 mb-3"
              )}
              {...fieldProps}
              {...parameters.cohorts}
            />
          </div>
          <div className="columns my-0">
            <SelectField
              className={cn(
                !parameters.bioontology.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.bioontology}
              {...selectProps}
              isLoading={isBioSubsetsDataLoading}
            />
            <SelectField
              className={cn(
                !parameters.clinicalClasses.isHidden && "column",
                "py-0 mb-3"
              )}
              {...parameters.clinicalClasses}
              {...selectProps}
              isLoading={isClinicalDataLoading}
            />
          </div>
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
    variantType,
    referenceName,
    referenceBases,
    alternateBases,
    start,
    end,
    geneSymbol,
    bioontology,
    clinicalClasses,
    referenceid,
    cohorts,
    freeFilters
  } = formValues

  const errors = []
  const setMissing = (name) =>
    errors.push([name, { type: "manual", message: "Parameter is missing" }])

  if (!referenceName && !referenceBases && !alternateBases && !start && !end && !variantType && !geneSymbol && !bioontology && !referenceid && !freeFilters && !clinicalClasses && !cohorts) {
    !referenceName && setMissing("referenceName")
    !referenceBases && setMissing("referenceBases")
    !alternateBases && setMissing("alternateBases")
    !start && setMissing("start")
    !end && setMissing("end")
    !variantType && setMissing("variantType")
    !geneSymbol && setMissing("geneSymbol")
    !bioontology && setMissing("bioontology")
    !clinicalClasses && setMissing("clinicalClasses")
    !referenceid && setMissing("referenceid")
    !freeFilters && setMissing("freeFilters")
    !cohorts && setMissing("freeFilters")
  }

  const queryError = validateBeaconQuery(formValues)
  if (queryError) {
    const error = {
      type: "manual",
      message: "Cannot build the database query."
    }
    errors.push(["global", error])
  }

  return errors
}

const handleExampleClicked = (reset, setExample, setUrlQuery) => (example) => {
  setUrlQuery({}, { replace: true })
  setExample(example)
}

// Maps FilteringTerms hook to apiReply usable by DataFetchSelect
function useBioSubsets(watchForm) {
  const datasetIds = watchForm("datasetIds")
  return useCollations({
    datasetIds,
    method: "children",
    filters: "NCIT,icdom,icdot,UBERON"
  })
}

function useReferencesSubsets(watchForm) {
  const datasetIds = watchForm("datasetIds")
  return useCollations({
    datasetIds,
    method: "children",
    filters: "PMID,geo,cellosaurus"
  })
}

function useClinicalSubsets(watchForm) {
  const datasetIds = watchForm("datasetIds")
  return useCollations({
    datasetIds,
    method: "children",
    filters: "TNM,NCITgrade,NCITstage"
  })
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

