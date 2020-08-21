/* eslint-disable react/display-name */
import React from "react"
import PropTypes from "prop-types"
import Table from "../Table"
import _ from "lodash"
import { useCollationsById } from "../../hooks/api"
import { WithData } from "../Loader"

export default function BiosamplesStatsDataTable({ biosamplesResponse }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Subsets",
        accessor: "id",
        Cell: ({ value, row: { original } }) => {
          return (
            <span>
              <a href={`/subsets/list?filters=${original.id}`}>{value}</a>
            </span>
          )
        }
      },
      {
        Header: "Subset Samples",
        accessor: "samples"
      },
      {
        Header: "Query Matches",
        accessor: "count"
      },
      {
        Header: "Subset Match Frequencies",
        accessor: "frequency",
        Cell: ({ value }) => {
          return (
            <>
              <span
                style={{
                  width: `${value * 100}%`,
                  height: `80%`,
                  position: "absolute",
                  left: 0,
                  backgroundColor: "#d8d8d8"
                }}
              />
              <span
                style={{
                  position: "absolute",
                  paddingLeft: "1rem"
                }}
              >
                {value}
              </span>
            </>
          )
        }
      }
    ],
    []
  )

  const allSubsets = useCollationsById({ datasetIds: "progenetix" })
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

function getFrequency(v, allSubsetsById, k) {
  const allSubsetsCount = allSubsetsById[k]?.count ?? -1
  if (allSubsetsCount <= 0) return ""
  return (v / allSubsetsCount).toFixed(3).toString()
}

export function makeSubsetsData(biosamplesResponse, allSubsetsById) {
  const ids = biosamplesResponse.flatMap((sample) =>
    sample.biocharacteristics.map(({ type }) => type.id)
  )
  const subsetCounts = _.countBy(ids)
  const subsets = Object.entries(subsetCounts).map(([k, v]) => ({
    id: k,
    count: v,
    frequency: getFrequency(v, allSubsetsById, k),
    samples: allSubsetsById[k]?.count
  }))

  return _.sortBy(subsets, "frequency").reverse()
}

BiosamplesStatsDataTable.propTypes = {
  biosamplesResponse: PropTypes.array.isRequired
}
