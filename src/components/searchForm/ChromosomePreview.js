import { Chromosome, refseq2chro } from "../Chromosome"
import React, { useRef } from "react"
import { useContainerDimensions } from "../../hooks/containerDimensions"

export default function ChromosomePreview({ watch, cytoBands }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  const startRange = watch("start")
  const endRange = watch("end")
  const referenceName = watch("referenceName")
  const chro = referenceName ? refseq2chro(referenceName) : ""
  const bands = cytoBands["chr" + chro]
  const shouldDisplay = (startRange || endRange) && bands

  return (
    <div ref={componentRef}>
      {shouldDisplay && (
        <Chromosome
          bands={bands}
          refseqId={referenceName}
          startRange={startRange}
          endRange={endRange}
          width={width}
        />
      )}
    </div>
  )
}
