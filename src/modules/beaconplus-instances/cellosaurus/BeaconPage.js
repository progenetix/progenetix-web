import React from "react"
import parametersConfig from "../../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BeaconPlusNav from "../../../components/BeaconPlusNav"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"
import Panel from "../../../components/Panel"

export default function BeaconPlusPage({ cytoBands }) {
  return (
    <>
      <BeaconPlusNav beaconName="Cell Line" />
      <div className="section">
        <div className="BeaconPlus__container">
          <Panel heading="Germline CNVs from the 1000 Genomes Project" className="content">
          This Beacon allows to query CNVs from the 1000 Genomes project.      
          </Panel>
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
