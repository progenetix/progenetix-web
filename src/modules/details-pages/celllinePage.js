import React, { useEffect, useState } from "react"
import {
  SITE_DEFAULTS,
  useProgenetixApi,
  sampleSearchPageFiltersLink,
  NoResultsHelp
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/Layout"
import Panel from "../../components/Panel"
import { LiteratureSearch } from "../../components/LiteratureSearch"
import { ShowJSON } from "../../components/RawData"
import { SubsetHistogram } from "../../components/Histogram"
import { ExternalLink, InternalLink } from "../../components/helpersShared/linkHelpers"
import { withUrlQuery } from "../../hooks/url-query"
import VariantsDataTable from "../../components/searchResults/VariantsDataTable"
import {VictoryContainer, VictoryLabel, VictoryPie} from "victory";

const service = "collations"
const exampleId = "cellosaurus:CVCL_0023"
const datasetIds = SITE_DEFAULTS.DATASETID

const CellLineDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  const hasAllParams = id && datasetIds
  const [labels, setLabels] = useState("");

  const aURL = `${SITE_DEFAULTS.API_PATH}beacon/genomicVariations/?filters=${id}&requestEntityId=genomicVariations&datasetIds=${datasetIds}&annotatedOnly=True&paginateResults=false`
  const variantsReply = useProgenetixApi( aURL )

  const iURL = `${SITE_DEFAULTS.API_PATH}beacon/individuals/?filters=${id}&datasetIds=${datasetIds}&limit=1`
  var [individual, setIndividual] = useState([]);
  useEffect(() => {
    fetch( iURL )
       .then((response) => response.json())
       .then((data) => {
          console.log(data.response.resultSets[0].results[0]);
          setIndividual(data.response.resultSets[0].results[0])
       })
       .catch((err) => {
          console.log(err.message);
       });
   }, [setIndividual]);

  return (
    <Layout title="Cell Line Details" headline="">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>

        <Panel heading="" className="content">

          <SubsetLoader id={id} individual={individual} datasetIds={datasetIds} />

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

        </Panel>

        <Panel heading={`Annotated Variants for ${id}`} className="content">
          <VariantsDataTable apiReply={variantsReply} datasetId={datasetIds} />
        </Panel>

        <Panel heading={`Literature Derived Contextual Information`} className="content">
          <LiteratureSearch
            id={id}
            datasetIds={datasetIds}
            labels={labels}
            setLabels={setLabels}
          />
        </Panel>

      </>
      )}
    </Layout>
  )
})

export default CellLineDetailsPage

/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

function SubsetLoader({ id, individual, datasetIds }) {

  const sURL = `${SITE_DEFAULTS.API_PATH}services/${service}/?id=${id}&datasetIds=${datasetIds}&method=details`

  const { data, error, isLoading } = useProgenetixApi(sURL)

  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <SubsetResponse id={id} individual={individual} response={data} datasetIds={datasetIds} />
      )}
    </Loader>
  )
}

/*============================================================================*/

function SubsetResponse({ id, response, individual, datasetIds }) {
  if (!response.response.results[0]) {
    return NoResultsHelp(exampleId, "subsetdetails")
  }
  return <Subset id={id} subset={response.response.results[0]} individual={individual} datasetIds={datasetIds} />
}

/*============================================================================*/

function Subset({ id, subset, individual, datasetIds }) {
  
  const filters = id
  const sampleFilterScope = "freeFilters"
  const [showAll, setShowAll] = useState(false);
  console.log(individual);
  console.log(Object.keys(individual));
  
  return (


<section className="content">

  <h2>{subset.label} ({subset.id})</h2>

  {subset?.parentTerms?.length > 1 && (
     <>
        <h5>Parental Cell Lines</h5>
        <ul>
          {subset.parentTerms
            .map(pt => 
              <InternalLink
                href={`/cellline/?id=${pt}&datasetIds=${ datasetIds }`}
                key={pt}
                label={pt}
              />).reduce((prev, curr) => [prev, ' ⇒ ', curr])}
        </ul>
      </>
  )}


  {subset?.childTerms?.length > 1 && (
      <>
        <h5>Derived Cell Lines</h5>
        <ul>
          {subset.childTerms.slice(0, showAll ? subset.childTerms.length : 5).map(pt =>
              <InternalLink
                  href={`/cellline/?id=${pt}&datasetIds=${datasetIds}`}
                  key={pt}
                  label={pt}
              />
          )}
        </ul>
        {subset.childTerms.length > 5 && (
            <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  backgroundColor: 'lightgrey',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  marginBottom: '10px',
                }}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>


        )}
      </>
  )}


  <h5>Donor Details</h5>

  <ul>

  {individual.indexDisease?.diseaseCode && (
    <li>
      <b>Diagnosis</b>{": "}
      {individual.indexDisease.diseaseCode.id}{" ("}
      {individual.indexDisease.diseaseCode?.label}{")"}
    </li>
      
  )}

  {individual.description && (
    <li>
      <b>Description</b>{": "}
      {individual.description}
    </li>
  )}

  {individual.sex && (
    <li>
      <b>Genotypic Sex</b>{": "}
      {individual.sex?.label} ({individual.sex.id})
    </li>
  )}

  {individual.indexDisease?.onset && (
      <li>
        <b>Age at Collection</b>{": "}
        {individual.indexDisease.onset.age}
      </li>
  )}

  </ul>

  {individual.genomeAncestry && individual.genomeAncestry?.length > 0 && (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", width: "100%", marginBottom: "0px" }}>
      <div style={{ width: "50%" }}>
        <b>Genome Ancestry</b>
          <table style={{ width: "80%", fontSize: "0.9em" }}>
            <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>%</th>
            </tr>
            </thead>
            <tbody>
            {individual.genomeAncestry
                .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
                .map((genomeAncestry, key) => {
                  return (
                      <tr key={key}>
                        <td>{genomeAncestry.id}</td>
                        <td>{genomeAncestry.label}</td>
                        <td>{genomeAncestry.percentage}</td>
                      </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div style={{ width: "40%", marginTop: "-70px", marginBottom: "-40px"}}>
          <VictoryPie
              data={individual.genomeAncestry
                  .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
                  .filter((datum) => parseFloat(datum.percentage) > 0) // Filter out data points with percentage of 0
              }
              x="label"
              y={(datum) => parseFloat(datum.percentage)}
              padAngle={2}
              radius={70}
              colorScale={['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', '#FEE1E8', '#D3C2CE']}
              labelRadius={({ radius }) => radius + 20}
              labelComponent={
                <VictoryLabel
                    style={{ fontSize: 12 }}
                    text={({ datum }) => datum.label} // Only show label text if percentage is greater than 0
                />
              }
              containerComponent={<VictoryContainer responsive={false}/>}
          />
      </div>
    </div>
  )}

  <h5>Samples</h5>
  <ul>
    <li>
      {subset.count} samples (
      {subset.codeMatches} direct <i>{subset.id}</i> matches;{" "}
      {subset.cnvAnalyses} CNV analyses)
    </li>
    <li>Select <i>{subset.id}</i> samples in the{" "}
      <a
        rel="noreferrer"
        target="_blank"
        href={ sampleSearchPageFiltersLink({datasetIds, sampleFilterScope, filters}) }
      >{" "}Search Form
      </a>
    </li>
  </ul>

  <h5>More Information</h5>
  <ul>
    <li>
      Cellosaurus{": "}<ExternalLink href={subset.reference} label={subset.id} />
    </li>
  </ul>

  <ShowJSON data={subset} />
  
</section>
  )
}

/*============================================================================*/


