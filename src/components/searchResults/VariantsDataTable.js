import React from "react"
import PropTypes from "prop-types"
import { WithData } from "../Loader"
import Table, { TooltipHeader } from "../Table"

export default function VariantsDataTable({ apiReply, datasetId }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Digest",
        accessor: "variantInternalId"
      },
        {
        Header: "Gene",
        accessor: "variation.molecularAttributes.geneIds[0]"
        },
        {
        Header: "Pathogenicity",
        accessor: "variation.variantLevelData.clinicalInterpretations[0].clinicalRelevance"
        },
        {
        Header: "Variant type",
        accessor: "variation.molecularAttributes.molecularEffects[0].label"
        },
      {
        Header: TooltipHeader(
          "Variant Instances",
          "Case level instances of this variant with links to the variant (V) and biosample (B) information."
        ),
        accessor: "caseLevelData",
        Cell: ({ value: caseLevelData }) =>
        caseLevelData.map((cld, i) => (
          <div key={i}>
            <a href={`/variant?id=${cld.id}&datasetIds=${datasetId}`} target="_blank" rel="noreferrer">
              V: {cld.id}
            </a>
            <br/>
            <a href={`/biosample?id=${cld.biosampleId}&datasetIds=${datasetId}`} target="_blank" rel="noreferrer">
              B: {cld.biosampleId}
            </a>
          </div>
        ))
      }
    ],
    [datasetId]
  )

  return (
    <WithData
      apiReply={apiReply}
      render={(response) => (
        <div>
          {response.response.resultSets[0].results && (
            <Table columns={columns} data={response.response.resultSets[0].results} />
          )}
        </div>
      )}
    />
  )
}

VariantsDataTable.propTypes = {
  apiReply: PropTypes.object.isRequired
}
