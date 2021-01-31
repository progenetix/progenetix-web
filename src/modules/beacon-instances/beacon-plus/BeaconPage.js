import React from "react"
import parametersConfig from "../../../../config/samples-search/parameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import Nav from "./Nav"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"

export default function BeaconPlusPage({ datasets, cytoBands }) {
  return (
    <>
      <Nav />
      <div className="section">
        <div className="BeaconPlus__container">
          <BiosamplesSearchPanel
            cytoBands={cytoBands}
            datasets={datasets}
            parametersConfig={parametersConfig}
            requestTypesConfig={requestTypesConfig}
          />
        </div>
      </div>
    </>
  )
}
