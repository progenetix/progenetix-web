import React from "react"
import { Layout } from "../../components/Layout"
import { SubsetLoader } from "../../components/SubsetLoader"
import Panel from "../../components/Panel"
import SubsetsHierarchyLoader from  "../../components/SubsetsHierarchyLoader"

const datasetIds = "progenetix"
const subsetId = "pgx:cohort-TCGAcancers"

export default function arraymap_dataPage() {
  return (
    <Layout title="TCGA Cancer Subsets" headline="">
      <Panel>
        <SubsetLoader
          id={subsetId}
          datasetIds={datasetIds}
        />
      </Panel>
      <Panel>
        <ThisSubset />
      </Panel>
      <Panel heading="TCGA Cancer Studies">
        <SubsetsHierarchyLoader collationTypes="TCGAproject" datasetIds="progenetix" />
      </Panel>
    </Layout>
  )
}

function ThisSubset() {
  return (
    <>
    <div style={{ display: "flex" }}>
      This page represents the TCGA subset of the Progenetix
      collection, based on 22142 samples (tumor and reeferences) from The
      Cancer Genome Atlas project. The results are based upon data generated
      by the TCGA Research Network. Disease-specific subsets of TCGA data (aka. projects) can be
      accessed below.
      <img
        src={"/img/tcga.png"}
        style={{
          float: "right",
          width: "200px",
          border: "0px",
          margin: "-20px -20px 0px 0px"
        }}
      />
    </div>
    </>
    )
} 
