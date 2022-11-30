import {
  getDataItemUrl,
  useDataItemDelivery,
  // replaceWithProxy,
  // useProgenetixApi,
  NoResultsHelp,
  referenceLink
} from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import React from "react"
import Link from "next/link"

const entity = "variants"
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
        NoResultsHelp(exampleId, entity)
      ) : (
        <VariantLoader id={id} datasetIds={datasetIds} />
      )}
    </Layout>
  )
})

export default VariantDetailsPage

function VariantLoader({ id, datasetIds }) {
  const apiReply = useDataItemDelivery(id, entity, datasetIds)
  return (
    <WithData
      apiReply={apiReply}
      background
      render={(response) => (
        // <>
          <VariantResponse
            response={response}
            id={id}
            datasetIds={datasetIds}
          />
          // <VariantsInterpretationResponse
          //   response={response}
          //   datasetIds={datasetIds}
          // />
        // </>
      )}
    />
  )
}

function VariantResponse({ response, datasetIds }) {
  if (!response.response.resultSets[0].results) {
    return NoResultsHelp(exampleId, entity)
  }
  return <Variant variant={response.response.resultSets[0].results[0]} datasetIds={datasetIds} />
}


function Variant({ variant, datasetIds }) {
  return (
    <section className="content">
      <h3>
        {variant.variantInternalId} ({datasetIds})
      </h3>

      <h5>Digest</h5>
      <p>{variant.variantInternalId}</p>

      {variant.variation.molecularAttributes && (
            <>
        <h5>Molecular Attributes</h5>
        <p>Gene: <b>{variant.variation.molecularAttributes.geneIds[0]}</b></p>
      </>
      )}
      {variant.variation.molecularAttributes && variant.variation.molecularAttributes.molecularEffects && (
            <>
        <p>Molecular effect: {variant.variation.molecularAttributes.molecularEffects[0].label}</p>
        </>
        )}

      {variant.variation.molecularAttributes && variant.variation.molecularAttributes.aminoacidChanges && (
            <>
        <p>Aminoacid changes: </p>
         <ul>
          {variant.variation.molecularAttributes.aminoacidChanges.map((aa) =>
            <li key={aa}>
              {aa}
            </li>
          )}
        </ul>
        </>
      )}

     {variant.variation.identifiers && variant.variation.identifiers.proteinHGVSIds && (
           <>
       <p>Protein HGVSids:</p>
         <ul>
          {variant.variation.identifiers.proteinHGVSIds.map((ph) =>
            <li key={ph}>
              {ph}
            </li>
          )}
        </ul>
        </>
       )}

     {variant.variation.identifiers && variant.variation.identifiers.clinvarIds && (
           <>
       <p>ClinVar IDs:</p>
         <ul>
            <li>
              <Link href={"https://www.ncbi.nlm.nih.gov/clinvar/variation/" + variant.variation.identifiers.clinvarIds[0][0]}>
                <a>{variant.variation.identifiers.clinvarIds[0][0]}</a>
              </Link>
            </li>
            <li>
                {variant.variation.identifiers.clinvarIds[0][1]}
            </li>
        </ul>
        </>
        )}

      {variant.variation.variantLevelData && variant.variation.variantLevelData.clinicalInterpretations.length > 0 && (
                <>
      <h5>Clinical Interpretations</h5>
      <p>Clinical Relevance: <b>{variant.variation.variantLevelData.clinicalInterpretations[0].clinicalRelevance}</b></p>
      <table>
      <tr>
        <th>ID</th>
        <th>Description</th>
      </tr>
      {variant.variation.variantLevelData.clinicalInterpretations?.map((clinicalInterpretations, key) => {
        return (
          <tr key={key}>
            <td>
            {referenceLink(clinicalInterpretations.effect) ? (
              <Link href={referenceLink(clinicalInterpretations.effect)}>
                <a>{clinicalInterpretations.effect.id}</a>
              </Link>
            ) : (
              clinicalInterpretations.effect.id
            )}
            </td>
            <td>{clinicalInterpretations.effect.label}</td>
          </tr>
        )
        })}
      </table>
      </>
      )}

      {variant.variation.molecularAttributes && variant.variation.molecularAttributes.molecularEffects && (
            <>
        <p>Source: CCLE mutations</p>
        </>
        )}

        {variant.variation.identifiers && variant.variation.identifiers.clinvarIds && (
              <>
        <p>Source: ClinVar</p>
        </>
        )}

      <h5>
        Download Data as{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={getDataItemUrl(variant.variantInternalId, entity, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>
    </section>
  )
}
