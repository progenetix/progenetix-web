import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"
import { useExtendedSWR } from "../../hooks/api"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function VariantsDataTable({ url, datasetId }) {
  const dataEffectResult = useExtendedSWR(url)
  const columns = React.useMemo(
    () => [
      {
        Header: "Int. ID",
        accessor: "_id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <Link
            href={`/variants/details?_id=${cellInfo.value}&datasetIds=${datasetId}`}
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
        Header: "Callset",
        accessor: "callset_id"
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
