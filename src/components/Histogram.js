import { Loader } from "./Loader"
import React, { useRef } from "react"
import { useSubsethistogram } from "../hooks/api"
import { useContainerDimensions } from "../hooks/containerDimensions"
import PropTypes from "prop-types"

export default function Histogram({ dataEffectResult }) {
  const { data, error, isLoading } = dataEffectResult
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </Loader>
  )
}

export function SubsetHistogram({ id, filter, datasetIds, size: givenSize }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const size = givenSize || width
  return (
    <div ref={componentRef}>
      <Histogram
        dataEffectResult={useSubsethistogram({
          datasetIds,
          id,
          filter,
          size
        })}
      />
    </div>
  )
}

SubsetHistogram.propTypes = {
  id: PropTypes.string.isRequired,
  filter: PropTypes.string,
  background: PropTypes.bool
}
