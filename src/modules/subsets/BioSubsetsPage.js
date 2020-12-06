import { useCollations, useCollationsById } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import React from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/Layout"
import { keyBy, merge } from "lodash"
import config from "./config.yaml"
import { SubsetHistogram } from "../../components/Histogram"
import { useConfigSelect } from "./configSelect"
import { buildTree, buildTreeForDetails, TreePanel } from "./TreePanel"

export default function BioSubsetsPage() {
  return (
    <Layout title="Subsets" headline="Cancer Types">
      <div className="content">
        <p>
          The cancer samples in Progenetix are mapped to several classification
          systems. For each of the classes, aggregated date is available by
          clicking the code. Additionally, a selection of the corresponding
          samples can be initiated by clicking the sample number or selecting
          one or more classes through the checkboxes.
        </p>
        <p>
          Sample selection follows a hierarchical system in which samples
          matching the child terms of a selected class are included in the
          response.
        </p>
      </div>
      <BioSubsetsContent />
    </Layout>
  )
}

const BioSubsetsContent = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const {
    selected: selectedFilters,
    setSelected: setSelectedFilters,
    options: filtersOptions
  } = useConfigSelect(config.biofilters, "filters", urlQuery, setUrlQuery)
  return (
    <>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <p>Cancer Classification:</p>
          </div>
          <div className="level-item">
            <span className="select">
              <select
                value={selectedFilters}
                onChange={(e) => setSelectedFilters(e.target.value)}
              >
                {filtersOptions}
              </select>
            </span>
          </div>
        </div>
      </div>
      <SubsetsLoader filters={selectedFilters} datasetIds="progenetix" />
    </>
  )
})

function SubsetsLoader({ filters, datasetIds }) {
  const bioSubsetsHierarchies = useCollations({
    filters,
    datasetIds,
    method: "paths"
  })

  const allBioSubsets = useCollationsById({
    datasetIds
  })
  return (
    <WithData
      dataEffectResult={bioSubsetsHierarchies}
      background
      render={(bioSubsetsHierarchies) => (
        <WithData
          dataEffectResult={allBioSubsets}
          background
          render={(allBioSubsets) => (
            <SubsetsResponse
              bioSubsetsHierarchies={bioSubsetsHierarchies}
              allBioSubsets={allBioSubsets}
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
  const tree = isDetailPage
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
        sampleFilterScope="bioontology"
        subsetScope="biosubsets"
      />
    </>
  )
}
