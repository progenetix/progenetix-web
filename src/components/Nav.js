import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import styles from "./Nav.module.scss"

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        role="navigation"
        aria-label="main navigation"
      >
        <span className={styles.logo}>
          Beacon <span className={styles.plus}>+</span>
        </span>
        <div className={styles.links}>
          <ActiveLink label="Home" href="/" />
          <ActiveLink label="About" href="/about" />
          <ActiveLink label="Help" href="https://info.progenetix.org/categories/howto.html" />
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
      <a className={`${styles.link} ${isActive && styles.active}`}>{label}</a>
    </Link>
  )
}
