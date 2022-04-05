import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table, { TooltipHeader } from "../Table"
// import { useProgenetixApi } from "../../hooks/api"
import DownloadButton from "../DownloadButton"
// import Link from "next/link"

export default function VariantsDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Digest",
        accessor: "variation.variantInternalId"
      },
      {
        Header: TooltipHeader(
          "Variant Instances",
          "Case level instances of this variant with links to the variant (V) and biosample (B) information."
        ),
        accessor: "caseLevelData",
        Cell: ({ value: caseLevelData }) =>
        caseLevelData.map((cld, i) => (
          <div key={i}>
            <a href={`/variants/details?id=${cld.id}&datasetIds=${datasetId}`} target="_blank" rel="noreferrer">
              V: {cld.id}
            </a>
            <br/>
            <a href={`/biosamples/details?id=${cld.biosampleId}&datasetIds=${datasetId}`} target="_blank" rel="noreferrer">
              B: {cld.biosampleId}
            </a>
          </div>
        ))
      }
      // {
      //   Header: "Type",
      //   accessor: "variantType"
      // }
    ]
  )

  return (
    <WithData
      apiReply={apiReply}
      render={(response) => (
        <div>
          <div className="mb-4">
            <DownloadButton
              label="Download Variants"
              json={response.response.resultSets[0].results}
              fileName="variants"
            />
          </div>
          <Table columns={columns} data={response.response.resultSets[0].results} />
        </div>
      )}
    />
  )
}

VariantsDataTable.propTypes = {
  apiReply: PropTypes.object.isRequired
}
