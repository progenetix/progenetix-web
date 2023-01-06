import React from "react"
import { ExternalLink } from "../../hooks/api"
import { Layout } from "../../components/LayoutCellLines"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../components/Histogram"
import Panel from "../../components/Panel"
import SubsetsLoader from  "../../components/SubsetsLoader"
// import Link from "next/link"

export default function cellLines_dataPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "250px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="Cancer Cell Lines" headline="Cancer Cell Lines">
      <Panel heading="Cancer cell line CNVs" className="content">
        <img src={"/img/progenetix_cellosaurus.png"} style={imgHere} />
        <div>
          This search page uses Progenetix cell line copy number variation data. These data include cancer cell lines that have been mapped to
           {" "}
          <ExternalLink
            href="https://web.expasy.org/cellosaurus/"
            label="Cellosaurus"
          />
          {" "} - a knowledge resource on cell lines.
        </div>
      </Panel>

      <div className="notification is-warning">
        The <i>Cell Lines</i> sub-site is a development project for the upcoming
        {" "}<b>cancercellines.org</b>.
      </div>    

      <Panel heading="CNV Frequency Plot">
      <SubsetHistogram
        datasetIds="progenetix"
        id="pgx:cohort-celllines"
      />
      </Panel>
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
        collapsed={true}
      />
      <Panel heading="Cell Lines (with parental/derived hierarchies)" className="content">
        <SubsetsLoader collationTypes="cellosaurus" datasetIds="progenetix" />
      </Panel>
    </Layout>
  )
}
