import {
  getDataItemUrl,
  useDataItemDelivery,
  // replaceWithProxy,
  // useProgenetixApi,
  NoResultsHelp
} from "../../hooks/api"
import { ExternalLink, ReferenceLink } from "../../components/helpersShared/linkHelpers"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import { ShowJSON } from "../../components/RawData"
import React from "react"

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
      )}
    />
  )
}

function VariantResponse({ response, id, datasetIds }) {
  if (!response.response.resultSets[0].results[0]) {
    return NoResultsHelp(exampleId, entity)
  }
  return <Variant variant={response.response.resultSets[0].results[0]} id={id} datasetIds={datasetIds} />
}


function Variant({ variant, id, datasetIds }) {
  return (
    <section className="content">
      <h3>
        {id} ({datasetIds})
      </h3>

      <h5>Digest</h5>
      <p>{variant.variantInternalId}</p>

    {variant.variation.molecularAttributes && (
      <>
        <h5>Molecular Attributes</h5>

        <ul>
        {variant.variation.molecularAttributes.geneIds && (
          <li>Gene: <b>{variant.variation.molecularAttributes.geneIds[0]}</b></li>
        )}

        {variant.variation.molecularAttributes?.molecularEffects && (
          <li>Molecular effect: {variant.variation.molecularAttributes.molecularEffects[0].label}</li>
        )}

          {variant.variation.molecularAttributes.aminoacidChanges && variant.variation.molecularAttributes.aminoacidChanges.length > 0 && variant.variation.molecularAttributes.aminoacidChanges[0] !== null && (
              <li>Aminoacid changes:
                <ul>
                  {variant.variation.molecularAttributes.aminoacidChanges.map((aa) => (
                      <li key={aa}>
                        {aa}
                      </li>
                  ))}
                </ul>
              </li>
          )}

        </ul>
      </>
    )}

    {variant.variation.identifiers && (

      <>
      <h5>Variant Identifiers</h5>
      <ul>

      {variant.variation.identifiers.proteinHGVSIds && (
        <li>Protein HGVSids:
          <ul>
          {variant.variation.identifiers.proteinHGVSIds.map((ph) =>
            <li key={ph}>
              {ph}
            </li>
          )}
          </ul>
        </li>
      )}

      {variant.variation.identifiers?.genomicHGVSIds && (
        <li>Genomic HGVSids:
          <ul>
          {variant.variation.identifiers.genomicHGVSIds.map((gh) =>
            <li key={gh}>
              {gh}
            </li>
          )}
          </ul>
        </li>
      )}

      {variant.variation.identifiers?.clinvarIds && (
          <li>ClinVar IDs:
            <ul>
              <li>
                <ExternalLink
                  href={`http://www.ncbi.nlm.nih.gov/clinvar/variation/${variant.variation.identifiers.clinvarIds[0]}`}
                  label={variant.variation.identifiers.clinvarIds[1]}
                />
              </li>
            </ul>
          </li>
      )}

      </ul>
      </>

    )}

    {variant.variation.variantAlternativeIds && (
        <div>
          <h5>Variant Alternative IDs</h5>
          <ul>
            {variant.variation.variantAlternativeIds.map((altid, key) => (
                <li key={key}>
                  {altid.id} - {altid.label}
                </li>
            ))}
          </ul>
        </div>
    )}

    { variant.variation.variantLevelData?.clinicalInterpretations && (
      <>
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
                {ReferenceLink(clinicalInterpretations.effect) ? (
                  <ExternalLink
                    href={ReferenceLink(clinicalInterpretations.effect)}
                    label={clinicalInterpretations.effect.id}
                  />
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
      </>
    )}

      <ShowJSON data={variant} />

      <h5>
        Download Data as Beacon v2{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href={getDataItemUrl(id, entity, datasetIds)}
        >
          {"{JSON↗}"}
        </a>
      </h5>

    </section>
  )
}
