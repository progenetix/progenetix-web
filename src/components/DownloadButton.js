import { initiateSaveAs } from "../utils/files"
import { useState } from "react"
import json2csv from "json2csv"

export default function DownloadButton({ json, fileName, label }) {
  const [downloadType, setDownloadType] = useState("JSON")
  const handleSaveClick =
    downloadType === "JSON"
      ? () => saveAsJson(json, `${fileName}.json`)
      : () => saveAsCSV(json, `${fileName}.csv`)
  return (
    <div className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            onChange={(e) => setDownloadType(e.target.value)}
            defaultValue="JSON"
          >
            <option>JSON</option>
            <option>CSV</option>
          </select>
        </span>
      </p>
      <p className="control">
        <button
          className="button is-light is-primary"
          onClick={handleSaveClick}
        >
          <span>{label}</span>
        </button>
      </p>
    </div>
  )
}

function saveAsJson(json, fileName) {
  initiateSaveAs(
    JSON.stringify(json, null, 2),
    fileName,
    "text/json;charset=utf-8"
  )
}

function saveAsCSV(json, fileName) {
  const { unwind, flatten } = json2csv.transforms
  const transforms = [flatten({ objects: true, arrays: true }), unwind()]
  const parser = new json2csv.Parser({ transforms })
  const data = parser.parse(json)
  initiateSaveAs(data, fileName, "text/csv;charset=utf-8")
}
