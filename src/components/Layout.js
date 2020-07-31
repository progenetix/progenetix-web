import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"
import { BeaconPlusTitle } from "../pages/beacon-plus"
import Head from "next/head"

export function Layout({ title = "", children, renderTitle = true }) {
  const [sideOpen, setSideOpen] = useState(false)
  return (
    <div className="Layout__app">
      <Head>
        <title>{title}</title>
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
            {renderTitle && <h1 className="title is-4">{title}</h1>}
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
        <MenuInternalLinkItem
          href="/publications?&amp;filters=genomes:>0"
          label="Publications"
        />
        <li>
          <MenuLink href="https://info.progenetix.org/">Info </MenuLink>
        </li>
        <MenuInternalLinkItem href="/beacon-plus" label={<BeaconPlusTitle />} />
        <ul>
          <MenuInternalLinkItem href="/beacon-plus/about" label="About" isSub />
        </ul>
        <li>
          <MenuLink href="https://info.progenetix.org/cgi-bin/pgx_biosamples.cgi?project=progenetix&amp;datasetIds=progenetix&amp;genome=GRCh38">
            Search Samples
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
      <Link href={href} passHref>
        <MenuLink isSub={isSub} isActive={isActive}>
          {label}
        </MenuLink>
      </Link>
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
      <a
        href={href}
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
    )
  }
)

function removeQuery(href) {
  return href.slice(0, href.indexOf("?"))
}
