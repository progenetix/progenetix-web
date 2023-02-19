import { Layout } from "../components/Layout"
import Panel from "../components/Panel"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { sample } from "lodash"
import { SITE, SITE_DEFAULTS, tryFetch } from "../hooks/api"
import { ExternalLink } from "../components/helpersShared/linkHelpers"

// const searchLink = 'Use case: Local CNV Frequencies <a href="/biosamples/">{↗}</a>'+

export default function Index({subsetsResponse}) {
  const imgHere = {
    float: "right",
    width: "250px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  const randomSubset = sample(
    subsetsResponse.response.results.filter((s) => s.cnvAnalyses > 1)
  )

  return (
    <Layout title="Cancer Cell Lines" headline="Cancer Cell Lines">
      <Panel heading="Cancer cell line variants" className="content">
        <img src={"/img/progenetix_cellosaurus.png"} style={imgHere} />
        <div>
          This search page uses Progenetix cell line copy number variation data.
          These data include cancer cell lines that have been mapped to{" "}
          <ExternalLink
            href="https://web.expasy.org/cellosaurus/"
            label="Cellosaurus"
          />
          {" "} - a knowledge resource on cell lines.
        </div>

      </Panel>
      <Panel heading="Cell Line Data CNV Frequency Plot" className="content">
        <SubsetHistogram datasetIds={SITE_DEFAULTS.DATASETID} id={randomSubset.id} />
      </Panel>
      <Panel className="content">
        <div className="admonition">
          <p className="admonition-title">Citation</p>
          <ul>
            <li>
              cancercelllines.org: <strong>Cancer cell line oncogenomic online resource</strong> (2023)
            </li>
            <li>Huang Q, Carrio-Cordo P, Gao B, Paloots R, Baudis M. (2021):{" "} 
              <strong>The Progenetix oncogenomic resource in 2021.</strong>{" "}
              <em>Database (Oxford).</em> 2021 Jul 17
            </li>

          </ul>
        </div>
        <div className="notification is-warning">
          The <i>Cancer Cell Lines</i> site is under development. <b>Stay tuned!</b>
        </div>    
      </Panel>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const subsetsReply = await tryFetch(
    `${SITE}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&method=counts&collationTypes=cellosaurus,NCIT`
  )
  return {
    props: {
      subsetsResponse: subsetsReply
    }
  }
}

