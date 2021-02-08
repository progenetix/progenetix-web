import { pluralizeWord, sampleSearchPageFiltersLink } from "../../hooks/api"
import React, { useEffect, useMemo, useState } from "react"
import cn from "classnames"
import { FaAngleDown, FaAngleRight } from "react-icons/fa"
import Tippy from "@tippyjs/react"
import { FixedSizeTree as Tree } from "react-vtree"
import useDebounce from "../../hooks/debounce"
import { min } from "lodash"
import { filterNode } from "./tree"

const ROW_HEIGHT = 30

export function SubsetsTree({
  tree,
  size,
  isFlat,
  datasetIds,
  checkedSubsets,
  checkboxClicked,
  subsetScope,
  sampleFilterScope
}) {
  const { searchInput, setSearchInput, filteredTree } = useFilterTree(tree)
  const [levelSelector, setLevelSelector] = useState(2)
  const treeRef = React.createRef()

  if (searchInput) {
    searchInput
  }
  if (setSearchInput) {
    setSearchInput
  }

  const hasSelectedSubsets = checkedSubsets.length > 0
  const selectSamplesHref =
    hasSelectedSubsets &&
    sampleSelectUrl({ subsets: checkedSubsets, datasetIds, sampleFilterScope })

  useEffect(() => {
    const state = Object.fromEntries(
      tree.children.map((rootNode) => [
        rootNode.uid,
        {
          open: levelSelector > 0,
          subtreeCallback(node, ownerNode) {
            // Since subtreeWalker affects the ownerNode as well, we can check if the
            if (node !== ownerNode) {
              // nodes are the same, and run the action only if they aren't
              node.isOpen =
                node.isOpen || node.data.nestingLevel < levelSelector
            }
          }
        }
      ])
    )
    treeRef.current.recomputeTree(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSelector])

  // <div className="field">
  // <input
  //   className="input "
  //   placeholder="Filter subsets ..."
  //   value={searchInput}
  //   onChange={(e) => setSearchInput(e.target.value)}
  // />
  // </div>

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const treeWalker = useMemo(() => mkTreeWalker(filteredTree), [tree])
  const height = Math.min(size * ROW_HEIGHT, 800)
  return (
    <>
      <div className="level">
        {!isFlat && (
          <>
            <div className="level-left">
              <div className="level-item">
                <p>Hierarchy Depth:</p>
              </div>
              <div className="level-item">
                <span className="select ">
                  <select
                    value={levelSelector}
                    onChange={(event) => {
                      setLevelSelector(event.target.value)
                    }}
                  >
                    <option value={0}>collapsed</option>
                    <option value={1}>1 level</option>
                    <option value={2}>2 levels</option>
                    <option value={3}>3 levels</option>
                    <option value={4}>4 levels</option>
                    <option value={5}>5 levels</option>
                    <option value={999}>all</option>
                  </select>
                </span>
              </div>
            </div>
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
        height={height}
        itemSize={ROW_HEIGHT}
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
  setOpen
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
              <Expander isOpen={isOpen} setOpen={setOpen} />
            </span>
          )}
          <Tippy content={`Show data for subset ${subsetId}`}>
            <a
              href={`/subsets/${subsetScope}?filters=${subsetId}&datasetIds=${datasetIds}`}
            >
              <span>{subsetId}</span>
            </a>
          </Tippy>
          {(subset?.label && (
            <span className="Subsets__tree__label" title={subset.label}>
              : {subset.label}
            </span>
          )) || <span>&nbsp;</span>}
          {isSearchPossible ? (
            <Tippy content={`Click to retrieve samples for ${subsetId}`}>
              <a
                style={{ flexShrink: "0" }}
                href={sampleSelectUrl({
                  subsets: [subset],
                  datasetIds,
                  sampleFilterScope
                })}
              >
                <span>
                  &nbsp;({subset.count} {pluralizeWord("sample", subset.count)})
                </span>
              </a>
            </Tippy>
          ) : subset ? (
            <span>
              &nbsp;({subset.count} {pluralizeWord("sample", subset.count)})
            </span>
          ) : null}
        </span>
      </span>
    </div>
  )
}

function Expander({ isOpen, setOpen }) {
  return isOpen ? (
    <span onClick={() => setOpen(false)}>
      <span className="icon has-text-grey-dark is-clickable mr-2">
        <FaAngleDown size={18} />
      </span>
    </span>
  ) : (
    <span onClick={() => setOpen(true)}>
      <span className="icon has-text-grey-dark is-info is-clickable mr-2">
        <FaAngleRight size={18} />
      </span>
    </span>
  )
}

// This function prepares an object for yielding. We can yield an object
// that has `data` object with `id` and `isOpenByDefault` fields.
// We can also add any other data here.
const getNodeData = (node, nestingLevel) => {
  const subset = node.subset
  // Here we are sending the information about the node to the Tree component
  // and receive an information about the openness state from it. The
  // `refresh` parameter tells us if the full update of the tree is requested;
  // basing on it we decide to return the full node data or only the node
  // id to update the nodes order.

  const lineHeightPx = 16
  const labelLength = subset?.label?.length ?? 0

  // Useful for publications. 150 is approx. the number of chars before line break.
  // This is a quick fix and need to be adapted if the font style ever change.
  // This is a quick fix and it does not work in mobile.
  const defaultHeight =
    ROW_HEIGHT + Math.floor(labelLength / 150) * lineHeightPx

  const openByDefault = false

  return {
    data: {
      id: node.uid.toString(),
      defaultHeight,
      isLeaf: node.children.length === 0,
      isOpenByDefault: openByDefault,
      name: node.name,
      subsetId: node.id,
      subset,
      nestingLevel
    },
    nestingLevel,
    node
  }
}

const mkTreeWalker = (tree) => {
  return function* treeWalker() {
    // Here we send root nodes to the component.
    for (let i = 0; i < tree.children.length; i++) {
      yield getNodeData(tree.children[i], 0)
    }
    while (true) {
      // Get the parent component back. It will be the object
      // the `getNodeData` function constructed, so you can read any data from it.
      const parentMeta = yield

      for (let i = 0; i < parentMeta.node.children.length; i++) {
        yield getNodeData(
          parentMeta.node.children[i],
          parentMeta.nestingLevel + 1
        )
      }
    }
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
