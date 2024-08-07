import React from "react"
import { Layout } from "../components/Layout"
import BiosamplesSearchPanel from "../components/searchForm/BiosamplesSearchPanel"
import parametersConfig from "../config/beaconSearchParameters.yaml"
import beaconQueryTypes from  "../config/beaconQueryTypes.yaml"
import requestTypeExamples from "../config/beaconSearchExamples.yaml"

export default function Page() {
  return (
    <Layout title="Search Samples" headline="">
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        beaconQueryTypes={beaconQueryTypes}
        requestTypeExamples={requestTypeExamples}
        collapsed={false}
      />
    </Layout>
  )
}
