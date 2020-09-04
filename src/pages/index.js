import { Layout } from "../components/layouts/Layout"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { sample } from "lodash"
import { PROGENETIX, tryFetch } from "../hooks/api"

export default function Index({ publicationsCount, subsets }) {
  const randomSubsetId = sample(subsets.filter((s) => s.count > 25)).id
  return (
    <Layout title="Progenetix" headline="Cancer genome data @ progenetix.org">
      <div className="content">
        <p>
          The Progenetix database provides an overview of mutation data in
          cancer, with a focus on copy number abnormalities (CNV / CNA), for all
          types of human malignancies.
        </p>
        <h4>Data Content and Provenance</h4>
        <p>
          The resource currently contains genome profiles of{" "}
          <strong>113322</strong> individual experiments. The genomic profiling
          data was derived from array and chromosomal{" "}
          <a href="https://en.wikipedia.org/wiki/Comparative_genomic_hybridization">
            Comparative Genomic Hybridization (CGH)
          </a>{" "}
          experiments as well as Whole Genome or Whole Exome Sequencing (WGS,
          WES) studies. Genomic profiles are either processed from various raw
          data formats or are extracted from published experimental results.
        </p>
        <p>
          Besides genomic profiling data, Progenetix contains sample specific
          biological, technical and provenance information which so far has been
          curated from <strong>1600</strong> articles.
        </p>
        <p>
          Original diagnoses are mapped to (hierarchical) classification systems
          and represents <strong>420</strong> and <strong>542</strong> different
          cancer types, according to the International classification of
          Diseases in Oncology (ICD-O) and NCIt &quot;neoplasm&quot;
          classification, respectively.
        </p>
        <ExampleHistogram id={randomSubsetId} />
        <p>
          For exploration of the resource it is suggested to either start with{" "}
          <a href="/subsets/list">Cancer Types</a> or by{" "}
          <a href="/samples/search">searching</a> for CNVs genes of interest.
        </p>
        <p>
          Additionally to genome profiles and associated metadata, the website
          present information about publications (currently{" "}
          <strong>{publicationsCount}</strong> articles) referring to cancer
          genome profiling experiments.
        </p>
        <h4>Access, Maintenance and Contributions</h4>
        <p>
          The content of the progenetix resource is freely accessible for
          research and commercial purposes, with attribution.
        </p>
        <p>
          The database &amp; software are developed by the{" "}
          <a href="https://info.baudisgroup.org">group of Michael Baudis</a> at
          the{" "}
          <a href="https://www.mls.uzh.ch/en/research/baudis/">
            University of Zurich
          </a>{" "}
          and the Swiss Institute of Bioinformatics{" "}
          <a href="http://sib.swiss/baudis-michael/">SIB</a>.
        </p>
        <p>
          Many previous members and external collaborators have contributed to
          data content and resource features. Participation (features, data,
          comments) by volunteers are welcome.
        </p>
      </div>
    </Layout>
  )
}

export const ExampleHistogram = ({ id }) => (
  <SubsetHistogram
    datasetIds="progenetix"
    id={id}
    scope="biosubsets"
    chr2plot="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22"
  />
)

// This function gets called at build time on server-side.
export const getStaticProps = async () => {
  const publicationsCount = await tryFetch(
    `${PROGENETIX}/api/progenetix/publications/count/`
  )
  // const biosubsetsCount = await tryFetch(
  //   `${PROGENETIX}/api/progenetix/biosubsets/count/`
  // )
  const subsets = await tryFetch(
    `${PROGENETIX}/cgi/bycon/bin/collations.py?datasetIds=progenetix&method=counts&filters=PMID,icdom,ncit,icdot&responseFormat=simplelist`,
    [
      {
        count: 243,
        id: "NCIT:C2972",
        label: "Cystadenoma"
      }
    ]
  )
  return {
    props: {
      publicationsCount,
      subsets
    }
  }
}
