import React from "react"
import { Layout } from "../../components/Layout"
import { SITE_DEFAULTS } from "../../hooks/api"
import SubsetsLoader from  "../../components/SubsetsLoader"
import Panel from "../../components/Panel"

export default function cellosaurus_SubsetsPage() {
  return (
    <Layout title="Subsets" headline="Cancer Cell Lines by Cellosaurus ID">
      <div className="content">
        <p>
          The cancer cell lines in <i>cancercelllines.org</i> are labeled
          by their Cellosaurus IDs as the primary identifier.
        </p>
        <p>
          Sample selection follows a hierarchical system in which samples
          matching the child terms of a selected class are included in the
          response. This means that one can retrieve all instances and daughter
          cell lines of a given cell line in a id-based search.
        </p>
      </div>
      <Panel heading="Cell Lines (with parental/derived hierarchies)" className="content">
        <SubsetsLoader collationTypes="cellosaurus" datasetIds={SITE_DEFAULTS.DATASETID} />
      </Panel>
    </Layout>
  )
}
