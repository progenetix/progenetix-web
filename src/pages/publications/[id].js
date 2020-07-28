import React, { useRef } from "react"
import {
  publicationUrl,
  usePublication,
  useSubsethistogram
} from "../../effects/api"
import { Loader } from "../../components/Loader"
import { useContainerDimensions } from "../../effects/containerDimensions"
import { useQuery } from "../../effects/query"
import Histogram from "../../components/Histogram"
import { Layout } from "../../components/Layout"
import { EpmcLink } from "../../components/publications/EpmcUrl"

export default function PublicationDetailsPage() {
  const urlQuery = useQuery()
  if (!urlQuery) return null // query will only be defined after first mount

  const { id, scope, filter } = urlQuery

  return (
    <Layout title="Publication Details">
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
  const { data, error } = usePublication(id)
  const isLoading = !data && !error
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
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)

  return (
    <section ref={componentRef} className="content">
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
      <div>
        <ul>
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
      </div>
      {publication.info?.progenetix_biosamples_count > 0 && (
        <Histogram
          background
          dataEffect={useSubsethistogram({
            datasetIds: "progenetix",
            id,
            filter,
            scope,
            size: width
          })}
        />
      )}
      {publication.info?.arraymap_biosamples_count > 0 && (
        <Histogram
          background
          dataEffect={useSubsethistogram({
            datasetIds: "arraymap",
            id,
            filter,
            scope,
            size: width
          })}
        />
      )}
    </section>
  )
}

const progenetixBasePath = `https://progenetix.org/cgi-bin`
const technologies = ["ccgh", "acgh", "wes", "wgs"]
