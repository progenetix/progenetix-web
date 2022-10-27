import { Layout } from "../../components/Layout"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { uploadFile } from "../../hooks/api"
import { getVisualizationLink } from "../service-pages/dataVisualizationPage"
import Link from "next/link"
import Panel from "../../components/Panel"

export default function FileLoaderPage() {
  return (
    <Layout
      title="User File Upload"
      headline="Upload Files for CNV Visualization"
    >
      <Panel heading="CNV Data Plotting" className="content">
        <p>
          Here we provide users an option to visualize their own CNV data, using
          the standard Progenetix plotting options for histograms and samples.
          This functionality is currently limited to single segmens files
          without the group labeling options. However, we provide the plotting
          libraries as a Perl package through our{" "}
          <a
            href="https://github.com/progenetix/PGX"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>{" "}
          repository.
        </p>
      </Panel>

      <div className="mb-5">
        <DataVisualizationUpload />
      </div>

      <Panel heading="Segment File format" className="content">
        <p>
          <b>NEW 2021</b>: We now recommend the use of our <code>.pgxseg</code>{" "}
          file format for th eupload of CNV segments files. As an extension of
          the standard tab-delimited segment file format below, the{" "}
          <code>.pgxseg</code> file format allows the addition of e.g. group
          label information. The file format is described on our{" "}
          <a
            href="https://info.progenetix.org/doc/fileformats.html"
            target="_blank"
            rel="noreferrer"
          >
            documentation site
          </a>
          {""}, including link to an example file.
        </p>
        <p>
          Otherwise, data has to be submitted as tab-delimited <code>.tsv</code>{" "}
          segment files. An example file is being provided{" "}
          <a
            href="/examples/multi-sample-segments-unfiltered.tsv"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </p>
        <p>
          While the header values are not being interpreted (i.e. it doesn not
          matter if the column is labeled <code>referenceName</code> or{" "}
          <code>chro</code>), the column order has to be respected:
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
            <code>referenceName</code>
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
          <li>
            <code>variant_type</code> (optional)
            <ul>
              <li>the called type of the segment</li>
              <li>
                one of <code>EFO:0030067</code> (CN gain) or <code>EFO:0030067</code> (deletion)
              </li>
              <li>
                this will override a status derived from thresholding the value
                in <code>mean</code>
              </li>
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
    accept: [".tsv", ".tab", ".pgxseg"],
    onDrop: async (acceptedFiles) => {
      const data = new FormData()
      data.append("upload_file", acceptedFiles[0], acceptedFiles[0].name)
      // data.append("upload_file_type", acceptedFiles[0].path.split('.')[1])
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
