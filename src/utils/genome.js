// nodejs, can only be loaded from static props
import { groupBy } from "lodash"

export const getCytoBands = async () => {
  const fs = require("fs")
  const path = require("path")
  const csv = require("neat-csv")
  const cytoBandIdeoPath = path.join(
    process.cwd(),
    "config",
    "cytoBandIdeo.txt"
  )
  const rows = await csv(fs.createReadStream(cytoBandIdeoPath), {
    headers: ["referenceName", "start", "end", "cytoband", "stain"],
    separator: "\t",
    skipComments: true
  })
  return groupBy(rows, "referenceName")
}
