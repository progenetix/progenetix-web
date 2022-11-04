---
template: post.html
title: Paginated Downloads
description: Chunk-wise downloads of search results
date: 2022-04-11
---

<img src="/img/biosamples-result-paging.png" style="float: right; width: 250px; margin: -120px 0px 5px 20px;"/>Throught its [Search Samples](http://progenetix.org/biosamples/) page Progenetix has
always offered options to download search results (biosamples, variants) in different formats (JSON,
tab-delimited tables, _pgxseg_ files ...). However, especially for large results with 
thousands of samples and potentially millions of variants this led to inconsistent behaviour
e.g. time-outs or dropped connections.

Now, API responses are capped through the `limit` parameter to default "sensible" values
which, however, can be adjusted for systematic data access & retrieval. This functionality
is also implemented in the sample search form, allowing e.g. the limited retrieval of
a subset of samples from large or general cancer types, or the "paging" through consecutive
sample groups for partitioned data retrieval.

<!--more-->

We have recently worked on implementing a [cleaner _paging_ method](/changelog/?h=paging#2022-03-24-limiting-document-numbers-through-pagination) through which data from Progenetix queries can be retrieved in consistent "parcels", using handover links. Technically, the ids of all
items matched by the original query are stored internally and retrieved by their
index ranges (e.g. samples 101-200) in several pre-defined formats.

Please see the [Beacon framework documentation](http://docs.genomebeacons.org/framework/) for a detailed description of the parameters.
