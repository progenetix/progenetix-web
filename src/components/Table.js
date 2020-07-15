import { usePagination, useTable } from "react-table"
import React from "react"
import {
  FaAngleRight,
  FaAngleLeft,
  FaAngleDoubleRight,
  FaAngleDoubleLeft
} from "react-icons/fa"

export default function Table({ columns, data, pageSize = 5 }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
      initialState: { pageIndex: 0, pageSize }
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
      <div className="DataTable__pagination">
        <span>
          <button
            className="button is-small"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <FaAngleDoubleLeft className="icon is-small" />
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <FaAngleLeft className="icon is-small" />
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <FaAngleRight className="icon is-small" />
          </button>{" "}
          <button
            className="button is-small"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <FaAngleDoubleRight className="icon is-small" />
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
