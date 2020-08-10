// Small "functional" tree utilities. See tests for understanding
export function hasChildren(node) {
  return (
    !!node &&
    typeof node === "object" &&
    typeof node.children !== "undefined" &&
    node.children.length > 0
  )
}

export function getNode(node, path) {
  const name = path.slice(-1)[0]
  const parentPath = path.slice(0, -1)
  if (parentPath.length > 0) {
    const parentNode = getNode(node, parentPath)
    if (hasChildren(parentNode)) {
      return parentNode.children.find((c) => c.name === name)
    } else return null
  } else {
    if (node.name === name) return node
    return null
  }
}

// Note: mutate the node
export function getOrMakeChild(parent, name) {
  if (!hasChildren(parent)) {
    parent.children = []
  }
  // ignore duplicates
  if (!parent.children.find((c) => c.name === name)) {
    parent.children.push({
      name,
      path: [...(parent.path ?? parent.name), name]
    })
  }
  const [child] = parent.children.slice(-1)
  return child
}

// Note: mutate the node
export function getOrMakeNode(baseNode, path) {
  const [name] = path.slice(-1)
  const parentPath = path.slice(0, -1)
  const parentNode =
    getNode(baseNode, parentPath) ?? getOrMakeNode(baseNode, parentPath)
  return getOrMakeChild(parentNode, name)
}
