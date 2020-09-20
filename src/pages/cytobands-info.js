/* eslint-disable react/display-name */
import React, { useRef } from "react"
import { Chromosome } from "../components/Chromosome"
import { getCytoBands } from "../utils/genome"
import { Layout } from "../components/layouts/Layout"
import { useContainerDimensions } from "../hooks/containerDimensions"

export default function CytobandsInfo({ cytoBands }) {
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef, {
    updateOnResize: true,
    debounceWait: 10
  })
  return (
    <Layout title="Cytobands" headline="Cytobands">
      <div ref={componentRef}>
        <Content cytoBands={cytoBands} width={width} />
      </div>
    </Layout>
  )
}

function Content({ cytoBands, width }) {
  return (
    <div className="content">
      <h5>CDKN2A Deletion Example</h5>
      <Chromosome
        bands={cytoBands.chr9}
        startRange="21500001-21975098"
        endRange="21967753-22500000"
        defaultAutoZoom
        width={width}
      />
      <h5>MYC Duplication</h5>
      <Chromosome
        bands={cytoBands.chr8}
        startRange="124000000-127736593"
        endRange="127740957-130000000"
        defaultAutoZoom
        width={width}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
