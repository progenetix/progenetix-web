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
          <Panel
            heading="Germline CNVs from the 1000 Genomes Project"
            className="content"
          >
            <p>
              This forward looking Cellosaurus Cell Line Beacon service tests
              experimental features and proposed extensions to the{" "}
              <a href="http://beacon-project.io">Beacon</a> protocol. The
              service is implemented using the{" "}
              <a href="https://github.com/progenetix/bycon">bycon</a> backend
              and part of the <a href="http://progenetix.org">Progenetix</a>{" "}
              cancer genomics resource.
            </p>
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
