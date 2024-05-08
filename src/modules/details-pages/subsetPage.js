import {
  SITE_DEFAULTS,
  useServiceItemDelivery,
  sampleSearchPageFiltersLink,
  NoResultsHelp
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/Layout"
import { ShowJSON } from "../../components/RawData"
import { SubsetHistogram } from "../../components/SVGloaders"
import { ExternalLink, InternalLink } from "../../components/helpersShared/linkHelpers"
import { withUrlQuery } from "../../hooks/url-query"

const service = "collations"
const exampleId = "NCIT:C3262"

const SubsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id, datasetIds } = urlQuery
  if (!datasetIds) {
    datasetIds = SITE_DEFAULTS.DATASETID
  }
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Subset Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>
      <SubsetLoader id={id} datasetIds={datasetIds} />
      
      <div className="mb-3">
        <SubsetHistogram
          id={id}
          datasetIds={datasetIds}
          loaderProps={{
            background: true,
            colored: true
          }}
        />
      </div>
      </>

      )}
    </Layout>
  )
})

export default SubsetDetailsPage

function SubsetLoader({ id, datasetIds }) {
  const { data, error, isLoading } = useServiceItemDelivery(
    id,
    service,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <SubsetResponse response={data} id={id} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

function SubsetResponse({ response, datasetIds }) {
  if (!response.response.results[0]) {
    return NoResultsHelp(exampleId, "subsetdetails")
  }

  return <Subset subset={response.response.results[0]} datasetIds={datasetIds} />
}

function Subset({ subset, datasetIds }) {
  
  const filters = subset.id
  const sampleFilterScope = "allTermsFilters"
      
  return (
<section className="content">
  <h2>
    {subset.label} ({subset.id})
  </h2>

  {subset.type && (
    <>
      <h5>Subset Type</h5>
      <ul>
        <li>
          {subset.type}{" "}
          <ExternalLink
            href={subset.reference}
            label={subset.id}
          />
        </li>
      </ul>

    </>
  )}

  <h5>Sample Counts</h5>
  <ul>
    <li>{subset.count} samples</li>
    <li>{subset.codeMatches} direct <i>{subset.id}</i> code  matches</li>
    <li>{subset.cnvAnalyses} CNV analyses</li>
    {subset.frequencymapCnvAnalyses && (
      <li>
        {subset.frequencymapCnvAnalyses} {" CNV analyses used in frequency calculations"}
      </li>
    )}
    <li>
      <InternalLink
        href={`${SITE_DEFAULTS.API_PATH}services/intervalFrequencies/${subset.id}/?output=pgxfreq`}
        label="Download CNV frequencies"
      />
    </li>
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
