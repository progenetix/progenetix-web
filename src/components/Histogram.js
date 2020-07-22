import { Loader } from "./Loader"
import React from "react"

export default function Histogram({ dataEffect }) {
  const { data, error } = dataEffect
  const isLoading = !data && !error
  return (
    <Loader isLoading={isLoading} hasError={error}>
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </Loader>
  )
}
