import React from "react"
import { Layout } from "../../components/Layout"
import { SubsetLoader } from "../../components/SubsetLoader"
import Panel from "../../components/Panel"

const datasetIds = "progenetix"
const subsetId = "pgx:cohort-arraymap"

export default function arraymap_dataPage() {
  return (
    <Layout title="" headline="">
      <Panel>
        <SubsetLoader
          id={subsetId}
          datasetIds={datasetIds}
        />
      </Panel>
      <Panel>
        <ThisSubset />
      </Panel>
    </Layout>
  )
}

function ThisSubset() {
  return (
    <>
    <div style={{ display: "flex" }}>
      The arrayMap data represents a subset of the Progenetix collection for
      which the probe-specific array has been used for data generation. For
      these samples, individual array probe plots will be accessible through
      the sample details pages.
      <img
        src={"/img/chroplot-GSM491153-chro9-labeled.svg"}
        style={{
          height: "160px",
          margin: "-15px 0px 0px 30px"
        }}
      />
    </div>
    </>
    )
} 
