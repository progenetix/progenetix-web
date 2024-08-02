import React from "react"
import { Layout } from "../../components/Layout"
import Panel from "../../components/Panel"
import SubsetsHierarchyLoader from  "../../components/SubsetsHierarchyLoader"

export default function cbioportal_SubsetsPage() {
  return (
    <Layout title="Subsets" headline="cBioPortal Studies">
      <div className="content">
        <p>
          This page represents samples from different cancer studies derived from cBioPortal.
        </p>
      </div>
      <Panel heading="cBioPortal Studies">
        <SubsetsHierarchyLoader collationTypes="cbioportal" datasetIds="progenetix" />
      </Panel>
    </Layout>
  )
}

