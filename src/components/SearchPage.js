import React from "react"
import { Layout } from "./Layout"
import BiosamplesSearchPanel from "./searchForm/BiosamplesSearchPanel"
import parametersConfig from "../config/beaconSearchParameters.yaml"
import beaconQueryTypes from  "../config/beaconQueryTypes.yaml"
import requestTypeExamples from "../config/beaconSearchExamples.yaml"

export default function Page({ cytoBands }) {
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
