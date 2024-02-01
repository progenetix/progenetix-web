# pgxRpi, an R Library to Access Progenetix Data

`pgxRpi` is an API wrapper package to access data from Progenetix database. More details about this package are in the [vignettes](https://github.com/progenetix/pgxRpi). There are several functions in this R package.

## Retrieve biosample information 

You can select biosamples from specific groups of interests, chosen by a filter. The description about _filters_ is [here](https://docs.progenetix.org/common/classifications-and-ontologies/).

```
biosamples <- pgxLoader(type="biosample", filters = "NCIT:C3512",codematches = TRUE)
```
The returned biosample information includes biosample id, various codes for tumor types, tumor stage, survival data, associated literature or research project, etc.

## Query CNV coverage data of biosamples from specific cohorts

The coverage is calculated across 1MB genomic bins, chromosomal arms, whole chromosomes, or whole genome.

The CNV coverage across genomic bins can be accessed by setting `output` = "pgxmatrix". More details about the data format "pgxmatrix" see the [documentation](https://docs.progenetix.org/services/#cnv-status-matrix).

```
cnv.status <- pgxLoader(type="variant", filters = "NCIT:C3058", output="pgxmatrix", codematches = T)
```

The CNV coverage across chromosomal arms, chromosomes, or whole genome can be accessed by setting `output` = "coverage".

```
cnv.status <- pgxLoader(type="variant", filters = "NCIT:C4443", output="coverage", codematches = F)
```

## Query and export segment copy number variant data 

You can download the copy number variant data of individual biosamples. The biosample id can be queried by pgxRpi or by Progenetix [website](http://progenetix.org/biosamples/).
The variant data exportation supports different output formats, more information see vignettes.

```
variants <- pgxLoader(type="variant", biosample_id = c("pgxbs-kftva6du","pgxbs-kftva6dv","pgxbs-kftva6dx"),output = "pgxseg")
```

## Query and visualize CNV frequencies 

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

<img src="../img/pgxRpi-freq-plot-by-chrom.png" style="margin-left: auto; margin-right:auto" />

```
pgxFreqplot(frequency,filters= c("NCIT:C4038","pgx:icdom-85003"),circos = TRUE) 
```

<img src="../img/pgxRpi-freq-plot-by-circos.png" style="margin-left: auto; margin-right:auto" />
