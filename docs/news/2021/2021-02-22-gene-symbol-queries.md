---
title: "Beacon+ and Progenetix Queries by Gene Symbol"
template: blog_post.html
author: '@mbaudis'
date: 2021-02-22
---

<img src="http://info.progenetix.org/assets/img/gene-symbol-selector-example.png", style="float: right; width: 127px; margin-top: -15px;" />We have introduced a simple option to search directly by Gene Symbol, which will match to _any_ genomic variant with partial overlap to the specified gene. This works by expanding the Gene Symbol (e.g. _TP53_, _CDKN2A_ ...) into a range query for its genomic coordinates (maximum CDR).

Such queries - which would e.g. return all whole-chromosome CNV events covering the gene of interest, too - should be narrowed by providing e.g. `Variant Type` and `Maximum Size` (e.g. 2000000) values.

<!--more-->

For testing we have provided a [dedicated search form](https://progenetix.org/beacon-genes/) which allows you to test the search for variants by gene symbol and size thresholding. The options may be expanded, e.g. for categorical overlap definitions or range expansions. Please remember that all these searches can be implemented by standard range requests - and even more fine tuned with "bracketed" searches as in the `CNV Request` example for [Beacon+](https://progenetix.org/beaconPlus/?).
