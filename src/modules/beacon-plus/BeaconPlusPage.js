import React from "react"
import parametersConfig from "../../../config/samples-search/parameters.yaml"
import requestTypesConfig from "../../../config/samples-search/beacon-plus_requestTypes.yaml"
import Nav from "./Nav"
import BiosamplesSearchPanel from "../../components/biosamples/BiosamplesSearchPanel"

export default function BeaconPlusPage({ datasets }) {
  return (
    <>
      <Nav />
      <div className="section">
        <div className="BeaconPlus__container">
          <BiosamplesSearchPanel
            datasets={datasets}
            parametersConfig={parametersConfig}
            requestTypesConfig={requestTypesConfig}
          />
        </div>
      </div>
    </>
  )
}
