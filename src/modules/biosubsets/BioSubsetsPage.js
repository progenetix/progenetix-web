import { useAllBioSubsets, useBioSubsets } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import React, { useEffect, useMemo, useReducer, useState } from "react"
import { withQuery } from "../../hooks/query"
import { Layout } from "../../components/layouts/Layout"
import { isEqual, sortBy, keyBy, merge } from "lodash"
import { getOrMakeChild, getOrMakeNode } from "./tree"
import cn from "classnames"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"
import PropTypes from "prop-types"
import biosubsetsConfig from "./config.yaml"
import { SubsetHistogram } from "../../components/Histogram"
import Link from "next/link"

const makeEntries = (config, initialValue) => {
  let configEntries = Object.entries(config)
  if (initialValue && !configEntries.find(([c]) => c === initialValue)) {
    configEntries = [[initialValue, { label: initialValue }], ...configEntries]
  }
  return configEntries
}

function useConfigSelect(config, initialValue) {
  const configEntries = useMemo(() => makeEntries(config, initialValue), [
    config,
    initialValue
  ])
  const [selected, setSelected] = useState(configEntries[0][0])

  // refresh state if initial values (from url) changes
  useEffect(() => {
    setSelected(configEntries[0][0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue])

  const options = configEntries.map(([k, v]) => (
    <option key={k}>{v.label}</option>
  ))
  return {
    selected,
    setSelected,
    options
  }
}

const BioSubsetsPage = withQuery(({ urlQuery }) => {
  const {
    selected: selectedFilters,
    setSelected: setSelectedFilters,
    options: filtersOptions
  } = useConfigSelect(biosubsetsConfig.filters, urlQuery.filters)
  const {
    selected: selectedDatasetIds,
    setSelected: setSelectedDatasetIds,
    options: datasetIdsOptions
  } = useConfigSelect(biosubsetsConfig.datasetIds, urlQuery.datasetIds)
  return (
    <Layout title="Subsets" headline="Subsets">
      <div className="level mb-6">
        <div className="level-left">
          <div className="level-item">
            <p>Filters:</p>
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
    </Layout>
  )
})

export default BioSubsetsPage

function SubsetsLoader({ filters, datasetIds }) {
  const bioSubsetsHierarchies = useBioSubsets({
    filters,
    datasetIds
  })

  const allBioSubsets = useAllBioSubsets({
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
  const subsetById = useMemo(
    () => merge(keyBy(bioSubsetsHierarchies, "id"), allBioSubsets),
    [allBioSubsets, bioSubsetsHierarchies]
  )

  const tree = useMemo(
    () =>
      isDetailPage
        ? buildTreeForDetails(bioSubsetsHierarchies, subsetById)
        : buildTree(bioSubsetsHierarchies, subsetById),
    [bioSubsetsHierarchies, subsetById, isDetailPage]
  )
  const [state, dispatch] = useReducer(reducer, initialState)
  const checkIsCollapsed = useMemo(
    () =>
      mkIsCollapsedByPath({
        defaultState: state.defaultState,
        defaultExpandedLevel: state.defaultExpandedLevel
      }),
    [state.defaultState, state.defaultExpandedLevel]
  )
  const checkedSubsets = useMemo(
    () =>
      Object.entries(state.checked).map(([id]) => {
        return subsetById[id]
      }),
    [state.checked, subsetById]
  )
  const hasCheckedSubsets = checkedSubsets.length > 0
  const selectSamplesHref =
    hasCheckedSubsets &&
    sampleSelectUrl({ subsets: checkedSubsets, datasetIds })
  let histogram
  if (isDetailPage) {
    histogram = (
      <div className="mb-6">
        <SubsetHistogram
          id={bioSubsetsHierarchies[0].id}
          datasetIds={datasetIds}
          loaderProps={{
            background: true,
            colored: true
          }}
        />
      </div>
    )
  }
  return (
    <div>
      {histogram}
      <div className="BioSubsets__sample-selection">
        <a
          className="button is-info mb-3"
          disabled={!hasCheckedSubsets}
          href={selectSamplesHref || ""}
          rel="noreferrer"
          target="_BLANK"
        >
          Select Samples from checked Subsets
        </a>
        <ul className="tags">
          {checkedSubsets.map((subset) => (
            <li className="tag" key={subset.id}>
              {subset.label} ({subset.child_terms?.length + 1})
            </li>
          ))}
        </ul>
      </div>
      <div className="BioSubsets__tree">
        <SubsetsTree
          tree={tree}
          datasetIds={datasetIds}
          checkIsCollapsed={checkIsCollapsed}
          collapsedOverrides={state.overrides}
          defaultExpandedLevel={state.defaultExpandedLevel}
          dispatch={dispatch}
        />
      </div>
    </div>
  )
}

const initialState = {
  overrides: {},
  defaultState: "expanded",
  defaultExpandedLevel: 1,
  checked: {}
}

function reducer(state, { type, payload }) {
  switch (type) {
    case "expand":
      return {
        ...state,
        overrides: { ...state.overrides, [payload]: "expanded" }
      }
    case "collapse":
      return {
        ...state,
        overrides: { ...state.overrides, [payload]: "collapsed" }
      }
    case "collapseAll":
      return {
        ...state,
        overrides: initialState.overrides,
        defaultState: "collapsed"
      }
    case "expandAll":
      return {
        ...state,
        overrides: initialState.overrides,
        defaultState: "expanded"
      }
    case "setLevel":
      return {
        ...state,
        overrides: {},
        defaultState: "expanded",
        defaultExpandedLevel: payload
      }
    case "checkboxClicked":
      if (payload.checked) {
        return {
          ...state,
          checked: { ...state.checked, [payload.id]: true }
        }
      } else {
        const { [payload.id]: omit, ...otherChecked } = state.checked
        return {
          ...state,
          checked: otherChecked
        }
      }
    default:
      throw new Error()
  }
}

const mkIsCollapsedByPath = ({ defaultState, defaultExpandedLevel }) => (
  override,
  depth
) => {
  if (override != null) return override === "collapsed"
  if (defaultState === "expanded") {
    // const depth = path.length - 2 // 2 because 1 is the tree fake "root"
    return depth > defaultExpandedLevel
  } else {
    return true
  }
}

function SubsetsTree({
  tree,
  datasetIds,
  dispatch,
  checkIsCollapsed,
  defaultExpandedLevel,
  collapsedOverrides
}) {
  let headers = (
    <tr>
      <th />
      <th>Subsets</th>
      <th>Samples</th>
    </tr>
  )
  return (
    <>
      <div className="BioSubsets__controls">
        <div
          className="button is-small"
          onClick={() => dispatch({ type: "collapseAll" })}
        >
          Collapse all
        </div>
        <div
          className="button is-small"
          onClick={() => dispatch({ type: "expandAll" })}
        >
          Expand
        </div>
        <span className="select is-small">
          <select
            value={defaultExpandedLevel}
            onChange={(event) =>
              dispatch({ type: "setLevel", payload: event.target.value })
            }
          >
            <option value={1}>1 level</option>
            <option value={2}>2 levels</option>
            <option value={3}>3 levels</option>
            <option value={4}>4 levels</option>
            <option value={5}>5 levels</option>
            <option value={99}>All</option>
          </select>
        </span>
      </div>
      <div className="table-container">
        <table className="table is-striped is-fullwidth is-bordered">
          <thead>{headers}</thead>
          <tbody>
            <NodeChildren
              checkIsCollapsed={checkIsCollapsed}
              nodeChildren={tree.children} // we ignore the "root"
              dispatch={dispatch}
              datasetIds={datasetIds}
              collapsedOverrides={collapsedOverrides}
            />
          </tbody>
        </table>
      </div>
    </>
  )
}

function NodeChildren({
  checkIsCollapsed,
  nodeChildren,
  datasetIds,
  dispatch,
  collapsedOverrides
}) {
  // We want to render the children async to not block the UI.
  // This is not ideal at all and the proper way to do it would be to use something like
  // react-window, which is not trivial.
  const [children, setChildren] = useState([])
  useEffect(() => {
    setTimeout(() => setChildren(nodeChildren), 5)
  }, [nodeChildren])

  return children.map((node, idx) => {
    const depth = node.path.length - 2 // 2 because 1 is the tree fake "root"
    const nodeKey = makeNodeKey(node)
    const groupCollapsedOverride = collapsedOverrides[nodeKey]
    const isGroupCollapsed = checkIsCollapsed(groupCollapsedOverride, depth)
    // we are filtering the interresting overrides for the children.
    // this is an optimisation to avoid the whole re-rendering of the tree.
    const overridesForChildren = Object.fromEntries(
      Object.entries(collapsedOverrides).filter(([key]) => {
        return key.includes(nodeKey)
      })
    )

    return (
      <MemoizedSubsetNode
        key={idx}
        node={node}
        groupCollapsed={isGroupCollapsed}
        dispatch={dispatch}
        depth={depth}
        datasetIds={datasetIds}
        checkIsCollapsed={checkIsCollapsed}
        collapsedOverrides={overridesForChildren}
      />
    )
  })
}

// Need deep compare (isEqual) because collapsedOverrides wont be equals after filterring
const MemoizedSubsetNode = React.memo(SubsetNode, isEqual)

function SubsetNode({
  node,
  dispatch,
  groupCollapsed,
  depth,
  datasetIds,
  checkIsCollapsed,
  collapsedOverrides
}) {
  return (
    <>
      <MemoizedRow
        node={node}
        dispatch={dispatch}
        collapsed={groupCollapsed}
        depth={depth}
        datasetIds={datasetIds}
      />
      {!groupCollapsed && node.children && (
        <NodeChildren
          checkIsCollapsed={checkIsCollapsed}
          nodeChildren={node.children}
          dispatch={dispatch}
          datasetIds={datasetIds}
          collapsedOverrides={collapsedOverrides}
        />
      )}
    </>
  )
}

SubsetNode.propTypes = {
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  groupCollapsed: PropTypes.bool.isRequired,
  depth: PropTypes.number.isRequired
}

const MemoizedRow = React.memo(Row)

function makeNodeKey(node) {
  return node.path.join(".")
}

function Row({ node, dispatch, collapsed, depth, datasetIds }) {
  const { name, subset, children } = node
  const key = makeNodeKey(node)
  const marginLeft = `${depth * 20}px`
  return (
    <tr>
      <td style={{ width: 20 }}>
        {subset && (
          <input
            onChange={(e) =>
              dispatch({
                type: "checkboxClicked",
                payload: { id: node.subset.id, checked: e.target.checked }
              })
            }
            type="checkbox"
          />
        )}
      </td>
      <td>
        <span style={{ marginLeft }} className="Subset__info">
          <span className={cn(!children && "is-invisible")}>
            <Expander collapsed={collapsed} dispatch={dispatch} nodeKey={key} />
          </span>
          <span>
            <Link href={`/biosubsets?filters=${name}&datasetIds=${datasetIds}`}>
              <a>{name}</a>
            </Link>
            {subset?.label && <span>: {subset.label}</span>}
          </span>
        </span>
      </td>
      <td style={{ whiteSpace: "nowrap" }}>
        <span>{subset?.count}</span>
      </td>
    </tr>
  )
}

function Expander({ collapsed, dispatch, nodeKey }) {
  return !collapsed ? (
    <span onClick={() => dispatch({ type: "collapse", payload: nodeKey })}>
      <span className="icon has-text-grey-dark is-clickable mr-2">
        <FaAngleDown size={18} />
      </span>
    </span>
  ) : (
    <span onClick={() => dispatch({ type: "expand", payload: nodeKey })}>
      <span className="icon has-text-grey-dark is-info is-clickable mr-2">
        <FaAngleRight size={18} />
      </span>
    </span>
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
  const tree = { name: "root", children: [], path: ["root"] }
  for (const hierarchy of sortedHierarchyPaths) {
    if (hierarchy.path) {
      const path = hierarchy.path.filter((p) => !!p)
      const fullPath = ["root", ...path]
      const node = getOrMakeNode(tree, fullPath)
      node.subset = subsetById[node.name]
    }
  }
  return tree
}

export function buildTreeForDetails(response, subsetById) {
  const rootSubset = response[0]
  const tree = { name: "root", children: [], path: ["root"] }
  const rootNode = getOrMakeChild(tree, rootSubset.id)
  rootNode.subset = rootSubset
  const child_terms = rootSubset.child_terms
  child_terms.forEach((c) => {
    // some subsets have themself in the children list
    if (rootSubset.id !== c) {
      const node = getOrMakeChild(rootNode, c)
      node.subset = subsetById[node.name]
    }
  })
  return tree
}

function sampleSelectUrl({ subsets, datasetIds }) {
  const samples = subsets
    .flatMap((subset) => [subset.id, ...(subset?.child_terms ?? [])])
    .join(",")

  return `/biosamples?bioontology=${samples}&datasetIds=${datasetIds}&filterLogic=OR&executeSearch=true`
}
