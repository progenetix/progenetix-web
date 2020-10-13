import { referenceLink } from "../../hooks/api"
import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"
import DownloadButton from "../DownloadButton"
import Link from "next/link"

export default function BiosamplesDataTable({ dataEffectResult, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
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
        Header: "Description",
        accessor: "description"
      },
      {
        Header: "Classifications",
        accessor: "biocharacteristics",
        Cell: ({ value: biocharacteristics }) =>
          biocharacteristics.map((biocharacteristic, i) => (
            <div key={i} title={biocharacteristic.label}>
              <Link href={`/subsets/list?filters=${biocharacteristic.type.id}`}>
                <a>{biocharacteristic.type.id}</a>
              </Link>{" "}
              {biocharacteristic.type.label}
            </div>
          ))
      },
      {
        Header: "Identifiers",
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
              )}
            </div>
          ))
      },
      {
        Header: "DEL",
        accessor: "info.cnvstatistics.delfraction"
      },
      {
        Header: "DUP",
        accessor: "info.cnvstatistics.dupfraction"
      },
      {
        Header: "CNV",
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
