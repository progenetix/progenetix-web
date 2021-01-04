import { referenceLink } from "../../hooks/api"
import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table, { TooltipHeader } from "../Table"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function BiosamplesDataTable({ dataEffectResult, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: TooltipHeader(
          "Biosample Id",
          "Internal, stable (Progenetix) identifier for the biosample"
        ),
        accessor: "id",
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
        Header: TooltipHeader("Description", "Text description of the sample"),
        accessor: "description"
      },
      {
        Header: TooltipHeader(
          "Classifications",
          "Terms for biological classifications associated with the sample (e.g. diagnosis, histology, organ site)"
        ),
        accessor: "biocharacteristics",
        Cell: ({ value: biocharacteristics }) =>
          biocharacteristics.map((biocharacteristic, i) => (
            <div key={i} title={biocharacteristic.label}>
              <Link
                href={`/subsets/biosubsets?filters=${biocharacteristic.type.id}`}
              >
                <a>{biocharacteristic.type.id}</a>
              </Link>{" "}
              {biocharacteristic.type.label}
            </div>
          ))
      },
      {
        Header: TooltipHeader(
          "Identifiers",
          "Identifiers for technical metadata or external information, either specifically describing the sample or its context (e.g. publication, study, technical platform)"
        ),
        accessor: "external_references",
        Cell: ({ value: externalReferences }) =>
          externalReferences.map((externalReference, i) => (
            <div key={i}>
              {referenceLink(externalReference) ? (
                <Link href={referenceLink(externalReference)}>
                  <a>{externalReference.type.id}</a>
                </Link>
              ) : (
                externalReference.type.id
              )}{" "}
              {externalReference.type.label}
            </div>
          ))
      },
      {
        Header: TooltipHeader(
          "CNVs",
          "Fraction of the sample's genome covered by CNV events (DUP or DEL)"
        ),
        accessor: "info.cnvstatistics.cnvfraction"
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
              fileName="biosamples"
            />
          </div>
          <Table columns={columns} data={data} />
        </div>
      )}
    />
  )
}

BiosamplesDataTable.propTypes = {
  dataEffectResult: PropTypes.object.isRequired
}
