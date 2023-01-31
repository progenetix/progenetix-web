import React from "react"
import { SITE_DEFAULTS } from "../../hooks/api"
import { Layout } from "../../components/Layout"
import SubsetsLoader from  "../../components/SubsetsLoader"

export default function icdom_SubsetsPage() {
  return (
    <Layout title="Subsets" headline="ICD-O 3 Cancer Histologies">
      <div className="content">
        <p>
          The cancer samples in Progenetix are mapped to several classification
          systems. This page represents samples in a shallow hierarchy according to
          their ICD-O 3 histology codes (rewritten to an internal prefix system).
        </p>
      </div>
      <SubsetsLoader collationTypes="icdom" datasetIds={ SITE_DEFAULTS.DATASETID } />
    </Layout>
  )
}

