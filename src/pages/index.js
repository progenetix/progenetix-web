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
        <p>
          For exploration of the resource it is suggested to either start with:
          <ul>
            <li><a href="/subsets/list">Cancer Types</a></li>
            <li><a href="/samples/search">searching</a> for CNVs in genes of interest</li>
          </ul>
        </p>
        <ExampleHistogram id={randomSubsetId} />
        <p>
          The resource currently contains genome profiles of{" "}
          <strong>113322</strong> individual experiments and represents
          <strong>542</strong> different cancer types, according to the NCIt
          &quot;neoplasm&quot; classification.
        </p>
        <p>
          Additionally to this genome profiles and associated metadata, the website
          present information about publications (currently{" "}
          <strong>{publicationsCount}</strong> articles) referring to cancer
          genome profiling experiments.
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
