import { referenceLink } from "../../hooks/api"
import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table, { TooltipHeader } from "../Table"
// import { useProgenetixApi } from "../../hooks/api"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function VariantsInterpretationsDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Variant ID",
        accessor: a => `${a.variantName} (${a.id})`
      },
      {
        Header: "Gene ID",
        accessor: "geneId"
      },
      {
        Header: TooltipHeader(
          "Interpretations & Evidences",
          "Identifiers for external information about the variant or its interpretation"
        ),
        accessor: "externalReferences",
        Cell: ({ value: externalReferences }) =>
          externalReferences.map((externalReference, i) => (
            <div key={i}>
              {referenceLink(externalReference) ? (
                <Link href={referenceLink(externalReference)}>
                  <a>{externalReference.id}</a>
                </Link>
              ) : (
                externalReference.id
              )}{" : "}
              {externalReference.label}
            </div>
          ))
      },
      {
        Header: "Cytoband",
        accessor: "cytoband"
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
