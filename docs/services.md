# Progenetix API Services `/services/`

The [`bycon`](https://github.com/progenetix/bycon) software stack underneath the 
_Progenetix_ environment provides support for a number of data services which make
use of special resources in _Progenetix_ or just provide alternative forms of data
delivery such as tabular text  or VCF files or data plots.

!!! note "Progenetix Beacon API"

    For the standard `Beacon` data API please see the [separate documentation page](/beaconplus).

## Formats

### `services.py` and URL Mapping

The service URL format is `progenetix.org/services/{serviceName}/?parameter=value`.

### API Response formats

Standard responses are provided as `Content-Type: application/json`. The wrapper
format for JSON encoded data follows the standard Beacon response
format where the main data is usually contained in the `response.results` list.

## Services

Services enabled through [`bycon`](https://github.com/progenetix/bycon) and rendered
through Progenetix are now documented through the [`bycon` software documentation](https://bycon.progenetix.org/API-services/). The special content of some of the Progenetix services is detailed below.

### Cancer Genomics Publications `publications`

The `publications` service serves as backend API for the display of genome
screening publications through the Progenetix [Publications DB](http://progenetix.org/publications/).

It provides articles describing whole genome screening (WGS, WES, aCGH, cCGH) experiments in cancer, including some information about e.g. the numbers of samples analysed with a given technology and if sample profiles are available in Progenetix.

Please contact us to alert us about additional articles you are aware of. The inclusion criteria are described in the [documentation](/publication-collection).

Since 2021 you can now directly submit suggestions for matching publications to the [oncopubs repository on Github](https://github.com/progenetix/oncopubs).


### Cytoband Mapping `cytomapper`

This services parses either:

* a properly formatted cytoband annotation (`cytoBands`)
    - "8", "9p11q21", "8q", "1p12qter"
* a concatenated `chroBases` parameter
    - `7:23028447-45000000`
    - `X:99202660`

While the return object is JSON by default, specifying `text=1`, together with the `cytoBands` or
`chroBases` parameter will return the text version.

There is a fallback to *GRCh38* if no assembly is being provided.

The `cytoBands` and `chroBases` parameters can be used for running the script on the command line
(see examples below).

#### Examples

* retrieve coordinates for some bands on chromosome 8  
    - [progenetix.org/services/cytomapper?assemblyId=NCBI36.1&cytoBands=8q24.1](http://progenetix.org/services/cytomapper?assemblyId=NCBI36.1&cytoBands=8q24.1)
* as above, just as text:
    - [progenetix.org/services/cytomapper?assemblyId=NCBI36.1&cytoBands=8q&output=text](http://progenetix.org/services/cytomapper?assemblyId=NCBI36.1&cytoBands=8q&output=text)
    - *cytomapper shortcut*: [progenetix.org/services/cytomapper/?assemblyId=NCBI36.1&cytoBands=8q&output=text](http://progenetix.org/services/cytomapper/?assemblyId=NCBI36.1&cytoBands=8q&output=text)
* get the cytobands whith which a base range on chromosome 17 overlaps, in short and long form
    - [progenetix.org/services/cytomapper?assemblyId=GRCh37&chroBases=17:800000-24326000](http://progenetix.org/services/cytomapper?assemblyId=GRCh37&chroBases=17:800000-24326000)
* using `curl` to get the text format mapping of a cytoband range, using the API `services` shortcut:
    - `curl -k http://progenetix.org/services/cytomapper?cytoBands\=8q21q24.1&assemblyId\=hg18&text\=1`
* running it locally
    - `./services/cytomapper.py --cytoBands 9p12q21`
    - `./services/cytomapper.py --assemblyId GRCh37 --cytoBands 9p12q21`
    - `./services/cytomapper.py --chroBases=17:800000-2432600`
    - `./services/cytomapper.py --assemblyId GRCh37 --cytoBands 8q --output json`

#### Response

As in other **bycon** `services`, API responses are in JSON format with the main
content being contained in the `response.results` field.


### Gene Coordinates `genespans`

* genomic mappings of gene coordinats
* initially limited to _GRCh38_ and overall CDS extension
* responds to (start-anchored) text input of HUGO gene symbols using the `geneId`
parameter or path value
* returns a list of matching gene objects (see below under __Response Formats__)
* the `filterPrecision=exact` query parameter restricts the response to a single
exact gene symbol match

#### Examples

* [progenetix.org/services/genespans/?geneId=TP53](http://progenetix.org/services/genespans/?geneId=TP53)
    - this will return all genes that start with `TP53`
* [progenetix.org/services/genespans/?geneId=TP53&filterPrecision=exact](http://progenetix.org/services/genespans/?geneId=TP53&filterPrecision=exact)
    - only TP53 info will be returned due to `filterPrecision=exact`
* [progenetix.org/services/genespans/CDKN2A](http://progenetix.org/services/genespans/CDKN2A)
    - when using the REST syntax also only the exact match will be returned


### Ontology Cross-Mapping (`ontologymaps`)

The `ontologymaps` service provides equivalency mapping between ICD-O and other
classification systems, notably NCIt. The mappings are represented in the [ICDOntologies](https://github.com/progenetix/ICDOntologies) project and accessible trough a front-end in the [Progenetix Services area](http://progenetix.org/service-collection/ontologymaps).

#### ICD-O Representation

Our resources use an internal representation of ICD-O 3 codes since no official CURIES are provided by the IARC. The syntax is:

* ICD-O 3 morphologies
    - "pgx:icdom-"`s/\///`; i.e. number only code
    - "8500/3" => `pgx:icdom-85003`
* ICD-O 3 Topographies
    - "icdot-" + code
    - "C53.9" => `pgx:icdot-C53.9`

#### Parameters

##### `filters`

* required
* comma-concatenated __complete__ codes and/or prefixes
* partial codes (see above for ICD-O syntax) will not be matched unless a relaxed filter precision is indicated

##### `filterPrecision`

* optional
* to allow partial code matches (see examples below)

#### Examples

##### NCIt and ICD-O 3

* [progenetix.org/services/ontologymaps/?filters=pgx:icdom-85003](http://progenetix.org/services/ontologymaps/?filters=pgx:icdom-85003)
* [http://progenetix.org/services/ontologymaps/?filters=NCIT](http://progenetix.org/services/ontologymaps/?filters=NCIT)
* [progenetix.org/services/ontologymaps/?filters=pgx:icdom-85003,pgx:icdot-C50.9](http://progenetix.org/services/ontologymaps/?filters=pgx:icdom-85003,pgx:icdot-C50.9)
* [progenetix.org/services/ontologymaps/?filters=icdom-85,icdot-C50&filterPrecision=start](http://progenetix.org/services/ontologymaps/?filters=icdom-85,icdot-C50&filterPrecision=start)
    - As in the example above, but by stemmming the query parameters and providing the `filterPrecision=start` pragma, the response will now be a list of matched data objects (inputs and equivalents)

##### UBERON and ICD-O 3 Topography

* [progenetix.org/services/ontologymaps/?filters=UBERON&filterPrecision=start](http://progenetix.org/services/ontologymaps/?filters=UBERON&filterPrecision=start)
    - all mappings
* [progenetix.org/services/ontologymaps/?filters=UBERON,icdot-C0&filterPrecision=start](http://progenetix.org/services/ontologymaps/?filters=UBERON,icdot-C0&filterPrecision=start)
    - all `C0...` ICD-O T matches
    - limited to `UBERON` mappings since the prefix was given, too (otherwise all the NCIT mappings would also be listed for these ICD-O T code matches)

#### More Information

* [Web Interface for ICD & NCIT](http://progenetix.org/service-collection/ontologymaps)
* [Interface for ICD & UBERON](http://progenetix.org/service-collection/uberonmaps)

<!--

### Public and Local Identifiers `ids`

The `ids` service forwards compatible, prefixed ids (see [`config/ids.yaml`](https://github.com/progenetix/bycon/blob/master/services/config/ids.yaml)) to specific
website endpoints. There is no check if the id exists; this is left to the web
page handling itself.

* <http://progenetix.org/services/ids/pgxbs-kftva5zv>
* <http://progenetix.org/services/ids/pubmed:28966033>
* <http://progenetix.org/services/ids/NCIT:C3262>
* <http://progenetix.org/services/ids/cellosaurus:CVCL_0022>
* <http://progenetix.org/services/ids/pgx:icdom-81703>

The `pgx` prefix has been registered with [identifiers.org](http://identifiers.org)
and the service can also be used to access identifiers at Progenetix.

* <https://identifiers.org/pgx:pgxbs-kftva5zv>

-->

### Geographic Locations / Cities _geolocations_

This service provides geographic location mapping for cities above 25'000
inhabitants (\~22750 cities), through either:

* matching of the (start-anchored) name
    - optional use of one of
        * `ISO3166alpha3`
        * `ISO3166alpha2`
        * (start-anchored, partial...) `country`
* providing GeoJSON compatible parameters:
    - `geoLongitude`
    - `geoLatitude`
    - `geoDistance`
        * optional, in meters; a default of 10'000m (10km) is provided
        * can be used for e.g. retrieving all places (or data from places if used
        with publication or sample searches) in an approximate region (e.g. for
        Europe using `2500000` around Heidelberg...)
        * optional use of a single `ISO3166alpha3` or `ISO3166alpha2` country code;
        e.g. [`?geoLatitude=42.36&geoLongitude=-71.06&geoDistance=500000&ISO3166alpha3=USA&map_h_px=800`](http://progenetix.org/services/geolocations?geoLatitude=42.36&geoLongitude=-71.06&geoDistance=500000&ISO3166alpha3=USA&output=map&map_h_px=800)
        will show cities in the NE U.S. (500km around Boston, MA) w/o matching Canadian ones

#### Query Types

* by `city`
    - start-anchored, case insensitive match `?city=heide`
    - optional e.g. `?city=heidelberg&ISO3166alpha2=ZA`
* by `id`
    - this uses the `city::country` "id" value, e.g. `lecce::italy`
* by `geoLatitude` & `geoLongitude` & `geoDistance`
    - `geoDistance` is to be given in meters

#### Response options

* `&output=text`
* `&output=map`
    - see below...

##### Examples

* [progenetix.org/services/geolocations?city=zurich](http://progenetix.org/services/geolocations?city=zurich)
* [progenetix.org/services/geolocations?city=New](http://progenetix.org/services/geolocations?city=New)
* [progenetix.org/services/geolocations?geolongitude=-0.13&geolatitude=51.51&geodistance=100000](http://progenetix.org/services/geolocations?geolongitude=-0.13&geolatitude=51.51&geodistance=100000)


### Geographic Maps

The new (2022) service utilizes the _geolocations_ service to

* display of matched cities on a map using the `&output=map` option
* load arbitrary data from a hosted data table (e.g. on Github)

#### Map Projections of Query results

The option `output=map` activates a Leaflet-based map projection of 
the geomapping data (either from search results or provided as an
external, web hosted file).

* [/services/geolocations?city=Heidelberg&output=map&marker_type=marker](http://progenetix.org/services/geolocations?city=Heidelberg&output=map&marker_type=marker)

##### Parameters

* `output=map` is required for the map display
* `help=true` will show map configuration parameters
* `file=http://........tsv` can be used to load a (tab-delimited) table of data w/ latitude + loniitude
parameters for displaying it on a map


#### Map with markers from a hosted file

* [progenetix.org/services/geolocations?map_w_px=600&map_h_px=480&marker_type=marker&file=https://raw.githubusercontent.com/compbiozurich/compbiozurich.github.io/main/collab/people.tab&output=map&help=true](http://progenetix.org/services/geolocations?map_w_px=600&map_h_px=480&marker_type=marker&file=https://raw.githubusercontent.com/compbiozurich/compbiozurich.github.io/main/collab/people.tab&output=map&help=true)

##### `file` properties

The current setup allows to have multiple items per "group", where a group corresponds to a single
location (i.e. all items have the same latitude & longitude parameters).

`group_label`
: Label text, required

`group_lat`
: Latitude, required

`group_lon`
: Longitude, required

`item_size`
: size parameter, e.g. count for this item; will be summed up for all members of the same group
(e.g. for a marker size corresponding to the group size); defaults to `1`

`item_label`
: Label for this item


`item_link`
: Link for this item; optional

`markerType`
: One of `marker` or `circle`; defaults to `marker` if no size is given


```
group_label group_lat   group_lon   item_size   item_label  item_link   markerType
Swiss   47  8   50  Progenetix  http://progenetix.org
Swiss   47  8   60  LSZGS 2 http://lifescienceszurich.ch
Swiss   47  8   100 UZH http://uzh.ch
Swiss   47  8   97  SIB http://sib.swiss
German  51  10  217     
Italian 44  11  75      
Austrian    48  15  41  
```

##### Examples

* [progenetix.org/services/geolocations?city=Heidelberg&markerType=marker](http://progenetix.org/services/geolocations?city=Heidelberg&output=map&markerType=marker)
* [progenetix.org/services/geolocations?file=https://raw.githubusercontent.com/progenetix/pgxMaps/main/rsrc/locationtest.tsv&debug=&output=map&help=true](http://progenetix.org/services/geolocations?file=https://raw.githubusercontent.com/progenetix/pgxMaps/main/rsrc/locationtest.tsv&debug=&output=map&help=true)




[^1]: Before 2022-02-11 there where 3102 (or 6204) intervals. After this, a changed algorithm lead to
avoidance of centromere-spanning intervals, i.e. shortened last intervals assigned to the chromosomal
p-arm and downstream shifts of interval positions.


