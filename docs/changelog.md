# Change Log

This page lists changes for the [Beacon+](http://beacon.progenetix.org/ui/)
implementation of the ["Beacon" genomics API](http://beacon-project.io), as well
as related updates for the [Progenetix](http://progenetix.org) front-end.

## 2023-06-12: Some schema changes...

**Schema changes are now extensively tracked in [bycon.progenetix.org](http://bycon.progenetix.org)**

The latest changes of the database schemas involve e.g.:

* several field changes in biosamples, to align w/ main Beacon v2 default schema:
  - `sampledTissue` => `sampleOriginDetail`
  - `description` => `notes`
  - `timeOfCollection.age` => `collectionMoment`


## 2022-12-22: Various API fixes & extensions

* the `genespans` responses contain now a `cytobands` parameter (i.e. the cytogenetic mapping of the gene's locus)
* FIXED: the beacon response meta now has the standard `receivedRequestSummary.requestParameters`
instead of before `receivedRequestSummary.variantPars`


## 2022-01-17: Term-specific queries

<img src="/img/2022-01-17-includeDescendantTerms-ui.png" style="float: right; width: 222px; margin-top: -15px;" alt="includeDescendantTerms selector" />So far (and still as standard), any
selected filter will also include matches on its child terms; i.e. "NCIT:C3052 -
Digestive System Neoplasm" will include results from gastric, esophagus, colon
... cancer. Here we introduce a selector for the search panel to make use of the Beacon v2
filters `includeDescendantTerms` pragma, which can be set to _false_ if one only
wants to query for the term itself and exclude any child terms from the matching.

Please be aware that this can only be applied globally and will affect all filtering
terms used in a query. More information is available in the [Filtering Terms](beaconplus.md#filters-filters-filtering-terms) documentation.


## 2022-01-17: Introducing `variant_state` classes for CNVs

More information can be found in the [description of ontology use for CNVs](classifications-and-ontologies.md#genomic-variations-cnv-ontology).

## 2022-01-10: BUG FIX Frequency Maps

Pre-computed Progenetix CNV frequency histograms (e.g. for NCIT codes) are based
samples from all child terms; e.g. `NCIT:C3262` will display an overview of all
neoplasias, although no single case has this specific code.

However, there had been a bu when under specific circumstances (code has some
mapped samples and code has more samples in child terms) only the direct matches
were used to compute the frequencies although the full number of samples was indicated
in the plot legend. FIXED.

<!--more-->

