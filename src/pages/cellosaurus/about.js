import Nav from "../../modules/beacon-instances/cellosaurus/Nav"

export default function About() {
  return (
    <>
      <Nav />
      <section className="section">
        <div className="BeaconPlus__container">
          <div className="content">
            <h3>
              About the Cellosaurus Beacon<sup>+</sup>
            </h3>
            <p>
              This forward looking Cellosaurus Cell Line Beacon service tests
              experimental features and proposed extensions to the{" "}
              <a href="http://beacon-project.io">Beacon</a> protocol. The
              service is implemented using the{" "}
              <a href="https://github.com/progenetix/bycon">bycon</a> backend
              and part of the <a href="http://progenetix.org">Progenetix</a>{" "}
              cancer genomics resource.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
