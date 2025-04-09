import React, { useEffect, useState } from "react"
import {
  SITE_DEFAULTS,
  basePath,
  useProgenetixApi,
  sampleSearchPageFiltersLink,
  NoResultsHelp
} from "../hooks/api"
import { Loader } from "../components/Loader"
import { Layout } from "./../site-specific/Layout"
import Panel from "../components/Panel"
import { AncestryData } from "../components/AncestryData"
// import { LiteratureSearch } from "../components/LiteratureSearch"
import { SubsetHistogram } from "../components/SVGloaders"
import { ExternalLink, InternalLink } from "../components/helpersShared/linkHelpers"
import { withUrlQuery } from "../hooks/url-query"
import VariantsDataTable from "../components/searchResults/VariantsDataTable"

const exampleId = "cellosaurus:CVCL_0023"
const searchPage = "filterSearch"

const CellLineDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id, datasetIds } = urlQuery
  if (!datasetIds) {
    datasetIds = SITE_DEFAULTS.DATASETID
  }
  const hasAllParams = id && datasetIds
  const [plotGeneSymbols, setGeneSymbols] = useState("");
  const [plotCytoregionLabels, setCytoregionSymbols] = useState("");

  // const aURL = `${basePath}beacon/genomicVariations/?filters=${id}&datasetIds=${datasetIds}&variantType=SO:0001059&paginateResults=false`
  // const variantsReply = useProgenetixApi( aURL )

  const iURL = `${basePath}beacon/individuals/?filters=${id}&datasetIds=${datasetIds}&limit=1`
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

  // var indexDisease = individual.indexDisease;
  console.log(individual);

  return (
    <Layout title="Cell Line Details" headline="">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>

        <Panel heading="" className="content">
          <ThisSubsetLoader
            id={id}
            individual={individual}
            datasetIds={datasetIds}
            setGeneSymbols={setGeneSymbols}
            plotGeneSymbols={plotGeneSymbols}
            plotCytoregionLabels={plotCytoregionLabels}
            setCytoregionSymbols={setCytoregionSymbols}
          />
        </Panel>

        <VariantsPanel id={id} individual={individual} datasetIds={datasetIds} />

{/*
        <Panel heading={`Annotated Variants for ${id}`} className="content">
          <VariantsDataTable apiReply={variantsReply} datasetId={datasetIds} />
        </Panel>

        <Panel heading="CNV Profile" className="content">
          <p>The graph shows the copy number gains (up, blue) and losses (down, orange)
          as percentage of the cell line instances they were observed in. Off note, since
          all instances arose from the same donor cell line one would expect all genomic
          regions to be either 0 or 100 percent. Regions with diverging values are either
          due to clonal divergence/progression and/or to experimental variability.
          </p>
          <div className="mb-3">
            <SubsetHistogram
              id={id}
              datasetIds={datasetIds}
              plotGeneSymbols={plotGeneSymbols}
              plotCytoregionLabels={plotCytoregionLabels}
              loaderProps={{
                background: true,
                colored: true
              }}
            />
          </div>
          {indexDisease?.id && (
            <>
              <h5>Matched Native Cancer Sample Histogram (Progenetix data)</h5>
                <div className="mb-3">
                <SubsetHistogram
                  id={indexDisease?.id}
                  datasetIds={["progenetix"]}
                  loaderProps={{background: true, colored: true}}
                />
              </div>
            </>
          )}
        </Panel>

        <Panel heading={`Literature Derived Contextual Information`} className="content">
          <LiteratureSearch
            id={id}
            datasetIds={datasetIds}
            plotGeneSymbols={plotGeneSymbols}
            setGeneSymbols={setGeneSymbols}
            plotCytoregionLabels={plotCytoregionLabels}
            setCytoregionSymbols={setCytoregionSymbols}
          />
        </Panel>
*/}        

      </>
      )}
    </Layout>
  )
})

export default CellLineDetailsPage

/*============================================================================*/
/*============================================================================*/
/*============================================================================*/

function ThisSubsetLoader({ id, individual, datasetIds, plotGeneSymbols, plotCytoregionLabels}) {

  const sURL = `${basePath}services/collations/${id}?datasetIds=${datasetIds}`

  const { data, error, isLoading } = useProgenetixApi(sURL)

  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <SubsetResponse
          id={id}
          individual={individual}
          response={data}
          datasetIds={datasetIds}
          plotGeneSymbols={plotGeneSymbols}
          plotCytoregionLabels={plotCytoregionLabels}
        />
      )}
    </Loader>
  )
}

/*============================================================================*/

function SubsetResponse({ id, response, individual, datasetIds, plotGeneSymbols, plotCytoregionLabels }) {
  if (!response.response?.results[0]) {
    return NoResultsHelp(exampleId, "subsetdetails")
  }
  return <Subset
    id={id}
    subset={response.response.results[0]}
    individual={individual}
    datasetIds={datasetIds}
    plotGeneSymbols={plotGeneSymbols}
    plotCytoregionLabels={plotCytoregionLabels}
  />
}

/*============================================================================*/

function Subset({ id, subset, individual, datasetIds, plotGeneSymbols, plotCytoregionLabels }) {
  
  const filters = id
  const sampleFilterScope = "allTermsFilters"
  const [showAll, setShowAll] = useState(false);

  // ... since we use the Phenopackets style, not the internal index_disease
  console.log(individual);
  var indexDisease = individual?.diseases?.[0].diseaseCode
  
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

  {indexDisease && (
    <li>
      <b>Diagnosis</b>{": "}
      {indexDisease?.id}{" ("}
      {indexDisease?.label}{")"}
    </li>
      
  )}

  {individual?.description && (
    <li>
      <b>Description</b>{": "}
      {individual.description}
    </li>
  )}

  {individual?.sex && (
    <li>
      <b>Genotypic Sex</b>{": "}
      {individual?.sex?.label} ({individual.sex.id})
    </li>
  )}

  {indexDisease?.onset && (
      <li>
        <b>Age at Collection</b>{": "}
        {indexDisease.onset.age}
      </li>
  )}

  </ul>

  {individual?.genomeAncestry && individual?.genomeAncestry?.length > 0 && (
    <>
      <h5>Genomic Ancestry</h5>
      <AncestryData individual={individual} />
    </>
  )}

  <h5>Samples</h5>

{/*  
  {individual.biosamples && individual.biosamples.length > 0 &&
    <>
    <h6>Biosamples</h6>
        <ul>
    {individual.biosamples.map((bs, i) => (
      <li key={i}>
      <InternalLink
        href={`/biosample/?id=${bs}&datasetIds=${ datasetIds }`}
        label={bs}
      />
      </li>
    ))}
    </ul>
    </>
  }
*/}
  
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
        href={ sampleSearchPageFiltersLink({datasetIds, searchPage, sampleFilterScope, filters}) }
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

  <h5>CNV Profiles</h5>
    <p>The graphs shows the copy number gains (up, blue) and losses (down, orange)
    as percentage of the cell line instances they were observed in. Off note, since
    all instances arose from the same donor cell line one would expect all genomic
    regions to be either 0 or 100 percent. Regions with diverging values are either
    due to clonal divergence/progression and/or to experimental variability.
    </p>
  <SubsetHistogram
    id={id}
    datasetIds={datasetIds}
    plotGeneSymbols={plotGeneSymbols}
    plotCytoregionLabels={plotCytoregionLabels}
    loaderProps={{
      background: true,
      colored: true
    }}
  />
  {indexDisease?.id && (
    <>
      <p>Where there is data available in Progenetix, the histogram below shows the CNV profile of the
      native cancer sample matching the cell line assigned diagnosis.
      </p>
      <SubsetHistogram
        id={indexDisease.id}
        datasetIds={["progenetix"]}
        plotGeneSymbols={plotGeneSymbols}
        plotCytoregionLabels={plotCytoregionLabels}
        loaderProps={{
          background: true,
          colored: true
        }}
      />
    </>
  )}

  {/*<ShowJSON data={subset} />*/}
  
</section>
  )
}

/*============================================================================*/

function VariantsPanel({ id, individual, datasetIds }) {

  const aURL = `${basePath}beacon/individuals/${individual.id}/g_variants/?filters=${id}&variantType=SO:0001059&paginateResults=false`
  const variantsReply = useProgenetixApi( aURL )
  return (
    <Panel heading={`Annotated Variants for ${id}`} className="content">
      <VariantsDataTable apiReply={variantsReply} datasetId={datasetIds} />
    </Panel>
  )
}
