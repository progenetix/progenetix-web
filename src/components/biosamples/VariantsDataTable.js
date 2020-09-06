import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"
import { useExtendedSWR } from "../../hooks/api"
import DownloadButton from "../DownloadButton"

export default function VariantsDataTable({ url }) {
  const dataEffectResult = useExtendedSWR(url)
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
    <WithData
      dataEffectResult={dataEffectResult}
      render={(data) => (
        <div>
          <div className="mb-4">
            <DownloadButton
              label="Download Response"
              json={data}
              fileName="variants"
            />
          </div>
          <Table columns={columns} data={data} />
        </div>
      )}
    />
  )
}

VariantsDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
