# Use Cases

## Explore Gene CNVs

One of the main use cases for the Progenetix resource is the exploration of frequency and disease specificity of genes of interest. Traditionally, the relevance of somatic CNVs hitting a gene in the context of cancer are judged by

* the CNV frequency (i.e. in what fraction of samples the a CNV in this gene is being observed)
* the relative specificity, i.e. how CNVs in this gene compare to
    - the overall amount of CNVs in the samples
    - the local specificity, i.e. the "focality" of the CNVs

The [Progenetix Search Page](https://progenetix.org/biosamples/) supports the exploration of regional CNVs through

* support for inserting positions of genes or cytobands into standard Beacon query parameter fields
* selection support for hierarchical disease annotations
* providing example queries as templates

The response of the queries for genomic variants provide some basic statistics, e.g. the relative frequencies of these variants for each classification code (e.g. NCIT, ICD-O) encountered in teh matched samples.

### Example Procedure

**TBD**

## Download or Plot CNV Frequencies

The Progenetix resource provides pre-computed CNV frequencies for all its
"collations" such as

* cancer types by e.g. NCIt, ICD-O morphology and topography codes
* experimental series, e.g. all samples from a given publication
* custom cohorts, e.g. all samples used in a Progenetix meta-analysis or
external project such as TCGA

This data can be accessed through the Progenetix API in data and image format.

![Example CNV histogram with custom parameters](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=NCIT:C7376&-size_plotarea_h_px=40&-value_plot_y_max=50&-colorschema=bluered&-chr2plot=1,3,9,17,22)

Interval frequencies are per default stored in a 1Mb binned format. More
information about the API use can be found [in the IntervalFrequencies API documentation](services.md#pgxseg-segment-cnv-frequencies).

### Example Procedure - Download CNV Frequencies

Typical cases for the use of collation-specific frequency data could be e.g.
the visualization of CNV tracks with 3rd party tools such as [Circos](http://www.circos.ca/software/)
or integration in data analysis workflows, e.g. for comparing target genes to
local, disease-specific CNV frequencies.

#### Getting cancer type CNV frequencies

All cancer codes for a given classification system can be retrieved though:

* NCIT
    - [progenetix.org/services/collations?filters=NCIT&output=text](https://progenetix.org/services/collations?filters=NCIT&output=text)
* ICD-O Morphologies
    - [progenetix.org/services/collations?filters=icdom&method=counts&output=text](https://progenetix.org/services/collations?filters=icdom&method=counts&output=text)
    - please be aware that we have to use transformed ICD-O codes; e.g.
  "ICD-O 8500/3" is represented as `pgx:icdom-85003` (`s/^(\d{4})\/(\d)$/pgx:icdom-$1$2/`)
* ICD-O Topographies
    - [progenetix.org/services/collations?filters=icdot&method=counts&output=text](https://progenetix.org/services/collations?filters=icdot&method=counts&output=text)

#### Download the data file

For any of those codes one can create a `.pgxseg` file downloader link for the
["IntervalFrequencies" service](services.md#pgxseg-segment-cnv-frequencies):

##### Examples

* [progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=NCIT:C105555](https://progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=NCIT:C105555)
* [progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=icdom-85003](https://progenetix.org/services/intervalFrequencies/?output=pgxseg&filters=icdom-85003)


### Example Procedure - Download or embed CNV frequency plot

For the generation of CNV frequency plots, the same procedure as above for
identifying existing frequency maps can be applied. CNV hsitograms in [SVG format](services.md#image-formats)
can be generated for download or embedding through a canonical service URL with
added (single) collation code.


#### Additional plot parameters

Plot parameters can be added to the request using a standard `&-__parameter__=__value__`
syntax. Please be aware of the `-` prefix.

* `-size_plotimage_w_px`
    - modifies the width of the plot image in px (default 800)
    - <https://progenetix.org/services/collationPlots/?id=PMID:22824167&-size_plotimage_w_px=1084>
* `-size_plotarea_h_px`
    - height of the plot area (excluding labels etc.) in px (default 100)
    - [progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=NCIT:C7376&-size_plotarea_h_px=300](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=NCIT:C7376&-size_plotarea_h_px=300)
* `-value_plot_y_max`
    - modifies the histogram's maximum value in percent (default 100)
    - [progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=pgx:cohort-TCGAcancers&-value_plot_y_max=50](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=pgx:cohort-TCGAcancers&-value_plot_y_max=50)
* `-colorschema`
    - change of colors used for gains and losses
    - options
        *  `orangeblue` (default)
        *  `redgreen`
        *  `greenred`
        *  `bluered`
* `-chr2plot`
    - comma-concatenated list of chromosomes to plot
    - default is 1 -> 22 since X & Y are not always correctly normalized for CNV
  frequencies
        *  `-chr2plot=1,2,3,44,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,X,Y`
        *  `-chr2plot=9`

    - [progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=NCIT:C7376&-size_plotarea_h_px=40&-value_plot_y_max=50&-colorschema=bluered&-chr2plot=1,3,9,17,22](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?id=NCIT:C7376&-size_plotarea_h_px=40&-value_plot_y_max=50&-colorschema=bluered&-chr2plot=1,3,9,17,22)
        *  see example above (live representation of embedded API call for this example)


##### Examples

* [progenetix.org/services/collationPlots/?id=pgx:icdom-85003](https://progenetix.org/services/collationPlots/?id=pgx:icdom-85003)
* [progenetix.org/services/collationPlots/?id=PMID:22824167](https://progenetix.org/services/collationPlots/?id=PMID:22824167)

--------------------------------------------------------------------------------

## Download Sample Data

The sample annotations for any type of query - particularly but not limited to
single identifier values - can be downloaded in either [Beacon v2 JSON](beaconplus.md#beacon-api)
or in a tab-delimited text format (`&output=table`).

##### Examples

* Download all TCGA cancer samples from Progenetix as tab-delimited table
      - [progenetix.org/beacon/biosamples/?filters=pgx:cohort-TCGAcancers&output=table](http://progenetix.org/beacon/biosamples/?filters=pgx:cohort-TCGAcancers&output=table)

--------------------------------------------------------------------------------

## pgxRpi, an R Library to Access Progenetix Data

`pgxRpi` is an API wrapper package to access data from Progenetix database. More details about this package are in the vignettes ([link](https://github.com/progenetix/pgxRpi)). There are several functions in this R package.

### Retrieve biosample information 

You can select biosamples from specific groups of interests, chosen by a filter. The description about _filters_ is in this [link](https://docs.progenetix.org/classifications-and-ontologies/).

```
biosamples <- pgxLoader(type="biosample", filters = "NCIT:C3512",codematches = TRUE)
```
The returned biosample information includes biosample id, various codes for tumor types, tumor stage, survival data, associated literature or research project, etc.

### Query and export copy number variant data 

You can download the copy number variant data of individual biosamples. The biosample id can be queried by pgxRpi or by Progenetix [website](https://progenetix.org/biosamples/).
The variant data exportation supports different output formats, more information see vignettes.

```
variants <- pgxLoader(type="variant", biosample_id = c("pgxbs-kftva6du","pgxbs-kftva6dv","pgxbs-kftva6dx"),output = "pgxseg")
```

### Query and visualize CNV frequencies 

You can query the CNV frequency of specific filters, namely specific cohorts. There are two available data formats. One is [`.pgxseg`](https://docs.progenetix.org/services/#pgxseg-segment-cnv-frequencies), good for visualization. Another is [`.pgxmatrix`](https://docs.progenetix.org/services/#cnv-frequency-matrix), good for analysis.

```
frequency <- pgxLoader(type="frequency", output ='pgxseg',
                         filters=c("NCIT:C4038","pgx:icdom-85003"), 
                         codematches = TRUE)
```

The data visualization requires the input data with `.pgxseg` format. You can plot the frequency by genome, by chromosomes, or plot like circos.

```
pgxFreqplot(frequency, filters='pgx:icdom-85003')
```

<img src="../img/pgxRpi-freq-plot-by-genome.png" style="margin-left: auto; margin-right:auto" />

```
pgxFreqplot(frequency, filters='NCIT:C4038',chrom=c(1,2,3), layout = c(3,1))
```

<img src="../img/img/pgxRpi-freq-plot-by-chrom.png" style="margin-left: auto; margin-right:auto" />

```
pgxFreqplot(frequency,filters= c("NCIT:C4038","pgx:icdom-85003"),circos = TRUE) 
```

<img src="../img/pgxRpi-freq-plot-by-circos.png" style="margin-left: auto; margin-right:auto" />

 --------------------------------------------------------------------------------

## User-Provided CNV Data

The Progenetix resource has a limited option to visualize CNV data provided by the users. Data has to be formatted in a standard tab-delimited columnar format, preferably using the [`.pgxseg` file format](services.md#data-file-formats-pgxseg-segments). Additional information can be found on the upload service page:

* [Upload Files for CNV Visualization](https://progenetix.org/service-collection/uploader/)

The data is only temporary stored on the server with a randomiized access path. At this time we do not provide any long term or login protected data storage and do not store access data.

#### Example Procedure

**TBD**

--------------------------------------------------------------------------------
