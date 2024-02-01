# Plots & Data Visualizations

## Image Formats

The standard format for (plot-)images generated on Progenetix is Scalable Vector Graphics ([SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)). As the name implies, SVG is _scalable_, i.e. images can be scaled up without loosing quality or expanding in storage size. However, some of teh generated images use also embedded rastered components which will deteriorate during scaling - this is e.g. the case for array probe plots.

!!! note "[Wikipedia](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)"

    All major modern web browsers—including Mozilla Firefox, Internet Explorer, Google Chrome, Opera, Safari, and Microsoft Edge—have SVG rendering support.

On most pages where plots are being displayed there is a download option for the images - (please alert us where those are missing). Browsers also have the option to export SVGs themselves e.g. as PDF.

## The `byconaut` plotting library

Functionality of the Progenetix and cancercellline.org plotting API is provided
by the [`byconaut`](https://byconaut.progenetix.org/) software project. It supports:

* render plots of sample-specific and aggregate CNV data, such as histograms clustered
  CNV sample strips
* read and write e.g. [Progentix `.pgxseg` segment files](/doc/fileformats.html)

!!! alert "Plot Parameters and Documentation"

    Please visit the documentation of the `byconaut` software repository for
    documentation about the use of the plotting API, e.g. how to modify
    plots using specific parameters (sizes, color, labels...):

    * [`byconaut` plot documentation](https://byconaut.progenetix.org/plotting/) with all 
      plot parameters

## Plot Examples

Below are just some plot examples; for detailed use please refer to the
[documentation](https://byconaut.progenetix.org/plotting/).

Examples link to or are embedded from **{{api_site_label}}**.

### CNV Histogram Plots

There are two possibilities to plot CNV histograms through the Progenetix API w/o using the user interface:

1. direct visualization of pre-computed collations, e.g. publications or diagnosttic entities
    * [services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443]({{config.api_web_root}}/services/collationPlots/?datasetIds=progenetix&id=NCIT:C4443)
2. a services API query in Beacon format, with the added option `&plotType=histoplot`
   (which is actually the fallback so not strictly needed...)
    * [services/sampleplots?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot]({{config.api_web_root}}/services/sampleplots?limit=200&datasetIds=progenetix&referenceName=refseq:NC_000009.12&variantType=EFO:0030067&start=21500000,21975098&end=21967753,22500000&filters=NCIT:C3058&output=histoplot)

Please **use option 1** if accessing complete entities (i.e. only using a single `filters` value) - this option is not limited through large sample numbers.

#### Examples

!!! note "Live Plot Generation"

    The examples below are embedded using direct API calls to `progenetix.org`.


* customized plot for glioblastoma CNV frequencies, limited to chromosomes 7, 9
  and 10 and 
    - `services/collationPlots/?id=NCIT:C3058&plotPars=plotChros=7,9,10::size_plotimage_w_px=640`

![]({{config.api_web_root}}/services/collationPlots/?id=NCIT:C3058&plotPars=plotChros=7,9,10::size_plotimage_w_px=640)

* plot with modified maximum Y - `value_plot_y_max` (histogram's maximum value
  in percent) and some custom label, for the TCGA cancer samples
    - `services/collationPlots/?id=pgx:cohort-TCGAcancers&plotPars=value_plot_y_max=50::plot_region_labels=5:0-48000000:Frequent+5p+gain,8:127735434-127742951:MYC::plot_marker_font_size=12`

![]({{config.api_web_root}}/services/collationPlots/?id=pgx:cohort-TCGAcancers&plotPars=value_plot_y_max=50::plot_region_labels=5:0-48000000:Frequent+5p+gain,8:127735434-127742951:MYC::plot_marker_font_size=12)

* as above, but plastering some cancer driver genes on the plot by their gene
  symbols (`plot_gene_symbols`):
  - `services/collationPlots/?id=pgx:cohort-TCGAcancers&plotPars=value_plot_y_max=50::plot_gene_symbols=MYC,MYCN,REL,ERBB2,TP53,CDK1,EGFR,BCL2,RB1::plot_marker_font_size=10`

![]({{config.api_web_root}}/services/collationPlots/?id=pgx:cohort-TCGAcancers&plotPars=value_plot_y_max=50::plot_gene_symbols=MYC,MYCN,REL,ERBB2,TP53,CDK1,EGFR,BCL2,RB1::plot_marker_font_size=10)


### Sample Strip Plots

* a sample plot, automatically clustered, from a search for Glioblastoma samples
  in the TCGA cancers cohort (limited to 30 samples)
    - it uses the `plotType=samplesplot` to force the per sample display
    - `services/sampleplots?filters=NCIT:C3058,pgx:cohort-TCGAcancers&plotPars=plotGeneSymbols=CDKN2A,EGFR&limit=30&plotType=samplesplot`

![]({{config.api_web_root}}/services/sampleplots?filters=NCIT:C3058,pgx:cohort-TCGAcancers&plotPars=plotGeneSymbols=CDKN2A,EGFR&limit=30&plotType=samplesplot)

* as above, without the `plotType=samplesplot` using the `histoplot` default
    - `services/sampleplots?filters=NCIT:C3058,pgx:cohort-TCGAcancers&plotPars=plotGeneSymbols=CDKN2A,EGFR&limit=30`

![]({{config.api_web_root}}/services/sampleplots?filters=NCIT:C3058,pgx:cohort-TCGAcancers&plotPars=plotGeneSymbols=CDKN2A,EGFR&limit=30)