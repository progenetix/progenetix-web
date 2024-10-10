# Use Cases

## Explore Gene CNVs

One of the main use cases for the Progenetix resource is the exploration of frequency and disease specificity of genes of interest. Traditionally, the relevance of somatic CNVs hitting a gene in the context of cancer are judged by

* the CNV frequency (i.e. in what fraction of samples the a CNV in this gene is being observed)
* the relative specificity, i.e. how CNVs in this gene compare to
    - the overall amount of CNVs in the samples
    - the local specificity, i.e. the "focality" of the CNVs

The [Progenetix Search Page](http://progenetix.org/search/) supports the exploration of regional CNVs through

* support for inserting positions of genes or cytobands into standard Beacon query parameter fields
* selection support for hierarchical disease annotations
* providing example queries as templates

The response of the queries for genomic variants provide some basic statistics, e.g. the relative frequencies of these variants for each classification code (e.g. NCIT, ICD-O) encountered in teh matched samples.

### Example Procedure

* go to the [Progenetix Search Page](http://progenetix.org/search/) (or the equivalent
  page at other resources)
* retrive the gene coordinates by clicking the `Gene Spans` button and typing the
  start f a HUGO gene symbol (e.g. `CDK`); select the gene of interest
* the panel should now show the coordinates (start + end + reference/chromosome);
  select `Apply` to insert the values into the form
* the values represent the genome coordinates for the maximum coding region of the
  gene; if you want to include the flanking regions, you can change the values
  accordingly or convert into a bracket query by changing those to ranges around
  start end end
    - e.g. change the `start` value from `60778331` to `60000000-60778330` and the
      `end` value from `60794852` to `60794853-61500000`; here the start bracket
      and the end brackets cover regions just outside the CDR, e.g. to match small CNVs
      that cober the whole region
* select the `Variant Type`
* `Query Database`

---

## Visualize CNV patterns

The Progenetix resource contains pre-computed CNV frequency profiles for all diagnostic
and technical (e.g. derived from a publication or technical platform) categories. These
profiles provide a rapid overview of CNV events along the genome but also can serve for
the exploration of possible genomic subsets hidden behind the overview profiles.


#### CNV profile clustering



### Example Procedure

**TBD**

---

## Download or Plot CNV Frequencies

### Collation plots

The Progenetix resource provides pre-computed CNV frequencies for all its
"collations" such as

* cancer types by e.g. NCIt, ICD-O morphology and topography codes
* experimental series, e.g. all samples from a given publication
* custom cohorts, e.g. all samples used in a Progenetix meta-analysis or
external project such as TCGA

This data can be accessed through the Progenetix API in data and image format.

![Example CNV histogram with custom parameters](http://progenetix.org/services/collationplots/?filters=NCIT:C7376&-size_plotarea_h_px=40&-value_plot_y_max=50&-colorschema=bluered&plotChros=1,3,9,17,22)

Interval frequencies are per default stored in a 1Mb binned format. More
information about the API use can be found [in the IntervalFrequencies API documentation](services.md#pgxseg-segment-cnv-frequencies).

### Query-based histograms

The Progenetix Beacon responses - depending on their type - usually contain a _handover_
URL to retrieve CNV histogram and/or sample plots of the samples matched by the query.
The `bycon` API now offers a direct access to the histograms without the need to deparse
JSON response first. The switch to the histogram is ionitiated by adding `&output=histoplot`
to the Beacon query URL. Then, the API will first query the samples and then perfor
a handover to the plotting API. Please be aware that this procedure is best suited for limited
queries and may lead to a time-out.

#### Examples:

![Example query-based CNV histogram](http://progenetix.org/services/sampleplots/?referenceName=9&variantType=EFO:0030067&start=21500000&start=21975098&end=21967753&end=22500000&filters=NCIT:C3058&filters=pgx:cohort-celllines&output=histoplot)

* [progenetix.org/services/sampleplots/?geneId=CDKN2A&variantType=EFO:0030067&variantMaxLength=2000000&filters=NCIT:C3058&output=histoplot](http://progenetix.org/services/sampleplots/?geneId=CDKN2A&variantType=EFO:0030067&variantMaxLength=2000000&filters=NCIT:C3058&output=histoplot)
    - a search for glioblastoma samples with a focal (here <= 2Mb) deletion in the _CDKN2A_ locus


### Example Procedure - Download CNV Frequencies

Typical cases for the use of collation-specific frequency data could be e.g.
the visualization of CNV tracks with 3rd party tools such as [Circos](http://www.circos.ca/software/)
or integration in data analysis workflows, e.g. for comparing target genes to
local, disease-specific CNV frequencies.

#### Getting cancer type CNV frequencies

All cancer codes for a given classification system can be retrieved though:

* NCIt cancer codes `NCIT`
    - [progenetix.org/services/collations?collationTypes=NCIT&deliveryKeys=id,label,count](http://progenetix.org/services/collations?collationTypes=NCIT&deliveryKeys=id,label,count)
* ICD-O Morphologies `icdom`
    - [progenetix.org/services/collations?collationTypes=icdom&deliveryKeys=id,label,count](http://progenetix.org/services/collations?collationTypes=icdom&deliveryKeys=id,label,count)
    - please be aware that we have to use transformed ICD-O codes; e.g.
  "ICD-O 8500/3" is represented as `pgx:icdom-85003` (`s/^(\d{4})\/(\d)$/pgx:icdom-$1$2/`)
* ICD-O Topographies `icdot`
    - [progenetix.org/services/collations?collationTypes=icdot&deliveryKeys=id,label,count](http://progenetix.org/services/collations?collationTypes=icdot&deliveryKeys=id,label,count)

#### Download the data file

For any of those codes one can create a `.pgxseg` file downloader link for the
["IntervalFrequencies" service](services.md#pgxseg-segment-cnv-frequencies):

##### Examples

* [progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=NCIT:C105555](http://progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=NCIT:C105555)
* [progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=icdom-85003](http://progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=icdom-85003)


### Example Procedure - Download or embed CNV frequency plot

For the generation of CNV frequency plots, the same procedure as above for
identifying existing frequency maps can be applied. CNV hsitograms in [SVG format](services.md#image-formats)
can be generated for download or embedding through a canonical service URL with
added (single) collation code.


##### Examples

* [progenetix.org/services/collationplots/?filters=pgx:icdom-85003](http://progenetix.org/services/collationplots/?filters=pgx:icdom-85003)
* [progenetix.org/services/collationplots/?filters=PMID:22824167](http://progenetix.org/services/collationplots/?filters=PMID:22824167)

--------------------------------------------------------------------------------

## Download Sample Data

The sample annotations for any type of query - particularly but not limited to
single identifier values - can be downloaded in either [Beacon v2 JSON](beaconplus.md#beacon-api)
or in a tab-delimited text format. You can also use `&limit=` to limit the number of samples to download, `&limit=0` indicates no limitations.

##### Examples

* Download all TCGA cancer samples from Progenetix as tab-delimited table
      - [progenetix.org/services/sampletable/?filters=pgx:cohort-TCGAcancers](http://progenetix.org/services/sampletable/?filters=pgx:cohort-TCGAcancers)


 --------------------------------------------------------------------------------

## User-Provided CNV Data

The Progenetix resource has a limited option to visualize CNV data provided by the users. Data has to be formatted in a standard tab-delimited columnar format, preferably using the [`.pgxseg` file format](services.md#data-file-formats-pgxseg-segments). Additional information can be found on the upload service page:

* [Upload Files for CNV Visualization](http://progenetix.org/service-collection/uploader/)

The data is only temporary stored on the server with a randomiized access path. At this time we do not provide any long term or login protected data storage and do not store access data.

#### Example Procedure

**TBD**

--------------------------------------------------------------------------------
