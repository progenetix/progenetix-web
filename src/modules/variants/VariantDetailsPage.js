import {
  getDataItemUrl,
  HANDOVER_IDS,
  useDataItemDelivery,
  replaceWithProxy,
  useProgenetixApi,
  NoResultsHelp, referenceLink
} from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import React from "react"
import Link from "next/link"
// import Link from "next/link"

const itemColl = "variants"
const exampleId = "5bab576a727983b2e00b8d32"

const VariantDetailsPage = withUrlQuery(({ urlQuery }) => {
  var { id, datasetIds } = urlQuery
  if (! datasetIds) {
    datasetIds = "progenetix"
  }
  const hasAllParams = id && datasetIds
  return (
    <Layout title="Variant Details" headline="Variant Details">
      {!hasAllParams ? (
        NoResultsHelp(exampleId, itemColl)
      ) : (
        <VariantLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default VariantDetailsPage

function VariantLoader({ id, datasetIds }) {
  const apiReply = useDataItemDelivery(id, itemColl, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        <>
          <VariantResponse
            response={response}
            id={id}
            datasetIds={datasetIds}
          />
          <VariantsInterpretationResponse
            response={response}
            datasetIds={datasetIds}
          />
        </>
      )}
    />
  )
}

function VariantResponse({ response, datasetIds }) {
  if (!response.response.resultSets[0].results[0]) {
    return NoResultsHelp(exampleId, itemColl)
  }
  return <Variant variant={response.response.resultSets[0].results[0]} datasetIds={datasetIds} />
}

function VariantsInterpretationResponse({ response, datasetIds }) {

  const handoverById = (givenId) => response.response.resultSets[0].resultsHandovers.find(({ handoverType: { id } }) => id === givenId)
  const variantsAnnotationsHandover = handoverById(HANDOVER_IDS.variantsinterpretations)
  const variantsAnnotationsReply= useProgenetixApi(
    variantsAnnotationsHandover && replaceWithProxy(variantsAnnotationsHandover.url)
  )
  return <VariantInterpretation ho={variantsAnnotationsHandover} apiReply={variantsAnnotationsReply} datasetIds={datasetIds} />

}

function Variant({ variant, datasetIds }) {
  return (
    <section className="content">
      <h3>
        {variant.variantInternalId} ({datasetIds})
      </h3>

      {variant.variantInternalId && (
        <>
          <h5>Digest</h5>
          <p>{variant.variantInternalId}</p>
        </>
      )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={getDataItemUrl(variant.id, itemColl, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}

// replace this with a table

function VariantInterpretation({ ho, apiReply, datasetIds }) {

  return (
    <WithData
      apiReply={apiReply}
      datasetIds={datasetIds}
      render={(response) =>
        <section className="content">
          {console.log(response)}
          <hr/>
            {response.resultSets[0].results[0].id}
          </h3>
          <ul>
            <li>Gene ID: {response.resultSets[0].results[0].geneId}</li>
            <li>Cytoband: {response.resultSets[0].results[0].cytoband}</li>
            <li>Aminoacid changes: {response.resultSets[0].results[0].aminoacidChanges}</li>
            ) : ""}
          </ul>
          {response.response.resultSets[0].results[0].clinicalRelevances[0].clinicalEffect ? (
            <div>
              <h5>Clinical Effect </h5>
              <ul>
                <li>{response.response.resultSets[0].results[0].clinicalRelevances[0].clinicalEffect.label} (FATHMM score: {response.response.resultSets[0].results[0].clinicalRelevances[0].clinicalEffect.score} )</li>
              </ul>
            </div>
          ) : ""}
          {response.response.resultSets[0].results[0].clinicalRelevances[1]?.diseaseId ? (
            <div>
              <h5>Disease ontologies </h5>
              {response.response.resultSets[0].results[0].clinicalRelevances[1]?.diseaseId?.map((disease, i) => (
                <div key={i}>
                  {referenceLink(disease) ? (
                    <Link href={referenceLink(disease)}>
                      <a>{disease.id}</a>
                    </Link>
                  ) : (
                    disease.id
                  )}{" : "}
                  {disease.label}
                </div>
              ))}
            </div>
          ) : ""}
          {response.response.resultSets[0].results[0].alternativeIds ? (
            <div>
              <h5>Alternative IDs</h5>
              {response.response.resultSets[0].results[0].alternativeIds?.map((externalReference, i) => (
                <div key={i}>
                  {referenceLink(externalReference) ? (
                    <Link href={referenceLink(externalReference)}>
                      <a>{externalReference.id}</a>
                    </Link>
                  ) : (
                    externalReference.id
                  )}{" : "}
                  {externalReference.label}
                </div>
              ))}
            </div>
          ) : ""}

          <h5>
            Download Data as{" "}
            <a
              rel="noreferrer"
              target="_blank"
              href={ho.url}
            >
              {"{JSON↗}"}
            </a>
          </h5>
        </section>
      }
    />
  )
}