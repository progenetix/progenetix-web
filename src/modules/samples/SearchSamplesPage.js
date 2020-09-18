import React from "react"
import { Layout } from "../../components/layouts/Layout"
import parametersConfig from "../../../config/samples-search/parameters.yaml"
import requestTypesConfig from "../../../config/samples-search/progenetix_requestTypes.yaml"
import BiosamplesSearchPanel from "../../components/biosamples/BiosamplesSearchPanel"

export default function SearchSamplesPage() {
  return (
    <Layout title="Search Samples" headline="">
      <BiosamplesSearchPanel
        datasets={datasets}
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
      />
    </Layout>
  )
}

const datasets = [
  { label: "progenetix", value: "progenetix" },
  { label: "arraymap", value: "arraymap" }
]
