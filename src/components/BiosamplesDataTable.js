import React from "react"
import useSWR from "swr"
import PropTypes from "prop-types"
import { useTable, usePagination } from "react-table"
import styles from "./BiosamplesDataTable.module.scss"

export default function BiosamplesDataTable({ url }) {
  const { data, error } = useSWR(url)
  const isLoading = !data && !error

  const columns = React.useMemo(
    () => [
      {
        Header: "General",
        columns: [
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
            accessor: (row) => row.biocharacteristics.map((r) => r.type.id+": "+r.type.label), // map to an array of type id
            Cell: ({ value }) => value.map((v, i) => <tr key={i}>{v}</tr>)
          },
        ]
      },
      {
        Header: "CNV Statistics (Genome Fractions)",
        columns: [
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
          },
        ]
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
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    usePagination
  )

  return (
    <>
      {/* eslint-disable react/jsx-key */}
      <table
        className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
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

      <div className={styles.pagination}>
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
        <span>
          <span>Go to page</span>{" "}
          <input
            className="input is-small"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: "100px" }}
          />
        </span>
        <span className="select is-small">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </span>
      </div>
    </>
  )
}

BiosamplesDataTable.propTypes = {
  url: PropTypes.string.isRequired
}
