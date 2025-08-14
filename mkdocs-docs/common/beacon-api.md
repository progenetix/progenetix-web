# Beacon - Discovery Services for Genomic Data


![Beacon Icon](/img/logo_beacon.png){ align=right width=25px}The Beacon protocol
defines an open standard for genomics data discovery by the Global Alliance for
Genomics & Health GA4GH with technical implementation through the
<a href="https://beacon-project.io">ELIXIR Beacon project</a>. Since 2015 the
[Theoretical Cytogenetics and Oncogenomics Group](https://baudisgroup.org)
at the University of Zurich has contributed to Beacon development, partially with the
[Beacon<sup><span style="color: #d00;">+</span></sup> demonstrator](https://beaconplus.progenetix.org),
to show current functionality and test future Beacon protocol extensions. The
Beacon<sup><span style="color: #d00;">+</span></sup> as well as the [Progenetix](https://progenetix.org)
and [cancercelllines.org](https://cancercelllines.org) websites run on top of the
open source [`bycon`](https://bycon.progenetix.org) stack which represent a full
Beacon implementation.

!!! note "Technical Documentation"

    An increasing amount of documentation relevant to the Progenetix API can be
    found in those locations:

    * [`bycon` package documentation](http://bycon.progenetix.org)
    * Beacon v2 [documentation site](http://docs.genomebeacons.org)


## BeaconPlus Data / Query Model

The Progenetix / Beaconplus query model utilises the Beacon core data model for
genomic and (biomedical, procedural) queries and data delivery. The model uses an
object hierarchy, consisting of

* `variant` (a.k.a. _genomicVariation_)
    - a single molecular observation, e.g. a genomic variant observed in the analysis of the DNA from a biosample
    - mostly corresponding to the "allele" concept, but with alternate use similar to that in VCF (e.g. CNV are no typical "allelic variants")
    - in Progenetix identical variants from different sampleas are identified through
    a compact digest (`variantInternalId`) and can be used to retrieve those distinct
    variants (c.f. "line in VCF")
* `analysis`
    - the entirety of all variants, observed in a single experiment on a single sample
    - the result of an _analysis_ represents a _callset_ , comparable to a data
      column in a __VCF__ variant annotation file
    - _callset_ has an optional position in the object hierarchy, since the _variants_
      themselves describe biological observations in a biosample
* `biosample`
    - a reference to a physical biological specimen on which analyses are performed
* `individual`
    - in a typical use a human subject from which the biosample(s) was/were extracted

The `bycon` framework implemented for Progenetix and related collections such as
cancercelllines.org implements these core entities as data collections in a MongoDB database.

!!! note "BeaconPlus Extensions of the Beacon API"

    The Progenetix Beacon API implements the Beacon framework and [Beacon v2
    default model](http://docs.genomebeacons.org/models/) with some extended functionality -
    e.g.

    * limited support for Boolean filter use (i.e. ability to force an override of the general
    `AND` with a general `&filterLogic=OR` option)
    * experimental support of a `/phenopackets` entity type & `&requestedSchema=phenopacket`
    output option
    * additional service endpoints, e.g. for biosamples or individuals
    * geoqueries using [`$geoNear`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/geoNear/)
    parameters or `city` matches


### Filters / Filtering Terms

Besides variant parameters the Beacon protocol defines `filters` as (self-)scoped
query parameters, e.g. for phenotypes, diseases, biomedical performance or technical
entities.

The Progenetix query filter system adopts a hierarchical logic for filtering terms.
However, the `includeDescendantTerms` pragma can be used to modify this behaviour.
Examples for codes with hierarchical treatment within the filter space are:

* NCIt
    - true, deep hierarchical ontology of cancer classifications
* Cellosaurus
    - derived cell lines are also accessible through the code of their parental line

Most of the filter options are based on ontology terms or identifiers in
CURIE format (e.g. `NCIT:C4033`, `cellosaurus:CVCL_0030` or `pubmed:16004614`). Please
see Beacon's [`Filters`](http://docs.genomebeacons.org/filters/) documentation
for more information, e.g. about `OntologyFilter`, `AlphanumericFilter`, `CustomFilter` types.

More documentation of available ontologies and how to find out about available
terms can be found on the [Classifications and Ontologies](common/classifications-and-ontologies.md)
page. 

##### Example

``` JSON
"filters": [
    {"id": "NCIT:C4536", "includeDescendantTerms": false}
],
```

### Beacon JSON responses

The Progenetix resource's API utilizes the `bycon` framework for implementation of
 the Beacon _v2_ API. The standard format for JSON responses corresponds to a generic Beacon v2
response. Depending on the endpoint, the main data will be a list of objects either
inside `response.results` or (mostly) in `response.resultSets[...].results`. Additionally,
most API responses provide access to data using _handover_ objects.

!!! info "Beacon API is implemented through `bycon`"

    Progenetix' Beacon API is implemented through the [`bycon`](https://github.com/progenetix/bycon/)
    software. The code documentation site at [bycon.progenetix.org](https://bycon.progenetix.org)]
    provides live [Beacon v2 path examples](https://bycon.progenetix.org/API) using the Progenetix resource.


<!--

#### Base `/`

The root path provides the standard `BeaconInfoResponse`.

* [/]({{config.api_web_root}}/beacon/)

----

#### Base `/filtering_terms`

* [/filtering_terms/]({{config.api_web_root}}/beacon/filtering_terms/)

##### `/filtering_terms/` + query

* [/filtering_terms/?filters=pubmed]({{config.api_web_root}}/beacon/filtering_terms/?filters=pubmed)
* [/filtering_terms/?filters=NCIT,icdom]({{config.api_web_root}}/beacon/filtering_terms/?filters=NCIT,icdom)

----

#### Base `/biosamples`

##### `/biosamples/` + query

* [/biosamples/?filters=cellosaurus:CVCL_0004]({{config.api_web_root}}/beacon/biosamples/?filters=cellosaurus:CVCL_0004)
    - this example retrieves all biosamples having an annotation for the Cellosaurus _CVCL_0004_
  identifier (K562)

##### `/biosamples/{id}/`

* [/biosamples/pgxbs-kftva5c9/]({{config.api_web_root}}/beacon/biosamples/pgxbs-kftva5c9/)
    - retrieval of a single biosample

##### `/biosamples/{id}/g_variants/`

* [/biosamples/pgxbs-kftva5c9/g_variants/]({{config.api_web_root}}/beacon/biosamples/pgxbs-kftva5c9/g_variants/)
    - retrieval of all variants from a single biosample
    - currently - and especially since for a mostly CNV containing resource - `variants` means "variant instances" (or as in the early v2 draft `variantsInSample`)

##### `/biosamples/{id}/analyses/`

* [/biosamples/pgxbs-kftva5c9/analyses/]({{config.api_web_root}}/beacon/biosamples/pgxbs-kftva5c9/analyses/)

----

#### Base `/individuals`

##### `/individuals/` + query

* [/individuals/?filters=NCIT:C7541]({{config.api_web_root}}/beacon/individuals/?filters=NCIT:C7541)
    - this example retrieves all individuals having an annotation associated with _NCIT:C7541_ (retinoblastoma)
    - in Progenetix, this particular code will be part of the annotation for the _biosample(s)_ associated with the returned individual
* [/individuals/?filters=NCIT:C20197,NCIT:C9291]({{config.api_web_root}}/beacon/individuals/?filters=NCIT:C20197,NCIT:C9291)
    - this query returns information about individuals with an anal carcinoma (**NCIT:C9291**) and a known male genotypic sex (**NCIT:C20197**)
    - in Progenetix, the information about its sex is associated with the _Individual_ object
      (stored in _individuals_), whereas the cancer type is a property of the _Biosample_.
      However, cross entity queries are supported through full aggregation across the different entities.

##### `/individuals/{id}/`

* [/biosamples/pgxind-kftx25hb/]({{config.api_web_root}}/beacon/biosamples/pgxind-kftx25hb/)
    - retrieval of a single individual

##### `/individuals/{id}/genomicVariations/`

* [/individuals/pgxind-kftx25hb/genomicVariations/]({{config.api_web_root}}/beacon/individuals/pgxind-kftx25hb/genomicVariations/)
    - retrieval of all variants from a single individual
    - currently - and especially since for a mostly CNV containing resource - `variants` means "variant instances" (or as in the early v2 draft `variantsInSample`)

----

#### Base `/genomicVariations`

There is currently (April 2021) still some discussion about the implementation and naming
of the different types of genomic variant endpoints. Since the Progenetix collections
follow a "variant observations" principle all variant requests are directed against
the local `variants` collection.

If using `g_variants` or `variants_in_sample`, those will be treated as aliases.

##### `/genomicVariations/` + query

* [/genomicVariations/?assemblyId=GRCh38&referenceName=17&variantType=DEL&filterLogic=AND&start=7500000&start=7676592&end=7669607&end=7800000](h{{config.api_web_root}}/beacon/genomicVariations/?assemblyId=GRCh38&referenceName=17&variantType=DEL&filterLogic=AND&start=7500000&start=7676592&end=7669607&end=7800000)
  - This is an example for a Beacon "Bracket Query" which will return focal deletions in the TP53 locus (by position).

##### `/genomicVariations/{id}/` or `/g_variants/{id}/`

* [/genomicVariations/5f5a35586b8c1d6d377b77f6/]({{config.api_web_root}}/beacon/genomicVariations/5f5a35586b8c1d6d377b77f6/)

##### `/genomicVariations/{id}/biosamples/`

* [/genomicVariations/5f5a35586b8c1d6d377b77f6/biosamples/]({{config.api_web_root}}/beacon/genomicVariations/5f5a35586b8c1d6d377b77f6/biosamples/)

----

#### Base `/analyses`

The Beacon v2 `/analyses` endpoint accesses the information about the genomic variants
derived from a single analysis. In Progenetix the main use of these documents is the storage of e.g.
CNV statistics or binned genome calls.

##### `/analyses/` + query

* [/analyses/?filters=cellosaurus:CVCL_0004]({{config.api_web_root}}/beacon/analyses/?filters=cellosaurus:CVCL_0004)
  - this example retrieves all biosamples having an annotation for the Cellosaurus _CVCL_0004_
  identifier (K562)

-------------------------------------------------------------------------------

-->

## `bycon` Beacon Server

The [`bycon`](https://github.com/progenetix/bycon) project provides a combination of a Beacon-protocol based API with additional API services, used as backend and middleware for the Progenetix resource.

`bycon` has been developed to support Beacon protocol development following earlier implementations of Beacon+ ("beaconPlus") with now deprected Perl libraries. The work tightly integrates with the [ELIXIR Beacon](https://genomebeacons.org) project.

`bycon` has its own documentation at [bycon.progenetix.org](http://bycon.progenetix.org).





