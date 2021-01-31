import Nav from "../../modules/beacon-instances/1000-genomes-cnv/Nav"

export default function About() {
  return (
    <>
      <Nav />
      <section className="section">
        <div className="BeaconPlus__container">
          <div className="content">
            <h3>
              About 1000 Genomes CNV Beacon<sup>+</sup>
            </h3>
            <p>
              This forward looking Beacon is based on the 1000 Genomes CNV
              dataset from the 2020 Dragen re-processing. The service tests
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
