import {
  NoResultsHelp,
  urlRetrieveIds
} from "../../hooks/api"
import { SubsetLoader } from "../../components/SubsetLoader"
import { Layout } from "../../components/Layout"
import { withUrlQuery } from "../../hooks/url-query"

// const exampleId = "NCIT:C3262"

const SubsetDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id, datasetIds, hasAllParams } = urlRetrieveIds(urlQuery)
  return (
    <Layout title="Subset Details">
      {!hasAllParams ? (
        NoResultsHelp("subset details")
      ) : (
        <SubsetLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default SubsetDetailsPage

