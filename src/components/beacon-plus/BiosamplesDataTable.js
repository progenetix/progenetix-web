import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { Loader } from "../Loader"
import Table from "../Table"

export default function BiosamplesDataTable({ url }) {
  const { data, error } = useSWR(url)
  const isLoading = !data && !error

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id"
      },
      {
        Header: "Project Id",
        accessor: "project_id"
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
            <div key={i} title={externalReference.description}>
              <a
                href={`https://info.progenetix.org/publication-details.html?scope=datacollections&id=${externalReference.type.id}`}
                rel="noreferrer"
                target="_blank"
              >
                {externalReference.type.id}
              </a>{" "}
              {externalReference.type.label}
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

BiosamplesDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
