import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/beaconSearchParameters.yaml"
import beaconQueryTypes from  "../../config/beaconQueryTypes.yaml"
import requestTypeExamples from "../../config/progenetix_searchExamples.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"

export default function progenetixdataPage({ cytoBands }) {
  return (
    <Layout title="Search Samples" headline="">
      <BiosamplesSearchPanel
        cytoBands={cytoBands}
        parametersConfig={parametersConfig}
        beaconQueryTypes={beaconQueryTypes}
        requestTypeExamples={requestTypeExamples}
        collapsed={false}
      />
    </Layout>
  )
}
