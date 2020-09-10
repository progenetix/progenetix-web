import React, { useEffect, useRef } from "react"
import L from "leaflet"
import { cleanup, getOSMTiles } from "../../components/map"
import { groupBy } from "lodash"
import useDeepCompareEffect from "use-deep-compare-effect"

export default function PublicationsMap({ publications, height }) {
  const mapRef = useRef(null)
  useEffect(() => {
    console.log("CREATE MAP")
    const tiles = getOSMTiles()
    const center = L.latLng(10.0, 35.0)
    const map = L.map("publications-map", {
      center: center,
      zoom: 2,
      layers: [tiles]
    })

    mapRef.current = map
    return () => cleanup(map)
  }, [])

  useDeepCompareEffect(() => {
    console.log("ADD CIRCLES")

    const byCoordinates = groupBy(
      publications,
      "provenance.geo.geojson.coordinates"
    )

    const circles = Object.entries(byCoordinates).map(([, publications]) => {
      const geo = publications[0].provenance.geo
      const radius = 3000 + 2000 * publications.length
      return L.circle(
        L.latLng(geo.geojson.coordinates[1], geo.geojson.coordinates[0]),
        {
          stroke: true,
          color: "#dd6633",
          weight: 1,
          fillColor: "#cc9966",
          fillOpacity: 0.4,
          radius: radius
        }
      ).bindPopup(
        `
        <div>${geo.city} (${geo.country})</div>
        <div><b>${publications.length}</b> publications</div>
        `
      )
    })

    const layerGroup = L.layerGroup(circles).addTo(mapRef.current)

    return () => mapRef.current.removeLayer(layerGroup)
  }, [publications])

  return <div style={{ height, zIndex: 0 }} id="publications-map" />
}
