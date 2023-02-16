import React, { useState } from "react"
import {
  SITE_DEFAULTS,
  basePath,
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
import Button from '@mui/material/Button';
const service = "collations"
const exampleId = "cellosaurus:CVCL_0023"
import Tooltip from '@mui/material/Tooltip';

const SubsetDetailsPage = withUrlQuery(({ urlQuery }) => {
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

      <div className="notification is-warning">
        The <i>Cancer Cell Lines</i> site is under development. <b>Stay tuned!</b>
      </div>    

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

export default SubsetDetailsPage

//

function LiteratureSearch({ id, datasetIds, labels, setLabels})
{
  const { data, error, isLoading } = useServiceItemDelivery(
    id,
    service,
    datasetIds
  )
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && (
        <LiteratureSearchResultsTabbed label={data.response.results[0].label} labels={labels} setLabels={setLabels}/>
      )}
    </Loader>
  );
}

function LiteratureSearchResultsTabbed({label, labels, setLabels}) {

  const {data,error,isLoading} = useLiteratureCellLineMatches(label);
  const TABS = {
    genes: "Gene Matches",
    cytobands: "Cytoband Matches",
    variants: "Variants"
  }
  // process: "Disease Annotations",
  // TABS.process, 

  const tabNames = [TABS.genes, TABS.cytobands, TABS.variants]
  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  return (
    <Loader isLoading={isLoading} hasError={error} background>

    {data && (
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
        {data?.Cancer?.length > 0 && selectedTab === TABS.process &&
          <ResultComponent cellline={label} entities={data.Cancer} /> 
        }
        {data?.Gene?.length > 0 && selectedTab === TABS.genes &&
          <GeneComponent cellline={label} genes={data.Gene.sort()} labels={labels} setLabels={setLabels}/>
        }
        {data?.Band?.length > 0 && selectedTab === TABS.cytobands &&
          <ResultComponent cellline={label} entities={data.Band} />
        }
        {data?.Variant?.length > 0 && selectedTab === TABS.variants &&
          <ResultComponent cellline={label} entities={data.Variant} />
        }
      </div>
    )}
    </Loader>
  )
}

function GeneComponent({cellline, genes, labels, setLabels})
{
  return (
    <section className="content">
      <table>
        {labels.length >= 1 ? <tr><td colSpan="9" align="center"><Button contained color="secondary" onClick={() => window.location.reload(true)}>Clear Annotations</Button></td></tr> : ""}
        {genes.map((gene,i)=>(<GeneResultSet key={`${i}`} gene={gene} cellline={cellline} labels={labels} setLabels={setLabels}/>))}
      </table>
    </section>
  );
}

function ResultComponent({cellline, entities})
{
  return (
    <section className="content">
      <table>
        {entities.map((ent,i)=>(<ResultSet key={`${i}`} entity={ent} cellline={cellline} />))}
      </table>
    </section>
  );
}

async function addGeneLabel(gene, labels, setLabels, setLabelButton)
{
  await fetch(basePath+"services/genespans/"+gene).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad response from "+basePath+"/services/genespans")
    }
    return res
  }).then(res => res.json()).then(data=>{
      var l = labels;
      setLabelButton(true)
      if (l === "") {
        l += data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
        +  "-" + data['response']['results'][0]['end'] + ":" + gene;
      } else {
        l += "," + data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
        +  "-" + data['response']['results'][0]['end'] + ":" + gene;
      }
      window.scrollTo(0, 0);
      setLabels(l);
  }).catch((error) => {
      console.log(error)
    })
}

function GeneResultSet({cellline, gene, labels, setLabels})
{
  const {data, error, isLoading} = useLiteratureSearchResults([cellline],[gene]);
  const [expand, setExpand] = useState(false);
  const [labelButton, setLabelButton] = useState(false);
  
  console.log('data:', data)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && data.pairs.length > 0 ? <tr><td>
        {labelButton && labels.length > 1 ? <Button disabled variant="contained">{gene}</Button> :
          <Tooltip title={`add gene ${gene} to the plot!`}>
            <Button onClick={()=>addGeneLabel(gene, labels, setLabels, setLabelButton)}>{gene}</Button>
          </Tooltip>}
      </td>
        {expand ?
          <td>{data.pairs.map((pair,i)=>(<GeneResultRow key={`${i}`} pair={pair}/>))}</td>
        :
          <td><GeneResultRow key={0} pair={data.pairs[0]} expand={expand} setExpand={setExpand}/></td>
        }

        {data.pairs.length < 2 ? 
          <td>&nbsp;</td>
        :
          <td>
            <Button color="secondary" onClick={() => {setExpand(!expand)}}>{expand ? <b>Close</b> : <b>Expand</b>}</Button>
          </td>
        }
      </tr> : ""}
    </Loader>
  )
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

// function GeneResultRow({pair, expand, setExpand})

function GeneResultRow({pair})
{
  const [showAbstract, setShowAbstract] = useState(false);
  return (
    <tr>
      <table>
      <tr>
        <td style={{border: '0px'}}>
          <div dangerouslySetInnerHTML={{ __html:pair.matches[0]}}/>
        </td>
        <td colSpan="3"  style={{border: '0px'}}>
          <a target="_blank" rel="noreferrer" href={"https://pubmed.ncbi.nlm.nih.gov/"+pair.pmid}>{pair.title} ({pair.pmid})</a>
        </td>
        <td style={{border: '0px'}}><Button onClick={() => {setShowAbstract(!showAbstract)}}>{!showAbstract ? <p>Abstract</p> : <p>Close Abstract</p>}</Button></td>
      </tr>
      {showAbstract ?
        <tr>
          <td colSpan="9" dangerouslySetInnerHTML={{ __html:pair.abstract}} style={{border: '0px'}}></td>
        </tr>
      : ""}
      </table>
    </tr>
  );
}


// TODO: Standard react memo(?) component for table
function ResultRow({pair})
{
  const [showAbstract, setShowAbstract] = useState(false);
  return (
    <tr>
      <table>
        <tr>
        <td style={{border: '0px'}}>
          <div dangerouslySetInnerHTML={{ __html:pair.text}}/>
        </td>
        <td style={{border: '0px'}}>
          <a target="_blank" rel="noreferrer" href={"https://pubmed.ncbi.nlm.nih.gov/"+pair.pmid}>{pair.title}</a>
        </td>
        <td style={{border: '0px'}}><Button onClick={() => {setShowAbstract(!showAbstract)}}>{!showAbstract ? <p>Abstract</p> : <p>Close Abstract</p>}</Button></td>
        </tr>
        {showAbstract ?
        <tr>
          <td colSpan="9" dangerouslySetInnerHTML={{ __html:pair.abstract}} style={{border: '0px'}}></td>
        </tr>
      : ""}
      </table>
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

      <h5>Sample Count: {subset.count} ({subset.codeMatches} direct{" "}
        {'"'}{subset.id}{'"'} code  matches, {subset.cnvAnalyses} CNV analyses)
      </h5>

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
