---
template: post.html
title: Histogram Improvements
description: Excluding reference samples from default plots
date: 2022-02-18
---

So far all samples matching a grouping code ("collation"; disease, publication etc.)
have been included when generating the pre-computed CNV frequencies. However, the
potential inclusion of normal/refernce samples sometimes lead to "dampened" CNV
profiles. Now, samples labeled as "reference sample" ([`EFO:0009654`](http://www.ebi.ac.uk/efo/EFO_0009654)) - 
a term we had introduced into the Experimental Factor Ontology - are excluded from
pre-computed histograms. However, when e.g. calling up samples from publications
using the search panel referencve samples will be included unless specifically excluded.

![](http://progenetix.org/services/collationplots/?datasetIds=progenetix&filters=PMID:22824167)
<div style="font-size:  0.8em;">Pre-computed CNV Frequencies for <a href="http://progenetix.org/publication/?filters=PMID:22824167">PMID:22824167</a>, now ommitting reference samples by default</div>

<!--more-->

![](http://progenetix.org/services/samplesplot?datasetIds=progenetix&filters=PMID:22824167&plotType=histoplot)
<div style="font-size:  0.8em;">All samples for <a href="http://progenetix.org/publication/?filters=PMID:22824167">PMID:22824167</a> were used when just retrieving by PMID</div>

