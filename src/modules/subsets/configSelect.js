import React, { useMemo } from "react"

const makeEntries = (config, queryValue) => {
  let configEntries = Object.entries(config)
  if (queryValue && !configEntries.find(([c]) => c === queryValue)) {
    configEntries = [[queryValue, { label: queryValue }], ...configEntries]
  }
  return configEntries
}

export function useConfigSelect(config, key, urlQuery, setUrlQuery) {
  const queryValue = urlQuery[key]
  const configEntries = useMemo(() => makeEntries(config, queryValue), [
    config,
    queryValue
  ])
  const selected =
    configEntries.find(([c]) => c === queryValue)?.[0] ?? configEntries[0][0]
  const setSelected = (newValue) =>
    setUrlQuery({ [key]: newValue }, { keepExisting: true })
  const options = configEntries.map(([k, v]) => (
    <option key={k} value={k}>
      {v.label}
    </option>
  ))
  return {
    selected,
    setSelected,
    options
  }
}
