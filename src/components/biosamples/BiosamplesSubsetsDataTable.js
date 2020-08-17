import React from "react"
import PropTypes from "prop-types"
import Table from "../Table"
import _ from "lodash"
import { useAllBioSubsets } from "../../hooks/api"
import { WithData } from "../Loader"

export default function BiosamplesSubsetsDataTable({ biosamplesResponse }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Subsets",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: ({ value, row: { original } }) => {
          return (
            <span>
              <a href={`/biosubsets?filters=${original.id}`}>{value}</a>
            </span>
          )
        }
      },
      {
        Header: "Samples",
        accessor: "samples"
      },
      {
        Header: "Observations",
        accessor: "count"
      },
      {
        Header: "Frequency",
        accessor: "frequency"
      }
    ],
    []
  )

  const allSubsets = useAllBioSubsets({ datasetIds: "progenetix" })
  return (
    <WithData
      dataEffectResult={allSubsets}
      background
      render={(allSubsets) => {
        const subsets = makeSubsetsData(biosamplesResponse, allSubsets)
        return <Table columns={columns} data={subsets} pageSize={20} />
      }}
    />
  )
}

export function makeSubsetsData(biosamplesResponse, allSubsetsById) {
  const sampleCount = biosamplesResponse.length
  const ids = biosamplesResponse.flatMap((sample) =>
    sample.biocharacteristics.map(({ type }) => type.id)
  )
  const subsetCounts = _.countBy(ids)
  const subsets = Object.entries(subsetCounts).map(([k, v]) => ({
    id: k,
    count: v,
    frequency: (v / sampleCount).toFixed(3),
    samples: allSubsetsById[k]?.count
  }))

  return _.sortBy(subsets, "frequency").reverse()
}

BiosamplesSubsetsDataTable.propTypes = {
  biosamplesResponse: PropTypes.array.isRequired
}
