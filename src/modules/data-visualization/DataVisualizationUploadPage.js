import { Layout } from "../../components/layouts/Layout"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { uploadFile } from "../../hooks/api"

export default function DataVisualizationUploadPage() {
  return (
    <Layout
      title="Data visualization Upload"
      headline="Data visualization Upload"
    >
      <DataVisualizationUpload />
    </Layout>
  )
}

function DataVisualizationUpload() {
  const [result, setResult] = useState(null)
  return (
    <div>
      <Dropzone setResult={setResult} />
      <p>{result && JSON.stringify(result)}</p>
    </div>
  )
}

function Dropzone({ setResult }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".tsv",
    onDrop: async (acceptedFiles) => {
      const data = new FormData()
      data.append("upload_file_name", acceptedFiles[0], acceptedFiles[0].name)
      data.append("upload_file_type", "segments")
      const result = await uploadFile(data)
      setResult(result)
    }
  })

  return (
    <>
      <div className="mb-6">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files.</p>
        </div>
      </div>
    </>
  )
}
