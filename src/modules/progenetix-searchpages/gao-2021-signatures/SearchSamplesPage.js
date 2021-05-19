import React from "react"
import { ExternalLink } from "../../../hooks/api"
import { Layout } from "../../../components/Layout"
import parametersConfig from "../../shared/searchParameters.yaml"
import requestTypesConfig from "./requestTypes.yaml"
import BiosamplesSearchPanel from "../../../components/biosamples/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../../components/Histogram"
import Panel from "../../../components/Panel"
// import Link from "next/link"

export default function SearchSamplesPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "200px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout
      title="Search Samples from Gao & Baudis, 2021"
      headline="Data from 2021 Signatures Publication"
    >
      <Panel heading="Genomic CNVs from publication..." className="content">
        <div>
          <img src={"/img/gao-2021-signatures-landscape.png"} style={imgHere} />
          This search page uses the subset of Progenetix data - including TCGA
          samples - used in the{" "}
          <ExternalLink
            href="https://info.baudisgroup.org/publications/2020-12-18-publication-Bo-classifiers/"
            label="Signatures of Discriminative Copy Number Aberrations in 31 Cancer Subtypes"
          />{" "}
          publication.
          <br />
          For access restriction imposed by PCAWG the data cannot not include
          the samples from this consortium which have been used in our
          publication.
        </div>
      </Panel>
      <Panel heading="Downloads and Source Links">
        <div>
          <ul>
            <li>
              <ExternalLink
                href="/_static/gao-2021-signatures/sample_segments_arraymap.tsv.zip"
                label="All Progenetix(arrayMap)samples and segmentations used in the study "
              />
            </li>
            <li>
              <ExternalLink
                href="/_static/gao-2021-signatures/sample_segments_tcga.tsv.zip"
                label="All TCGA samples and segmentations used in the study"
              />
            </li>
            <li>
              <ExternalLink
                href="https://github.com/baudisgroup/cancer-signatures/blob/master/data/sample_ids_arraymap.txt"
                label="IDs of all Progenetix(arrayMap) samples used in the study"
              />
            </li>
            <li>
              <ExternalLink
                href="https://github.com/baudisgroup/cancer-signatures/blob/master/data/sample_ids_tcga.txt"
                label="IDs of all TCGA files used in the study"
              />
            </li>
            <li>
              <ExternalLink
                href="https://github.com/baudisgroup/cancer-signatures/blob/master/data/sample_ids_pcawg.txt"
                label="IDs of all PCAWG files used in the study"
              />
            </li>
            <li>
              <ExternalLink
                href="/_static/gao-2021-signatures/arraymap_meta.csv"
                label="Metadata of Progenetix(arrayMap) samples"
              />
            </li>
            <li>
              <ExternalLink
                href="/_static/gao-2021-signatures/tcga_meta.csv"
                label="Metadata of TCGA samples"
              />
            </li>
          </ul>
        </div>
      </Panel>
      <Panel heading="CNV Frequency Plot">
        <SubsetHistogram
          datasetIds="progenetix"
          id="pgxcohort-gao2021signatures"
        />
      </Panel>
      <BiosamplesSearchPanel
        datasets={datasets}
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}

const datasets = [{ label: "Progenetix", value: "progenetix" }]
