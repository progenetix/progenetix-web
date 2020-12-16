import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"

export function Layout({ title, headline, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  return (
    <div className="Layout__app">
      <img src="/img/pgx-logo.png" className="Layout__logo_topright icon" />
      <Head>
        <title>{title || ""}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
            {headline && <h1 className="title is-4">{headline}</h1>}
            {children}
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="content container has-text-centered">
          © 2000 - 2020 Progenetix Cancer Genomics Information Resource by the
          group of{" "}
          <a href="https://info.baudisgroup.org/group/Michael_Baudis/">
            Michael Baudis
          </a>{" "}
          at the{" "}
          <a href="https://www.mls.uzh.ch/en/research/baudis/">
            University of Zurich
          </a>{" "}
          and the{" "}
          <a href="http://sib.swiss/baudis-michael/">
            Swiss Institute of Bioinformatics{" "}
            <span className="span-red">SIB</span>
          </a>{" "}
          is licensed under CC BY 4.0
          <a rel="license" href="https://creativecommons.org/licenses/by/4.0">
            <img className="Layout__cc__icons" src="/img/cc-cc.svg" />
            <img className="Layout__cc__icons" src="/img/cc-by.svg" />
          </a>
          <br />
          No responsibility is taken for the correctness of the data presented
          nor the results achieved with the Progenetix tools.
        </div>
      </footer>
    </div>
  )
}

function Side({ onClick }) {
  return (
    <div onClick={onClick}>
      <a href="/">
        <img
          className="Layout__side-logo"
          src="/img/progenetix-logo-black.png"
          alt="progenetix"
        />
      </a>
      <ul className="Layout__side__items">
        <MenuInternalLinkItem href="/about" label="About Progenetix" />
        <MenuInternalLinkItem
          href="/subsets/biosubsets"
          label="Cancer CNV Profiles"
        />
        <MenuInternalLinkItem
          href="/biosamples/search"
          label="Search Samples"
        />
        <MenuInternalLinkItem
          href="/subsets/cohorts"
          label="Studies & Cohorts"
        />
        <MenuInternalLinkItem
          href="/publications.html"
          label="Publication DB"
        />
        <MenuInternalLinkItem
          href="/service-collection/ontologymaps"
          label="Services"
        />
        <MenuInternalLinkItem
          href="/service-collection/ontologymaps"
          label="NCIt Mappings"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/service-collection/uberonmaps"
          label="UBERON Mappings"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/service-collection/uploader"
          label="Upload & Plot"
        />
        <li>
          <MenuLink href="https://info.progenetix.org/">
            Documentation{" "}
          </MenuLink>
        </li>
        <MenuInternalLinkItem
          href="/beacon-plus/search"
          label={
            <>
              Beacon<sup style={{ color: "red" }}>+</sup>
            </>
          }
        />
        <li>
          <MenuLink href="https://info.baudisgroup.org/">
            Baudisgroup @ UZH{" "}
          </MenuLink>
        </li>
      </ul>
    </div>
  )
}

function MenuInternalLinkItem({ href, label, isSub }) {
  const router = useRouter()
  const isActive = removeQuery(href) === removeQuery(router.asPath)
  return (
    <li>
      <MenuLink isSub={isSub} isActive={isActive} href={href}>
        {label}
      </MenuLink>
    </li>
  )
}

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
// eslint-disable-next-line react/display-name
const MenuLink = React.forwardRef(
  ({ onClick, href, isActive, children, isSub }, ref) => {
    const className = isSub ? "Layout__side__sub" : "Layout__side__category"
    return (
      <Link href={href}>
        <a
          onClick={onClick}
          ref={ref}
          className={cn(
            { "is-active": isActive },
            "Layout__side__item",
            className
          )}
        >
          {children}
        </a>
      </Link>
    )
  }
)

function removeQuery(href) {
  if (href.indexOf("?") > 0) return href.slice(0, href.indexOf("?"))
  else return href
}
