import { Layout } from "../../components/layouts/Layout"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { uploadFile } from "../../hooks/api"
import { getVisualizationLink } from "./DataVisualizationPage"
import Link from "next/link"

export default function DataVisualizationUploadPage() {
  return (
    <Layout
      title="Data visualization Upload"
      headline="Data visualization Upload"
    >
      <article className="content">
        <p>TODO: Some descriptions about this feature.</p>
      </article>
      <DataVisualizationUpload />
    </Layout>
  )
}

function DataVisualizationUpload() {
  const [result, setResult] = useState(null)

  return (
    <div>
      {result ? (
        <Results results={result} onCancelClicked={() => setResult(null)} />
      ) : (
        <Dropzone setResult={setResult} />
      )}
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
      <div className="content">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag and drop some files here, or click to select files.</p>
        </div>
      </div>
    </>
  )
}
function Results({ results, onCancelClicked }) {
  const accessId = results.accessid
  const visualizationLink = getVisualizationLink(accessId)

  return (
    <>
      <div className="message is-success animate__fadeIn animate__animated animate__faster">
        <div className="message-body content">
          <p>The file has been successfully uploaded!</p>
          <p>
            <Link href={visualizationLink}>
              <a className="button is-link">See visualization!</a>
            </Link>
          </p>
          or{" "}
          <button onClick={onCancelClicked} className="button-link button-text">
            upload an other file instead.
          </button>
        </div>
      </div>
    </>
  )
}
