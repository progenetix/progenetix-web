import { Layout } from "../../components/Layout"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { uploadFile } from "../../hooks/api"
import { getVisualizationLink } from "../data-visualization/DataVisualizationPage"
import Link from "next/link"
import Panel from "../../components/Panel"

export default function FileLoaderPage() {
  return (
    <Layout
      title="USer File Upload"
      headline="Upload Files for CNV Visualization"
    >
      <div className="mb-5">
        <DataVisualizationUpload />
      </div>

      <Panel heading="File format" className="content">
        <p>
          Data has to be submitted as tab-delimited <b>.tsv</b> segment files.
          An example file is being provided{" "}
          <a
            href="/examples/multi-sample-segments-unfiltered.tsv"
            target="_blank"
          >
            here
          </a>
          .
        </p>

        <p>
          While the header values are not being interpreted, the column order
          has to be followed:
        </p>

        <ol>
          <li>
            <code>sample</code>
            <ul>
              <li>please use only word characters, underscores, dashes</li>
              <li>
                the <code>sample</code> value is used for splitting multi-sample
                files into their individual profiles
              </li>
            </ul>
          </li>
          <li>
            <code>chro</code>
            <ul>
              <li>the reference chromosome</li>
              <li>1-22, X, Y (23 =&gt; X; 24 =&gt; Y)</li>
            </ul>
          </li>
          <li>
            <code>start</code>
            <ul>
              <li>base positions according to the used reference genome</li>
            </ul>
          </li>
          <li>
            <code>end</code>
            <ul>
              <li>as above</li>
            </ul>
          </li>
          <li>
            <code>mean</code>
            <ul>
              <li>the value of the segment</li>
              <li>0-centered</li>
              <li>
                segments not passing the calling thresholds (fallback{" "}
                <code>0.15</code>, <code>-0.15</code>) are being filtered out
              </li>
              <li>
                one can use dummy values (e.g. <code>1</code> for gains,{" "}
                <code>-1</code> for losses)
              </li>
            </ul>
          </li>
          <li>
            <code>probes</code> (optional)
            <ul>
              <li>the number of array probes, call bins in the segment</li>
              <li>fallback filter removes</li>
              <li>optional (no filter on empty values)</li>
            </ul>
          </li>
        </ol>
      </Panel>
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
    accept: [".tsv", ".tab"],
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
