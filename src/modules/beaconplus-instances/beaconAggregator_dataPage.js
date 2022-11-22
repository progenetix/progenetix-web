import React from "react"
import cn from "classnames"
import { useRouter } from "next/router"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./beaconAggregator_searchParameters.yaml"
import AggregatorSearchPanel from "../../components/searchForm/AggregatorSearchPanel"
import Panel from "../../components/Panel"
import Link from "next/link"
import { DOCLINK } from "../../hooks/api"

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
            {beaconName} Beacon<sup className="Nav__plus">+</sup>
          </a>
        </Link>

        <div className="Nav__links">
          <ActiveLink label="Progenetix" href="/" />
          <a href={DOCLINK} className="navbar-item">
            Help
          </a>
        </div>
      </nav>
    </header>
  )
}

function ActiveLink({ href, label }) {
  const router = useRouter()
  const isActive = router.asPath === href
  return (
    <Link href={href}>
      <a className={cn("navbar-item", { "Nav__Link--active": isActive })}>
        {label}
      </a>
    </Link>
  )
}
