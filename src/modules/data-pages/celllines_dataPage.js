import React from "react"
import { Layout } from "../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./celllines_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"

export default function cellLines_dataPage({ cytoBands }) {

  return (
    <Layout title="Cancer Cell Lines" headline="Cancer Cell Lines">
{/*      <div className="notification is-warning">
        The <i>Cancer Cell Lines</i> site is under development. <b>Stay tuned!</b>
      </div>
*/}      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
        collapsed={false}
      />
    </Layout>
  )
}
