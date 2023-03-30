import React, { useState } from "react"
import {
  SITE_DEFAULTS,
  useServiceItemDelivery,
  sampleSearchPageFiltersLink,
  NoResultsHelp
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/Layout"
import { LiteratureSearch } from "../../components/LiteratureSearch"
import { ShowJSON } from "../../components/RawData"
import { SubsetHistogram } from "../../components/Histogram"
import { ExternalLink } from "../../components/helpersShared/linkHelpers"
import { withUrlQuery } from "../../hooks/url-query"

const service = "collations"
const exampleId = "cellosaurus:CVCL_0023"

const CellLineDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  var datasetIds = SITE_DEFAULTS.DATASETID
  const hasAllParams = id && datasetIds
  const [labels, setLabels] = useState("");
  return (
    <Layout title="Cell Line Details" headline="Cell Line Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>

      <SubsetLoader id={id} datasetIds={datasetIds} />

      <div className="mb-3">
        <SubsetHistogram
          id={id}
          datasetIds={datasetIds}
          labelstring={labels}
          loaderProps={{
            background: true,
            colored: true
          }}
        />
      </div>

      <LiteratureSearch id={id} datasetIds={datasetIds} labels={labels} setLabels={setLabels}/>

      </>
      )}
    </Layout>
  )
})

export default CellLineDetailsPage

/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

function SubsetLoader({ id, datasetIds }) {
  const { data, error, isLoading } = useServiceItemDelivery(
    id,
    service,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <SubsetResponse id={id} response={data} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

/*============================================================================*/

function SubsetResponse({ id, response, datasetIds }) {
  if (!response.response.results[0]) {
    return NoResultsHelp(exampleId, "subsetdetails")
  }
  return <Subset id={id} subset={response.response.results[0]} datasetIds={datasetIds} />
}

/*============================================================================*/

function Subset({ id, subset, datasetIds }) {
  
  const filters = id
  const sampleFilterScope = "freeFilters"
    
  return (

<section className="content">

  <h2>{subset.label} ({subset.id})</h2>

  {subset.type && (
    <>
      <h5>Subset Type</h5>
      <ul>
        <li>
          {subset.type}{" "}
          <ExternalLink href={subset.reference} label={subset.id} />
        </li>
      </ul>

    </>
  )} 

  <h5>Sample Counts</h5>
  <ul>
    <li>{subset.count} samples</li>
    <li>{subset.codeMatches} direct <i>{subset.id}</i> code  matches</li>
    <li>{subset.cnvAnalyses} CNV analyses</li>
  </ul>

  <h5>Search Samples</h5>
  <p>Select <i>{subset.id}</i> samples in the{" "}
    <a
      rel="noreferrer"
      target="_blank"
      href={ sampleSearchPageFiltersLink({datasetIds, sampleFilterScope, filters}) }
    >{" "}Search Form
    </a>
  </p> 

  <ShowJSON data={subset} />
  
</section>
  )
}
