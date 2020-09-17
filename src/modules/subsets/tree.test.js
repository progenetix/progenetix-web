import {
  hasChildren,
  getNode,
  getOrMakeChild,
  getOrMakeNode,
  filterNode
} from "./tree"

test("hasChildren", () => {
  expect(hasChildren({ id: "c", children: [{ id: "d" }] })).toBeTruthy()
  expect(hasChildren({ id: "c" })).toBeFalsy()
})

test("getNode", () => {
  expect(getNode({ id: "c" }, ["c"])).toStrictEqual({ id: "c" })
  expect(getNode({ id: "c" }, ["d"])).toStrictEqual(null)
  expect(
    getNode({ id: "c", children: [{ id: "d" }] }, ["c", "d"])
  ).toStrictEqual({ id: "d" })
  expect(
    getNode({ id: "c", children: [{ id: "d", children: [{ id: "e" }] }] }, [
      "c",
      "d",
      "e"
    ])
  ).toStrictEqual({ id: "e" })
  expect(
    getNode({ id: "c", children: [{ id: "d", children: [{ id: "e" }] }] }, [
      "c",
      "d"
    ])
  ).toStrictEqual({ id: "d", children: [{ id: "e" }] })
  expect(
    getNode({ id: "c", children: [{ id: "d" }] }, ["a", "d"])
  ).toStrictEqual(null)
})

test("getOrMakeChild", () => {
  const node = { id: "c", uid: "c" }
  getOrMakeChild(node, "d")
  expect(node).toStrictEqual({
    id: "c",
    uid: "c",
    children: [
      {
        id: "d",
        uid: "d",
        path: ["c", "d"]
      }
    ]
  })
})

test("makeNode", () => {
  const node = { id: "c", uid: "c" }
  getOrMakeNode(node, ["c", "d"])
  expect(node).toStrictEqual({
    id: "c",
    uid: "c",
    children: [{ id: "d", uid: "d", path: ["c", "d"] }]
  })
})

test("getOrMakeNode with deeper node", () => {
  const node = { id: "c", uid: "c" }
  getOrMakeNode(node, ["c", "d", "e", "f"])
  expect(node).toStrictEqual({
    children: [
      {
        children: [
          {
            children: [
              {
                id: "f",
                uid: "f",
                path: ["c", "d", "e", "f"]
              }
            ],
            id: "e",
            uid: "e",
            path: ["c", "d", "e"]
          }
        ],
        id: "d",
        uid: "d",
        path: ["c", "d"]
      }
    ],
    id: "c",
    uid: "c"
  })
})

test("filterNode", () => {
  const node = { id: "a", uid: "a" }
  getOrMakeNode(node, ["a", "b", "c"])
  getOrMakeNode(node, ["a", "d", "e", "f"])
  getOrMakeNode(node, ["a", "d", "e", "g"])
  const filtered = filterNode(node, (node) => node.id === "f")
  expect(filtered).toStrictEqual({
    id: "a",
    uid: "a",
    children: [
      {
        id: "d",
        uid: "d",
        path: ["a", "d"],
        children: [
          {
            id: "e",
            uid: "e",
            path: ["a", "d", "e"],
            children: [
              {
                id: "f",
                uid: "f",
                path: ["a", "d", "e", "f"],
                children: []
              }
            ]
          }
        ]
      }
    ]
  })
})
