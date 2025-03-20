import React, { useState } from "react"
import { Layout } from "../site-specific/Layout"
import { Infodot } from "../components/Infodot"
import { PublicationFewCountTable } from "../components/publicationComps/PublicationTables"
import { ExternalLink }  from "../components/helpersShared/linkHelpers"
import { useProgenetixRefPublicationList } from "../hooks/api"
import { WithData } from "../components/Loader"
// import dynamic from "next/dynamic"
import { matchSorter } from "match-sorter"
import useDebounce from "../hooks/debounce"
import Panel from "../components/Panel"

export default function PublicationsProgenetixRefListPage() {
  const [searchInput, setSearchInput] = useState(null)
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const imgHere = {
    float: "right",
    width: "400px",
    border: "0px",
    margin: "-100px -10px 0px 0px"
  }

  return (
    <Layout title="Publications" headline="Progenetix References">
    
      <Panel heading="Articles Citing - or Using - Progenetix" className="content">
        <div>
          <img src={"/img/arraymap-cancercelllines-progenetix-logos-1200x240.png"} style={imgHere} />
          This page lists articles which we found to have made use of, or referred to, the Progenetix resource ecosystem. These articles may not necessarily contain original case profiles themselves.
        </div>
        <div>
          Please <a href="mailto:contact@progenetix.org">contact us</a> to alert
          us about additional articles you are aware of. Also, you can now directly
          submit suggestions for matching publications to the{" "}
          <ExternalLink
            href="https://github.com/progenetix/oncopubs"
            label="oncopubs repository on Github"
          />.
        </div>

        {/*Some article filtering */}
        <div className="columns my-0">
          <div className="field column py-0 mb-3 is-one-third">
            <label className="label">
              Filter
              <Infodot infoText={"Filter publications by keyword, pubmed or year (greedy matching...)"} />
            </label>{" "}
            <input
              className="input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </Panel>
      
      {/*
        The PublicationsLoader creates her own Panel for the article table
        and then adds the map below.
      */}

      <PublicationsLoader
        textSearch={debouncedSearchInput?.trim() ?? ""}
      />
      
    </Layout>
  )
}

function FilteredPublication({ publications, textSearch }) {
  const filteredPublications = matchSorter(publications, textSearch, {
    keys: ["id", "authors", "title", "pubYear", "pubmedid", "provenance.geoLocation.properties.city"],
    threshold: matchSorter.rankings.CONTAINS
  })
  return (
    <>
      <Panel className="content">
        <PublicationFewCountTable publications={filteredPublications} />
      </Panel>
      {/*<PublicationsMapContainer publications={filteredPublications} />*/}
    </>
  )
}

function PublicationsLoader({ textSearch }) {
  const publicationsResult = useProgenetixRefPublicationList({
    // geoCity,
    // geodistanceKm
  })

  return (
    <WithData
      apiReply={publicationsResult}
      background
      render={(data) => (
        <FilteredPublication
          publications={data.response.results}
          textSearch={textSearch}
        />
      )}
    />
  )
}

// function PublicationsMapContainer({ publications }) {
//   const publicationsCount = publications.length
//   return (
//     <>
//       <div className="mb-5">
//         <PublicationsMap publications={publications} height={600} />
//       </div>
//       <p className="content">
//         Geographic distribution (by corresponding author) of the{" "}
//         <b>{publicationsCount}</b> listed publications which have been found to
//         cite and/or use Progenetix.
//       </p>
//     </>
//   )
// }

// const PublicationsMap = dynamic(() => import("../components/publicationComps/PublicationsMap"), {
//   ssr: false
// })

