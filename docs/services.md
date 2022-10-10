# Progenetix API & Services

The _bycon_ environment provides a number of data services which make use of
resources in the _Progenetix_ environment.

## Formats

### `services.py` and URL Mapping

The service URL format is `progenetix.org/services/{serviceName}/?parameter=value`.

--------------------------------------------------------------------------------

### API Response formats

Standard responses are provided as `Content-Type: application/json`. The wrapper
format for JSON encoded data follows the standard Beacon response
format where the main data is usually contained in the `response.results` list.

--------------------------------------------------------------------------------

### Data File Formats - `.pgxseg` Segments

Progenetix uses a variation of a standard tab-separated columnar text file such
as produced by array or sequencing CNV software, with an optional metadata header
for e.g. plot or grouping instructions.

Wile the first edition only was geared towards sample-linked segment annotations,
a variation is now being provided for CNV frequencies.

#### `.pgxseg` Sample Segment Files

* a standard tab-delimited Progenetix segments file
    - an additional header may exist
    - only first 5 columns are necessary
    - column 5 (mean) can be empty or dot, if column 6 exists and contains status value
    - undefined fields in existing columns are replaced with the "." character
* header (optional)
    - header lines start with the `#` character
    - Plot parameters:
        * lines start with `#plotpars=>`
        * parameters are added in `parameter_name=value;other_parameter=itsValue` format - see below
        * basically any [plot parameter from PGX](https://github.com/progenetix/PGX/blob/master/config/plotdefaults.yaml) can be used
    - Sample / grouping parameters
        * the `biosample_id` parameter is required to assign values (e.g. group labels) to samples
        * `biosample_id` has to correspond to the identifiers used in column 1 of the following segments data
        * `parameter=value` pairs are semicolon-separated
        * values may be wrapped in double quotation marks (`group_label="Ductal Breast Carcinoma"`)
        * `group_id` __should__ be used for grouping
      - this is a convention for the Progenetix plotting engine
      - `group_label` is optional for grouping / labeling of the groups
    - Metadata
        * lines start with `#meta=>`
        * additional information about the file
        * (so far) only informative

For example, this API call retireves the variants for 78 samples from two NCIt
cancer types (please be aware of the `&filterLogic=OR` pragma!):

* [progenetix.org/beacon/variants/?filters=NCIT:C6393,NCIT:C4504&filterLogic=OR&output=pgxseg](http://progenetix.org/beacon/variants/?filters=NCIT:C6393,NCIT:C4504&filterLogic=OR&output=pgxseg)

An excerpt of the segment file would look like below:

```
#meta=>biosample_count=78
#plotpars=>title="Testing Custom Plot Parameters"
#plotpars=>subtitle="Some Chromosomes, Colors etc."
#plotpars=>chr2plot="3,5,7,8,11,13,16"
#plotpars=>color_var_dup_hex=#EE4500;color_var_del_hex=#09F911
#plotpars=>size_title_left_px=300
#plotpars=>size_text_title_left_px=10
#sample=>biosample_id=pgxbs-kftvhhmm;group_id=NCIT:C6393;group_label="Invasive Ductal and Invasive Lobular Breast Carcinoma"
#sample=>biosample_id=GSM252886;group_id=NCIT:C4504;group_label="Malignant Breast Phyllodes Tumor"
biosample_id  chro  start stop  mean  variant_type  probes
pgxbs-kftvhhmm  1 911484  11993973  -0.4486 DEL .
pgxbs-kftvhhmm  1 12158755  22246766  0.2859 DUP  .
pgxbs-kftvhhmm  1 22346353  24149880  -0.5713 DEL .
pgxbs-kftvhhmm  1 24160170  33603123  0.0812  . .
pgxbs-kftvhhmm  1 33683474  37248987  -0.6478 DEL .
pgxbs-kftvhhmm  1 37391587  248655165 0.0342  . .
pgxbs-kftvhhmm  2 110819  240942225 -0.0007 . .
pgxbs-kftvhhmm  3 119131  4655519 -0.0122 . .
pgxbs-kftvhhmm  3 4662952 4857477 0.9273 DUP  .
...
```

#### `.pgxseg` Segment CNV Frequencies

In the frequency file

* `group_id` values replace the `biosample_id`
    - multiple groups can be concatenated in the file
* `chro`, `start` and `end` are the same as in the sample files
* `gain_frequency` and `loss_frequency` indicate the *percent* values for gains and losses overlapping the segment, respectively

Future options are under evaluation.

Examples can be derived from the Progenetix "Services" API:

* [/services/intervalFrequencies/pgx:cohort-TCGAcancers/?output=pgxseg](http://progenetix.org/services/intervalFrequencies/pgx:cohort-TCGAcancers/?output=pgxseg)
    - single group in REST syntax (here overall CNV frequencies in >11000 cancer samples from the TCGA sample collection)
* [/services/intervalFrequencies/?filters=icdom-81403,icdom-81443&output=pgxseg](http://progenetix.org/services/intervalFrequencies/?filters=icdom-81403,icdom-81443&output=pgxseg)
    - 2 sets using the `filters` parameter

```
#meta=>genome_binning=1Mb;interval_number=3106
#group=>group_id=icdom-81403;label=Adenocarcinoma, NOS;dataset_id=progenetix;sample_count=18559
group_id  chro  start end gain_frequency  loss_frequency  index
icdom-81403 1 0 1000000 8.8 9.12  0
icdom-81403 1 1000000 2000000 8.49  8.68  1
icdom-81403 1 2000000 3000000 9.81  13.19 2
icdom-81403 1 3000000 4000000 10.02 15.84 3
icdom-81403 1 4000000 5000000 7.94  15.91 4
...
icdom-81403 2 228000000 229000000 7.37  6.62  477
icdom-81403 2 229000000 230000000 7.39  6.89  478
icdom-81403 2 230000000 231000000 8.3 7.0 479
icdom-81403 2 231000000 232000000 8.24  6.86  480
icdom-81403 2 232000000 233000000 9.1 7.89  481
...
```

--------------------------------------------------------------------------------


### Data Matrix Files

#### CNV Frequency Matrix

The CNV frequency matrix contains interval CNV frequencies for genomic bins, separate for gain and loss frquencies:

* header similar to segment frequency files
* first column with group identifier
* standard genome binning on GRCh38 results in 2 x 3106[^1] value columns
* header line indicates genomic ranges for the bins
* first all gain frequencies (in %), then all losses

```
#meta=>genome_binning=1Mb;interval_number=3106
#group=>group_id=NCIT:C7376;label=Pleural Malignant Mesothelioma;dataset_id=progenetix;sample_count=240
#group=>group_id=PMID:22824167;label=Beleut M et al. (2012)...;dataset_id=progenetix;sample_count=159
group_id  1:0-1000000:gainF 1:1000000-2000000:gainF ...  1:0-1000000:lossF  1:1000000-2000000:lossF ...
NCIT:C7376  9.58  7.92  ...  1.89 1.89  ...
PMID:22824167 6.29  0.0 ... 8.18  4.4 ...
```

##### Examples

* <http://progenetix.org/services/intervalFrequencies/?datasetIds=progenetix&output=pgxmatrix&filters=NCIT:C7376,PMID:22824167>

#### CNV Status Matrix

For endpoints with per biosample or callset / analysis delvery, the Progenetix
API offers the delivery of a binned status matrix. This matrix can e.g. directly
be used for clustering CNV patterns.

* id columns, followed by
    - all "gain status" columns (e.g. 3106[^1], see above), followed by
    - all "loss status" columns
* the status is indicated by a coverage value, i.e. the fraction of how much the
binned interval overlaps with one or more CNVs of the given type.

The header will contain sample specific information.

```
#meta=>id=progenetix
#meta=>assemblyId=GRCh38
#meta=>filters=NCIT:C4443
#meta=>genome_binning=1Mb;interval_number=3106
#meta=>no_info_columns=3;no_interval_columns=6212
#sample=>biosample_id=pgxbs-kftvktaz;analysis_ids=pgxcs-kftwu9ca;group_id=NCIT:C6650;group_label=Ampulla of Vater adenocarcinoma;NCIT::id=NCIT:C6650;NCIT::label=Ampulla of Vater adenocarcinoma
#sample=>biosample_id=pgxbs-kftvkyeq;analysis_ids=pgxcs-kftwvv3p;group_id=NCIT:C3908;group_label=Ampulla of Vater Carcinoma;NCIT::id=NCIT:C3908;NCIT::label=Ampulla of Vater Carcinoma
...
#meta=>biosampleCount=26;analysisCount=26
analysis_id biosample_id  group_id  1:0-1000000:DUP 1:1000000-2000000:DUP 1:2000000-3000000:DUP 1:3000000-4000000:DUP  ...
pgxcs-kftwu9ca  pgxbs-kftvktaz  NCIT:C6650  0 0.3434  1.0 1.0
pgxcs-kftwwbry  pgxbs-kftvkzwp  NCIT:C3908  0.5801  0 0.6415  1.0
...
```

##### Examples

* [progenetix.org/beacon/callsets/?output=pgxmatrix&filters=NCIT:C4443](http://progenetix.org/beacon/callsets/?output=pgxmatrix&filters=NCIT:C4443)


### Image Formats

The standard format for (plot-)images generated on Progenetix is Scalable Vector Graphics ([SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)). As the name implies, SVG is _scalable_, i.e. images can be scaled up without loosing quality or expanding in storage size. However, some of teh generated images use also embedded rastered components which will deteriorate during scaling - this is e.g. the case for array probe plots.

!!! note [Wikipedia](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)
    All major modern web browsers—including Mozilla Firefox, Internet Explorer, Google Chrome, Opera, Safari, and Microsoft Edge—have SVG rendering support.

On most pages where plots are being displayed there is a download option for the images - (please alert us where those are missing). Browsers also have the option to export SVGs themselves e.g. as PDF.

#### The PGX plotting library

Plots on Progenetix are generated using the [PGX package](http://github.com/progenetix/PGX/), a set of Perl libraries for processing and graphical representation of CNV data. The package contains tools to

* read and write e.g. [Progentix segment files](/doc/fileformats.html)
* generate binned status maps
* render plots of sample-specific and aggregate CNV data, such as histograms and CNV frequency heatmaps     

#### CNV Histogram Plots

There are two possibilities to plot CNV histograms through the Progenetix API w/o using the user interface:

1. direct visualization of pre-computed collations, e.g. publications or diagnosttic entities
    * [progenetix.org/services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443](http://progenetix.org/services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443)
2. a Beacon API query with the added option `&output=histoplot`
    * [progenetix.org/beacon/biosamples/?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot](http://progenetix.org/beacon/biosamples/?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot)

Please **use option 1** if accessing complete entities (i.e. only using a single `filters` value) - this option is not limited through large sample numbers.

--------------------------------------------------------------------------------

## Services

### Cancer Genomics Publications `publications`

The `publications` service serves as backend API for the display of genome
screening publications through the Progenetix [Publications DB](http://progenetix.org/publications/).

It provides articles describing whole genome screening (WGS, WES, aCGH, cCGH) experiments in cancer, including some information about e.g. the numbers of samples analysed with a given technology and if sample profiles are available in Progenetix.

Please contact us to alert us about additional articles you are aware of. The inclusion criteria are described in the [documentation](/publication-collection).

Since 2021 you can now directly submit suggestions for matching publications to the [oncopubs repository on Github](https://github.com/progenetix/oncopubs).

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

### Gene Coordinates `genespans`

* genomic mappings of gene coordinats
* initially limited to _GRCh38_ and overall CDS extension
* responds to (start-anchored) text input of HUGO gene symbols using the `geneId`
parameter or path value
* returns a list of matching gene objects (see below under __Response Formats__)
* the `filterPrecision=exact` query parameter restricts the response to a single
exact gene symbol match

#### Examples

* [progenetix.org/services/genespans/?geneId=TP53&filterPrecision=exact](http://progenetix.org/services/genespans/?geneId=TP53&filterPrecision=exact)
* [progenetix.org/services/genespans/CDKN2A](http://progenetix.org/services/genespans/CDKN2A)

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

### Public and Local Identifiers `ids`

The `ids` service forwards compatible, prefixed ids (see [`config/ids.yaml`](https://github.com/progenetix/bycon/blob/master/services/config/ids.yaml)) to specific
website endpoints. There is no check if the id exists; this is left to the web
page handling itself.

* <http://progenetix.org/services/ids/pgxbs-kftva5zv>
* <http://progenetix.org/services/ids/PMID:28966033>
* <http://progenetix.org/services/ids/NCIT:C3262>
* <http://progenetix.org/services/ids/cellosaurus:CVCL_0022>
* <http://progenetix.org/services/ids/pgx:icdom-81703>

The `pgx` prefix has been registered with [identifiers.org](http://identifiers.org)
and the service can also be used to access identifiers at Progenetix.

* <https://identifiers.org/pgx:pgxbs-kftva5zv>

--------------------------------------------------------------------------------

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
* by `geolatitude` & `geolongitude` & `geodistance`
    - `geodistance` is to be given in meters

#### Response options

* `&output=text`
* `&output=map`
    - see below...

##### Examples

* [progenetix.org/services/geolocations?city=zurich](http://progenetix.org/services/geolocations?city=zurich)
* [progenetix.org/services/geolocations?city=New](http://progenetix.org/services/geolocations?city=New)
* [progenetix.org/services/geolocations?geolongitude=-0.13&geolatitude=51.51&geodistance=100000](http://progenetix.org/services/geolocations?geolongitude=-0.13&geolatitude=51.51&geodistance=100000)

--------------------------------------------------------------------------------

### Geographic Maps

The new (2022) service utilizes the _geolocations_ service to

* display of matched cities on a map using the `&output=map` option
* load arbitrary data from a hosted data table (e.g. on Github)

##### Parameters

* `output=map` is required for the map display
* `help=true` will show map configuration parameters
* `file=http://........tsv` can be used to load a (tab-delimited) table of data w/ latitude + loniitude
parameters for displaying it on a map

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


