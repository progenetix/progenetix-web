import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/beaconSearchParameters.yaml"
import beaconQueryTypes from  "../../config/beaconQueryTypes.yaml"
import requestTypeExamples from "../../config/arraymap_searchExamples.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"

import Panel from "../../components/Panel"

export default function arraymap_dataPage({ cytoBands }) {
  return (
    <Layout title="Search arrayMap Samples" headline="arrayMap">
      <Panel heading="Genomic CNV Arrays" className="content">
        <div style={{ display: "flex" }}>
          The arrayMap data represents a subset of the Progenetix collection for
          which the probe-specific array has been used for data generation. For
          these samples, individual array probe plots will be accessible through
          the sample details pages.
          <img
            src={"/img/chroplot-GSM491153-chro9-labeled.svg"}
            style={{
              height: "160px",
              margin: "-70px -24px -18px 0"
            }}
          />
        </div>
      </Panel>
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
