import { Layout } from "../site-specific/Layout"
import Panel from "../components/Panel"
import { SubsetHistogram } from "../components/SVGloaders"
import { InternalLink }  from "../components/helpersShared/linkHelpers"
import React from "react"
import { sample } from "lodash"
import { SITE_DEFAULTS, tryFetch } from "../hooks/api"

const imgFocal = {
  float: "right",
  width: "300px",
  border: "0px",
  margin: "-35px -20px -10px 10px"
}

// const histoLegend = {
//   margin: "-4px 0px 18px 0px",
//   display: "block"
// }

export default function Index({
  ncitCountResponse,
  progenetixStats,
  subsetsResponse
}) {

  const randomSubset = sample(
    subsetsResponse.response.results.filter((s) => s.cnvAnalyses > 1)
  )

  return (
<Layout title="Progenetix" headline="Cancer genome data @ progenetix.org">
  <Panel className="content">
    <p>
      The Progenetix database provides an overview of mutation data in
      cancer, with a focus on copy number abnormalities (CNV / CNA), for all
      types of human malignancies. The data is based on{" "}
      <i>individual sample data</i> of currently{" "}
      <span className="span-red">{progenetixStats.response.results[0].counts.biosamples}</span>{" "}
      samples from{" "}<span className="span-red">{ncitCountResponse}</span>{" "}
      different cancer types (NCIt neoplasm classification)
    </p>

    <h4>
      <InternalLink href="/search/" label="Local CNV Frequencies" />
    </h4>

    <p>
      <img src={"/img/9p-example-histogram.svg"} style={imgFocal} />A
      typical use case on Progenetix is the search for local copy number
      aberrations - e.g. involving a gene - and the exploration of cancer
      types with these CNVs. The <a href="/search/">[ Search Page ]</a>{" "}
      provides example use cases for designing queries. Results contain
      basic statistics as well as visualization and download options.
    </p>

    <h4>
      <InternalLink
        href="/subsets/NCIT-subsets"
        label="Cancer CNV Profiles"
      />
    </h4>

    <p>
      Frequency profiles of regional
      genomic gains and losses for all categories (diagnostic entity,
      publication, cohort ...) can be accessed through the respective{" "}
      Cancer Types pages with visualization and sample retrieval options. Below is
      a typical example of the aggregated CNV data in {randomSubset.count} samples
      in{" "}{randomSubset.label}{" "} with the frequency of regional{" "}
      <span className="span-dup-color">copy number gains</span>{" "}
      (<span className="span-hldup-color">high level</span>){" "}and{" "}
      <span className="span-del-color">losses</span>{" "}
      (<span className="span-hldel-color">high level</span>){" "}
      displayed for the 22 autosomes.
      <SubsetHistogram datasetIds={SITE_DEFAULTS.DATASETID} id={randomSubset.id} />
    </p>

    <h4>
      <InternalLink
        href="/publications"
        label="Cancer Genomics Publications"
      />
    </h4>
    <p>
      Through the <a href="/publications">[ Publications ]</a> page
      Progenetix provides{" "}
      <span className="span-red">
        {progenetixStats.response.results[0].counts.publications}
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
    `${SITE_DEFAULTS.SITE}services/dbstats/?datasetIds=${SITE_DEFAULTS.DATASETID}`
  )
  const ncitCountReply = await tryFetch(
    `${SITE_DEFAULTS.SITE}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&collationTypes=NCIT&includeDescendantTerms=false&requestedGranularity=count`
  )
  const subsetsReply = await tryFetch(
    `${SITE_DEFAULTS.SITE}services/collations/?datasetIds=${SITE_DEFAULTS.DATASETID}&collationTypes=NCIT&deliveryKeys=count,id,label,cnv_analyses`
  )

  return {
    props: {
      progenetixStats: dbstatsReply,
      ncitCountResponse: ncitCountReply.responseSummary.numTotalResults,
      subsetsResponse: subsetsReply
    }
  }
}
