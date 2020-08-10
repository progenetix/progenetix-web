import Nav from "../../modules/beacon-plus/Nav"

export default function About() {
  return (
    <>
      <Nav />
      <section className="section">
        <div className="BeaconPlus__container">
          <div className="content">
            <h3>
              About Beacon<sup>+</sup>
            </h3>
            <p>
              This forward looking Beacon interface implements additional,
              planned features beyond the current Beacon specifications.
            </p>
            <p>
              The Beacon<sup>+</sup> genome variation service tests experimental
              features and proposed extensions to the{" "}
              <a href="http://beacon-project.io">Beacon</a> protocol. The
              service is implemented using the{" "}
              <a href="https://github.com/progenetix/bycon">bycon</a> backend
              and allows access to the various datasets represented through the{" "}
              <a href="http://progenetix.org">Progenetix</a> cancer genomics
              resource.
            </p>
            <p>
              Further information about the Beacon project can be found through
              the <a href="http://beacon-project.io/">ELIXIR Beacon website</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
