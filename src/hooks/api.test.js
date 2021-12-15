import { replaceWithProxy } from "./api"

const { buildQueryParameters } = require("./api")

test("build a complete query", () => {
  expect(
    buildQueryParameters({
      datasetIds: ["progenetix"],
      assemblyId: "GRCh38",
      referenceName: "9",
      variantType: "DEL",
      start: "20000001",
      end: "21967753-23000000",
      referenceBases: "N",
      alternateBases: "G",
      bioontology: ["NCIT:C102872", "NCIT:C102873"],
      sex: "PATO:0020002",
      materialtype: "EFO:0009656",
      freeFilters: "geolat:49,geolong:8.69,geodist:2000000"
    })
  ).toBe(
    "datasetIds=progenetix&assemblyId=GRCh38&referenceName=9&variantType=DEL&referenceBases=N&alternateBases=G&start=20000000&end=21967753&end=23000000&filters=NCIT%3AC102872&filters=NCIT%3AC102873&filters=PATO%3A0020002&filters=EFO%3A0009656&filters=geolat%3A49&filters=geolong%3A8.69&filters=geodist%3A2000000"
  )
})

test("build a query with start", () => {
  expect(
    buildQueryParameters({
      start: "20000001"
    })
  ).toBe("start=20000000")
})

test("build a query with start range", () => {
  expect(
    buildQueryParameters({
      start: "20000001,20000003"
    })
  ).toBe("start=20000000&start=20000003")
})

test("build a query with end", () => {
  expect(
    buildQueryParameters({
      end: "21967753"
    })
  ).toBe("end=21967753")
})

test("build a query with end range", () => {
  expect(
    buildQueryParameters({
      end: "21967753-23000000"
    })
  ).toBe("end=21967753&end=23000000")
})

test("replaceWithProxy", () => {
  expect(
    replaceWithProxy(
      "http://test.progenetix.org:3000/test?query=a",
      true,
      "api/"
    )
  ).toBe("api/test?query=a")
  expect(
    replaceWithProxy(
      new URL("http://test.progenetix.org:3000/test?query=a"),
      true,
      "api/"
    )
  ).toBe("api/test?query=a")
})
