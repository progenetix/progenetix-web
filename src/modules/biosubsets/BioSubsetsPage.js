import { useBioSubsets } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React, { useMemo, useReducer, useState } from "react"
import { withQuery } from "../../hooks/query"
import { Layout } from "../../components/layouts/Layout"
import { sortBy } from "lodash"
import { getOrMakeNode, map } from "./tree"
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
    selected: selectedFilters,
    setSelected: setSelectedFilters,
    options: filtersOptions
  } = useConfigSelect(biosubsetsConfig.filters)
  const {
    selected: selectedDatasetIds,
    setSelected: setSelectedDatasetIds,
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
  const { data, error, isLoading } = useBioSubsets({
    filters,
    datasetIds
  })
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      {data && <SubsetsResponse response={data} />}
    </Loader>
  )
}

function SubsetsResponse({ response }) {
  // memoize response computing
  const tree = useMemo(() => buildTree(response), [response])
  return <SubsetsTree tree={tree} />
}

const initialState = {
  collapsedOverrides: { root: false },
  defaultState: false,
  defaultExpandedLevel: 3
}

function reducer(state, { type, payload }) {
  switch (type) {
    case "expand":
      return {
        ...state,
        collapsedOverrides: { ...state.collapsedOverrides, [payload]: false }
      }
    case "collapse":
      return {
        ...state,
        collapsedOverrides: { ...state.collapsedOverrides, [payload]: true }
      }
    case "collapseAll":
      return {
        ...state,
        collapsedOverrides: initialState.collapsedOverrides,
        defaultState: "collapsed"
      }
    case "expandAll":
      return {
        ...state,
        collapsedOverrides: initialState.collapsedOverrides,
        defaultState: "expanded"
      }
    case "setLevel":
      return {
        ...state,
        collapsedOverrides: {},
        defaultState: "expanded",
        defaultExpandedLevel: payload
      }
    default:
      throw new Error()
  }
}

function SubsetsTree({ tree }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  function isCollapsedByPath(path) {
    const override = state.collapsedOverrides[path.join(".")]
    if (override != null) return override
    if (state.defaultState === "expanded") {
      const depth = path.length - 2 // 2 because 1 is the tree fake "root"
      return depth > state.defaultExpandedLevel
    } else {
      return true
    }
  }

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
          {map(tree, (node, idx) => {
            if (node.name === "root") return null
            const depth = node.path.length - 2 // 2 because 1 is the tree fake "root"
            const isRoot = depth === 0
            const isCollapsed =
              !isRoot && hasCollapsedParent(node, isCollapsedByPath)
            const groupCollapsed = isCollapsedByPath(node.path)

            return (
              !isCollapsed && (
                <SubsetNode
                  node={node}
                  key={idx}
                  groupExpanded={!groupCollapsed}
                  dispatch={dispatch}
                  depth={depth}
                />
              )
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function hasCollapsedParent(node, isCollapsedByKey) {
  for (let i = 1; i < node.path.length; i++) {
    const parentPath = node.path.slice(0, i)

    if (isCollapsedByKey(parentPath)) {
      return true
    }
  }
  return false
}

function SubsetNode({ node, dispatch, groupExpanded, depth }) {
  const { name, subset, children } = node
  const key = node.path.join(".")
  const marginLeft = `${depth}rem`
  // TODO: dataset link is just for testing; should lead to details page
  const dataset = "progenetix"
  return (
    <tr>
      <td style={{ width: 20 }}>
        <input type="checkbox" />
      </td>
      <td>
        <span style={{ marginLeft }} className="Subset__info">
          <span className={cn(!children && "is-invisible")}>
            <Expander
              expanded={groupExpanded}
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
          href={`https://progenetix.org/cgi/pgx_subsets.cgi?filters=${name}&datasetIds=${dataset}`}
        >
          {"{↗}"}
        </a>
      </td>
    </tr>
  )
}

SubsetNode.propTypes = {
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  groupExpanded: PropTypes.bool.isRequired,
  depth: PropTypes.number.isRequired
}

function Expander({ expanded, dispatch, nodeKey }) {
  return expanded ? (
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
