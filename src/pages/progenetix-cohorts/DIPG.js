import React from "react"
import { Layout } from "../../site-specific/Layout"
import { SubsetLoader } from "../../components/SubsetLoader"
import Panel from "../../components/Panel"
import { ExternalLink } from "../../components/helpersShared/linkHelpers"

const datasetIds = "progenetix"
const subsetId = "pgx:cohort-DIPG"

export default function Page() {
  return (
    <Layout title="TCGA Cancer Subsets" headline="">
      <Panel heading="Genomic Variants in DIPG and Related Pediatric Gliomas">
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
      <img
        src={"/img/project_DIPG.png"}
        style={{
          float: "right",
          width: "200px",
          border: "0px",
          margin: "-20px -20px 0px 0px"
        }}
      />
      This page allows the exploration of genomic variants in aggressive
      childhood gliomas, enabled by the data originally collected for{" "}
      <ExternalLink
        href="http://info.baudisgroup.org/publications/2017-10-01-Integrated-Molecular/"
        label="Mackay et al. (2017)"
      />. 
    </div>
    </>
    )
} 
