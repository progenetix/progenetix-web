---
---

# Change Log

This page lists changes for the [Beacon+](http://beacon.progenetix.org/ui/)
implementation of the ["Beacon" genomics API](http://beacon-project.io), as well
as related updates for the [Progenetix](http://progenetix.org) front-end.

## 2022-01-17: Term-specific queries

<img src="http://info.progenetix.org/assets/img/2022-01-17-includeDescendantTerms-ui.png" style="float: right; width: 222px; margin-top: -15px;" alt="includeDescendantTerms selector" />So far (and still as standard), any
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

## 2021-11-25: Publication page fix

* The publication details pages did not display content due to the changed Beacon response structure. Fixed.

## 2021-04-30: Closing in on Beacon v2

As one of the drivers of the Beacon protocol and to drive the Beacon v2 protocol
process we have now started the documentation of Beacon v2 endpoints which
are supported in Progenetix as part of the [**implementations-v2**](https://github.com/ga4gh-beacon/implementations-v2/blob/main/index.md)
project:

* [documentation source](https://github.com/ga4gh-beacon/implementations-v2/blob/main/progenetix-examples.md)
* same as [web page](https://beacon-project.io/implementations-v2/progenetix-examples.html)

<!--more-->

## 2020-10-01: Moving to `bycon` powered BeaconPlus

We've changed the Beacon backend to the `bycon` code base. The new project's
codebase is accessible through the [`bycon`](http://github.com/progenetix/bycon/)
project. Contributions welcome!

### Example

* [progenetix.org/beacon/variants/?referenceBases=G&alternateBases=A&assemblyId=GRCh38&referenceName=17&start=7577120&filters=pgx:cohort-DIPG](https://progenetix.org/beacon/variants/?referenceBases=G&alternateBases=A&assemblyId=GRCh38&referenceName=17&start=7577120&filters=pgx:cohort-DIPG)
