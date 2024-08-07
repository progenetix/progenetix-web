import FileSaver from "file-saver"

export function initiateSaveAs(string, name, type = "text/csv;charset=utf-8") {
  const file = new File([string], name, {
    type: type
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
