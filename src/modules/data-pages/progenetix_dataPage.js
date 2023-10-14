import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/searchParameters.yaml"
import requestTypeConfig from "../../config/progenetix_searchParameters.yaml"
import requestTypeExamples from "../../config/progenetix_searchExamples.yaml"

import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"

export default function progenetixdataPage({ cytoBands }) {
  return (
    <Layout title="Search Samples" headline="">
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypeConfig={requestTypeConfig}
        requestTypeExamples={requestTypeExamples}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}
