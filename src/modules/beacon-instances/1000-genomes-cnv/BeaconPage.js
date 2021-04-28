import React from "react"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BeaconPlusNav from "../../../components/BeaconPlusNav"
// import Nav from "./Nav"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"

export default function ThousandGenomesPage({ cytoBands }) {
  return (
    <>
      <BeaconPlusNav beaconName="1kG CNV" />
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

const datasets = [{ label: "1000genomesDRAGEN", value: "1000genomesDRAGEN" }]
