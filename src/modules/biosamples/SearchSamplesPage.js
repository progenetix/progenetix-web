import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../../config/samples-search/parameters.yaml"
import requestTypesConfig from "../../../config/samples-search/progenetix_requestTypes.yaml"
import BiosamplesSearchPanel from "../../components/biosamples/BiosamplesSearchPanel"

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

const datasets = [
  { label: "progenetix", value: "progenetix" },
  { label: "arraymap", value: "arraymap" }
]
