import React from "react"
import { ExternalLink } from "../../hooks/api"
import { Layout } from "../../components/Layout"
import parametersConfig from "../shared/searchParameters.yaml"
import requestTypesConfig from "./oneKgenomes_searchParameters.yaml"
import BiosamplesSearchPanel from "../../components/biosamples/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../components/Histogram"
import Panel from "../../components/Panel"

export default function oneKgenomes_dataPage({ cytoBands }) {
  const imgHere = {
    float: "right",
    width: "200px",
    border: "0px",
    margin: "-90px -20px 0px 0px"
  }

  return (
    <Layout title="1000 Genomes Germline CNVs" headline="1000 Genomes Germline CNVs">
      <Panel heading="Search Genomic CNV Data from the Thousand Genomes Project" className="content">
        <div>
          <img src={"/img/oneKgenomes.png"} style={imgHere} />
          This search page accesses the reference germline CNV data of 3200 samples from the 1000 Genomes Project. 
          The results are based on the data from the Illumina DRAGEN caller re-analysis of
          3200 whole genome sequencing (WGS) samples downloaded from the{" "}
          <ExternalLink
            href="https://aws.amazon.com/blogs/industries/dragen-reanalysis-of-the-1000-genomes-dataset-now-available-on-the-registry-of-open-data/"
            label="AWS store of the Illumina-led reanalysis project"
          />{" "}.
        </div>
        <SubsetHistogram datasetIds="progenetix" id="pgx:cohort-oneKgenomes" />
        <div>
          Please note that the CNV spikes are based on the frequency of occurrence of <i>any</i> CNV
          in a given 1Mb interval, not on their overlap. Some genome bins may have at least one small CNV in
          each sample - especially in peri-centromeric regions - and therefore will display with a 100% frequency -
          although many of those may not overlap.
        </div>
      </Panel>
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypesConfig={requestTypesConfig}
        cytoBands={cytoBands}
        collapsed={false}
      />
    </Layout>
  )
}
