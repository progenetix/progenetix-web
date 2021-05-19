import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import cn from "classnames"
import { DOCLINK } from "../hooks/api"

export default function BeaconPlusNav({ beaconName }) {
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
          <ActiveLink label="Beacon+" href="/beaconplus-instances/beaconplus" />
          <ActiveLink
            label="Gene Beacon"
            href="/beaconplus-instances/genesymbols"
          />
          <ActiveLink
            label="1000 Genomes CNVs"
            href="/beaconplus-instances/1000-genomes-cnv"
          />
          <ActiveLink
            label="Cell Line Beacon"
            href="/beaconplus-instances/cellosaurus"
          />
          <ActiveLink label="About" href="/beaconplus-instances/about" />
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

// <Link href="/1000-genomes-cnv/search">
// <a className="Nav__logo">
//   1000 Genomes Beacon <sup className="Nav__plus">+</sup>
// </a>
// </Link>
