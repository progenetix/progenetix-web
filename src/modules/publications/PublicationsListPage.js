import React from "react"
import { Layout } from "../../components/layouts/Layout"
import { usePublicationList } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import Table from "../../components/Table"
import { epmcId, EpmcLink } from "./EpmcUrl"

export default function PublicationsListPage() {
  return (
    <Layout title="Publications" headline="Progenetix Publication Collection">
      <article className="mb-6">
        <p>
          The current page lists articles describing whole genome screening
          (WGS, WES, aCGH, cCGH) experiments in cancer, registered in the
          Progenetix publication collection.
        </p>
        <p>
          Please <a href="mailto:contact@progenetix.org">contact us</a> to alert
          us about additional articles you are aware of.
        </p>
      </article>
      <PublicationTableLoader />
    </Layout>
  )
}

function PublicationTableLoader() {
  const { data, error, isLoading } = usePublicationList()
  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
        // eslint-disable-next-line react/display-name
        Cell: (cellInfo) => (
          <a
            href={`/publications/details?id=${cellInfo.value}&scope=datacollections`}
          >
            {cellInfo.value}
          </a>
        )
      },
      {
        Header: "Publication",
        accessor: "label",
        // eslint-disable-next-line react/display-name
        Cell: ({ value, row: { original } }) => {
          return (
            <>
              <div>{value}</div>
              <div>
                {original.journal} ( {epmcId(original.id)}){" "}
                <EpmcLink publicationId={original.id} />
              </div>
            </>
          )
        }
      },
      {
        Header: "Samples",
        columns: [
          {
            Header: "cCGH",
            accessor: "counts.ccgh"
          },
          {
            Header: "aCGH",
            accessor: "counts.acgh"
          },
          {
            Header: "WES",
            accessor: "counts.wes"
          },
          {
            Header: "WGS",
            accessor: "counts.wgs"
          }
        ]
      },
      { accessor: "authors" },
      { accessor: "title" },
      { accessor: "sortid" }
    ],
    []
  )

  return (
    <Loader isLoading={isLoading} hasError={error} background>
      <Table
        columns={columns}
        data={data}
        pageSize={15}
        hasGlobalFilter
        hiddenColumns={["authors", "title", "sortid"]}
      />
    </Loader>
  )
}
