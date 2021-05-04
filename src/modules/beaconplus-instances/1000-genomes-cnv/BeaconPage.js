import React from "react"
import parametersConfig from "../../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BeaconPlusNav from "../../../components/BeaconPlusNav"
// import Nav from "./Nav"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"

export default function BeaconPlusPage({ cytoBands }) {
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


// <p>
// This forward looking Beacon is based on the 1000 Genomes CNV
// dataset from the 2020 Dragen re-processing. The service tests
// experimental features and proposed extensions to the{" "}
// <a href="http://beacon-project.io">Beacon</a> protocol. The
// service is implemented using the{" "}
// <a href="https://github.com/progenetix/bycon">bycon</a> backend
// and part of the <a href="http://progenetix.org">Progenetix</a>{" "}
// cancer genomics resource.
// </p>
