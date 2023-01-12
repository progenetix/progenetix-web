import React, { useState } from "react"
import cn from "classnames"
import { FaBars, FaTimes } from "react-icons/fa"
import { ErrorBoundary } from "react-error-boundary"
import Head from "next/head"
import {ErrorFallback, MenuInternalLinkItem} from "./MenuHelpers"
import {
  SERVICEINFOLINK,
  DOCLINK,
  GROUPSITELINK,
  PROGENETIXINFO,
  USECASESLINK,
  NEWSLINK,
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
          © 2000 - {THISYEAR} Progenetix Cancer Genomics Information Resource by
          the{" "}
          <a href={PROGENETIXINFO}>
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
          src="/img/progenetix-logo-black.png"
          alt="progenetix"
        />
      </a>
      <ul className="Layout__side__items">
        <MenuInternalLinkItem
          href="/subsets/NCIT-subsets"
          label="Cancer CNV Profiles"
        />
        <MenuInternalLinkItem
          href="/subsets/icdom-subsets"
          label="ICD-O Morphologies"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/subsets/icdot-subsets"
          label="ICD-O Organ Sites"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/subsets/NCITclinical-subsets"
          label="Clinical Categories"
          isSub="isSub"
        />
        <MenuInternalLinkItem href="/search/" label="Search Samples" />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/arraymap"
          label="Data Cohorts"
        />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/arraymap"
          label="arrayMap"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/TCGA"
          label="TCGA Samples"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/oneKgenomes"
          label="1000 Genomes Reference Samples"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/DIPG"
          label="DIPG Samples"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/subsets/cbioportal-subsets"
          label="cBioPortal Studies"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/progenetix-cohorts/gao-2021-signatures"
          label="Gao & Baudis, 2021"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="http://cancercelllines.org"
          label={
            <>
              Cances Cell Lines<sup style={{ color: "red" }}>o</sup>
            </>
          }
        />
        <MenuInternalLinkItem href="/publications" label="Publication DB" />
        <MenuInternalLinkItem
          href="/publications"
          label="Genome Profiling"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href="/publicationsProgenetixRef"
          label="Progenetix Use"
          isSub="isSub"
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
        <MenuInternalLinkItem
          href="/beaconPlus/"
          label={
            <>
              Beacon<sup style={{ color: "red" }}>+</sup>
            </>
          }
        />
        <MenuInternalLinkItem href={DOCLINK} label="Documentation" />
        <MenuInternalLinkItem
          href={NEWSLINK}
          label="News"
          isSub="isSub"
        />
        <MenuInternalLinkItem
          href={USECASESLINK}
          label="Downloads & Use Cases"
          isSub="isSub"
        />

        <MenuInternalLinkItem
          href={SERVICEINFOLINK}
          label="Sevices & API"
          isSub="isSub"
        />

        <MenuInternalLinkItem
          href={GROUPSITELINK}
          label="Baudisgroup @ UZH"
        />
      </ul>
    </div>
  )
}
