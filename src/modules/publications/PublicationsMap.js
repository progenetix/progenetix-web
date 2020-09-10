import React, { useEffect } from "react"
import L from "leaflet"
import { cleanup, getOSMTiles } from "../../components/map"
import { groupBy } from "lodash"

export default function PublicationsMap({ publications, height }) {
  useEffect(() => {
    const tiles = getOSMTiles()
    const center = L.latLng(10.0, 35.0)
    const map = L.map("publications-map", {
      center: center,
      zoom: 2,
      layers: [tiles]
    })

    const byCoordinates = groupBy(
      publications,
      "provenance.geo.geojson.coordinates"
    )

    Object.entries(byCoordinates).forEach(([, publications]) => {
      const geo = publications[0].provenance.geo
      const radius = 3000 + 2000 * publications.length
      L.circle(
        L.latLng(geo.geojson.coordinates[1], geo.geojson.coordinates[0]),
        {
          stroke: true,
          color: "#dd6633",
          weight: 1,
          fillColor: "#cc9966",
          fillOpacity: 0.4,
          radius: radius
        }
      )
        .bindPopup(
          `
        <div>${geo.city} (${geo.country})</div>
        <div><b>${publications.length}</b> publications</div>
        `
        )
        .addTo(map)
    })

    return () => cleanup(map)
  }, [publications])

  return <div style={{ height }} id="publications-map" />
}
