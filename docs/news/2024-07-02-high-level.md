---
template: post.html
title: Data model and plotting update
description: Now with "high level" support
date: 2024-07-02
links:
---

![Example Plot](/img/high-level-EGFR-glioblastoma-example-plot.svg){ style="" }
Both the data model and the plot engine now support an separate color style for
high level CNV events. In histograms those are overplotted on the standard
color scheme - e.g. red areas where high level plots were detected, by their
absolute frequency. In the example plot above we performed a search for high-level
gains involving EGFR, in glioblastomas, and then only plotted chromosomes 7 and 9.
While the ~100% peak at EGFR is expected, additionally nearly 70% of the matched
samples have a focal and high level deletion involving the CDKN2A locus. 
<!--more-->


