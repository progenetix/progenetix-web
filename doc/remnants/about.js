import { Layout } from "../components/Layout"
import { ExternalLink } from "../hooks/api"

export default function About() {
  return (
    <Layout
      title="About Progenetix"
      headline="About the Progenetix Resource ..."
    >
      <div className="content">
        <h3>Data Content and Provenance</h3>
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
          Original diagnoses are mapped to (hierarchical) classification systems
          and represents <strong>420</strong> and <strong>542</strong> different
          cancer types, according to the International classification of
          Diseases in Oncology (ICD-O) and NCIt &quot;neoplasm&quot;
          classification, respectively.
        </p>
        <p>
          Besides genomic profiling data, Progenetix contains sample specific
          biological, technical and provenance information which so far has been
          curated from <strong>1600</strong> articles.
        </p>
        <h3>Access, Maintenance and Contributions</h3>
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
        <h3>Requests</h3>
        <p>
        While we try to respond to emails in a timely manner, for requests regarding
        interface improvements, new use case scenarios or bug reporting we recommend
        to use the Github issue trackers of the {" "}
        <ExternalLink
          href="https://github.com/progenetix/progenetix-web/issues"
          label="progenetix-web web frontend"
        />{" "}or of the{" "}
        <ExternalLink
          href="https://github.com/progenetix/progenetix.github.io/issues"
          label="Progenetix documentation"
        />{"."}
        </p>
      </div>
    </Layout>
  )
}
