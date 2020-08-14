import React from "react"
import PropTypes from "prop-types"
import Table from "../Table"
import _ from "lodash"

export default function BiosamplesSubsetsDataTable({ biosamplesResponse }) {
  const subsets = makeSubsetsData(biosamplesResponse)
  const columns = React.useMemo(
    () => [
      {
        Header: "Subsets",
        accessor: "id"
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

  return <Table columns={columns} data={subsets} pageSize={20} />
}

export function makeSubsetsData(biosamplesResponse) {
  const sampleCount = biosamplesResponse.length
  const ids = biosamplesResponse.flatMap((sample) =>
    sample.biocharacteristics.map(({ type }) => type.id)
  )
  const subsetCounts = _.countBy(ids)
  const subsets = Object.entries(subsetCounts).map(([k, v]) => ({
    id: k,
    count: v,
    frequency: (sampleCount / v).toPrecision(4)
  }))

  return _.sortBy(subsets, "frequency")
}

BiosamplesSubsetsDataTable.propTypes = {
  biosamplesResponse: PropTypes.array.isRequired
}
