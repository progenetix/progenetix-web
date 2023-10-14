import React from "react"
import { ExternalLink } from "../../components/helpersShared/linkHelpers"
import { Layout } from "../../components/Layout"
import parametersConfig from "../../config/searchParameters.yaml"
import requestTypeConfig from "../../config/carriocordo2021heterogeneity_searchParameters.yaml"
import requestTypeExamples from "../../config/carriocordo2021heterogeneity_searchExamples.yaml"

import BiosamplesSearchPanel from "../../components/searchForm/BiosamplesSearchPanel"
import { SubsetHistogram } from "../../components/SVGloaders"
import Panel from "../../components/Panel"
// import Link from "next/link"

export default function carriocordo2021heterogeneity_dataPage({ cytoBands }) {

  return (
    <Layout
      title="Search Samples from Carrio-Cordo & Baudis, 2021"
      headline="Data from 2021 Cancer Type Heterogeneity Publication"
    >
      <Panel heading="Genomic CNVs from publication..." className="content">
        <div>
          This search page uses the subset of Progenetix data used in the{" "}
          <ExternalLink
            href="https://info.baudisgroup.org/publications/2021-03-01-preprint-Copy-number-variant-heterogeneity/"
            label="Copy number variant heterogeneity among cancer types reflects inconsistent concordance with diagnostic classifications"
          />{" "}
          preprint.
        </div>
      </Panel>
      <Panel heading="CNV Frequency Plot">
        <SubsetHistogram
          datasetIds="progenetix"
          id="pgx:cohort-carriocordo2021heterogeneity"
        />
      </Panel>
      <BiosamplesSearchPanel
        parametersConfig={parametersConfig}
        requestTypeConfig={requestTypeConfig}
        requestTypeExamples={requestTypeExamples}
        cytoBands={cytoBands}
      />
    </Layout>
  )
}
