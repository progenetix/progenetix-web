import React, { useRef } from "react"
import L from "leaflet"
import {
  centerPopup,
  createCircle,
  getLatlngFromGeoJSON,
  useMap
} from "../../components/map"
import { groupBy } from "lodash"
import useDeepCompareEffect from "use-deep-compare-effect"
import Table from "../../components/Table"
import ReactDOM from "react-dom"

export default function PublicationsMap({ publications, height }) {
  const mapRef = useRef(null)
  useMap(mapRef)

  useDeepCompareEffect(() => {
    if (publications.length === 0) return
    const map = mapRef.current

    const byCoordinates = groupBy(
      publications,
      "provenance.geo.geojson.coordinates"
    )

    const circles = Object.entries(byCoordinates).map(([, publications]) => {
      const randomId = Math.random().toString(36).substring(2, 15)
      const geo = publications[0].provenance.geo
      const radius = 3000 + 2000 * publications.length
      const render = () =>
        // eslint-disable-next-line react/no-render-return-value
        ReactDOM.render(
          <PublicationsTable publications={publications} />,
          document.getElementById(randomId)
        )
      const latlng = getLatlngFromGeoJSON(geo)
      const circle = createCircle(latlng, radius).bindPopup(
        `
        <div>${geo.city} (${geo.country}): <b>${publications.length}</b> publications</div>
        <div id="${randomId}"></div>
        `,
        { minWidth: 400, keepInView: true }
      )
      circle.render = render
      return circle
    })

    map.on("popupopen", function (e) {
      const popup = e.target._popup
      centerPopup(map, popup)
      popup._source.render()
    })

    const layerGroup = L.featureGroup(circles).addTo(map)
    map.fitBounds(layerGroup.getBounds())
    return () => map.removeLayer(layerGroup)
  }, [publications, mapRef])

  return <div style={{ height, zIndex: 0 }} id="map" />
}

function PublicationsTable({ publications }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <a
            href={`/publications/details?id=${cellInfo.value}&filterPrecision=exact`}
          >
            {cellInfo.value}
          </a>
        )
      }
    ],
    []
  )

  return <Table columns={columns} data={publications} pageSize={8} />
}
