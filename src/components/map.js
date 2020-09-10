import L from "leaflet"

export const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png"
})

export function getOSMTiles() {
  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
}

export const CustomMarker = L.Marker.extend({
  options: {
    icon: markerIcon
  }
})

export function cleanup(map) {
  if (map && map.remove) {
    map.off()
    map.remove()
  }
}
