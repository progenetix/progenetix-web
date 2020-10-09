import React, { useEffect, useState } from "react"
import { Layout } from "../../components/layouts/Layout"
import {
  ontologymapsUrl,
  useCollations,
  useExtendedSWR
} from "../../hooks/api"
import CustomSelect from "../../components/Select"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import Link from "next/link"

const Ontologymaps = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const allOntologiesOptions = useAllOntologiesOptions()

  const [firstSelection, setFirstSelection] = useState(urlQuery.firstSelection)
  const handleFirstSelectionChange = (firstSelection) => {
    setUrlQuery({
      ...(firstSelection ? { firstSelection } : null)
    })
    setSecondSelection(null)
    setFirstSelection(firstSelection)
  }
  useEffect(() => {
    setFirstSelection(urlQuery.firstSelection)
  }, [urlQuery.firstSelection])

  const [secondSelection, setSecondSelection] = useState(
    urlQuery.secondSelection
  )
  const handleSecondSelectionChange = (secondSelection) => {
    setUrlQuery({
      ...(urlQuery.firstSelection
        ? { firstSelection: urlQuery.firstSelection }
        : null),
      ...(secondSelection ? { secondSelection } : null)
    })
    setSecondSelection(secondSelection)
  }
  useEffect(() => {
    setSecondSelection(urlQuery.secondSelection)
  }, [urlQuery.secondSelection])

  // compute second selection options
  const {
    isLoading: secondSelectionLoading,
    error: secondSelectionError,
    options: secondSelectionOptions
  } = useGetFilteredOptions({
    filters: firstSelection,
    remove: firstSelection
  })

  // compute result
  const selections = [firstSelection, secondSelection].filter((s) => !!s)
  let filters
  if (selections.length === 0) {
    filters = selections
  } else {
    filters = selections.join(",")
  }
  const {
    data: resultsData,
    isLoading: resultsLoading,
    error: resultsError
  } = useOntologymaps({ filters })

  return (
    <Layout title="Ontologymaps" headline="Ontologymaps">
      <div className="mb-6">
        <CustomSelect
          className="mb-5"
          options={allOntologiesOptions}
          value={
            allOntologiesOptions.find((o) => o.value === firstSelection) ?? null
          }
          onChange={(option) => handleFirstSelectionChange(option?.value)}
          isClearable
          placeholder="First selection"
        />
        {firstSelection && (
          <Loader
            isLoading={secondSelectionLoading}
            hasError={secondSelectionError}
          >
            {secondSelectionOptions && secondSelectionOptions.length ? (
              <CustomSelect
                className="mb-6"
                options={secondSelectionOptions}
                value={
                  secondSelectionOptions.find(
                    (o) => o.value === secondSelection
                  ) ?? null
                }
                onChange={(option) =>
                  handleSecondSelectionChange(option?.value)
                }
                isClearable
                placeholder="Second selection"
              />
            ) : (
              <div className="notification">
                No groups found for the first selection.
              </div>
            )}
          </Loader>
        )}
        {firstSelection && (
          <Loader isLoading={resultsLoading} hasError={resultsError}>
            {resultsData?.data.code_groups?.length > 0 ? (
              <CodeGroups
                codeGroups={resultsData?.data.code_groups}
                ontomapsUrl={ ontologymapsUrl( filters ) }
              />
            ) : (
              <div className="notification">No groups found.</div>
            )}
          </Loader>
        )}
      </div>
    </Layout>
  )
})

export default Ontologymaps

function getOptions(data) {
  if (!data || data.data.unique_codes == null) return []
  const NCIT = data.data.unique_codes["NCIT"] ?? []
  const icdom = data.data.unique_codes["icdom"] ?? []
  const icdot = data.data.unique_codes["icdot"] ?? []
  return [NCIT, icdom, icdot].flat().map((c) => ({
    label: c.label,
    value: c.id
  }))
}

function CodeGroups({ codeGroups, ontomapsUrl }) {
  return (
    <div className="content">
      <h5>Selected codes <Link href={ontomapsUrl}><a>JSON</a></Link></h5>
      <table className="table is-bordered">
        {codeGroups.map((codeGroup, i) => (
          <tr key={i}>
            {codeGroup.map((code) => (
              <td key={code.id}>
                {code.id}: {code.label}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  )
}

function useAllOntologiesOptions() {
  const { data } = useCollations({
    filters: "",
    method: "counts",
    datasetIds: "progenetix"
  })
  // const { data } = useOntologymaps({
  //   filters: "NCIT,icdom"
  // })
  if (!data) return []

  return data
    .filter(
      (c) =>
        c.id.includes("icdot") ||
        c.id.includes("icdom") ||
        c.id.includes("NCIT")
    )
    .map((c) => ({
      label: c.id+": "+c.label,
      value: c.id
    }))
}

function useOntologymaps({ filters }) {
  const url = filters?.length > 0 && ontologymapsUrl( filters )
  return useExtendedSWR(url)
}

function useGetFilteredOptions({ filters, remove }) {
  const { data, isLoading, error } = useOntologymaps({ filters })
  let options = getOptions(data)
  options = options.filter((o) => o.value !== remove)
  return { isLoading, error, options }
}
