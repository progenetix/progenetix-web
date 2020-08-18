import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import cn from "classnames"

export default function Nav() {
  return (
    <header className="section Nav__header">
      <nav
        className="BeaconPlus__container Nav__wrapper"
        role="navigation"
        aria-label="main navigation"
      >
        <Link href="/beacon-plus/search">
          <a className="Nav__logo">
            Beacon <sup className="Nav__plus">+</sup>
          </a>
        </Link>
        <div className="Nav__links">
          <ActiveLink label="About" href="/beacon-plus/about" />
          <a
            href="https://info.progenetix.org/categories/howto.html"
            className="navbar-item"
          >
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
