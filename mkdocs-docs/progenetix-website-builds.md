# Progenetix Websites

The Progenetix sites are build from this project using 2 different toolchains:

* the Progenetix resource website [progenetix.org](http://progenetix.org), as a
React project
* the Progenetix documentation [docs.progenetix.org](http://doc.sprogenetix.org),
as a Mkdocs project with

## Progenetix Resource Site

The Progenetix data site is built as a React project, _i.e._ a pre-compiled 
JavaScript package.

### How to use 

Installation of libraries:

```bash
npm install
```

The developer version can be run with

```bash
npm run dev
```

... on 127.0.0.1:3000 for live testing of modifications etc.

For the current Progenetix setup we use Apache and therefore export a static
build with

```bash
npm run build && npm run export && sudo rsync -av out/* /Library/WebServer/Documents/Sites/progenetix
```

Otherwise a production build can be run with:

```bash
npm run build
npm run start
```

### Directory structure

* `out`
    - the compiled website files
    - for use of the static build those should be copied to the server root or another target directory 
* `public`
    - contents will be moved to the web server, in the given directory structure and naming
    - `public/img/IonTichy.png` => `http://myserver.org/img/IonTichy.png`
* `src` all the code ...

#### `src/`

* `components`
    - bits and pieces such as form and navigation scripts / page components which may be used by different parts of the project
* `config`
    - configuration files for the search form etc.
* `hooks`
    - React functions to add lifecycle events and state management to other functional components
* `modules`
    - page-specific scripts and resources
    - in contrast to the pages themselves they are not part of the web hierarchy but compiled into the project
* `pages`
    - directories and included scripts correspond to website structure


## Progenetix Documentation

The Progenetix documentation [docs.progenetix.org](http://doc.sprogenetix.org)
is a Mkdocs project with

* source files (Markdown, images, extra css etc.) in [`docs/`](https://github.com/progenetix/progenetix-web/tree/main/docs/)
* configuration in [`mkdocs.yaml`](https://github.com/progenetix/progenetix-web/tree/main/mkdocs.yaml)
* additional configuration files in [`extra/`](https://github.com/progenetix/progenetix-web/tree/main/extra/)

On Github the site is auto-generated on push actions using Github actions with
[this workflow](https://github.com/progenetix/progenetix-web/blob/main/.github/workflows/mk-progenetix-docs.yaml).

Locally the site can be served from its root directory (_i.e._ the main project
directory) through `mkdocs serve`.
