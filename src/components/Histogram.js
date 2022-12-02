import { Loader } from "./Loader"
import React, { useRef } from "react"
import {
  useSubsethistogram,
  subsetSVGlink,
  subsetIdLink,
  subsetPgxsegLink
} from "../hooks/api"
import { useContainerDimensions } from "../hooks/containerDimensions"
import PropTypes from "prop-types"
import Link from "next/link"

export default function Histogram({ apiReply }) {
  const { data, error, isLoading } = apiReply
  return (
    <Loader isLoading={isLoading} hasError={error} background>
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </Loader>
  )
}

export function SubsetHistogram({ id, filter, datasetIds, labelstring, size: givenSize }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const size = givenSize || width
  return (
    <div ref={componentRef}>
      <Histogram
        apiReply={useSubsethistogram({
          datasetIds,
          id,
          filter,
          labelstring,
          size
        })}
      />
      <div className="svg-histolinks">
        <Link href={subsetSVGlink(id, datasetIds)}>
          <a>Download SVG</a>
        </Link>
        {" | "}
        <Link href={subsetIdLink(id)}>
          <a>Go to {id}</a>
        </Link>
        {" | "}
        <Link href={subsetPgxsegLink(id)}>
          <a>Download CNV Frequencies</a>
        </Link>
      </div>
    </div>
  )
}

SubsetHistogram.propTypes = {
  id: PropTypes.string.isRequired,
  filter: PropTypes.string,
  background: PropTypes.bool
}
