import React from "react"
import { Layout } from "../../../components/Layout"
import parametersConfig from "../../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"
import Panel from "../../../components/Panel"
import { ExternalLink } from "../../../hooks/api"
// import Link from "next/link"

export default function SearchSamplesPage({ cytoBands }) {
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
