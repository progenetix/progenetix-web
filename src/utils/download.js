import FileSaver from "file-saver"

export function initiateSaveAsJson(dataJson, name) {
  const file = new File([JSON.stringify(dataJson)], name, {
    type: "text/json;charset=utf-8"
  })
  FileSaver.saveAs(file)
}
