import { Loader } from "./Loader"
import React, { useRef } from "react"
import { useSubsethistogram } from "../hooks/api"
import { useContainerDimensions } from "../hooks/containerDimensions"
import PropTypes from "prop-types"

export default function Histogram({ dataEffect, background = false }) {
  const { data, error, isLoading } = dataEffect
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
  datasetsIds,
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
          datasetsIds,
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

SubsetHistogram.propTypes = {
  id: PropTypes.string.isRequired,
  filter: PropTypes.string,
  scope: PropTypes.string,
  background: PropTypes.bool
}
