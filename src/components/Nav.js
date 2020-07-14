import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import cn from "classnames"

export default function Nav() {
  return (
    <header className="section Nav__header">
      <nav
        className="container Nav__wrapper"
        role="navigation"
        aria-label="main navigation"
      >
        <span className="Nav__logo">
          Beacon <sup className="Nav__plus">+</sup>
        </span>
        <div className="Nav__links">
          <ActiveLink label="Home" href="/" />
          <ActiveLink label="About" href="/about" />
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
