import React from "react"
import { ExternalLink } from "../../hooks/api"
import { Layout } from "../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./DIPG_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/biosamples/BiosamplesSearchPanel"
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
        datasets={datasets}
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}

const datasets = [{ label: "Progenetix", value: "progenetix" }]
