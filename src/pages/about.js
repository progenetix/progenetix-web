import React from "react"
import Nav from "../components/Nav"

export default function About() {
  return (
    <>
      <Nav />
      <section className="section">
        <div className="container">
          This version of the Beacon <span className="Nav__plus">+</span> genome
          variation service tests experimental features and proposed
          extensions to the <a href="http://beacon-project.io">Beacon</a> protocol.
          The service is implemented using the <a href="http://">bycon</a> backend
          and allows access to the various datasets represented through the
          <a href="http://progenetix.org">Progenetix</a> resource.
        </div>
      </section>
    </>
  )
}
