# Beacon - Discovery Services for Genomic Data

[TOC]

-------------------------------------------------------------------------------

![Beacon Icon](http://info.progenetix.org/assets/img/logo_beacon.png){ align=right width=25px}The Beacon protocol defines an open standard for genomics data discovery,
developed by members of the Global Alliance for Genomics & Health. Since 2016,
the Beacon protocols is being developed through the
<a href="https://beacon-project.io">ELIXIR Beacon project</a> as a GA4GH driver project.</p>

As part of the project, since early 2016 the [Computational Cytogenetics and Oncogenomics Group](http://info.baudisgroup.org) at the University of Zurich develops the
[Beacon<sup><span style="color: #d00;">+</span></sup> demonstrator](https://beacon.progenetix.org/ui/),
to demonstrate current functionality and future Beacon protocol extensions.

The Beacon<sup><span style="color: #d00;">+</span></sup> implementation is a
custom front end on top of the [Progenetix](https://progenetix.org)
dataset, with emphasis on structural genome variations from cancer samples.

On 2020-01-20,  Beacon<sup><span style="color: #d00;">+</span></sup> became part
of the [ELIXIR Beacon Network](https://beacon-network.elixir-europe.org).

## BeaconPlus Data / Query Model

The Progenetix / Beaconplus query model utilises the [GA4GH core data model](https://schemablocks.org/standards/ga4gh-data-model.html) for genomic and (biomedical, procedural) queries and data delivery.

The GA4GH data model for genomics recommends the use of a principle object hierarchy, consisting of

* `variant` (a.k.a. _genomicVariation_)
    - a single molecular observation, e.g. a genomic variant observed in the analysis of the DNA from a biosample
    - mostly corresponding to the "allele" concept, but with alternate use similar to that in VCF (e.g. CNV are no typical "allelic variants")
    - in Progenetix identical variants from different sampleas are identified through
    a compact digest (`variantInternalId`) and can be used to retrieve those distinct
    variants (c.f. "line in VCF")
* `callset`
    - the entirety of all variants, observed in a single experiment on a single sample
    - a _callset_ can be compared to a data column in a __VCF__ variant annotation file
    - _callset_ has an optional position in the object hierarchy, since _variants_ describe biological observations in a biosample
* `biosample`
    - a reference to a physical biological specimen on which analyses are performed
* `individual`
    - in a typical use a human subject from which the biosample(s) was/were extracted

In the Progenetix backend we mirror the GA4GH data model in the storage system, consisting of the corresponding

* variants
* callsets (analyses)
* biosamples
* individuals

collections of MongoDB databases. These collections are addressed by scoped queries.

### `filters` Filters / Filtering Terms

Filters represent a way to allow the resource provider to direct "self-scoped" query values to the corresponding attributes in their backend resource. In the Progenetix implementation, a lookup table followed by scope assignment is used to map prefixed filter values to the correct  attributes and collections. Most of the filter options are
based on ontology terms or identifiers in CURIE format (e.g. `NCIT:C4033`, `cellosaurus:CVCL_0030` or `PMID:16004614`). For use case examples please
look below; documentation of available ontologies and how to find out about available
terms can be found on the [Classifications and Ontologies](classifications-and-ontologies.md) page.

In Beacon v2, the new `FilteringTerms` schema adds options to specify different types of filters (`OntologyFilter`, `AlphanumericFilter`, `CustomFilter`) which can
contain a number of parameters to define e.g. scope or matching behaviour. These
more complex terms are only available through `PUT` requests.

##### Example

```
"filters": [
    {
        "id": "NCIT:C4536",
        "scope": "biosamples",
        "includeDescendantTerms": false
    }
],
```

#### Hierarchical Terminologies in Filter Queries

Hierarchical terminologies allow queries at different levels, to include all its children terms. The Progenetix query filter system adopts this inclusion logic if the classification / code type is hierarchy-based. However, the `includeDescendantTerms` pragma can be used to modify this behaviour - globally
if provided in a `GET` request (`&includeDescendantTerms=false`) or as part of
filter objects (see above).

Examples for codes with hierarchical treatment within the filter space are:

* NCIt
  - true, deep hierarchical ontology of cancer classifications
* Cellosaurus
  - derived cell lines are also accessible through the code of their parental line

--------------------------------------------------------------------------------

## Beacon API

### Beacon v2: Path Examples in Progenetix

The Beacon v2 protocol uses a REST path structure for consistant data access.

The Beacon+ implementation - developed oin the [`bycon` project](https://github.com/progenetix/bycon/)
implements an expanding set of those Beacon v2 paths for the [Progenetix](http://progenetix.org)
resource.

----

#### Base `/`

The root path provides the standard `BeaconInfoResponse`.

* [/](https://progenetix.org/beacon/)

----

#### Base `/filtering_terms`

##### `/filtering_terms/`

* [/filtering_terms/](https://progenetix.org/beacon/filtering_terms/)


##### `/filtering_terms/` + query

* [/filtering_terms/?filters=PMID](https://progenetix.org/beacon/filtering_terms/?filters=PMID)
* [/filtering_terms/?filters=NCIT,icdom](https://progenetix.org/beacon/filtering_terms/?filters=NCIT,icdom)

----

#### Base `/biosamples`

##### `/biosamples/` + query

* [/biosamples/?filters=cellosaurus:CVCL_0004](https://progenetix.org/beacon/biosamples/?filters=cellosaurus:CVCL_0004)
  - this example retrieves all biosamples having an annotation for the Cellosaurus _CVCL_0004_
  identifier (K562)

##### `/biosamples/{id}/`

* [/biosamples/pgxbs-kftva5c9/](http://progenetix.org/beacon/biosamples/pgxbs-kftva5c9/)
  - retrieval of a single biosample

##### `/biosamples/{id}/variants/` & `/biosamples/{id}/variants_in_sample/`

* [/biosamples/pgxbs-kftva5c9/variants/](http://progenetix.org/beacon/biosamples/pgxbs-kftva5c9/variants/)
* [/biosamples/pgxbs-kftva5c9/variants_in_sample/](http://progenetix.org/beacon/biosamples/pgxbs-kftva5c9/variants_in_sample/)
  - retrieval of all variants from a single biosample
  - currently - and especially since for a mostly CNV containing resource - `variants` means "variant instances" (or as in the early v2 draft `variantsInSample`)

##### `/biosamples/{id}/analyses/`

* [/biosamples/pgxbs-kftva5c9/analyses/](http://progenetix.org/beacon/biosamples/pgxbs-kftva5c9/variants/)

----

#### Base `/individuals`

##### `/individuals/` + query

* [/individuals/?filters=NCIT:C7541](https://progenetix.org/beacon/individuals/?filters=NCIT:C7541)
  - this example retrieves all individuals having an annotation associated with _NCIT:C7541_ (retinoblastoma)
  - in Progenetix, this particular code will be part of the annotation for the _biosample(s)_ associated with the returned individual
* [/individuals/?filters=PATO:0020001,NCIT:C9291](https://progenetix.org/beacon/individuals/?filters=PATO:0020001,NCIT:C9291)
  - this query returns information about individuals with an anal carcinoma (**NCIT:C9291**) and a known male genotypic sex (**PATO:0020001**)
  - in Progenetix, the information about its sex is associated with the _Individual_ object (and rtherefore in the _individuals_ collection), whereas the information about the cancer type is a property of the _Biosample_ (and therefore stored in the _biosamples_ collection)

##### `/individuals/{id}/`

* [/biosamples/pgxind-kftx25hb/](http://progenetix.org/beacon/biosamples/pgxind-kftx25hb/)
  - retrieval of a single individual

##### `/individuals/{id}/variants/` & `/individuals/{id}/variants_in_sample/`

* [/individuals/pgxind-kftx25hb/variants/](http://progenetix.org/beacon/individuals/pgxind-kftx25hb/variants/)
* [/individuals/pgxind-kftx25hb/variants_in_sample/](http://progenetix.org/beacon/individuals/pgxind-kftx25hb/variants_in_sample/)
  - retrieval of all variants from a single individual
  - currently - and especially since for a mostly CNV containing resource - `variants` means "variant instances" (or as in the early v2 draft `variantsInSample`)

----

#### Base `/variants`

There is currently (April 2021) still some discussion about the implementation and naming
of the different types of genomic variant endpoints. Since the Progenetix collections
follow a "variant observations" principle all variant requests are directed against
the local `variants` collection.

If using `g_variants` or `variants_in_sample`, those will be treated as aliases.

##### `/variants/` + query

* [/variants/?assemblyId=GRCh38&referenceName=17&variantType=DEL&filterLogic=AND&start=7500000&start=7676592&end=7669607&end=7800000](http://progenetix.org/beacon/variants/?assemblyId=GRCh38&referenceName=17&variantType=DEL&filterLogic=AND&start=7500000&start=7676592&end=7669607&end=7800000)
  - This is an example for a Beacon "Bracket Query" which will return focal deletions in the TP53 locus (by position).

##### `/variants/{id}/` or `/variants_in_sample/{id}` or `/g_variants/{id}/`

* [/variants/5f5a35586b8c1d6d377b77f6/](http://progenetix.org/beacon/variants/5f5a35586b8c1d6d377b77f6/)
* [/variants_in_sample/5f5a35586b8c1d6d377b77f6/](http://progenetix.org/beacon/variants_in_sample/5f5a35586b8c1d6d377b77f6/)

##### `/variants/{id}/biosamples/` & `variants_in_sample/{id}/biosamples/`

* [/variants/5f5a35586b8c1d6d377b77f6/biosamples/](http://progenetix.org/beacon/variants/5f5a35586b8c1d6d377b77f6/biosamples/)
* [/variants_in_sample/5f5a35586b8c1d6d377b77f6/biosamples/](http://progenetix.org/beacon/variants_in_sample/5f5a35586b8c1d6d377b77f6/biosamples/)

----

#### Base `/analyses` (or `/callsets`)

The Beacon v2 `/analyses` endpoint accesses the Progenetix `callsets` collection
documents, i.e. information about the genomic variants derived from a single
analysis. In Progenetix the main use of these documents is the storage of e.g.
CNV statistics or binned genome calls.

##### `/analyses/` + query

* [/analyses/?filters=cellosaurus:CVCL_0004](https://progenetix.org/beacon/analyses/?filters=cellosaurus:CVCL_0004)
  - this example retrieves all biosamples having an annotation for the Cellosaurus _CVCL_0004_
  identifier (K562)





