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

const sampleFilterScope = "freeFilters"

export default function CohortsPage() {
  return (
    <Layout title="Cohorts" headline="Studies & Cohorts">
      <div className="content">
        <p>
          Progenetix represents data from a large number of external collections
          and projects.
        </p>
        <CohortsContent />
      </div>
    </Layout>
  )
}

const CohortsContent = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const {
    selected: selectedFilters,
    setSelected: setSelectedFilters,
    options: filtersOptions
  } = useConfigSelect(config.cohortfilters, "filters", urlQuery, setUrlQuery)
  return (
    <>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <p>Cancer Cohorts:</p>
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
          <h3>
            Find{" "}
            <a
              href={`/biosamples/search?${sampleFilterScope}=${bioSubsetsHierarchies[0].id}&datasetIds=${datasetIds}`}
            >
              {bioSubsetsHierarchies[0].id} samples
            </a>
          </h3>
        </div>
      )}
      {!isDetailPage && (
        <TreePanel
          datasetIds={datasetIds}
          subsetById={subsetById}
          subsetScope="biosubsets"
          sampleFilterScope={sampleFilterScope}
          tree={tree}
          isFlat
        />
      )}
    </>
  )
}
