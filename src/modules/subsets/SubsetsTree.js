import { pluralizeWord, sampleSearchPageFiltersLink } from "../../hooks/api"
import React, { useEffect, useMemo, useState } from "react"
import cn from "classnames"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"
import Tippy from "@tippyjs/react"
import { VariableSizeTree as Tree } from "react-vtree"
import useDebounce from "../../hooks/debounce"
import { min } from "lodash"
import { filterNode } from "./tree"

const ROW_HEIGHT = 40

export function SubsetsTree({
  tree,
  isFlat,
  datasetIds,
  checkedSubsets,
  checkboxClicked,
  subsetScope,
  sampleFilterScope
}) {
  const {
    searchInput,
    debouncedSearchInput,
    setSearchInput,
    filteredTree
  } = useFilterTree(tree)
  const [levelSelector, setLevelSelector] = useState(1)
  const [useDefaultExpanded, setUseDefaultExpanded] = useState(true)
  const defaultExpandedLevel = debouncedSearchInput
    ? 99
    : useDefaultExpanded
    ? levelSelector
    : 0

  const treeRef = React.createRef()

  const hasSelectedSubsets = checkedSubsets.length > 0
  const selectSamplesHref =
    hasSelectedSubsets &&
    sampleSelectUrl({ subsets: checkedSubsets, datasetIds, sampleFilterScope })

  useEffect(() => {
    treeRef.current.recomputeTree({
      useDefaultOpenness: true,
      refreshNodes: true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExpandedLevel])

  const [size, setSize] = useState(0)
  const treeWalker = useMemo(
    () => mkTreeWalker(filteredTree, defaultExpandedLevel, setSize),
    [defaultExpandedLevel, filteredTree]
  )

  return (
    <>
      <div className="Subsets__controls">
        <div className="field">
          <input
            className="input "
            placeholder="Filter subsets ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {!isFlat && (
          <>
            <div
              className="button "
              onClick={() => setUseDefaultExpanded(false)}
            >
              Collapse all
            </div>
            <div
              className="button "
              onClick={() => setUseDefaultExpanded(true)}
            >
              Expand
            </div>
            <span className="select ">
              <select
                value={levelSelector}
                onChange={(event) => {
                  setLevelSelector(event.target.value)
                  setUseDefaultExpanded(true)
                }}
              >
                <option value={1}>1 level</option>
                <option value={2}>2 levels</option>
                <option value={3}>3 levels</option>
                <option value={4}>4 levels</option>
                <option value={5}>5 levels</option>
                <option value={999}>all</option>
              </select>
            </span>
          </>
        )}
        {hasSelectedSubsets && (
          <a className="button is-primary " href={selectSamplesHref || null}>
            Search Samples from selection
          </a>
        )}{" "}
      </div>
      <ul className="tags">
        {!hasSelectedSubsets && (
          <span className="tag is-dark">No Selection</span>
        )}
        {checkedSubsets.map((subset) => (
          <li className="tag is-primary" key={subset.id}>
            {subset.label} ({subset.count})
          </li>
        ))}
      </ul>
      <Tree
        ref={treeRef}
        treeWalker={treeWalker}
        estimatedItemSize={ROW_HEIGHT}
        height={Math.min(size * ROW_HEIGHT, 800)}
        rowComponent={Row}
        itemData={{
          datasetIds,
          checkboxClicked,
          sampleFilterScope,
          subsetScope,
          isFlat
        }}
      >
        {Node}
      </Tree>
    </>
  )
}

export const Row = ({
  index,
  data: { component: Node, treeData, order, records },
  style
}) =>
  React.createElement(
    Node,
    Object.assign({}, records[order[index]], {
      style: style,
      treeData: treeData,
      index
    })
  )

// Node component receives all the data we created in the `treeWalker` +
// internal openness state (`isOpen`), function to change internal openness
// state (`toggle`) and `style` parameter that should be added to the root div.
function Node({
  data: { isLeaf, subsetId, subset, nestingLevel },
  treeData: {
    datasetIds,
    checkboxClicked,
    subsetScope,
    sampleFilterScope,
    isFlat
  },
  index,
  isOpen,
  style,
  toggle
}) {
  const isSearchPossible = subset && canSearch(subset)
  const even = index % 2 === 0
  return (
    <div
      style={{
        ...style,
        background: even ? "none" : "#fafafa"
      }}
      className="Subsets__tree__row"
    >
      <span
        className="Subsets__tree__cell"
        style={{ justifyContent: "center", width: 30, flex: "none" }}
      >
        {subset && isSearchPossible && (
          <input
            onChange={(e) =>
              checkboxClicked({ id: subset.id, checked: e.target.checked })
            }
            type="checkbox"
          />
        )}
      </span>
      <span
        className="Subsets__tree__cell"
        style={{
          flex: "1 1 auto"
        }}
      >
        <span
          className="Subsets__tree__info"
          style={{
            paddingLeft: `${nestingLevel * 20}px`
          }}
        >
          {!isFlat && (
            <span className={cn(isLeaf && "is-invisible")}>
              <Expander isOpen={isOpen} toggle={toggle} />
            </span>
          )}
          <span>
            <Tippy content={`Show data for subset ${subsetId}`}>
              <a
                href={`/subsets/${subsetScope}?filters=${subsetId}&datasetIds=${datasetIds}`}
              >
                <span>{subsetId}</span>
              </a>
            </Tippy>
            {subset?.label && <span>: {subset?.label}</span>}
            {isSearchPossible ? (
              <Tippy content={`Click to retrieve samples for ${subsetId}`}>
                <a
                  href={sampleSelectUrl({
                    subsets: [subset],
                    datasetIds,
                    sampleFilterScope
                  })}
                >
                  <span>
                    {" "}
                    ({subset.count} {pluralizeWord("sample", subset.count)})
                  </span>
                </a>
              </Tippy>
            ) : subset ? (
              <span>
                {" "}
                ({subset.count} {pluralizeWord("sample", subset.count)})
              </span>
            ) : null}
          </span>
        </span>
      </span>
    </div>
  )
}

function Expander({ isOpen, toggle }) {
  return isOpen ? (
    <span onClick={toggle}>
      <span className="icon has-text-grey-dark is-clickable mr-2">
        <FaAngleDown size={18} />
      </span>
    </span>
  ) : (
    <span onClick={toggle}>
      <span className="icon has-text-grey-dark is-info is-clickable mr-2">
        <FaAngleRight size={18} />
      </span>
    </span>
  )
}

const mkTreeWalker = (tree, defaultExpandedLevel, setSize) => {
  return function* treeWalker(refresh) {
    const stack = []
    // Remember all the necessary data of the first node in the stack.
    // We don't push the root, but its children
    tree?.children?.forEach((node) => {
      stack.push({
        nestingLevel: 0,
        node
      })
    })

    let size = 0
    // Walk through the tree until we have no nodes available.
    while (stack.length !== 0) {
      const {
        nestingLevel,
        node: { children = [], uid, subset, id }
      } = stack.pop()
      // Here we are sending the information about the node to the Tree component
      // and receive an information about the openness state from it. The
      // `refresh` parameter tells us if the full update of the tree is requested;
      // basing on it we decide to return the full node data or only the node
      // id to update the nodes order.
      const openByDefault = nestingLevel < defaultExpandedLevel

      console.log(subset?.label)

      const lineHeightPx = 16
      const isOpened = yield refresh
        ? {
            id: uid,
            defaultHeight:
              // Useful for publications. 150 is approx. the number of chars before line break.
              // This is a quick fix and need to be adapted if the font style ever change.
              ROW_HEIGHT +
              Math.floor(subset?.label.length / 150) * lineHeightPx,
            isLeaf: children.length === 0,
            isOpenByDefault: openByDefault,
            subsetId: id,
            subset,
            nestingLevel
          }
        : uid
      size++
      // Basing on the node openness state we are deciding if we need to render
      // the child nodes (if they exist).
      if (children.length !== 0 && isOpened) {
        // Since it is a stack structure, we need to put nodes we want to render
        // first to the end of the stack.
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({
            nestingLevel: nestingLevel + 1,
            node: children[i]
          })
        }
      }
    }
    setSize(size)
  }
}

const match = (debouncedSearchInput) => (node) =>
  node.id.toLowerCase().includes(debouncedSearchInput.toLowerCase()) ||
  node.subset?.label.toLowerCase().includes(debouncedSearchInput.toLowerCase())

function useFilterTree(tree) {
  const [searchInput, setSearchInput] = useState("")
  const debouncedSearchInput = useDebounce(searchInput, 500) || ""
  const filteredTree = filterNode(tree, match(debouncedSearchInput)) || []
  return { searchInput, debouncedSearchInput, setSearchInput, filteredTree }
}

function sampleSelectUrl({ subsets, datasetIds, sampleFilterScope }) {
  const filters = subsets.map(({ id }) => id).join(",")
  // here the `bioontology` parameter has to be used instead of `filters` for transfer to the search form
  return sampleSearchPageFiltersLink({ datasetIds, sampleFilterScope, filters })
}

function canSearch(subset) {
  // Only necessary for NCIT
  if (!subset.id.includes("NCIT:")) return true
  const minDepth = subset.hierarchy_paths
    ? min(subset.hierarchy_paths?.map((hp) => hp.depth))
    : 999
  return minDepth >= 2
}
