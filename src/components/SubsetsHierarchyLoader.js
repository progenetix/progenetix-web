import { useCollationsByType, useCollationsById } from "../hooks/api"
import { WithData } from "./Loader"
import React from "react"
import { keyBy, merge } from "lodash"
import { buildTree, TreePanel } from "./classificationTree/TreePanel"

export default function SubsetsHierarchyLoader({ collationTypes, datasetIds, defaultTreeDepth }) {
  const bioSubsetsHierarchiesReply = useCollationsByType({
    datasetIds,
    method: "paths",
    collationTypes
  })

  const allBioSubsetsReply = useCollationsById({datasetIds})

  return (
    <WithData
      apiReply={bioSubsetsHierarchiesReply}
      background
      render={(bioSubsetsHierarchiesResponse) => (
        <WithData
          apiReply={allBioSubsetsReply}
          background
          render={(allBioSubsetsResponse) => (
            <SubsetsResponse
              bioSubsetsHierarchies={bioSubsetsHierarchiesResponse.response.results}
              allBioSubsets={allBioSubsetsResponse.response.results}
              datasetIds={datasetIds}
              defaultTreeDepth={defaultTreeDepth}
            />
          )}
        />
      )}
    />
  )
}

function SubsetsResponse({ bioSubsetsHierarchies, allBioSubsets, datasetIds, defaultTreeDepth }) {
  // We merge both subsets from hierarchies and subsets from allSubsets.
  // This is because some children in the bioSubsetsHierarchies don't have labels or sample count information.
  const subsetById = merge(keyBy(bioSubsetsHierarchies, "id"), allBioSubsets)
  const { tree, size } = buildTree(bioSubsetsHierarchies, subsetById)

  return (
    <TreePanel
      datasetIds={datasetIds}
      subsetById={subsetById}
      tree={tree}
      size={size}
      defaultTreeDepth={defaultTreeDepth}
      sampleFilterScope="allTermsFilters"
    />
  )
}
