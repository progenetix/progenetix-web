import React from "react"

export function ShowJSON({ data }) {
  return (
    <>
      <h5>Raw Data</h5>
        <div>
          <pre className="prettyprint">{ JSON.stringify(data, null, 2) }</pre>
        </div>
    </>
  )
}
