import { groupBy } from "lodash"

function getRect(x, width, stain) {
  return (
    <rect
      x={x}
      y={0}
      className={`stain--${stain}`}
      width={width}
      height={100}
    />
  )
}

export default function Genome({ cytoBands }) {
  const groups = groupBy(cytoBands, "referenceName")
  return (
    <>
      <div className="content mx-6 my-5">
        {Object.entries(groups).map(([name, bands]) => {
          return (
            <div key={name}>
              <h6>{name}</h6>
              <span style={{ display: "inline-flex", height: "33px" }}>
                <Chromosome bands={bands} />
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

const xScale = 1000000 / 5

export function Chromosome({ bands }) {
  const max = bands[bands.length - 1].end
  const maxX = max / xScale

  return (
    <svg
      style={{ border: "1px solid" }}
      height="100%"
      viewBox={`0 0 ${maxX} 100`}
    >
      {bands.map((band) => {
        // current = current
        const x = band.start / xScale
        const width = (band.end - band.start) / xScale
        return getRect(x, width, band.stain)
      })}
    </svg>
  )
}

export const getStaticProps = async () => {
  const fs = require("fs")
  const path = require("path")
  const csv = require("neat-csv")
  const cytoBandIdeoPath = path.join(
    process.cwd(),
    "config",
    "cytoBandIdeo.txt"
  )
  const cytoBandIdeo = await csv(fs.createReadStream(cytoBandIdeoPath), {
    headers: ["referenceName", "start", "end", "cytoband", "stain"],
    separator: "\t",
    skipComments: true
  })
  return {
    props: {
      cytoBands: cytoBandIdeo
    }
  }
}
