import React from "react"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BeaconPlusNav from "../../../components/BeaconPlusNav"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"

export default function ThousandGenomesPage({ cytoBands }) {
  return (
    <>
      <BeaconPlusNav beaconName="Cell Line" />
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

const datasets = [{ label: "Cellosaurus Cell Lines", value: "cellosaurus" }]
