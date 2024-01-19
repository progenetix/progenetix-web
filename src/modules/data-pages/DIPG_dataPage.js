import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/beaconSearchParameters.yaml"
import beaconQueryTypes from  "../../config/beaconQueryTypes.yaml"
// import beaconQueryTypes from  "../../config/DIPGqueryTypes.yaml"
import requestTypeExamples from "../../config/DIPG_searchExamples.yaml"

import { ExternalLink } from "../../components/helpersShared/linkHelpers"


import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import Panel from "../../components/Panel"
// import Link from "next/link"

export default function DIPG_dataPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "160px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="Search DIPG Samples" headline="DIPG Mutation Data">
      <Panel
        heading="Search Genomic Variants in DIPG and Related Pediatric Gliomas"
        className="content"
      >
        <div>
          <img src={"/img/project_DIPG.png"} style={imgHere} />
          This portal allows the exploration of genomic variants in aggressive
          childhood gliomas, enabled by the data originally collected for{" "}
          <ExternalLink
            href="http://info.baudisgroup.org/publications/2017-10-01-Integrated-Molecular/"
            label="Mackay et al. (2017)"
          />
          .
        </div>
      </Panel>
      <BiosamplesSearchPanel
        cytoBands={cytoBands}
        parametersConfig={parametersConfig}
        beaconQueryTypes={beaconQueryTypes}
        requestTypeExamples={requestTypeExamples}
        collapsed={false}
      />
    </Layout>
  )
}
