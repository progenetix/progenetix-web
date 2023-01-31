import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { ErrorBoundary } from "react-error-boundary"
import Head from "next/head"
import {ErrorFallback, MenuInternalLinkItem} from "./MenuHelpers"
import {
  SITE_DEFAULTS,
  THISYEAR
} from "../hooks/api"

export function Layout({ title, headline, children }) {
  const [sideOpen, setSideOpen] = useState(false)
  return (
    <div className="Layout__app">
      <Head>
        <title>{title || ""}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="Layout__header__celllines">
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
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
              }}
            >
              {children}
            </ErrorBoundary>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="content container has-text-centered">
          © 2023 - {THISYEAR} Progenetix Cancer Genomics Information Resource by
          the{" "}
          <a href="https://info.baudisgroup.org">
            Computational Oncogenomics Group
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
          src="/img/progenetix_cellosaurus.png"
          alt="progenetix celllines"
        />
      </a>
      <ul className="Layout__side__items">
        <MenuInternalLinkItem
          href="/"
          label={
            <>
              Cancer Cell Lines<sup style={{ color: "red" }}>o</sup> Home
            </>
          }
        />
        <MenuInternalLinkItem
          href="/search"
          label="Search Cell Lines"
        />
        <MenuInternalLinkItem
          href="/subsets/cellosaurus-subsets"
          label="Cell Line Listing"
        />
        <MenuInternalLinkItem
          href="/subsets/NCIT-subsets"
          label="CNV Profiles by Cancer Type"
        />
        <MenuInternalLinkItem href={SITE_DEFAULTS.PROJECTDOCLINK} label="Documentation" />
        <MenuInternalLinkItem
          href={SITE_DEFAULTS.NEWSLINK}
          label="News"
          isSub="isSub"
        />
        <MenuInternalLinkItem href={SITE_DEFAULTS.MASTERROOTLINK} label="Progenetix" />
        <MenuInternalLinkItem
          href={SITE_DEFAULTS.MASTERROOTLINK}
          label="Progenetix Data"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href={`${SITE_DEFAULTS.MASTERDOCLINK}`}
          label="Progenetix Documentation"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href={`${SITE_DEFAULTS.MASTERROOTLINK}/publications`}
          label="Publication DB"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="https://info.baudisgroup.org/"
          label="Baudisgroup @ UZH"
        />
      </ul>
    </div>
  )
}

