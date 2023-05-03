import React from "react"
import { Layout } from "../components/Layout"
import Panel from "../components/Panel"
import { SubsetHistogram } from "../components/SVGloaders"
import { Admonition } from "../components/Admonitions"
import { sample } from "lodash"
import { SITE_DEFAULTS, tryFetch } from "../hooks/api"
import { ExternalLink, InternalLink } from "../components/helpersShared/linkHelpers"

// const searchLink = 'Use case: Local CNV Frequencies <a href="/biosamples/">{↗}</a>'+

export default function Index({
  subsetsResponse,
  ncitCount,
  cellosaurusCount
}) {
  const imgHere = {
    float: "right",
    width: "250px",
    border: "0px",
    margin: "-65px 0px 0px 0px"
  }

  const randomSubset = sample(
    subsetsResponse.response.results.filter((s) => s.cnvAnalyses > 1)
  )

  return (
    <Layout title="Cancer Cell Lines" headline="Cancer Cell Line Genomics">
        <img src={"/img/progenetix_cellosaurus.png"} style={imgHere} />
        <Panel heading="" className="content">
        
        <p>
          The cancer cell line genome variation data in <i>cncercelllines</i> consists
          of a mix of whole-genome copy number variation (CNV) profiles - as has
          been established for the parent{" "}
          <InternalLink
            href="http://progenetix.org"
            label="Progenetix"
          />{" "}
          resource - as well as annotated genome variation data, mapped to genome
          coordinats and queryable using the{" "}
          <ExternalLink
            href="http://docs.genomebeacons.org"
            label="Beacon v2 API"
          />. The <i>cancercelllines</i> resource contains data of{" "}
          <span className="span-red">{cellosaurusCount}</span>{" "}individual cancer cell lines from{" "}
          <span className="span-red">{ncitCount}</span>{" "}different cancer
          types (NCIt neoplasm classification).
        </p>
        <p>
          A large amount of the cancer cell line data has been collected based on
          annotations and pointers from{" "}
          <ExternalLink
            href="https://web.expasy.org/cellosaurus/"
            label="Cellosaurus"
          />
          {" "}, a reference knowledge resource on cell lines.
        </p>

        <SubsetHistogram
          datasetIds={SITE_DEFAULTS.DATASETID}
          id={randomSubset.id}
          title="Cell Line Data CNV Frequency Plot"
          description={`The CNV histogram above represents CNV data from a
          randomly selected set of samples - either instances of a common cell 
          line or with a shared diagnosis. In this example the frequencies of 
          regional gains and losses in ${randomSubset.cnvAnalyses}${" "}
          samples from ${randomSubset.id} (${randomSubset.label}) are on display.`}
        />

        <Admonition
          title="Citation"
          content='
          <ul>
            <li>
              cancercelllines.org: <strong>Cancer cell line oncogenomic online resource</strong> (2023)
            </li>
            <li>Huang Q, Carrio-Cordo P, Gao B, Paloots R, Baudis M. (2021): 
              <strong>The Progenetix oncogenomic resource in 2021.</strong> 
              <em>Database (Oxford).</em> 2021 Jul 17
            </li>
          </ul>'
        />

      </Panel>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const subsetsReply = await tryFetch(
    `${SITE_DEFAULTS.PREFETCH_PATH}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&method=counts&collationTypes=cellosaurus,NCIT,icdom,PMID,icdot`
  )
  const cellosaurusCountReply = await tryFetch(
    `${SITE_DEFAULTS.PREFETCH_PATH}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&method=codematches&collationTypes=cellosaurus&requestedGranularity=count`
  )
  const ncitCountReply = await tryFetch(
    `${SITE_DEFAULTS.PREFETCH_PATH}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&method=codematches&collationTypes=NCIT&requestedGranularity=count`
  )
  return {
    props: {
      ncitCount: ncitCountReply.responseSummary.numTotalResults,
      cellosaurusCount: cellosaurusCountReply.responseSummary.numTotalResults,
      subsetsResponse: subsetsReply
    }
  }
}

