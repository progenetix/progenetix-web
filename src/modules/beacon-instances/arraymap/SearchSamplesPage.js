import React from "react"
import { Layout } from "../../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"
import Panel from "../../../components/Panel"

export default function SearchSamplesPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "300px",
    height: "160px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="Search arrayMap Samples" headline="arrayMap">
      <Panel heading="Search Genomic CNV Arrays" className="content">
        <div>
          <img
            src={"/img/chroplot-GSM491153-chro9-labeled.svg"}
            style={imgHere}
          />
          The arrayMap data represents a subset of the Progenetix collection for
          which the probe-specific array has been used for data generation. For
          these samples, individual array probe plots will be accessible through
          the sample details pages.
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
