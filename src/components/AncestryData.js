import React from "react";
import { VictoryContainer, VictoryPie, VictoryLabel } from "victory";

export function AncestryData({individual}) {

  return (
    <>

  {individual?.genomeAncestry && individual?.genomeAncestry?.length > 0 && (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", width: "100%", marginBottom: "0px" }}>
      <div style={{ width: "50%" }}>
          <table style={{ width: "80%", fontSize: "0.9em" }}>
            <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>%</th>
            </tr>
            </thead>
            <tbody>
            {individual.genomeAncestry
                .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
                .map((genomeAncestry, key) => {
                  return (
                      <tr key={key}>
                        <td>{genomeAncestry.id}</td>
                        <td>{genomeAncestry.label}</td>
                        <td>{genomeAncestry.percentage}</td>
                      </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div style={{ width: "40%", marginTop: "-70px", marginBottom: "-40px"}}>
          <VictoryPie
              data={individual.genomeAncestry
                  .sort((a, b) => a.label.localeCompare(b.label)) // Sort alphabetically
                  .filter((datum) => parseFloat(datum.percentage) > 0) // Filter out data points with percentage of 0
              }
              x="label"
              y={(datum) => parseFloat(datum.percentage)}
              padAngle={2}
              radius={70}
              colorScale={['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3', '#FEE1E8', '#D3C2CE']}
              labelRadius={({ radius }) => radius + 20}
              labelComponent={
                <VictoryLabel
                    style={{ fontSize: 12 }}
                    text={({ datum }) => datum.label} // Only show label text if percentage is greater than 0
                />
              }
              containerComponent={<VictoryContainer responsive={false}/>}
          />
      </div>
    </div>
  )}
  </>
  )
}
