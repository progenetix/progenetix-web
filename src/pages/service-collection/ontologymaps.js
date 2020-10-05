import React from "react"
import { Layout } from "../../components/layouts/Layout"
import { basePath, useExtendedSWR } from "../../hooks/api"
import { useAsyncSelect } from "../../hooks/asyncSelect"
import CustomSelect from "../../components/Select"

export default function Ontologymaps() {
  const { inputValue, onInputChange, value, onChange } = useAsyncSelect()
  const values = (value && value.map((option) => option.value)) ?? []

  let filters
  if (values.length === 0) {
    filters = inputValue
  } else {
    filters = values.join(",")
  }

  const { data, isLoading, error } = useOntologymaps({ filters })

  const options = getOptions(data)

  return (
    <Layout title="Ontologymaps" headline="Ontologymaps">
      <div>
        {error && (
          <div className="notification is-warning">Could not load data...</div>
        )}
        <CustomSelect
          className="mb-6"
          options={options}
          isLoading={!!inputValue && isLoading}
          onInputChange={onInputChange}
          value={value}
          onChange={onChange}
          placeholder="Ex: icdom-81403..."
          isMulti
          isClearable
        />
        {data && data.code_groups && (
          <CodeGroups codeGroups={data && data.code_groups} />
        )}
      </div>
    </Layout>
  )
}

function getOptions(data) {
  if (!data || data.unique_codes == null) return []
  const NCIT = data.unique_codes["NCIT"] ?? []
  const icdom = data.unique_codes["icdom"] ?? []
  const icdot = data.unique_codes["icdot"] ?? []
  return [NCIT, icdom, icdot].flat().map((c) => ({
    label: c,
    value: c
  }))
}

function CodeGroups({ codeGroups }) {
  return (
    <div className="content">
      <h5>Code groups</h5>
      {codeGroups.map((codeGroup, i) => (
        <ul key={i}>
          {codeGroup.map((code) => (
            <li key={code.id}>
              {code.id}: {code.label}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

function useOntologymaps({ filters }) {
  const url =
    filters &&
    `${basePath}services/ontologymaps/?filters=${filters}&responseFormat=simplelist`
  return useExtendedSWR(url)
}
