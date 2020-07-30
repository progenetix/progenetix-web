import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"

export function Layout({ title, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  return (
    <div className="Layout__app">
      <div className="Layout__header">
        {!sideOpen ? (
          <span
            className="Layout__burger icon"
            onClick={() => setSideOpen(true)}
          >
            <FaBars className="icon" />
          </span>
        ) : (
          <span
            className="Layout__burger icon"
            onClick={() => setSideOpen(false)}
          >
            <FaTimes className="icon" />
          </span>
        )}
      </div>
      <main className="Layout__main">
        <div className="Layout__side-background" />
        <div className="Layout__duo container">
          <aside className={cn("Layout__side", { open: sideOpen })}>
            <Side onClick={() => setSideOpen(false)} />
          </aside>
          <div className="Layout__lead">
            <h1 className="title is-2">{title}</h1>
            {children}
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="content container">
          <p>©2000 - 2020 Michael Baudis</p>
        </div>
      </footer>
    </div>
  )
}

function Side({ onClick }) {
  return (
    <div onClick={onClick}>
      <img
        className="Layout__side-logo"
        src="/progenetix_black_300.png"
        alt="progenetix"
      />
      <ul className="Layout__side__items">
        <li>
          <ActiveLink
            href="/publications?&amp;filters=genomes:>0"
            label="Publications"
          />
        </li>
        <li>
          <a href="https://info.progenetix.org/">Info</a>
        </li>
        <li>
          <ActiveLink label="About" href="/about" />
        </li>
        <li>
          <a href="/">
            Beacon<sup style={{ color: "#F14668" }}>+</sup>
          </a>
        </li>
        <li>
          <ActiveLink
            href="/cgi-bin/pgx_biosamples.cgi?project=progenetix&amp;datasetIds=progenetix&amp;genome=GRCh38"
            label="Search Samples"
          />
        </li>
      </ul>
    </div>
  )
}

function ActiveLink({ href, label }) {
  const router = useRouter()
  const isActive = href.startsWith(router.asPath)
  return (
    <Link href={href}>
      <a className={cn({ "is-active": isActive })}>{label}</a>
    </Link>
  )
}
