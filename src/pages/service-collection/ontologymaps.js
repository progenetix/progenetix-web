import React, { useEffect, useState } from "react"
import { Layout } from "../../components/layouts/Layout"
import { ontologymapsUrl, useExtendedSWR, PROGENETIXINFO } from "../../hooks/api"
import CustomSelect from "../../components/Select"
import { Loader } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import Link from "next/link"

const filterPrecision = "start"
const docurl = `${PROGENETIXINFO}/doc/services/ontologymaps.html`

export default function OntologymapsPage() {
  return (
    <Layout title="Ontologymaps" headline="Services: Ontologymaps">
      <div className="content">
        <p>
          The <strong>ontologymaps</strong> service provides equivalency mapping
          between ICD-O and other classification systems, notably NCIt. It makes
          use of the sample-level mappings for NCIT and ICD-O 3 codes developed
          for the individual samples in the Progenetix collection.
        </p>
        <p>
          While NCIT treats diseases as{" "}
          <span className="span-blue">histologic</span> and{" "}
          <span className="span-red">topographic</span> described entities (e.g.{" "}
          <span className="span-purple">NCIT:C7700</span>:{" "}
          <span className="span-red">Ovarian</span>{" "}
          <span className="span-blue">adenocarcinoma</span>), these two
          components are represented separately in ICD-O, through the{" "}
          <span className="span-blue">Morphology</span> and{" "}
          <span className="span-red">Topography</span> coding arms (e.g. here{" "}
          <span className="span-blue">8140/3</span> +{" "}
          <span className="span-red">C56.9</span>).
        </p>
        <p>
          More documentation with focus on the API functionality can be found
          on the <a href={docurl}>documentation pages</a>.
        </p>
      </div>
      <OntologymapsSelection />
    </Layout>
  )
}

const OntologymapsSelection = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const { options: allOntologiesOptions } = useGetFilteredOptions({
    filters: "NCIT,icdom,icdot",
    filterPrecision: filterPrecision
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
    <div className="content">
      <h5>Code Selection</h5>
      <div className="mb-6">
        <CustomSelect
          className="mb-5"
          options={allOntologiesOptions}
          value={
            allOntologiesOptions.find((o) => o.value === firstSelection) ?? null
          }
          onChange={(option) => handleFirstSelectionChange(option?.value)}
          isClearable
          placeholder="First: Type & select NCIT or ICD-O code"
        />
        {firstSelection && (
          <Loader
            isLoading={secondSelectionLoading}
            hasError={secondSelectionError}
          >
            {secondSelectionOptions && resultsData?.data.code_groups?.length > 1 ? (
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
                placeholder="Optional: Limit with second selection"
              />
            ) : (
              <div>
              </div>
            )}
            <Loader isLoading={resultsLoading} hasError={resultsError}>
              {resultsData?.data.code_groups?.length > 0 ? (
                <CodeGroups
                  codeGroups={resultsData?.data.code_groups}
                  ontomapsUrl={ontologymapsUrl({ filters, filterPrecision })}
                />
              ) : (
                <div className="notification">No groups found.</div>
              )}
            </Loader>
          </Loader>
        )}
      </div>
    </div>
  )
})

function CodeGroups({ codeGroups, ontomapsUrl }) {
  return (
    <div className="content">
      <h5>
        Matching Code Mappings{" "}
        <a rel="noreferrer" target="_blank" href={ontomapsUrl}>
          {"{JSON↗}"}
        </a>
      </h5>
      <table className="table is-bordered">
        <tbody>
          {codeGroups.map((codeGroup, i) => (
            <tr key={i}>
              {codeGroup.map((code) => (
                <td key={code.id}>
                  <Link href={`/subsets/list?datasetIds=progenetix&filters=${code.id}`}>
                    <a>{code.id}</a>
                  </Link>{": "}{code.label}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {codeGroups.length > 1 && (
        <p>
          More than one code groups means that either mappings need refinements
          (e.g. additional specific NCIT classes for ICD-O T topographies) or
          you started out with an unspecific ICD-O M class and need to add a
          second selection.
        </p>
      )}
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
