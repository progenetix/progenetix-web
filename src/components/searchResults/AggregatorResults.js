import { Loader } from "../Loader"
// import { DatasetResultBox } from "./DatasetResultBox"
import React from "react"
import { makeFilters } from "../../hooks/api"

export function AggregatorResults({ response, isLoading, error, query }) {
  return (
    <>
      <div className="subtitle ">
        <QuerySummary query={query} />
      </div>
      <Loader isLoading={isLoading} hasError={error} colored background>
        {() => (
          <>
            <AggregatorResponses
              aggregatorResponseSets={response.response.responseSets}
              query={query}
            />
          </>
        )}
      </Loader>
    </>
  )
}

function AggregatorResponses({ aggregatorResponseSets }) {
  return aggregatorResponseSets.map((r, i) => (
    <AggregatorResultBox key={i} data={r} />
  ))
}

function AggregatorResultBox({data: responseSet}) {
  const {
    id,
    apiVersion,
    exists,
    error,
    info
  } = responseSet

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{id}</h2>
        <div>
          <b>API Version: </b>
            {apiVersion}
        </div>
        <div>
          <b>Variant: </b>
            {exists.toString()}
        </div>
        <div>
          <b>Info: </b>
            {info.queryUrl}
        </div>
        {error && (
        <div>
          <b>Error: </b>
            {error}
        </div>
        )}
    </div>
  )


}




function QuerySummary({ query }) {
  const filters = makeFilters(query)
  return (
    <ul className="BeaconPlus__query-summary">
      {query.assemblyId && (
        <li>
          <small>Assembly: </small>
          {query.assemblyId}
        </li>
      )}
      {query.geneId && (
        <li>
          <small>Gene: </small>
          {query.geneId.value}
        </li>
      )}
      {query.referenceName && (
        <li>
          <small>Chro: </small>
          {query.referenceName}
        </li>
      )}
      {query.start && (
        <li>
          <small>Start: </small>
          {query.start}
        </li>
      )}
      {query.end && (
        <li>
          <small>End: </small>
          {query.end}
        </li>
      )}
      {query.variantType && (
        <li>
          <small>Type: </small>
          {query.variantType}
        </li>
      )}
      {query.variantMinLength && (
        <li>
          <small>Min. Length: </small>
          {query.variantMinLength}
        </li>
      )}
      {query.variantMaxLength && (
        <li>
          <small>Max. Length: </small>
          {query.variantMaxLength}
        </li>
      )}
      {query.referenceBases && (
        <li>
          <small>Ref. Base(s): </small>
          {query.referenceBases}
        </li>
      )}
      {query.alternateBases && (
        <li>
          <small>Alt. Base(s): </small>
          {query.alternateBases}
        </li>
      )}
      {filters.length > 0 && (
        <li>
          <small>Filters: </small>
          {filters.join(", ")}
        </li>
      )}
      {filters.length > 1 && (
        <li>
          <small>Filter Logic: </small>
          {query.filterLogic}
        </li>
      )}
    </ul>
  )
}
