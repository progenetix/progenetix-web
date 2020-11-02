import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
import React, { useRef, useState } from "react"
import { LabeledGeneSpanOptions } from "../../components/form/GenespanUtilities"
import { useForm } from "react-hook-form"
import SelectField from "../../components/form/SelectField"
import InputField from "../../components/form/InputField"
import cn from "classnames"
import { replaceWithProxy, useDataVisualization } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import { useAsyncSelect } from "../../hooks/asyncSelect"

export const getVisualizationLink = (accessId) =>
  `/data-visualization?accessid=${accessId}`

const DataVisualizationPage = withUrlQuery(({ urlQuery }) => {
  const { accessid } = urlQuery
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  return (
    <Layout title="Data visualization" headline="Data visualization">
      {!accessid ? (
        <NoResultsHelp />
      ) : (
        <div ref={componentRef}>
          {width > 0 && (
            <DataVisualizationPanel accessid={accessid} width={width} />
          )}
        </div>
      )}
    </Layout>
  )
})
export default DataVisualizationPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5 content">
      This page will only show content if called with a specific <i>accessid</i>
      .
      <br />
      Please start over from the Search Samples page or{" "}
      <a href="/service-collection/uploader">upload a file</a>.
    </div>
  )
}

function DataVisualizationPanel({ accessid, width }) {
  const [formValues, setFormValues] = useState({})
  const dataResult = useDataVisualization({
    accessid,
    "-size_plotimage_w_px": width,
    ...formValues
  })
  const onSubmit = (values) => {
    setFormValues(values)
    dataResult.mutate(null)
  }
  return (
    <div>
      <div className="columns">
        <div className="mb-6 column">
          <DataVisualizationForm isQuerying={false} onSubmit={onSubmit} />
        </div>
      </div>
      <WithData
        background
        dataEffectResult={dataResult}
        render={(data) => <ResultPanel response={data} />}
      />
    </div>
  )
}

function DataVisualizationForm({ isQuerying, onSubmit }) {
  const defaultValues = { group_by: "", "-markers": null }
  const { register, handleSubmit, errors, control } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="columns">
        <div className="column">
          <InputField
            name="-chr2plot"
            label="Chromosomes"
            errors={errors}
            register={register}
            defaultValue="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22"
          />
        </div>
        <div className="column">
          <InputField
            name="-randno"
            label="Random Samples (no.)"
            errors={errors}
            register={register}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <SelectField
            name="group_by"
            register={register}
            label="Plot Grouping"
            options={groupByOptions}
            control={control}
            errors={errors}
          />
        </div>
        <div className="column">
          <InputField
            name="-min_group_no"
            label="Min. Samples per Group"
            errors={errors}
            register={register}
            defaultValue="2"
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <InputField
            name="-size_title_left_px"
            label="Left Labels Width (px)"
            errors={errors}
            register={register}
            defaultValue="200"
          />
        </div>
        <div className="column">
          <InputField
            name="-size_clustertree_w_px"
            label="Cluster Tree Width (px)"
            errors={errors}
            register={register}
            defaultValue="50"
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <InputField
            name="-size_plotarea_h_px"
            label="Histogram Height (px)"
            errors={errors}
            register={register}
            defaultValue="100"
          />
        </div>
        <div className="column">
          <InputField
            name="-value_plot_y_max"
            label="Histogram Max. Scale (%)"
            errors={errors}
            register={register}
            defaultValue="100"
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <GeneSpanSelector
            errors={errors}
            register={register}
            control={control}
          />
        </div>
        <div className="column">
          <InputField
            name="-labels"
            label="Free Labels"
            errors={errors}
            register={register}
            defaultValue=""
          />
        </div>
      </div>
      <div className="field mt-5">
        <div className="control">
          <button
            type="submit"
            className={cn("button", "is-primary", {
              "is-loading": isQuerying
            })}
          >
            Plot Data
          </button>
        </div>
      </div>
    </form>
  )
}

function ResultPanel({ response }) {
  const histogramUrl = response.data?.plots?.histogram?.svg_link_tmp
  const multistripUrl = response.data?.plots?.multistrip?.svg_link_tmp
  const samplematrixUrl = response.data?.samplematrix_link_tmp
  return (
    <div>
      <div>
        <img src={replaceWithProxy(histogramUrl)} />
        <a href={histogramUrl} target="_blank" rel="noreferrer">
          Open Histogram
        </a>
      </div>
      <div>
        <img src={replaceWithProxy(multistripUrl)} />
        <a href={multistripUrl} target="_blank" rel="noreferrer">
          Open Sample Plot
        </a>
      </div>
      <div>
        <a href={samplematrixUrl} target="_blank" rel="noreferrer">
          Download Sample Status Matrix
        </a>
      </div>
    </div>
  )
}

const groupByOptions = [
  { value: "NCIT", label: "NCIT Neoplasm Code" },
  { value: "icdom", label: "ICD-O Morphology Code" },
  { value: "icdot", label: "ICD Topography Code" },
  { value: "PMID", label: "Publication (PubMed ID)" },
  { value: "geo:GSE", label: "GEO Series ID" },
  { value: "geo:GPL", label: "GEO Platform ID" },
  {
    value: "cellosaurus",
    label: "Cellosaurus Cellline ID"
  }
]

function GeneSpanSelector({ control, errors, register }) {
  const { inputValue, onInputChange } = useAsyncSelect()
  const { options, isLoading } = LabeledGeneSpanOptions(inputValue)
  return (
    <SelectField
      name="-markers"
      label="Gene selection"
      isLoading={isLoading && !!inputValue}
      options={options}
      onInputChange={onInputChange}
      control={control}
      errors={errors}
      register={register}
      isMulti
    />
  )
}
