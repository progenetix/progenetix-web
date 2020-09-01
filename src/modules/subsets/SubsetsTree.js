import React, { useEffect, useState } from "react"
import { isEqual } from "lodash"
import PropTypes from "prop-types"
import cn from "classnames"
import Link from "next/link"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"

export default function SubsetsTree({
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

// Need deep compare (isEqual) because collapsedOverrides wont be equals after filtering
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
            <Link
              href={`/subsets/list?filters=${name}&datasetIds=${datasetIds}`}
            >
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
