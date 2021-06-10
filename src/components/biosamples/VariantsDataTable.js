import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"
// import { useProgenetixApi } from "../../hooks/api"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function VariantsDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Int. ID",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <Link
            href={`/variants/details?id=${cellInfo.value}&datasetIds=${datasetId}`}
          >
            {cellInfo.value}
          </Link>
        )
      },
      {
        Header: "Digest",
        accessor: "digest"
      },
      {
        Header: "Biosample",
        accessor: "biosample_id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <Link
            href={`/biosamples/details?id=${cellInfo.value}&datasetIds=${datasetId}`}
          >
            {cellInfo.value}
          </Link>
        )
      },
      {
        Header: "Chr.",
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
    [datasetId]
  )

  return (
    <WithData
      apiReply={apiReply}
      render={(response) => (
        <div>
          <div className="mb-4">
            <DownloadButton
              label="Download Variants"
              json={response.result_sets[0].results}
              fileName="variants"
            />
          </div>
          <Table columns={columns} data={response.result_sets[0].results} />
        </div>
      )}
    />
  )
}

VariantsDataTable.propTypes = {
  apiReply: PropTypes.object.isRequired
}
