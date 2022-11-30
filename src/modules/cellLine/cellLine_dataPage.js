import React from "react"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./cellLine_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import Panel from "../../components/Panel"

export default function cellLinePage({ cytoBands }) {
  return (
    <>
      <div className="section">
        <div className="BeaconPlus__container">
          <Panel className="content">
            <div>
                Cell Lines
            </div>
          </Panel>
          <BiosamplesSearchPanel
            cytoBands={cytoBands}
            parametersConfig={parametersConfig}
            requestTypesConfig={requestTypesConfig}
            collapsed={false}
          />
        </div>
      </div>
    </>
  )
}
