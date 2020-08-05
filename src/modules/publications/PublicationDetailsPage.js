import React from "react"
import { publicationUrl, usePublication } from "../../hooks/api"
import { Loader } from "../../components/Loader"
import { useQuery } from "../../hooks/query"
import { SubsetHistogram } from "../../components/Histogram"
import { Layout } from "../../components/layouts/Layout"
import { EpmcLink } from "./EpmcUrl"

export default function PublicationDetailsPage() {
  const urlQuery = useQuery()
  if (!urlQuery) return null // query will only be defined after first mount

  const { id, scope, filter } = urlQuery

  return (
    <Layout title="Publication Details" headline="Publication Details">
      {!id ? (
        <NoResultsHelp />
      ) : (
        <PublicationLoader id={id} scope={scope} filter={filter} />
      )}
    </Layout>
  )
}

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific Pubmed ID which
      already exists in the Progenetix `publications` database, e.g.{" "}
      <a href={"/publications/PMID:28966033"}>
        /publication-details?id=PMID:28966033
      </a>
      . Please start over from the Progenetix Publication Collection page.
    </div>
  )
}

function PublicationLoader({ id, scope, filter }) {
  const { data, error, isLoading } = usePublication(id)
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      <PublicationResponse
        response={data}
        id={id}
        scope={scope}
        filter={filter}
      />
    </Loader>
  )
}

function PublicationResponse({ response, id, scope, filter }) {
  if (response?.length >= 1) {
    return response.map((publication, i) => (
      <PublicationDetails
        key={i}
        publication={publication}
        id={id}
        scope={scope}
        filter={filter}
      />
    ))
  } else {
    return <NoResultsHelp />
  }
}

function PublicationDetails({ publication, id, scope, filter }) {
  return (
    <section className="content">
      <h3 className="subtitle">
        {publication.title}{" "}
        <a rel="noreferrer" target="_blank" href={publicationUrl(id)}>
          {"{↗}"}
        </a>
      </h3>

      <p className="has-text-weight-semibold">{publication.authors}</p>
      <p>
        <i>{publication.journal}</i> {id} <EpmcLink publicationId={id} />
      </p>
      <p>{publication.abstract}</p>
      <h5>Origin</h5>
      <p>{publication.provenance.geo.label}</p>
      <h5>Genome Screens</h5>
      <ul className="mb-5">
        {technologies.map((technologie, i) =>
          publication.counts[technologie] ? (
            <li key={i}>
              {technologie}: {publication.counts[technologie]}
            </li>
          ) : null
        )}
        {publication.info?.progenetix_biosamples_count > 0 && (
          <li>
            {publication.info.progenetix_biosamples_count} sample profiles are{" "}
            <a
              href={`${progenetixBasePath}/pgx_biosamples.cgi?datasetIds=progenetix&filters=${id}`}
            >
              registered in Progenetix
            </a>
          </li>
        )}
        {publication.info?.arraymap_biosamples_count > 0 && (
          <li>
            {publication.info.arraymap_biosamples_count} sample profiles are{" "}
            <a
              href={`${progenetixBasePath}/pgx_biosamples.cgi?datasetIds=arraymap&filters=${id}`}
            >
              registered in arrayMap
            </a>
          </li>
        )}
      </ul>
      {publication.info?.progenetix_biosamples_count > 0 && (
        <SubsetHistogram
          id={id}
          filter={filter}
          scope={scope}
          datasetIds="progenetix"
          background
        />
      )}
      {publication.info?.arraymap_biosamples_count > 0 && (
        <SubsetHistogram
          id={id}
          filter={filter}
          scope={scope}
          datasetIds="arraymap"
          background
        />
      )}
    </section>
  )
}

const progenetixBasePath = `https://progenetix.org/cgi-bin`
const technologies = ["ccgh", "acgh", "wes", "wgs"]
