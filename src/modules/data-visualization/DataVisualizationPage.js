import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
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

const sampleMaxNo = 1000

export const getVisualizationLink = (accessId, count) =>
  `/data-visualization?accessid=${accessId}&sampleCount=${count}`

const DataVisualizationPage = withUrlQuery(({ urlQuery }) => {
  const { accessid, sampleCount } = urlQuery
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  return (
    <Layout
      title="Data visualization"
      headline={`Data visualization (${sampleCount} samples)`}
    >
      {!accessid ? (
        <NoResultsHelp />
      ) : (
        <div ref={componentRef}>
          {sampleCount > sampleMaxNo && (
            <p>
              Please limit the visualization to about {sampleMaxNo} samples...
            </p>
          )}
          {width > 0 && (
            <DataVisualizationPanel
              accessid={accessid}
              sampleCount={sampleCount}
              width={width}
            />
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

function DataVisualizationPanel({ accessid, sampleCount, width }) {
  const [formValues, setFormValues] = useState({})

  var randNo = null
  if (sampleCount > sampleMaxNo) {
    randNo = sampleMaxNo
  }

  const dataResult = useDataVisualization({
    accessid,
    "-randno": randNo,
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
          <DataVisualizationForm
            isQuerying={false}
            sampleCount={sampleCount}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      <WithData
        background
        apiReply={dataResult}
        render={(data) => <ResultPanel response={data.results} />}
      />
    </div>
  )
}

function DataVisualizationForm({ isQuerying, sampleCount, onSubmit }) {
  var randNo = null
  if (sampleCount > sampleMaxNo) {
    randNo = sampleMaxNo
  }

  const defaultValues = { group_by: "", "-markers": null, "-randno": randNo }
  const { register, handleSubmit, errors, control } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="columns">
        <div className="column">
          <InputField
            name="-chr2plot"
            label="Chromosomes"
            infoText="The chromosomes to be included in the plo, in the order they should appear. The values should just be the comma-separated chromosome numbers."
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
            infoText="Use this to pull a random selection, e.g. if the number of samples is very high (>1000)."
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
            infoText="A selection here will produce separate histograms for samples aggregated for the given scope, e.g. all samples from the same publication or diagnostic code. This requires that samples contain several different types for the selected aggregation scope."
            errors={errors}
          />
        </div>
        <div className="column">
          <InputField
            name="-min_group_no"
            label="Min. Samples per Group"
            errors={errors}
            register={register}
            infoText="Minimum number of samples for aggregated groups."
            defaultValue="2"
          />
        </div>
        <div className="column">
          <InputField
            name="-bin_match_min"
            label="Min. Interval Fraction"
            errors={errors}
            register={register}
            infoText="CNV frequencies are calculated for genomic bins, normally for a 1Mb size. The minimal interval fraction value allows to require a minimum amount of overlap of a CNV with these bins; a value of 0.5 will only use CNVs which overlap an interval by at least 50% for histogram display and sample clustering."
            defaultValue="0.00001"
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <InputField
            name="-size_title_left_w_px"
            label="Left Labels Width (px)"
            errors={errors}
            register={register}
            defaultValue="200"
          />
        </div>
        <div className="column">
          <InputField
            name="-size_strip_h_px"
            label="Sample Line Height (px)"
            errors={errors}
            register={register}
            defaultValue="10"
          />
        </div>
        <div className="column">
          <InputField
            name="-size_text_title_left_px"
            label="Sample Label (px)"
            errors={errors}
            register={register}
            defaultValue="8"
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
            infoText="Height of the histogram plot area, in pixels."
          />
        </div>
        <div className="column">
          <InputField
            name="-value_plot_y_max"
            label="Histogram Max. Scale (%)"
            errors={errors}
            register={register}
            defaultValue="100"
            infoText="Maximum CNV frequency percentage in the histogram."
          />
        </div>
        <div className="column">
          <InputField
            name="-size_clustertree_w_px"
            label="Cluster Tree Width (px)"
            errors={errors}
            register={register}
            defaultValue="50"
            infoText="Width of the tree for sample and group clustering, in pixels."
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <GeneSpanSelector
            errors={errors}
            register={register}
            control={control}
            infoText="Select one or more genes to be highlighted on the plots."
          />
        </div>
        <div className="column">
          <InputField
            name="-labels"
            label="Free Labels"
            errors={errors}
            register={register}
            infoText="Add one or more comma-concatenated custom labels to the plot in the form of '7:10000000-20000000:MyLabel,18:8500000-8600000:Strange Spot'"
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
  const multihistoUrl = response.data?.plots?.multihistogram?.svg_link_tmp
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
      <img src={replaceWithProxy(multihistoUrl)} />
      <a href={multihistoUrl} target="_blank" rel="noreferrer">
        Open Group Histogram Plot
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
  { value: "UBERON", label: "UBERON Anatomy Concepts" },
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
      label="Select Gene Label"
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
