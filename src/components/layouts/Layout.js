import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"

export function Layout({ title, headline, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  return (
    <div className="Layout__app">
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
          © 2000 - 2020 Progenetix Cancer Genomics Information Resource by <a href="https://info.baudisgroup.org/group/Michael_Baudis/">Michael Baudis</a>
          is licensed under CC BY 4.0<a rel="license" href="https://creativecommons.org/licenses/by/4.0">
          <img className="Image__cc__icons" src="/cc-cc.svg" />
          <img className="Image__cc__icons" src="/cc-by.svg" />
          </a><br/>

          No responsibility is taken for the correctness of the data presented
          nor the  results achieved with the Progenetix tools.
        </div>
      </footer>
    </div>
  )
}

function Side({ onClick }) {
  return (
    <div onClick={onClick}>
      <Link href="/">
        <img
          className="Layout__side-logo"
          src="/progenetix_black_300.png"
          alt="progenetix"
        />
      </Link>
      <ul className="Layout__side__items">
        <MenuInternalLinkItem href="/publications/list" label="Publications" />
        <MenuInternalLinkItem href="/samples/search" label="Search Samples" />
        <MenuInternalLinkItem href="/subsets/list" label="Biosubsets" />
        <li>
          <MenuLink href="https://info.progenetix.org/">Info </MenuLink>
        </li>
        <MenuInternalLinkItem
          href="/beacon-plus"
          label={
            <>
              Beacon<sup style={{ color: "red" }}>+</sup>
            </>
          }
        />
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
  if (href.indexOf("?") > 0) return href.slice(0, href.indexOf("?"))
  else return href
}
