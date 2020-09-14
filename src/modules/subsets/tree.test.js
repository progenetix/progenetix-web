import { hasChildren, getNode, getOrMakeChild, getOrMakeNode } from "./tree"

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
  const node = { id: "c" }
  getOrMakeChild(node, "d")
  expect(node).toStrictEqual({
    id: "c",
    children: [
      {
        id: "d",
        path: ["c", "d"]
      }
    ]
  })
})

test("makeNode", () => {
  const node = { id: "c" }
  getOrMakeNode(node, ["c", "d"])
  expect(node).toStrictEqual({
    id: "c",
    children: [{ id: "d", path: ["c", "d"] }]
  })
})

test("getOrMakeNode with deeper node", () => {
  const node = { id: "c" }
  getOrMakeNode(node, ["c", "d", "e", "f"])
  expect(node).toStrictEqual({
    children: [
      {
        children: [
          {
            children: [
              {
                id: "f",
                path: ["c", "d", "e", "f"]
              }
            ],
            id: "e",
            path: ["c", "d", "e"]
          }
        ],
        id: "d",
        path: ["c", "d"]
      }
    ],
    id: "c"
  })
})
