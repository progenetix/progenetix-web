import React from "react"

export function epmcId(publicationId) {
  return publicationId.split(":")[1]
}

export function epmcUrl(publicationId) {
  return `http://www.europepmc.org/abstract/MED/${epmcId(publicationId)}`
}

export function EpmcLink({ publicationId }) {
  return (
    <a href={epmcUrl(publicationId)} rel="noreferrer" target="_BLANK">
      <img src="https://progenetix.org/p/EPMC_16.gif" />
    </a>
  )
}
