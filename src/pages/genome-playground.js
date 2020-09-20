/* eslint-disable react/display-name */
import React, { useState } from "react"
import { checkIntegerRange } from "../hooks/api"
import { Chromosome } from "../components/Chromosome"
import { getCytoBands } from "../utils/genome"

export default function GenomePlayground({ cytoBands }) {
  return (
    <>
      <div className="content mx-6 my-5">
        {Object.entries(cytoBands).map(([name, bands]) => {
          return (
            <div key={name}>
              <h6>{name}</h6>
              <span style={{ display: "inline-flex" }}>
                <ChromosomeControl name={name} bands={bands} />
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function ChromosomeControl({ name, bands }) {
  const max = bands[bands.length - 1].end

  const defaultStart = (max * 0.1).toFixed()
  const defaultEnd = (max * 0.9).toFixed()
  const [startRange, setStart] = useState(defaultStart)
  const [endRange, setEnd] = useState(defaultEnd)

  const handleStartChange = (e) => {
    const newStartRange = e.target.value
    setStart(newStartRange)
  }

  const handleEndChange = (e) => {
    const newEndRange = e.target.value
    setEnd(newEndRange)
  }

  const startRangeError = checkIntegerRange(startRange)
  const endRangeError = checkIntegerRange(endRange)

  return (
    <div>
      <div className="mb-2">
        <input
          value={startRange}
          onChange={handleStartChange}
          className="input is-small mb-3"
          placeholder="start"
        />
        {startRangeError}
        <input
          value={endRange}
          onChange={handleEndChange}
          className="input is-small is"
          placeholder="end"
        />
        {endRangeError}
      </div>
      <Chromosome
        name={name}
        bands={bands}
        startRange={startRange}
        endRange={endRange}
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
