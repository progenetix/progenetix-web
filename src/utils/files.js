import FileSaver from "file-saver"

export function initiateSaveAsJson(dataJson, name) {
  const file = new File([JSON.stringify(dataJson)], name, {
    type: "text/json;charset=utf-8"
  })
  FileSaver.saveAs(file)
}

export function openJsonInNewTab(dataJson) {
  const jsonString = JSON.stringify(dataJson, null, 2)
  const x = window.open()
  x.document.open()
  x.document.write(`<html><body><pre>${jsonString}</pre></body></html>`)
  x.document.close()
}
