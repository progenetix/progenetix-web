import React from "react"
import Nav from "./Nav"

export default function MdPage({ children }) {
  return (
    <>
      <Nav />
      <section className="section">
        <div className="container">
          <div className="content">{children}</div>
        </div>
      </section>
    </>
  )
}
