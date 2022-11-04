---
title: "CURIE Prefix Remapping - NCIT & PMID"
template: post.html
date: 2020-03-30
author: '@mbaudis'
www_links_formatted:
categories:
  - news
tags:
  - Progenetix
  - API
  - ontologies
  - identifiers
  - documentation
---



Wherever possible, data annotation in _Progenetix_ uses *{S}[B]* [_OntologyClass_](https://schemablocks.org/schemas/sb-phenopackets/OntologyClass.html)
objects for categorical values, with CURIEs as _id_ values. So far, the
_Progenetix_ databases had used `pubmed:` for _PubMed_ identifiers and `ncit:`
for NCI Metathesaurus (Neoplasm) ids.

<!--more-->

In line with the use in [Monarch](https://monarchinitiative.org) and other
reference ontology based projects, we have switched the identifier formats:

* `ncit:C12345` => `NCIT:C12345`
* `pubmed:1234567` => `PMID:1234567`

Please [report](mailto:contact@progenetix.org) broken links!
