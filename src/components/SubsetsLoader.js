import { useCollationsByType, useCollationsById } from "../hooks/api"
import { WithData } from "./Loader"
import React from "react"
import { keyBy, merge } from "lodash"
import { SubsetHistogram } from "./Histogram"
import { buildTree, buildTreeForDetails, TreePanel } from "./classificationTree/TreePanel"

export default function SubsetsLoader({ collationTypes, datasetIds }) {
  const bioSubsetsHierarchiesReply = useCollationsByType({
    datasetIds,
    method: "paths",
    collationTypes
  })

  const allBioSubsetsReply = useCollationsById({
    datasetIds
  })

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
            />
          )}
        />
      )}
    />
  )
}

function SubsetsResponse({ bioSubsetsHierarchies, allBioSubsets, datasetIds }) {
  const isDetailPage = bioSubsetsHierarchies.length === 1
  // We merge both subsets from hierarchies and subsets from allSubsets.
  // This is because some children in the bioSubsetsHierarchies don't have labels or sample count information.
  const subsetById = merge(keyBy(bioSubsetsHierarchies, "id"), allBioSubsets)
  const { tree, size } = isDetailPage
    ? buildTreeForDetails(bioSubsetsHierarchies, subsetById)
    : buildTree(bioSubsetsHierarchies, subsetById)

  return (
    <>
      {isDetailPage && (
        <div className="mb-3">
          <SubsetHistogram
            id={bioSubsetsHierarchies[0].id}
            datasetIds={datasetIds}
            loaderProps={{
              background: true,
              colored: true
            }}
          />
        </div>
      )}
      <TreePanel
        datasetIds={datasetIds}
        subsetById={subsetById}
        tree={tree}
        size={size}
        sampleFilterScope="bioontology"
      />
    </>
  )
}
