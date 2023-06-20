import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./filtersearch_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
// import Link from "next/link"

export default function filtersearch_page({cytoBands}) {

  return (
    <Layout title="Find Samples" headline="Find Term's Samples">
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}
