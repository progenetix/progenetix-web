import React from "react"
import { usePublication, Link, epmcUrl, EpmcLink } from "../../hooks/api"
import { WithData } from "../../components/Loader"
import { withUrlQuery } from "../../hooks/url-query"
import { SubsetHistogram } from "../../components/Histogram"
import { Layout } from "../../components/Layout"

const PublicationDetailsPage = withUrlQuery(({ urlQuery }) => {
  const { id } = urlQuery
  return (
    <Layout title="Publication Details">
      {!id ? <NoResultsHelp /> : <PublicationLoader id={id} />}
    </Layout>
  )
})
export default PublicationDetailsPage

function NoResultsHelp() {
  return (
    <div className="notification is-size-5">
      This page will only show content if called with a specific Pubmed ID which
      already exists in the Progenetix `publications` database, e.g.{" "}
      <a href={"/publications/details?id=PMID:9405679"}>
        /details?id=PMID:9405679
      </a>
      . Please start over from the Progenetix Publication Collection page.
    </div>
  )
}

function PublicationLoader({ id }) {
  const publicationReply = usePublication(id)
  return (
    <WithData
      apiReply={publicationReply}
      background
      render={(response) => (
        <PublicationResponse results={response.response?.results} id={id} />
      )}
    />
  )
}

function PublicationResponse({ results, id }) {
  if (results?.length >= 1) {
    return results.map((publication, i) => (
      <PublicationDetails key={i} publication={publication} id={id} />
    ))
  } else {
    return <NoResultsHelp />
  }
}

function PublicationDetails({ publication, id }) {
  const progenetixBiosamplesCount = publication.counts?.progenetix ?? 0
  const arraymapBiosamplesCount = publication.counts?.arraymap ?? 0
  return (
    <section className="content">
      <h2 className="tile">
        <Link
          href={epmcUrl(publication.id)}
          label={publication.id}
        />
      </h2>
      <h3 className="subtitle is-5">{publication.title}</h3>
      <p className="has-text-weight-semibold">{publication.authors}</p>
      <p>
        <i>{publication.journal}</i> {id} <EpmcLink publicationId={id} />
      </p>
      <p>{publication.abstract}</p>

      <h5>Contact</h5>
      <ul className="mb-5">
      {publication.contact?.name != "" && (
        <li>{publication.contact.name}</li>
      )}
      {publication.contact?.affiliation != "" && (
        <li>{publication.contact.affiliation}</li>
      )}
      {publication.contact?.email != "" && (
        <li>{publication.contact.email}</li>
      )}  
      </ul>

      <h5>Origin</h5>
      <p>{publication.provenance.geoLocation.properties?.city}, {publication.provenance.geoLocation.properties?.country}</p>

      {publication.progenetixCurator && (
        <div>
        <h5>Progenetix Curator</h5>
        <p>{publication.progenetixCurator}</p>
        </div>
      )}
      
      <h5>Genome Screens</h5>
      <ul className="mb-5">
        {technologies.map((technologie, i) =>
          publication.counts[technologie] ? (
            <li key={i}>
              {technologie}: {publication.counts[technologie]}
            </li>
          ) : null
        )}
        {progenetixBiosamplesCount > 0 && (
          <li>
            {progenetixBiosamplesCount} sample profiles are registered in
            Progenetix
          </li>
        )}
        {arraymapBiosamplesCount > 0 && (
          <li>
            {arraymapBiosamplesCount} sample profiles are registered in arrayMap
          </li>
        )}
      </ul>
      {(progenetixBiosamplesCount > 0 || arraymapBiosamplesCount > 0) && (
        <a
          className="button is-info mb-5"
          href={sampleSearchHref({
            id,
            progenetixSamplesCount: progenetixBiosamplesCount
          })}
        >
          Retrieve Publication Samples
        </a>
      )}

      {progenetixBiosamplesCount > 0 && (
        <div className="mb-5">
          <SubsetHistogram id={id} filter={id} datasetIds="progenetix" />
        </div>
      )}
    </section>
  )
}

function sampleSearchHref({ id, progenetixSamplesCount }) {
  const datasetsIds = []
  if (progenetixSamplesCount > 0) datasetsIds.push("progenetix")

  return `/biosamples/?freeFilters=${id}&datasetIds=${datasetsIds.join(
    ","
  )}&executeSearch=true`
}

const technologies = ["ccgh", "acgh", "wes", "wgs"]
