import { BIOKEYS, referenceLink } from "../../hooks/api"
import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table, { TooltipHeader } from "../Table"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function BiosamplesDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: TooltipHeader(
          "Biosample Id",
          "Internal, stable (Progenetix) identifier for the biosample"
        ),
        accessor: "id",
        Cell: function Cell(cellInfo) {
          return (
            <Link
              href={`/biosamples/details?id=${cellInfo.value}&datasetIds=${datasetId}`}
            >
              {cellInfo.value}
            </Link>
          )
        }
      },      
      {
        Header: TooltipHeader(
          "Dx Classifications",
          "Terms for biological classifications associated with the sample (e.g. diagnosis, histology, organ site)"
        ),
        accessor: "icdoMorphology.id",
        // eslint-disable-next-line react/display-name
        Cell: (cell) => (
          <div>
            {BIOKEYS.map(bioc => (
              <div key={bioc}>
                <Link
                href={`/subsets/biosubsets?filters=${cell.row.original[bioc].id}`}
                >
                  <a>{cell.row.original[bioc].id}</a>
                </Link>{" "}
                {cell.row.original[bioc].label}
              </div>
            ))}
          </div>
        )
      },

      {
        Header: TooltipHeader(
          "Identifiers",
          "Identifiers for technical metadata or external information, either specifically describing the sample or its context (e.g. publication, study, technical platform)"
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
              )}{" "}
              {externalReference.label}
            </div>
          ))
      },
      {
        Header: TooltipHeader(
          "CNV Fraction",
          "Fraction of the sample's genome covered by CNV events (DUP or DEL)"
        ),
        accessor: "info.cnvstatistics.cnvfraction"
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
              label="Download Biosamples"
              json={response.response.resultSets[0].results}
              fileName="biosamples"
            />
          </div>
          <Table columns={columns} data={response.response.resultSets[0].results} />
        </div>
      )}
    />
  )
}

BiosamplesDataTable.propTypes = {
  apiReply: PropTypes.object.isRequired
}
