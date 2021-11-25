import React, { useEffect, useState } from "react"
import { Layout } from "../../components/Layout"
import { Infodot } from "../../components/Infodot"
import { PublicationFewCountTable } from "./PublicationTables"
import { useGeoCity, useProgenetixrefPublicationList, Link } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { useAsyncSelect } from "../../hooks/asyncSelect"
import CustomSelect from "../../components/Select"
import dynamic from "next/dynamic"
import { matchSorter } from "match-sorter"
import useDebounce from "../../hooks/debounce"
import Panel from "../../components/Panel"

export default function PublicationsProgenetixuseListPage() {
  const [geoCity, setGeoCity] = useState(null)
  const [geodistanceKm, setGeodistanceKm] = useState(100)
  const [searchInput, setSearchInput] = useState(null)
  const debouncedSearchInput = useDebounce(searchInput, 500)
  const imgHere = {
    float: "right",
    width: "400px",
    border: "0px",
    margin: "-90px -10px 0px 0px"
  }

  return (
    <Layout title="Publications" headline="Progenetix References">
    
      <Panel heading="Articles Citing - or Using - Progenetix" className="content">
        <div>
          <img src={"/img/progenetix-arraymap-1200x180.png"} style={imgHere} />
          This page lists articles which we found to have made use of, or referred to, the Progenetix resource ecosystem. These articles may not necessarily contain original case profiles themselves.
        </div>
        <div>
          Please <a href="mailto:contact@progenetix.org">contact us</a> to alert
          us about additional articles you are aware of.
          <br/>
          <b>New Oct 2021</b> You can now directly submit suggestions for matching
          publications to the{" "}
          <Link
            href="https://github.com/progenetix/oncopubs"
            label="oncopubs repository on Github"
          />.
        </div>

        {/*Some article filtering */}
        <div className="columns my-0">
          <div className="field column py-0 mb-3 is-one-third">
            <label className="label">
              Filter
              <Infodot infoText={"Filter publications by keyword"} />
            </label>{" "}
            <input
              className="input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="field column py-0 mb-3 is-one-third">
            <label className="label">
              City
              <Infodot
                infoText={"Filter publications by city or proximity to one"}
              />
            </label>
            <GeoCitySelector geoCity={geoCity} setGeoCity={setGeoCity} />
          </div>
          {geoCity && (
            <div className="field column py-0 mb-3 is-narrow animate__fadeIn animate__animated animate__faster">
              <label className="label">Range (km)</label>
              <input
                className="input"
                type="number"
                value={geodistanceKm}
                onChange={(e) => setGeodistanceKm(e.target.value)}
              />
            </div>
          )}
        </div>
      </Panel>
      
      {/*
        The PublicationsLoader creates her own Panel for the article table
        and then adds the map below.
      */}

      <PublicationsLoader
        geoCity={geoCity}
        geodistanceKm={geodistanceKm}
        textSearch={debouncedSearchInput?.trim() ?? ""}
      />
      
    </Layout>
  )
}

function FilteredPublication({ publications, textSearch }) {
  const filteredPublications = matchSorter(publications, textSearch, {
    keys: ["id", "authors", "title"],
    threshold: matchSorter.rankings.CONTAINS
  })
  return (
    <>
      <Panel className="content">
        <PublicationFewCountTable publications={filteredPublications} />
      </Panel>
      <PublicationsMapContainer publications={filteredPublications} />
    </>
  )
}

function PublicationsLoader({ geoCity, geodistanceKm, textSearch }) {
  const publicationsResult = useProgenetixrefPublicationList({
    geoCity,
    geodistanceKm
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

function GeoCitySelector({ setGeoCity }) {
  const { inputValue, value, onChange, onInputChange } = useAsyncSelect()
  useEffect(() => setGeoCity(value), [setGeoCity, value])
  const { data, isLoading } = useGeoCity({ city: inputValue })
  let options = []
  if (data) {
    options = data.response.results.map((g) => ({
      value: g.id,
      data: g,
      label: `${g.geoLocation.properties.city} (${g.geoLocation.properties.country})`
    }))
  }
  return (
    <CustomSelect
      options={options}
      isLoading={!!inputValue && isLoading}
      onInputChange={onInputChange}
      value={value}
      onChange={onChange}
      placeholder="Type to search..."
      isClearable
    />
  )
}

function PublicationsMapContainer({ publications }) {
  const publicationsCount = publications.length
  return (
    <>
      <div className="mb-5">
        <PublicationsMap publications={publications} height={600} />
      </div>
      <p className="content">
        Geographic distribution (by corresponding author) of the{" "}
        <b>{publicationsCount}</b> listed publications which have been found to
        cite and/or use Progenetix.
      </p>
    </>
  )
}

const PublicationsMap = dynamic(() => import("./PublicationsMap"), {
  ssr: false
})
