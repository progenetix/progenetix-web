import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { useTable, usePagination } from "react-table"

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
        accessor: (row) =>
          row.biocharacteristics.map((r) => r.type.id + ": " + r.type.label), // map to an array of type id
        Cell: ({ value }) => value.map((v, i) => <tr key={i}>{v}</tr>)
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

  if (isLoading) {
    return <div>Loading Biosamples Data...</div>
  }
  if (error) {
    return <div className="is-danger">Error while loading BiosamplesData</div>
  }

  return <Table columns={columns} data={data} />
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page, which has only the rows for the active page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }
    },
    usePagination
  )

  return (
    <>
      {/* eslint-disable react/jsx-key */}
      <table
        className="table is-narrow is-hoverable is-fullwidth"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* eslint-enable react/jsx-key */}
      <div className="BiosamplesDataTable__pagination">
        <span>
          <button
            className="button is-small"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
        </span>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </>
  )
}

BiosamplesDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
