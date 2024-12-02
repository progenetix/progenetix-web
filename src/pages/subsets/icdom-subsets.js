import React from "react"
import { Layout } from "../../site-specific/Layout"
import SubsetsHierarchyLoader from  "../../components/SubsetsHierarchyLoader"

export default function Page() {
  return (
    <Layout title="Subsets" headline="ICD-O 3 Cancer Histologies">
      <div className="content">
        <p>
          The cancer samples in Progenetix are mapped to several classification
          systems. This page represents samples in a shallow hierarchy according to
          their ICD-O 3 histology codes (rewritten to an internal prefix system).
        </p>
      </div>
      <SubsetsHierarchyLoader collationTypes="icdom" datasetIds="progenetix" />
    </Layout>
  )
}

