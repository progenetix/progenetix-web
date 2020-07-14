const { buildQueryParameters } = require("./bycon")

test("build a query", () => {
  expect(
    buildQueryParameters({
      datasetIds: ["arraymap", "dipg"],
      assemblyId: "GRCh38",
      includeDatasetResonses: "ALL",
      requestType: "variantCNVrequest",
      referenceName: "9",
      variantType: "DEL",
      start: "20000001",
      end: "21967753-23000000",
      referenceBases: "N",
      alternateBases: "G",
      bioontology: ["NCIT:C102872"],
      materialtype: "EFO:0009656",
      filters: "filter1"
    })
  ).toBe(
    "datasetIds=arraymap&datasetIds=dipg&assemblyId=GRCh38&includeDatasetResonses=ALL&requestType=variantCNVrequest&referenceName=9&variantType=DEL&referenceBases=N&alternateBases=G&bioontology=NCIT%3AC102872&materialtype=EFO%3A0009656&filters=filter1&start=20000000&end=21967752&end=23000000"
  )
})
