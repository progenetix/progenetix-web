import React from "react"
import { useRouter } from "next/router"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./beaconplus_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import ActiveLink from "../../components/ActiveLink"
import Panel from "../../components/Panel"
import Link from "next/link"
import { DOCLINK } from "../../hooks/api"

export default function BeaconPlusPage({ cytoBands }) {
  return (
    <>
      <BeaconPlusNav beaconName="" />
      <div className="section">
        <div className="BeaconPlus__container">
          <Panel className="content">
            <div>
                This forward looking Beacon interface proposes additional,
                planned features beyond the <a href="http://docs.genomebeacons.org/">current Beacon v2 specifications</a>. The Beacon<sup>+</sup> genome variation service tests experimental features and proposed extensions to the <a href="http://beacon-project.io">Beacon</a> protocol. The
                service is implemented using the <a href="https://github.com/progenetix/bycon">bycon</a> backend
                and allows access to the various datasets represented through the <a href="http://progenetix.org">Progenetix</a> cancer genomics resource.
                Further information about the Beacon project can be found through
                the <a href="http://beacon-project.io/">ELIXIR Beacon website</a>.
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

function BeaconPlusNav({ beaconName }) {
  const router = useRouter()
  return (
    <header className="section Nav__header">
      <nav
        className="BeaconPlus__container Nav__wrapper"
        role="navigation"
        aria-label="main navigation"
      >
        <Link href={router}>
          <a className="Nav__logo">
            {beaconName} Beacon<sup className="Nav__plus">+</sup>
          </a>
        </Link>        

        <div className="Nav__links">
          <ActiveLink label="Aggregator" href="/beaconAggregator/" />
          <ActiveLink label="Progenetix" href="/" />
          <a href={DOCLINK} className="navbar-item">
            Help
          </a>
        </div>
      </nav>
    </header>
  )
}
