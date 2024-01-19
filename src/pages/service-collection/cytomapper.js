import React, { useRef } from "react"
import { Chromosome } from "../../components/Chromosome"
import { getCytoBands } from "../../utils/genome"
import { Layout } from "../../components/Layout"
import { useContainerDimensions } from "../../hooks/containerDimensions"

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
        refseqId="refseq:NC_000009.12"
        startRange="21500001-21975098"
        endRange="21967753-22500000"
        defaultAutoZoom
        width={width}
      />
      <h5>MYC Duplication</h5>
      <Chromosome
        bands={cytoBands.chr8}
        refseqId="refseq:NC_000008.11"
        startRange="127000000-127736593"
        endRange="127740957-128000000"
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
