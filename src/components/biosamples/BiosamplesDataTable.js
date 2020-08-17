import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table from "../Table"

export default function BiosamplesDataTable({ dataEffectResult, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <a
            href={`/samples/details?id=${cellInfo.value}&datasetIds=${datasetId}`}
            rel="noreferrer"
            target="_blank"
          >
            {cellInfo.value}
          </a>
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
            <div key={i} title={biocharacteristic.description}>
              <a
                href={`https://progenetix.org/do/pgx_subsets/filters=${biocharacteristic.type.id}`}
                rel="noreferrer"
                target="_blank"
              >
                {biocharacteristic.type.id}
              </a>{" "}
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
              {isPMID(externalReference) ? (
                <a
                  href={`/publications/details?id=${externalReference.type.id}&scope=datacollections`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {externalReference.type.id}
                </a>
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
        Header: "DEL",
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
      render={(data) => <Table columns={columns} data={data} />}
    />
  )
}

function isPMID(externalReference) {
  return externalReference.type.id.includes("PMID:")
}

BiosamplesDataTable.propTypes = {
  dataEffectResult: PropTypes.object.isRequired
}
