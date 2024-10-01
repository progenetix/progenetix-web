import React from "react"
import Link from "next/link"
import { SITE_DEFAULTS } from "../hooks/api"

export default function BeaconPlusNav() {
  return (
    <header className="section Nav__header">
      <nav
        className="BeaconPlus__container Nav__wrapper"
        role="navigation"
        aria-label="main navigation"
      >
        <Link href="/">
          <a className="Nav__logo">
            Beacon<sup className="Nav__plus">+</sup>
          </a>
        </Link>        

        <div className="Nav__links">
{/*
          <ActiveLink label="Aggregator" href="/beaconAggregator/" />
*/}
          <a href={SITE_DEFAULTS.MASTERROOTLINK} className="navbar-item">
            Progenetix
          </a>
          <a href={SITE_DEFAULTS.MASTERDOCLINK} className="navbar-item">
            Help
          </a>
        </div>
      </nav>
    </header>
  )
}
