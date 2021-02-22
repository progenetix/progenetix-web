import { Layout } from "../components/Layout"
import { SubsetHistogram } from "../components/Histogram"
import React from "react"
import { sample } from "lodash"
import { PROGENETIX, tryFetch } from "../hooks/api"

export default function Index({
  ncitCountResponse,
  dbstatsResponse,
  subsetsResponse
}) {
  const randomSubset = sample(
    subsetsResponse.results.filter((s) => s.count > 25)
  )
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
              <a href="/subsets/biosubsets">Cancer Types</a>
            </li>
            <li>
              <a href="/biosamples/search">searching</a> for CNVs in genes of
              interest
            </li>
          </ul>
        </p>
        <SubsetHistogram datasetIds="progenetix" id={randomSubset.id} />
        <p>
          The resource currently contains genome profiles of{" "}
          <strong>
            {dbstatsResponse.results[0].datasets.progenetix.counts.biosamples}
          </strong>{" "}
          individual samples and represents{" "}
          <strong>{ncitCountResponse.info.count}</strong> cancer types,
          according to the NCIt &quot;neoplasm&quot; classification.
        </p>
        <p>
          Additionally to this genome profiles and associated metadata, the
          website present information about publications (currently{" "}
          <strong>
            {dbstatsResponse.results[0].datasets.progenetix.counts.publications}
          </strong>{" "}
          articles) referring to cancer genome profiling experiments.
        </p>
      </div>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const dbstatsReply = await tryFetch(`${PROGENETIX}/services/dbstats/`)
  const ncitCountReply = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=codematches&filters=NCIT`
  )
  const subsetsReply = await tryFetch(
    `${PROGENETIX}/services/collations/?datasetIds=progenetix&method=counts&filters=icdom,NCIT,PMID,icdot,UBERON`
  )

  return {
    props: {
      dbstatsResponse: dbstatsReply.response,
      ncitCountResponse: ncitCountReply.response,
      subsetsResponse: subsetsReply.response
    }
  }
}
