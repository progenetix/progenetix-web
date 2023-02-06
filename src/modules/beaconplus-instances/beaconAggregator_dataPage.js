import React from "react"
import { useRouter } from "next/router"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./beaconAggregator_searchParameters.yaml"
import AggregatorSearchPanel from "../../components/searchForm/AggregatorSearchPanel"
import ActiveLink from "../../components/ActiveLink"
import Panel from "../../components/Panel"
import Link from "next/link"
import { SITE_DEFAULTS } from "../../hooks/api"

export default function BeaconAggregatorPage({ cytoBands }) {
  return (
    <>
      <BeaconPlusNav beaconName="" />
      <div className="section">
        <div className="BeaconPlus__container">
          <Panel className="content">
            <div>
                This page provides an entry point to prototype a Beacon
                aggregator - <b>strictly for development purposes</b>.
            </div>
          </Panel>  
          <AggregatorSearchPanel
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
            { beaconName } Beacon<sup className="Nav__plus">+</sup>Aggregator
          </a>
        </Link>

        <div className="Nav__links">
          <ActiveLink label="BeaconPlus" href="/beaconPlus/" />
          <ActiveLink label="Progenetix" href="/" />
          <a href={SITE_DEFAULTS.MASTERDOCLINK} className="navbar-item">
            Help
          </a>
        </div>
      </nav>
    </header>
  )
}
