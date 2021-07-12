// import { referenceLink } from "../../hooks/api"
import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
// import Table, { TooltipHeader } from "../Table"
import Table  from "../Table"
// import { useProgenetixApi } from "../../hooks/api"
import DownloadButton from "../DownloadButton"
// import Link from "next/link"

export default function VariantsInterpretationsDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Annotation ID",
        accessor: a => `${a.variantName} (${a.id})`
      },
      {
        Header: "Gene ID",
        accessor: "geneId"
      },
      {
        Header: "Clinical Effect",
        accessor: "clinicalRelevances",
          Cell: ({ value: clinicalRelevances }) =>
            clinicalRelevances[0].clinicalEffect.label
      },
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
              json={response.resultSets[0].results}
              fileName="variants"
            />
          </div>
          <Table columns={columns} data={response.resultSets[0].results} />
        </div>
      )}
    />
  )
}

VariantsInterpretationsDataTable.propTypes = {
  apiReply: PropTypes.object.isRequired
}
