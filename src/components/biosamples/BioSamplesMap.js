import React, { useRef } from "react"
import ReactDOM from "react-dom"
import L from "leaflet"
import { centerPopup, createCircle, getLatlngFromGeoJSON, useMap } from "../map"
import { groupBy } from "lodash"
import useDeepCompareEffect from "use-deep-compare-effect"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"

export default function BiosamplesMap({ dataEffectResult, datasetId }) {
  return (
    <WithData
      dataEffectResult={dataEffectResult}
      render={(data) => (
        <Map biosamples={data} height={640} datasetId={datasetId} />
      )}
    />
  )
}

BiosamplesMap.propTypes = {
  dataEffectResult: PropTypes.object.isRequired,
  datasetId: PropTypes.string.isRequired
}

function Map({ biosamples, height, datasetId }) {
  const mapRef = useRef(null)
  useMap(mapRef)

  useDeepCompareEffect(() => {
    if (biosamples.length === 0) return
    const map = mapRef.current

    const byCoordinates = groupBy(
      biosamples,
      "provenance.geo.geojson.coordinates"
    )

    const circles = Object.entries(byCoordinates).map(([, biosamples]) => {
      const randomId = Math.random().toString(36).substring(2, 15)
      const geo = biosamples[0].provenance.geo
      const radius = 3000 + 2000 * biosamples.length
      const render = () =>
        // eslint-disable-next-line react/no-render-return-value
        ReactDOM.render(
          <BiosamplesTable biosamples={biosamples} datasetId={datasetId} />,
          document.getElementById(randomId)
        )
      const latlng = getLatlngFromGeoJSON(geo)
      const circle = createCircle(latlng, radius).bindPopup(
        `
        <div class="mb-4">${geo.city} (${geo.country}): <b>${biosamples.length}</b> biosamples</div>
        <div id="${randomId}"></div>
        `,
        { minWidth: 400 }
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
  }, [biosamples, mapRef])

  return <div style={{ height, zIndex: 0 }} id="map" />
}

function BiosamplesTable({ biosamples, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <a
            href={`/samples/details?id=${cellInfo.value}&datasetIds=${datasetId}`}
          >
            {cellInfo.value}
          </a>
        )
      },
      {
        accessor: "description"
      }
    ],
    [datasetId]
  )

  return <Table columns={columns} data={biosamples} pageSize={10} />
}
