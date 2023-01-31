import React, { useState } from "react"
import {
  SITE_DEFAULTS,
  getServiceItemUrl,
  useServiceItemDelivery,
  sampleSearchPageFiltersLink,
  NoResultsHelp,
  useLiteratureSearchResults,
  useLiteratureCellLineMatches
} from "../../hooks/api"
import cn from "classnames"
import { Loader } from "../../components/Loader"
import { Layout } from "../../components/Layout"
import { SubsetHistogram } from "../../components/Histogram"
import { withUrlQuery } from "../../hooks/url-query"

const service = "collations"
const exampleId = "cellosaurus:CVCL_0023"

const SubsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id } = urlQuery
  var datasetIds = SITE_DEFAULTS.DATASETID
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Cell Line Details" headline="Cell Line Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, "subsetdetails")
      ) : (
      <>

      <div className="notification is-warning">
        The <i>Cancer Cell Lines</i> site is under development. <b>Stay tuned!</b>
      </div>    

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

//

function LiteratureSearch({ id, datasetIds })
{
  const { data, error, isLoading } = useServiceItemDelivery(
    id,
    service,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <LiteratureSearchResultsTabbed label={data.response.results[0].label} />
      )}
    </Loader>
  );
}

function LiteratureSearchResultsTabbed({label}) {

  const {data,error,isLoading} = useLiteratureCellLineMatches();

  const TABS = {
    cytobands: "Cytoband Matches",
    process: "Disease Annotations",
    genes: "Gene Matches"
  }

  const tabNames = [TABS.process, TABS.cytobands, TABS.genes]
  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  return (
    <Loader isLoading={isLoading} hasError={error} background>

    {data && label in data.celllines && (
      <div className="box">
        {tabNames?.length > 0 ? (
          <div className="tabs is-boxed ">
            <ul>
              {tabNames.map((tabName, i) => (
                <li
                  className={cn({
                    "is-active": selectedTab === tabName
                  })}
                  key={i}
                  onClick={() => setSelectedTab(tabName)}
                >
                  <a>{tabName}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {data.celllines[label].NeoplasticProcess.length > 0 && selectedTab === TABS.process &&
          <ResultComponent cellline={label} entities={data.celllines[label].NeoplasticProcess} /> 
        }
        {data.celllines[label].Gene.length > 0 && selectedTab === TABS.genes &&
          <ResultComponent cellline={label} entities={data.celllines[label].Gene} />
        }
        {data.celllines[label].CytogeneticBand.length > 0 && selectedTab === TABS.cytobands &&
          <ResultComponent cellline={label} entities={data.celllines[label].CytogeneticBand} />
        }
      </div>
    )}
    </Loader>
  )
}

function ResultComponent({cellline, entities})
{
  return (
    <section className="content">
      <table>
        {entities.map((ent,i)=>(<ResultSet key={`${i}`} entity={ent.entity} cellline={cellline} />))}
      </table>
    </section>
  );
}

function ResultSet({cellline,entity})
{
  const {data,error,isLoading} = useLiteratureSearchResults([cellline],[entity]);
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && data.pairs.length > 0 ? <tr><td>
        <b>{entity}</b>
      </td><td>{data.pairs.map((pair,i)=>(<ResultRow key={`${i}`} pair={pair} />))}</td></tr> : ""}
    </Loader>
  )
}


// TODO: Standard reack memp(?) component for table
function ResultRow({pair})
{
  return (
    <tr>
      <td>
        <div dangerouslySetInnerHTML={{ __html:pair.text}}/>
      </td>
      <td>
        <a target="_blank" rel="noreferrer" href={"https://pubmed.ncbi.nlm.nih.gov/"+pair.pmid}>{pair.title}</a>
      </td>
    </tr>
  );
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

  const pgxRegex = new RegExp('^.*cancercelllines.*/services/.*?$')
    
  return (
    <section className="content">
      <h2>
        {subset.label} ({subset.id}, {SITE_DEFAULTS.DATASETLABEL})
      </h2>

      <h5>Subset Type:{" "}Cell line{" "}         
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

      <h5>Sample Count: {subset.count} ({subset.codeMatches} direct {'"'}{subset.id}{'"'} code  matches)</h5>

      <h5>
        Select {subset.id} samples in the 
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
          {"{Beacon JSON ↗}"}
        </a>
      </h5>
    </section>
  )
}
