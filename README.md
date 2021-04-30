# progenetix-web - Web front-end for Beacon+ and the Progenetix resource

Access live version: http://progenetix.org/

## How to use

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
npm run build && npm run export && sudo rsync -av out/* /Library/WebServer/Documents
```

Otherwise a production build can be run with:

```bash
npm run build
npm run start
```


## Directory structure

* `config`
  - miscellaneous external data
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
* `hooks`
  - React functions to add lifecycle events and state management to other functional components
* `modules`
  - page-specific scripts and resources
  - in contrast to the pages themselves they are not part of the web hierarchy but compiled into the project
* `pages`
  - directories and included scripts correspond to website structure 
