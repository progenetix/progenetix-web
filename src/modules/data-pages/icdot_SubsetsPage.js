import React from "react"
import { Layout } from "../../components/Layout"
import SubsetsLoader from  "../../components/SubsetsLoader"

export default function icdom_SubsetsPage() {
  return (
    <Layout title="Subsets" headline="ICD-O 3 Cancer Locations">
      <div className="content">
        <p>
          The cancer samples in Progenetix are mapped to several classification
          systems. This page represents samples in a shallow hierarchy according to
          their ICD-O 3 topography codes (rewritten to an internal prefix system).
        </p>
      </div>
      <SubsetsLoader collationTypes="icdot" datasetIds="progenetix" />
    </Layout>
  )
}

