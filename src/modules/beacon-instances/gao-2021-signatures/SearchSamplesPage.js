import React from "react"
import { ExternalLink } from "../../../hooks/api"
import { Layout } from "../../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../../components/Histogram"
import Panel from "../../../components/Panel"
// import Link from "next/link"

export default function SearchSamplesPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "200px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="Search Samples from Gao & Baudis, 2021" headline="Data from 2021 Signatures Publication">
      <Panel heading="Search Genomic CNV Data Signatures of Discriminative Copy Number Aberrations..." className="content">
        <div>
          <img src={"/img/gao-2021-signatures-landscape.png"} style={imgHere} />
          This search page uses the subset of Progenetix data - including TCGA samples - used in the{" "}
          <ExternalLink
            href="https://info.baudisgroup.org/publications/2020-12-18-publication-Bo-classifiers/"
            label="Signatures of Discriminative Copy Number Aberrations in 31 Cancer Subtypes"
          />
          {" "}publication.<br/>For access restriction imposed by PCAWG the data cannot not include the samples from this consortium which have been used in our publication.
        </div>
        <SubsetHistogram datasetIds="progenetix" id="pgxcohort-gao2021signatures" />
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
