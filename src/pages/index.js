import { Layout } from "../components/Layout"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { sample } from "lodash"
import { PROGENETIX, tryFetch } from "../hooks/api"

export default function Index({ ncitCount, dbstats, subsets }) {
  const randomSubset = sample(subsets.data.filter((s) => s.count > 25))
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
            <li>
              <a href="/subsets/list">Cancer Types</a>
            </li>
            <li>
              <a href="/biosamples/search">searching</a> for CNVs in genes of
              interest
            </li>
          </ul>
        </p>
        <ExampleHistogram id={randomSubset.id} />
        <p>
          The resource currently contains genome profiles of{" "}
          <strong>{dbstats.data.progenetix.counts.biosamples}</strong>{" "}
          individual samples and represents{" "}
          <strong>{ncitCount.results_count}</strong> cancer types, according to
          the NCIt &quot;neoplasm&quot; classification.
        </p>
        <p>
          Additionally to this genome profiles and associated metadata, the
          website present information about publications (currently{" "}
          <strong>{dbstats.data.progenetix.counts.publications}</strong>{" "}
          articles) referring to cancer genome profiling experiments.
        </p>
      </div>
    </Layout>
  )
}

export const ExampleHistogram = ({ id }) => (
  <SubsetHistogram datasetIds="progenetix" id={id} />
)

// This function gets called at build time on server-side.
export const getStaticProps = async () => {
  const dbstats = await tryFetch(`${PROGENETIX}/services/dbstats/`)
  const ncitCount = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=codematches&filters=NCIT`
  )
  const subsets = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=counts&filters=PMID,icdom,NCIT,icdot,UBERON`,
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
      dbstats,
      ncitCount,
      subsets
    }
  }
}
