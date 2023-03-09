# Plots & Data Visualizations

## Image Formats

The standard format for (plot-)images generated on Progenetix is Scalable Vector Graphics ([SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)). As the name implies, SVG is _scalable_, i.e. images can be scaled up without loosing quality or expanding in storage size. However, some of teh generated images use also embedded rastered components which will deteriorate during scaling - this is e.g. the case for array probe plots.

!!! note "[Wikipedia](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)"

    All major modern web browsers—including Mozilla Firefox, Internet Explorer, Google Chrome, Opera, Safari, and Microsoft Edge—have SVG rendering support.

On most pages where plots are being displayed there is a download option for the images - (please alert us where those are missing). Browsers also have the option to export SVGs themselves e.g. as PDF.

## The PGX plotting library

Plots on Progenetix are generated using the [PGX package](http://github.com/progenetix/PGX/), a set of Perl libraries for processing and graphical representation of CNV data. The package contains tools to

* read and write e.g. [Progentix segment files](/doc/fileformats.html)
* generate binned status maps
* render plots of sample-specific and aggregate CNV data, such as histograms and CNV frequency heatmaps


## Plot Types

### CNV Histogram Plots

There are two possibilities to plot CNV histograms through the Progenetix API w/o using the user interface:

1. direct visualization of pre-computed collations, e.g. publications or diagnosttic entities
    * [progenetix.org/services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443](http://progenetix.org/services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443)
2. a Beacon API query with the added option `&output=histoplot`
    * [progenetix.org/beacon/biosamples/?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot](http://progenetix.org/beacon/biosamples/?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot)

Please **use option 1** if accessing complete entities (i.e. only using a single `filters` value) - this option is not limited through large sample numbers.

#### Examples

* customized plot for glioblastoma CNV frequencies, limited to chromosomes 7, 9 and 10
    - `progenetix.org/services/collationPlots/?id=NCIT:C3058&chr2plot=7,9,10&colorschema=redgreen&size_plotimage_w_px=640`

![](http://progenetix.org/services/collationPlots/?id=NCIT:C3058&chr2plot=7,9,10&colorschema=redgreen&size_plotimage_w_px=640)

## Additional plot parameters

Plot parameters can be added to the request using a standard `&__parameter__=__value__`
syntax.

* `size_plotimage_w_px`
    - modifies the width of the plot image in px (default 800)
    - <http://progenetix.org/services/collationPlots/?id=PMID:22824167&size_plotimage_w_px=1084>
* `size_plotarea_h_px`
    - height of the plot area (excluding labels etc.) in px (default 100)
    - <http://progenetix.org/services/collationPlots/?id=NCIT:C7376&size_plotarea_h_px=300>
![](http://progenetix.org/services/collationPlots/?id=NCIT:C7376&size_plotarea_h_px=300)

* `value_plot_y_max`
    - modifies the histogram's maximum value in percent (default 100)
    - <http://progenetix.org/services/collationPlots/?id=pgx:cohort-TCGAcancers&value_plot_y_max=50>
* `colorschema`
    - change of colors used for gains and losses
    - options
        *  `orangeblue` (default)
        *  `redgreen`
        *  `greenred`
        *  `bluered`
* `chr2plot`
    - comma-concatenated list of chromosomes to plot
    - default is 1 -> 22 since X & Y are not always correctly normalized for CNV
  frequencies
        *  `chr2plot=1,2,3,44,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,X,Y`
        *  `chr2plot=9`

    - <http://progenetix.org/services/collationPlots/?id=NCIT:C7376&size_plotarea_h_px=40&value_plot_y_max=50&colorschema=bluered&chr2plot=1,3,9,17,22>
![](http://progenetix.org/services/collationPlots/?id=NCIT:C7376&size_plotarea_h_px=40&value_plot_y_max=50&colorschema=bluered&chr2plot=1,3,9,17,22)
