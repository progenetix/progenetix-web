import { Layout } from "../components/Layout"
import Panel from "../components/Panel"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { ExternalLink } from "../hooks/api"

// const searchLink = 'Use case: Local CNV Frequencies <a href="/biosamples/">{↗}</a>'+

export default function Index() {
  const imgHere = {
    float: "right",
    width: "250px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

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
        <div className="admonition">
          <p className="admonition-title">Citation</p>
          <ul>
            <li>Huang Q, Carrio-Cordo P, Gao B, Paloots R, Baudis M. (2021):{" "} 
              <strong>The Progenetix oncogenomic resource in 2021.</strong>{" "}
              <em>Database (Oxford).</em> 2021 Jul 17
            </li>
            <li>
              progenetix.org: <strong>Progenetix oncogenomic online resource</strong> (2022)
            </li>

          </ul>
        </div>

      </Panel>
      <Panel heading="CNV Frequency Plot">
      <SubsetHistogram
        datasetIds="progenetix"
        id="pgx:cohort-celllines"
      />
      </Panel>
      <div className="notification is-warning">
        The <i>Cancer Cell Lines</i> site is under development. <b>Stay tuned!</b>
      </div>    
    </Layout>
  )
}
