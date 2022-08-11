---
template: blog_post.html
title: Query-based histograms
description: Direct generation of histogram plots from Beacon queries
date: 2022-02-18
---

So far, the plot API only provided (documented) access to generate CNV histogram
plots [from "collations"](../use-cases.md#collation-plots) with pre-computed frequencies.
The `bycon` API now offers a direct access to the histograms, by adding `&output=histoplot`
to a Beacon (biosamples) query URL. The server will first query the samples and then perform
a handover to the plotting API. Please be aware that this procedure is best suited for limited
queries and may lead to a time-out.

<!--more-->

#### Example (some loading time)

![Example query-based CNV histogram](http://progenetix.org/beacon/biosamples/?referenceName=9&variantType=EFO:0030067&start=21500000&start=21975098&end=21967753&end=22500000&filters=NCIT:C3058&filters=pgx:cohort-celllines&output=histoplot)

* [progenetix.org/beacon/biosamples/?referenceName=9&variantType=EFO:0030067&start=21500000&start=21975098&end=21967753&end=22500000&filters=NCIT:C3058&filters=pgx:cohort-celllines&output=histoplot](http://progenetix.org/beacon/biosamples/?referenceName=9&variantType=EFO:0030067&start=21500000&start=21975098&end=21967753&end=22500000&filters=NCIT:C3058&filters=pgx:cohort-celllines&output=histoplot)
    - a search for samples with focal deletion in the _CDKN2A_ locus, limited to glioblastoma cell lines 

Please see the dociumentation in [Use Cases](../use-cases.md#query-based-histograms).
