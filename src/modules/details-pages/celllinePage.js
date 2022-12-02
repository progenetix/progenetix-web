import {
  getServiceItemUrl,
  useServiceItemDelivery,
  sampleSearchPageFiltersLink,
  NoResultsHelp,
  useLiteratureSearchResults,
  useLiteratureCellLineMatches
} from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/Layout"
import { SubsetHistogram } from "../../components/Histogram"
import { withUrlQuery } from "../../hooks/url-query"


const service = "collations"
const exampleId = "NCIT:C3262"

const SubsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id, datasetIds } = urlQuery
  if (! datasetIds) {
    datasetIds = "progenetix"
  }
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Subset Details" headline="Subset Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>
      <SubsetLoader id={id} datasetIds={datasetIds} />
      
      <div className="mb-3">
        <SubsetHistogram
          id={id}
          datasetIds={datasetIds}
          // labelstring="17:10000000-3000000:TEST"
          loaderProps={{
            background: true,
            colored: true
          }}
        />
      </div>
      <LiteratureSearch id={id} datasetIds={datasetIds} />
      </>
      )}
    </Layout>
  )
})

export default SubsetDetailsPage

function LiteratureSearch({ id, datasetIds })
{
  const { data, error, isLoading } = useServiceItemDelivery(
    id,
    service,
    datasetIds
  )
  return (<Loader isLoading={isLoading} hasError={error} background>
            {data && (<LiteratureSearchResults label={data.response.results[0].label} />)}
          </Loader>);
}

function LiteratureSearchResults({label})
{
  const {data,error,isLoading} = useLiteratureCellLineMatches();
  return (<Loader isLoading={isLoading} hasError={error} background>
            {data && label in data.celllines && (<div>
              <section className="content"><h1>Literature Results</h1></section>
              {data.celllines[label].CytogeneticBand.length > 0 ? 
                <ResultComponent cellline={label} entities={data.celllines[label].CytogeneticBand} name={"Cytobands"} /> : ""}
              {data.celllines[label].NeoplasticProcess.length > 0 ?  
              <ResultComponent cellline={label} entities={data.celllines[label].NeoplasticProcess} name={"Cancer Types"} /> : ""}
              {data.celllines[label].Gene.length > 0 ? 
              <ResultComponent cellline={label} entities={data.celllines[label].Gene} name={"Genes"} /> : ""}
            </div>)}
          </Loader>)
}

function ResultComponent({name,cellline,entities})
{
  return (<section className="content">
            <h3>{name}</h3>
            <table>
              {entities.map((ent,i)=>(<ResultSet key={`${i}`} entity={ent.entity} cellline={cellline} />))}
            </table>
          </section>);
}

function ResultSet({cellline,entity})
{
  const {data,error,isLoading} = useLiteratureSearchResults([cellline],[entity]);
  return (<Loader isLoading={isLoading} hasError={error} background>
            {data && data.pairs.length > 0 ? <tr><td>
              <b>{entity}</b>
            </td><td>{data.pairs.map((pair,i)=>(<ResultRow key={`${i}`} pair={pair} />))}</td></tr> : ""}
          </Loader>)
}

function ResultRow({pair})
{
  return (<tr>
            <td>
              <div dangerouslySetInnerHTML={{ __html:pair.text}}/>
            </td>
            <td>
              <a target="_blank" rel="noreferrer" href={"https://pubmed.ncbi.nlm.nih.gov/"+pair.pmid}>{pair.title}</a>
            </td>
          </tr>);
}

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
  const sampleFilterScope = "freeFilters"

  const pgxRegex = new RegExp('^.*progenetix.*/services/.*?$')
    
  return (
    <section className="content">
      <h2>
        {subset.label} ({subset.id}, {datasetIds})
      </h2>

      {subset.type && (
        <>
          <h5>Subset Type:{" "}{subset.type}{" "}
            
            {
              ! pgxRegex.test(subset.reference) && (
                <>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={ subset.reference }
                    >
                    {"{"}{ subset.id }{" ↗}"}
                    </a>
                </>
              )   
              
            } 
            
          </h5>
        </>
      )}      

      <h5>Sample Count: {subset.count} ({subset.codeMatches} direct {'"'}{subset.id}{'"'} code  matches)</h5>

      <h5>
        Select Samples in the 
        <a
          rel="noreferrer"
          target="_blank"
          href={ sampleSearchPageFiltersLink({datasetIds, sampleFilterScope, filters}) }
        >{" "}Search Form
        </a>
      </h5>
      
      
      
      <h5>
        Download Data as Beacon v2{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={getServiceItemUrl(subset.id, service, datasetIds)}
        >
          {"{JSON ↗}"}
        </a>
      </h5>
    </section>
  )
}
