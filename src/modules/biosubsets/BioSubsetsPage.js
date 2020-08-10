import { useBioSubsets } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React, { useCallback, useMemo, useReducer, useState } from "react"
import { withQuery } from "../../hooks/query"
import { Layout } from "../../components/layouts/Layout"
import { sortBy } from "lodash"
import { getOrMakeNode } from "./tree"
import cn from "classnames"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"
import PropTypes from "prop-types"
import biosubsetsConfig from "./config.yaml"

function useConfigSelect(config) {
  const configEntries = Object.entries(config)
  const defaultSelected = configEntries[0][0]
  const [selected, setSelected] = useState(defaultSelected)
  const options = configEntries.map(([k, v]) => (
    <option key={k}>{v.label}</option>
  ))
  return {
    selected,
    setSelected,
    options
  }
}

const BioSubsetsPage = withQuery(() => {
  const {
    selected: selectedFilter,
    setSelected: setSelectedFilter,
    options: filtersOptions
  } = useConfigSelect(biosubsetsConfig.filters)
  const {
    selected: selectedDatasetId,
    setSelected: setSelectedDatasetId,
    options: datasetIdsOptions
  } = useConfigSelect(biosubsetsConfig.datasetsIds)

  return (
    <Layout title="Subsets" headline="Subsets">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <p>Filters:</p>
          </div>
          <div className="level-item">
            <span className="select">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
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
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
              >
                {datasetIdsOptions}
              </select>
            </span>
          </div>
        </div>
      </div>
      <SubsetsLoader filter={selectedFilter} datasetId={selectedDatasetId} />
    </Layout>
  )
})

export default BioSubsetsPage

function SubsetsLoader({ filter, datasetId }) {
  const { data, error, isLoading } = useBioSubsets({
    filters: filter,
    datasetId: datasetId
  })
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && <SubsetsResponse response={data} datasetId={datasetId} />}
    </Loader>
  )
}

function SubsetsResponse({ response, datasetId }) {
  // memoize response computing
  const tree = useMemo(() => buildTree(response), [response])
  return <SubsetsTree tree={tree} datasetId={datasetId} />
}

const initialState = {
  overrides: {},
  defaultState: "expanded",
  defaultExpandedLevel: 3
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
    default:
      throw new Error()
  }
}

const mkIsCollapsedByPath = (state) => (path) => {
  const override = state.overrides[path.join(".")]
  if (override != null) return override === "collapsed"
  if (state.defaultState === "expanded") {
    const depth = path.length - 2 // 2 because 1 is the tree fake "root"
    return depth > state.defaultExpandedLevel
  } else {
    return true
  }
}

function SubsetsTree({ tree, datasetId }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const isCollapsedByPath = useCallback(mkIsCollapsedByPath(state), [state])
  let headers = (
    <tr>
      <th />
      <th>Subsets</th>
      <th>Samples</th>
    </tr>
  )
  return (
    <div>
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
            value={state.defaultExpandedLevel}
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

      <table className="table is-striped is-fullwidth">
        <thead>{headers}</thead>
        <tbody>
          <NodeChildren
            isCollapsedByPath={isCollapsedByPath}
            nodeChildren={tree.children}
            dispatch={dispatch}
            datasetId={datasetId}
          />
        </tbody>
      </table>
    </div>
  )
}

function NodeChildren({
  isCollapsedByPath,
  nodeChildren,
  datasetId,
  dispatch
}) {
  return nodeChildren.map((node, idx) => {
    const depth = node.path.length - 2 // 2 because 1 is the tree fake "root"
    const groupCollapsed = isCollapsedByPath(node.path)
    return (
      <SubsetNode
        key={idx}
        node={node}
        groupCollapsed={groupCollapsed}
        dispatch={dispatch}
        depth={depth}
        datasetId={datasetId}
        isCollapsedByPath={isCollapsedByPath}
      />
    )
  })
}

const SubsetNode = ({
  node,
  dispatch,
  groupCollapsed,
  depth,
  datasetId,
  isCollapsedByPath
}) => {
  return (
    <>
      <SubsetRow
        node={node}
        dispatch={dispatch}
        collapsed={groupCollapsed}
        depth={depth}
        datasetId={datasetId}
      />
      {!groupCollapsed && node.children && (
        <NodeChildren
          isCollapsedByPath={isCollapsedByPath}
          nodeChildren={node.children}
          dispatch={dispatch}
          datasetId={datasetId}
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

const SubsetRow = React.memo(
  ({ node, dispatch, collapsed, depth, datasetId }) => {
    const { name, subset, children } = node
    const key = node.path.join(".")
    const marginLeft = `${depth}rem`
    return (
      <tr>
        <td style={{ width: 20 }}>
          <input type="checkbox" />
        </td>
        <td>
          <span style={{ marginLeft }} className="Subset__info">
            <span className={cn(!children && "is-invisible")}>
              <Expander
                collapsed={collapsed}
                dispatch={dispatch}
                nodeKey={key}
              />
            </span>
            <span>
              {name}
              {subset?.label && <span>: {subset.label}</span>}
            </span>
          </span>
        </td>
        <td style={{ width: 25 }}>
          {subset?.count}{" "}
          <a
            href={`https://progenetix.org/cgi/pgx_subsets.cgi?filters=${name}&datasetIds=${datasetId}`}
          >
            {"{↗}"}
          </a>
        </td>
      </tr>
    )
  }
)

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

export function buildTree(response) {
  const subsetById = Object.fromEntries(
    response.map((subset) => [subset.id, subset])
  )
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
