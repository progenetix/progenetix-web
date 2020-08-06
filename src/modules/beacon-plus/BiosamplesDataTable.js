import React from "react"
import PropTypes from "prop-types"
import { Loader } from "../../components/Loader"
import Table from "../../components/Table"
import { useExtendedSWR } from "../../hooks/api"

export default function BiosamplesDataTable({ url, datasetId }) {
  const { data, error, isLoading } = useExtendedSWR(url)

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <a
            href={`/biosamples/${cellInfo.value}?datasetIds=${datasetId}`}
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
                  href={`/publications/${externalReference.type.id}?scope=datacollections`}
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
    []
  )

  return (
    <Loader isLoading={isLoading} hasError={error}>
      <Table columns={columns} data={data} />
    </Loader>
  )
}

function isPMID(externalReference) {
  return externalReference.type.id.includes("PMID:")
}

BiosamplesDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
