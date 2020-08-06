import { useBioSubsets } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import React, { useMemo, useReducer } from "react"
import { useQuery } from "../../hooks/query"
import { Layout } from "../../components/layouts/Layout"
import { sortBy } from "lodash"
import { getOrMakeNode, map } from "./tree"
import cn from "classnames"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"
import PropTypes from "prop-types"

const defaultFilters = "NCIT"

export default function BioSubsetsPage() {
  const urlQuery = useQuery()
  if (!urlQuery) return null // query will only be defined after first mount

  const { filters } = urlQuery
  return (
    <Layout title="Subsets" headline="Subsets">
      <SubsetsLoader filters={filters || defaultFilters} />
    </Layout>
  )
}

function SubsetsLoader({ filters }) {
  const { data, error, isLoading } = useBioSubsets({ filters })
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

const initialState = { expanded: {} }

function reducer(state, { type, payload }) {
  switch (type) {
    case "expand":
      return { expanded: { ...state.expanded, [payload]: true } }
    case "collapse":
      return { expanded: { ...state.expanded, [payload]: false } }
    default:
      throw new Error()
  }
}

function SubsetsTree({ tree }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  let headers = (
    <tr>
      <th></th>
      <th>Subsets</th>
      <th>Progenetix</th>
    </tr>
  )
  return (
    <table className="table is-striped is-fullwidth">
      <thead>{headers}</thead>
      <tbody>
        {map(tree, (node, idx) => {
          if (node.name === "root") return null
          const isHidden = hasHiddenParent(node, state.expanded)
          const expanded = state.expanded[node.path.join(".")] !== false
          return (
            !isHidden && (
              <SubsetNode
                node={node}
                key={idx}
                expanded={expanded}
                dispatch={dispatch}
              />
            )
          )
        })}
      </tbody>
    </table>
  )
}

function hasHiddenParent(node, expandedByKey) {
  for (let i = 0; i < node.path.length; i++) {
    const parentKey = node.path.slice(0, i).join(".")
    if (expandedByKey[parentKey] === false) {
      return true
    }
  }
  return false
}

function SubsetNode({ node, dispatch, expanded }) {
  const { name, subset, children } = node
  const key = node.path.join(".")
  const depth = node.path.length
  const marginLeft = `${depth - 2}rem`
  return (
    <tr>
      <td>
        <input type="checkbox" className="Subset__check" />
      </td>
      <td>
        <span style={{ marginLeft }} className="Subset__info">
          <span className={cn(!children && "is-invisible")}>
            <Expander expanded={expanded} dispatch={dispatch} nodeKey={key} />
          </span>
          <span>
            {name}
            {subset?.label && <span>: {subset.label}</span>}
          </span>
        </span>
      </td>
      <td>{subset?.count}</td>
    </tr>
  )
}

SubsetNode.propTypes = {
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired
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
