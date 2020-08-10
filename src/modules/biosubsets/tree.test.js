import { hasChildren, getNode, getOrMakeChild, getOrMakeNode } from "./tree"

test("hasChildren", () => {
  expect(hasChildren({ name: "c", children: [{ name: "d" }] })).toBeTruthy()
  expect(hasChildren({ name: "c" })).toBeFalsy()
})

test("getNode", () => {
  expect(getNode({ name: "c" }, ["c"])).toStrictEqual({ name: "c" })
  expect(getNode({ name: "c" }, ["d"])).toStrictEqual(null)
  expect(
    getNode({ name: "c", children: [{ name: "d" }] }, ["c", "d"])
  ).toStrictEqual({ name: "d" })
  expect(
    getNode(
      { name: "c", children: [{ name: "d", children: [{ name: "e" }] }] },
      ["c", "d", "e"]
    )
  ).toStrictEqual({ name: "e" })
  expect(
    getNode(
      { name: "c", children: [{ name: "d", children: [{ name: "e" }] }] },
      ["c", "d"]
    )
  ).toStrictEqual({ name: "d", children: [{ name: "e" }] })
  expect(
    getNode({ name: "c", children: [{ name: "d" }] }, ["a", "d"])
  ).toStrictEqual(null)
})

test("getOrMakeChild", () => {
  const node = { name: "c" }
  getOrMakeChild(node, "d")
  expect(node).toStrictEqual({
    name: "c",
    children: [
      {
        name: "d",
        path: ["c", "d"]
      }
    ]
  })
})

test("makeNode", () => {
  const node = { name: "c" }
  getOrMakeNode(node, ["c", "d"])
  expect(node).toStrictEqual({
    name: "c",
    children: [{ name: "d", path: ["c", "d"] }]
  })
})

test("getOrMakeNode with deeper node", () => {
  const node = { name: "c" }
  getOrMakeNode(node, ["c", "d", "e", "f"])
  expect(node).toStrictEqual({
    children: [
      {
        children: [
          {
            children: [
              {
                name: "f",
                path: ["c", "d", "e", "f"]
              }
            ],
            name: "e",
            path: ["c", "d", "e"]
          }
        ],
        name: "d",
        path: ["c", "d"]
      }
    ],
    name: "c"
  })
})
