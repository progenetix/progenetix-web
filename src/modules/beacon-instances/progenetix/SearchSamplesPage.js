import React from "react"
import { Layout } from "../../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"

export default function SearchSamplesPage({ cytoBands }) {
  return (
    <Layout title="Search Samples" headline="">
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
