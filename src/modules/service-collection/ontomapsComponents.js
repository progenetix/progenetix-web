import { ontologymapsUrl, useExtendedSWR } from "../../hooks/api"
import Link from "next/link"

export function CodeGroups({ codeGroups, ontomapsUrl }) {
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
                  <Link
                    href={`/subsets/list?datasetIds=progenetix&filters=${code.id}`}
                  >
                    <a>{code.id}</a>
                  </Link>
                  {": "}
                  {code.label}
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

export function useOntologymaps({ filters, filterPrecision }) {
  const url =
    filters?.length > 0 && ontologymapsUrl({ filters, filterPrecision })
  return useExtendedSWR(url)
}

export function useGetFilteredOptions({
  filters,
  filterResult,
  filterPrecision
}) {
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

function mapToOptions(data) {
  if (!data || data.data.unique_codes == null) return []
  const NCIT = data.data.unique_codes["NCIT"] ?? []
  const icdom = data.data.unique_codes["icdom"] ?? []
  const icdot = data.data.unique_codes["icdot"] ?? []
  const UBERON = data.data.unique_codes["UBERON"] ?? []
  return [NCIT, icdom, icdot, UBERON].flat().map((c) => ({
    label: c.id + ": " + c.label,
    value: c.id
  }))
}
