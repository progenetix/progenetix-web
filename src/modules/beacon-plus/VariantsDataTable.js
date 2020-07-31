import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { Loader } from "../../components/Loader"
import Table from "../../components/Table"

export default function VariantsDataTable({ url }) {
  const { data, error } = useSWR(url)
  const isLoading = !data && !error
  const columns = React.useMemo(
    () => [
      {
        Header: "Digest",
        accessor: "digest"
      },
      {
        Header: "Callset ID",
        accessor: "callset_id"
      },
      {
        Header: "Biosample ID",
        accessor: "biosample_id"
      },
      {
        Header: "Chromosome",
        accessor: "reference_name"
      },
      {
        Header: "Ref. Base(s)",
        accessor: "reference_bases"
      },
      {
        Header: "Alt. Base(s)",
        accessor: "alternate_bases"
      },
      {
        Header: "Type",
        accessor: "variant_type"
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
