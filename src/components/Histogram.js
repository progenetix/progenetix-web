import { Loader } from "./Loader"
import React, { useRef } from "react"
import { useSubsethistogram } from "../effects/api"
import { useContainerDimensions } from "../effects/containerDimensions"

export default function Histogram({ dataEffect, background = false }) {
  const { data, error } = dataEffect
  const isLoading = !data && !error
  return (
    <Loader isLoading={isLoading} hasError={error} background={background}>
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </Loader>
  )
}

export function SubsetHistogram({
  id,
  filter,
  scope,
  size: givenSize,
  background = false
}) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const size = givenSize || width
  return (
    <div ref={componentRef}>
      <Histogram
        dataEffect={useSubsethistogram({
          datasetIds: "progenetix",
          id,
          filter,
          scope,
          size
        })}
        background={background}
      />
    </div>
  )
}
