import { Layout } from "../components/Layout"
import Panel from "../components/Panel"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { sample } from "lodash"
import { PROGENETIX, tryFetch, Link } from "../hooks/api"

// const searchLink = 'Use case: Local CNV Frequencies <a href="/biosamples/">{↗}</a>'+

const imgFocal = {
  float: "right",
  width: "200px",
  border: "0px",
  margin: "-80px -20px 0px 10px"
}

export default function Index({
  ncitCountResponse,
  progenetixStats,
  subsetsResponse
}) {
  const randomSubset = sample(
    subsetsResponse.results.filter((s) => s.count > 30)
  )

  return (
    <Layout title="Progenetix" headline="Cancer genome data @ progenetix.org">
      <Panel className="content">
        <div className="content">
          The Progenetix database provides an overview of mutation data in
          cancer, with a focus on copy number abnormalities (CNV / CNA), for all
          types of human malignancies. The data is based on{" "}
          <i>individual sample data</i> from currently{" "}
          <span className="span-red">
            {progenetixStats.results[0].counts.biosamples}
          </span>{" "}
          samples.
          <SubsetHistogram datasetIds="progenetix" id={randomSubset.id} />
          <div className="has-text-centered">
            <small>
              Example for aggregated CNV data in {randomSubset.count} samples in{" "}
              {randomSubset.label}.<br />
              Here the frequency of regional{" "}
              <span className="span-gain-color">
                copy number gains
              </span> and <span className="span-loss-color">losses</span> are
              displayed for all 22 autosomes.
            </small>
          </div>
        </div>
      </Panel>

      <Panel heading="Progenetix Use Cases" className="content">
        <h4>
          <Link href="/biosamples/" label="Local CNV Frequencies" />
        </h4>

        <p>
          <img src={"/img/9p-example-histogram.png"} style={imgFocal} />A
          typical use case on Progenetix is the search for local copy number
          aberrations - e.g. involving a gene - and the exploration of cancer
          types with these CNVs. The <a href="/biosamples/">[ Search Page ]</a>{" "}
          provides example use cases for designing queries. Results contain
          basic statistics as well as visualization and download options.
        </p>

        <h4>
          <Link
            href="/subsets/biosubsets"
            label="Cancer CNV Profiles"
          />
        </h4>

        <p>
          The progenetix resource contains data of{" "}
          <span className="span-red">{ncitCountResponse}</span> different cancer
          types (NCIt neoplasm classification), mapped to a variety of
          biological and technical categories. Frequency profiles of regional
          genomic gains and losses for all categories (diagnostic entity,
          publication, cohort ...) can be accessed through the{" "}
          <a href="/subsets/biosubsets">[ Cancer Types ]</a> page with direct
          visualization and options for sample retrieval and plotting options.
        </p>

        <h4>
          <Link
            href="/publications"
            label="Cancer Genomics Publications"
          />
        </h4>

        <p>
          Through the <a href="/publications">[ Publications ]</a> page
          Progenetix provides{" "}
          <span className="span-red">
            {progenetixStats.results[0].counts.publications}
          </span>{" "}
          annotated references to research articles from cancer genome screening
          experiments (WGS, WES, aCGH, cCGH). The numbers of analyzed samples
          and possible availability in the Progenetix sample collection are
          indicated.
        </p>
      </Panel>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const dbstatsReply = await tryFetch(
    `${PROGENETIX}/services/dbstats/?datasetIds=progenetix`
  )
  const ncitCountReply = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=codematches&filters=NCIT`
  )
  const subsetsReply = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=paths&filters=icdom,NCIT,PMID,icdot,UBERON,TNM`
  )

  return {
    props: {
      progenetixStats: dbstatsReply,
      ncitCountResponse: ncitCountReply.responseSummary.numTotalResults,
      subsetsResponse: subsetsReply
    }
  }
}
