import { useCollations, useCollationsById } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import React, { useMemo, useState } from "react"
import { withUrlQuery } from "../../hooks/url-query"
import { Layout } from "../../components/layouts/Layout"
import { keyBy, merge, sortBy } from "lodash"
import { getOrMakeChild, getOrMakeNode } from "./tree"
import biosubsetsConfig from "./config.yaml"
import { SubsetHistogram } from "../../components/Histogram"
import { SubsetsTree } from "./SubsetsTree"

const makeEntries = (config, queryValue) => {
  let configEntries = Object.entries(config)
  if (queryValue && !configEntries.find(([c]) => c === queryValue)) {
    configEntries = [[queryValue, { label: queryValue }], ...configEntries]
  }
  return configEntries
}

function useConfigSelect(config, key, urlQuery, setUrlQuery) {
  const queryValue = urlQuery[key]
  const configEntries = useMemo(() => makeEntries(config, queryValue), [
    config,
    queryValue
  ])
  const selected =
    configEntries.find(([c]) => c === queryValue)?.[0] ?? configEntries[0][0]
  const setSelected = (newValue) =>
    setUrlQuery({ [key]: newValue }, { keepExisting: true })
  const options = configEntries.map(([k, v]) => (
    <option key={k} value={k}>
      {v.label}
    </option>
  ))
  return {
    selected,
    setSelected,
    options
  }
}

export default function BioSubsetsPage() {
  return (
    <Layout title="Subsets" headline="Cancer Types">
      <BioSubsetsContent />
    </Layout>
  )
}

const BioSubsetsContent = withUrlQuery(({ urlQuery, setUrlQuery }) => {
  const {
    selected: selectedFilters,
    setSelected: setSelectedFilters,
    options: filtersOptions
  } = useConfigSelect(
    biosubsetsConfig.filters,
    "filters",
    urlQuery,
    setUrlQuery
  )
  const {
    selected: selectedDatasetIds,
    setSelected: setSelectedDatasetIds,
    options: datasetIdsOptions
  } = useConfigSelect(
    biosubsetsConfig.datasetIds,
    "datasetIds",
    urlQuery,
    setUrlQuery
  )
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

          <div className="level-item">
            <p>Dataset:</p>
          </div>
          <div className="level-item">
            <span className="select">
              <select
                value={selectedDatasetIds}
                onChange={(e) => setSelectedDatasetIds(e.target.value)}
              >
                {datasetIdsOptions}
              </select>
            </span>
          </div>
        </div>
      </div>
      <SubsetsLoader
        filters={selectedFilters}
        datasetIds={selectedDatasetIds}
      />
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
      <TreePanel datasetIds={datasetIds} subsetById={subsetById} tree={tree} />
    </>
  )
}

function TreePanel({ tree, subsetById, datasetIds }) {
  const [checkedIds, setCheckedIds] = useState({})
  const checkboxClicked = ({ checked, id }) => {
    if (checked) {
      setCheckedIds({ ...checkedIds, [id]: true })
    } else {
      const { [id]: omit, ...otherChecked } = checkedIds
      setCheckedIds(otherChecked)
    }
  }
  const checkedSubsets = Object.entries(checkedIds).map(([id]) => {
    return subsetById[id]
  })
  return (
    <>
      <div className="BioSubsets__tree">
        <SubsetsTree
          tree={tree}
          datasetIds={datasetIds}
          checkedSubsets={checkedSubsets}
          checkboxClicked={checkboxClicked}
        />
      </div>
    </>
  )
}

export function buildTree(response, subsetById) {
  const hierarchyPaths = response.flatMap((subset) => subset.hierarchy_paths)
  const sortedHierarchyPaths = sortBy(hierarchyPaths, [
    function (p) {
      return p.order
    }
  ])

  // add an arbitrary root
  const tree = { id: "root", children: [], path: ["root"] }
  for (const hierarchy of sortedHierarchyPaths) {
    if (hierarchy.path) {
      const path = hierarchy.path.filter((p) => !!p)
      const fullPath = ["root", ...path]
      const node = getOrMakeNode(tree, fullPath)
      node.subset = subsetById[node.id]
    }
  }
  return tree
}

export function buildTreeForDetails(response, subsetById) {
  const rootSubset = response[0]
  const tree = { id: "root", children: [], path: ["root"] }
  const rootNode = getOrMakeChild(tree, rootSubset.id)
  rootNode.subset = rootSubset
  const child_terms = rootSubset.child_terms
  child_terms.forEach((c) => {
    // some subsets have themself in the children list
    if (rootSubset.id !== c) {
      const node = getOrMakeChild(rootNode, c)
      node.subset = subsetById[node.id]
    }
  })
  return tree
}
