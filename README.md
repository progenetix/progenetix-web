# Cancercelllines Websites Code

The Cancercelllines sites are build from this project using 2 different toolchains:

* the Cancercelllines resource website [cancercelllines.org](http://cancercelllines.org), as a
React project with
    - code in [`src/`](src/)
    - static files in [`public/`](public/)

* the Cancercelllines documentation [docs.cancercelllines.org](http://docs.cancercelllines.org),
as a Mkdocs project with
    - files in [`docs/`](docs/)
    - configuration in [`mkdocs.yaml`](./mkdocs.yaml)
    - additional configuration files in [`extra/`](extra/)

More information can be found in the [Progenetix documentation](http://docs.progenetix.org/progenetix-website-builds)

## Local built commands

* `npm run local`
    - runs the website generation usingt the `.test` server for API calls (e.g.
    for testing API mofdifications/calls or when offline)
    - requires a working local `bycon` setup, databases and all
* `npm run built`
    - uses the `....org` site for API calls during built phase
    - site will _still_ use local data, only not for the built phase (and therefore
    fail if no internet connection etc.)
