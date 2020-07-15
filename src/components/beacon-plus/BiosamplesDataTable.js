import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { Loader } from "../Loader"
import Table from "../Table"

export default function BiosamplesDataTable({ url }) {
  const { data, error } = useSWR(url)
  const isLoading = !data && !error

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id"
      },
      {
        Header: "Project Id",
        accessor: "project_id"
      },
      {
        Header: "Description",
        accessor: "description"
      },
      {
        Header: "Classifications",
        accessor: (row) =>
          row.biocharacteristics.map((r) => r.type.id + ": " + r.type.label), // map to an array of type id
        Cell: ({ value }) => value.map((v, i) => <div key={i}>{v}</div>)
      },
      {
        Header: "Identifiers",
        accessor: (row) => row.external_references.map((r) => r.type.id), // map to an array of type id
        Cell: ({ value }) => value.map((v, i) => <div key={i}>{v}</div>)
      },
      {
        Header: "DEL",
        accessor: "info.cnvstatistics.delfraction"
      },
      {
        Header: "DEL",
        accessor: "info.cnvstatistics.dupfraction"
      },
      {
        Header: "CNV",
        accessor: "info.cnvstatistics.cnvfraction"
      }
    ],
    []
  )

  return (
    <Loader isLoading={isLoading} hasError={error}>
      <Table columns={columns} data={data} />
    </Loader>
  )
}

BiosamplesDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
