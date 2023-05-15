import React, { useState } from "react"
import {
  SITE_DEFAULTS,
  useServiceItemDelivery,
  useLiteratureSearchResults,
  useLiteratureCellLineMatches
} from "../hooks/api"
import cn from "classnames"
import { Loader } from "./Loader"
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
const service = "collations"

export function LiteratureSearch({ id, datasetIds, labels, setLabels})
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
    genes: { id: "genes", label: "Gene Matches", info: "Genes that have been matched in publications related to the cell line. The connection between gene and cell line may be indirect (e.g. as part of a process affected in the CL) or circumstantial (e.g. involving another CL or sample discussed in the context)."},
    cytobands: { id: "cytobands", label: "Cytoband Matches", info: "Genomic regions by cytoband annotation (8q24, 17p ...) named in a CL context"},
    variants: { id: "variants", label: "Variants", info: "Genomic variation types or processes mentioned in the context of the CL, in the corresponding publication (not necessarily applying to the CL itself)"}
  }
  // process: "Disease Annotations",
  // TABS.process, 

  const tabNames = [TABS.genes.label, TABS.cytobands.label, TABS.variants.label]
  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  return (
    <Loader isLoading={isLoading} hasError={error} background>
    {data && Object.keys(data).length > 0 ?
      <div className="box">
        {tabNames?.length > 0 ?
          <div className="tabs is-boxed">
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
        : null}
        {data?.Gene?.length > 0 && selectedTab === TABS.genes.label &&
          <GeneComponent cellline={label} genes={data.Gene.sort()} labels={labels} setLabels={setLabels}/>
        }
        {data?.Band?.length > 0 && selectedTab === TABS.cytobands.label &&
          <CytobandComponent cellline={label} entities={data.Band.sort()} />
        }
        {data?.Variant?.length > 0 && selectedTab === TABS.variants.label &&
          <ResultComponent cellline={label} entities={data.Variant} />
        }
      </div> : "Nothing to see here..."
    }
    </Loader>
  )
}

/*==============================================================================
================================================================================
==============================================================================*/

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

function CytobandComponent({cellline, cytobands, labels, setLabels})
{
    return (
        <section className="content">
            <table>
                {labels.length >= 1 ? <tr><td colSpan="9" align="center"><Button contained color="secondary" onClick={() => window.location.reload(true)}>Clear Annotations</Button></td></tr> : ""}
                {cytobands.map((cytoband,i)=>(<CytobandResultSet key={`${i}`} cytoband={cytoband} cellline={cellline} labels={labels} setLabels={setLabels}/>))}
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
  await fetch(SITE_DEFAULTS.API_PATH+"services/genespans/"+gene).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error("Bad response from "+SITE_DEFAULTS.API_PATH+"/services/genespans")
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

async function addCytobandLabel(cytoband, labels, setLabels, setLabelButton)
{
    await fetch(SITE_DEFAULTS.API_PATH+"services/cytobands/"+cytoband).then(res => {
        if (res.status >= 400 && res.status < 600) {
            throw new Error("Bad response from "+SITE_DEFAULTS.API_PATH+"/services/cytobands")
        }
        return res
    }).then(res => res.json()).then(data=>{
        var l = labels;
        setLabelButton(true)
        if (l === "") {
            l += data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
                +  "-" + data['response']['results'][0]['end'] + ":" + cytoband;
        } else {
            l += "," + data['response']['results'][0]['referenceName'] + ":" + data['response']['results'][0]['start']
                +  "-" + data['response']['results'][0]['end'] + ":" + cytoband;
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

function CytobandResultSet({cellline, cytoband, labels, setLabels})
{
    const {data, error, isLoading} = useLiteratureSearchResults([cellline],[cytoband]);
    const [expand, setExpand] = useState(false);
    const [labelButton, setLabelButton] = useState(false);

    console.log('data:', data)
    return (
        <Loader isLoading={isLoading} hasError={error} background>
            {data && data.pairs.length > 0 ? <tr><td>
                {labelButton && labels.length > 1 ? <Button disabled variant="contained">{cytoband}</Button> :
                    <Tooltip title={`add cytoband ${cytoband} to the plot!`}>
                        <Button onClick={()=>addCytobandLabel(cytoband, labels, setLabels, setLabelButton)}>{cytoband}</Button>
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

