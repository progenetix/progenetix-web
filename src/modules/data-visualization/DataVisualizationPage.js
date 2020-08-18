import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
import React from "react"

const DataVisualizationPage = withUrlQuery(({ urlQuery }) => {
  const { accessid } = urlQuery
  return (
    <Layout title="Data visualization" headline="Data visualization">
      {!accessid ? (
        <NoResultsHelp />
      ) : (
        <DataVisualizationLoaded accessid={accessid} />
      )}
    </Layout>
  )
})

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific <i>accessid</i>
      . Please start over from the Search Samples page.
    </div>
  )
}

function DataVisualizationLoaded({ accessid }) {
  return <div className="notification is-size-5">{accessid}</div>
}

export default DataVisualizationPage
