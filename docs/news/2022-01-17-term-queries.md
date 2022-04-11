---
template: blog_post.html
title: Term-specific queries
description: Allowing the de-selection of descendant terms in ontology filters
date: 2022-01-17
---

<img src="/img/2022-01-17-includeDescendantTerms-ui.png" style="float: right; width: 222px; margin-top: -15px;" alt="includeDescendantTerms selector" />So far (and still as standard), any
selected filter will also include matches on its child terms; i.e. "NCIT:C3052 -
Digestive System Neoplasm" will include results from gastric, esophagus, colon
... cancer. Here we introduce a selector for the search panel to make use of the Beacon v2
filters `includeDescendantTerms` pragma, which can be set to _false_ if one only
wants to query for the term itself and exclude any child terms from the matching.

Please be aware that this can only be applied globally and will affect all filtering
terms used in a query. More information is available in the [Filtering Terms](beaconplus.md#filters-filters-filtering-terms) documentation.