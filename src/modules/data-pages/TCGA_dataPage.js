import React from "react"
import { ExternalLink } from "../../components/helpersShared/linkHelpers"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/searchParameters.yaml"
import requestTypeConfig from "../../config/TCGA_searchParameters.yaml"
import requestTypeExamples from "../../config/TCGA_searchExamples.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../components/SVGloaders"
import Panel from "../../components/Panel"
// import Link from "next/link"
import SubsetsLoader from  "../../components/SubsetsLoader"

export default function TCGA_dataPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "200px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="Search TCGA Samples" headline="TCGA CNV Data">
      <Panel heading="Search Genomic CNV Data from TCGA" className="content">
        <div>
          <img src={"/img/tcga.png"} style={imgHere} />
          This search page accesses the TCGA subset of the Progenetix
          collection, based on 22142 samples (tumor and reeferences) from The
          Cancer Genome Atlas project. The results are based upon data generated
          by the{" "}
          <ExternalLink
            href="https://www.cancer.gov/tcga"
            label="TCGA Research Network"
          />{" "}. Disease-specific subsets of TCGA data (aka. projects) can be
          accessed below.
        </div>
        <SubsetHistogram datasetIds="progenetix" id="pgx:cohort-TCGAcancers" />
      </Panel>
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypeConfig={requestTypeConfig}
        requestTypeExamples={requestTypeExamples}
        cytoBands={cytoBands}
        collapsed={true}
      />
      <Panel heading="TCGA Cancer Studies">
        <SubsetsLoader collationTypes="TCGAproject" datasetIds="progenetix" />
      </Panel>

    </Layout>
  )
}
