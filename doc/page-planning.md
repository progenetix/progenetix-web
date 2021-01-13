## Pages

### Biosample related data

#### Beacon+ page

- based on the example page, w/ extended options (additional responses, adaptive
  UI with context based form elements ...)
- integration of utility elements - e.g. "gene name search" for populating
  genome positions, cytoband lookup ...

#### Sample selection page

##### Replaces: [/cgi-bin/pgx_biosamples.cgi](https://progenetix.org/cgi-bin/pgx_biosamples.cgi)

- in principle an extended version of the Beacon+ page, but with added elements
  and e.g. aggregation option through _accessid_
- histogram as default
- statistics table (backend needs to be created/modified)
- map representation (numbers per city ...)
- forwarding of result via handover to...
- biosample table w/ pagination

#### Data visualization page

##### Replaces: [/cgi-bin/pgx_process.cgi](https://progenetix.org/cgi-bin/pgx_process.cgi)

- form & result containers for plots, data download
- backend needs to be modified, but seems feasible enough

#### Sample details page

##### Replaces: [info.progenetix.org/biosample-details.html](https://info.progenetix.org/biosample-details.html?datasetIds=progenetix&id=PGX_AM_BS_PGkes2003_MB-kes-01)

- display of a single "biosample"
- linked from the biosamples tables (or specific `id` query)

### Datacollections

Datacollections are pre-computed aggregations of data from e.g. single
diagnostic codes or grouping identifiers.

#### Subsets listing page(s)

##### Replaces: [/cgi-bin/pgx_subsets.cgi](https://progenetix.org/cgi-bin/pgx_subsets.cgi?biosubsets.biocharacteristics.id=NCIT)

- table or tree/folded display; hierarchy currently mocked-up w/ indentation ...
- some different types; subsetting implemented through `id` query for prefix
- backend needs to be modified, but should be easy
- optional/future: search form

#### Subsets detail page

##### Replaces: Subsets page w/ single subset

- currently details (i.e. only the histogram) is being shown if single subset
  returned from search ([example](https://progenetix.org/do/pgx_subsets/filters=NCIT:C4349$&datasetIds=arraymap)

#### Publications listing page(s)

##### Replaces: [info.progenetix.org/publications.html](https://info.progenetix.org/publications.html?&filters=genomes:%3E0)

- currently implemented w/ `DataTables` => existing JSON backend
- some different types; subsetting implemented through `filters` query against
  sample count fields
- optional/future: search form
- map display

#### Publication detail page

##### Replaces: [info.progenetix.org/publication-details.html](https://info.progenetix.org/publication-details.html?scope=datacollections&id=PMID:22824167)

- current page content-wise already implemented w/ JS
- additional map display
