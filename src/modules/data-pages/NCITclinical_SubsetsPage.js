import React from "react"
import { Layout } from "../../components/Layout"
import SubsetsLoader from  "../../components/SubsetsLoader"

export default function NCITclinical_SubsetsPage() {
  return (
    <Layout title="Subsets" headline="Cancers by TNM and Histological Grades">
      <div className="content">
        <p>
          
        </p>
      </div>
      <SubsetsLoader collationTypes="NCITtnm" datasetIds="progenetix" />
      <SubsetsLoader collationTypes="NCITgrade" datasetIds="progenetix" />
    </Layout>
  )
}
