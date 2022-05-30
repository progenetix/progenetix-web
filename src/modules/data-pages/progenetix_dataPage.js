import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./progenetix_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"

export default function progenetixdataPage({ cytoBands }) {
  return (
    <Layout title="Search Samples" headline="">
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}
