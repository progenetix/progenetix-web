import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { Loader } from "../Loader"
import Table from "../Table"

export default function VariantsDataTable({ url }) {
  const { data, error } = useSWR(url)
  const isLoading = !data && !error
  const columns = React.useMemo(
    () => [
      {
        Header: "variantset_id",
        accessor: "variantset_id"
      },
      {
        Header: "callset_id",
        accessor: "callset_id"
      },
      {
        Header: "biosample_id",
        accessor: "biosample_id"
      },
      {
        Header: "digest",
        accessor: "digest"
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

VariantsDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
