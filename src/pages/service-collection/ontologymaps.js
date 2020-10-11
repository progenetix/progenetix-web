import React, { useEffect, useState } from "react"
import { Layout } from "../../components/layouts/Layout"
import { ontologymapsUrl, useExtendedSWR } from "../../hooks/api"
import CustomSelect from "../../components/Select"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import Link from "next/link"

const Ontologymaps = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const { options: allOntologiesOptions } = useGetFilteredOptions({
    filters: "NCIT,icdom,icdot",
    filterPrecision: "start"
  })

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
    filterResult: firstSelection
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
            <Loader isLoading={resultsLoading} hasError={resultsError}>
              {resultsData?.data.code_groups?.length > 0 ? (
                <CodeGroups
                  codeGroups={resultsData?.data.code_groups}
                  ontomapsUrl={ontologymapsUrl(filters)}
                />
              ) : (
                <div className="notification">No groups found.</div>
              )}
            </Loader>
          </Loader>
        )}
      </div>
    </Layout>
  )
})

function CodeGroups({ codeGroups, ontomapsUrl }) {
  return (
    <div className="content">
      <h5>
        Selected codes{" "}
        <Link href={ontomapsUrl}>
          <a>JSON</a>
        </Link>
      </h5>
      <table className="table is-bordered">
        <tbody>
          {codeGroups.map((codeGroup, i) => (
            <tr key={i}>
              {codeGroup.map((code) => (
                <td key={code.id}>
                  {code.id}: {code.label}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function useGetFilteredOptions({ filters, filterResult, filterPrecision }) {
  const { data, isLoading, error } = useOntologymaps({
    filters,
    filterPrecision
  })
  let options = mapToOptions(data)
  options = filterResult
    ? options.filter((o) => o.value !== filterResult)
    : options
  return { isLoading, error, options }
}

function useOntologymaps({ filters, filterPrecision }) {
  const url =
    filters?.length > 0 && ontologymapsUrl({ filters, filterPrecision })
  return useExtendedSWR(url)
}

function mapToOptions(data) {
  if (!data || data.data.unique_codes == null) return []
  const NCIT = data.data.unique_codes["NCIT"] ?? []
  const icdom = data.data.unique_codes["icdom"] ?? []
  const icdot = data.data.unique_codes["icdot"] ?? []
  return [NCIT, icdom, icdot].flat().map((c) => ({
    label: c.id + ": " + c.label,
    value: c.id
  }))
}

export default Ontologymaps
