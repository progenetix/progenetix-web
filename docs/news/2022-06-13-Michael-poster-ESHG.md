---
template: post.html
title: "Implementation of the GA4GH Beacon protocol for discovery and sharing of genomic copy number variation data"
description: Poster Abstract | ESHG Vienna 2022 
date: 2022-06-13
author: "@mbaudis"
hide:
  - navigation
  - toc
---

**Background & Objectives** Genomic copy number variations (CNV) are a major contributor to inter-individual genomic variation, can be causative events in rare diseases, but especially represent the majority of the mutational landscape in the most malignancies. While specific CNV events and some recurring patterns have contributed to the identification of individual cancer drivers and the recognition of cancer  subtypes, the complexity of genomic CNV patterns requires large amounts of well-defined genomic profiles for statistically meaningful analyses. At the other end of the spectrum, in the area of rare disease genomics the potential pathogenicity of individual CNV events requires validation against a vast set of disease-related and reference genomic profiles and annotations.

<!--more-->

**Methods** The “Beacon” protocol - developed with support from ELIXIR, the European bioinformatics infrastructure organization, as a standard of the Global Alliance for Genomics and Health (GA4GH) - represents an emerging standard for an “Internet for Genomics”. While the initial version of the protocol served as a widely adopted test bed for the sharing of genomic variants over federated query systems connecting hundreds of internationally distributed resources, the version 2 of the protocol aims at providing a framework for extended, metadata-rich query and response options in both public and restricted federated access scenarios. Throughout the development of Beacon v2, the Progenetix cancer genomics resource (progenetix.org) - including the largest publicly accessible set of cancer CNV data - has served as a testbed for implementation of Beacon v2 protocol features. 

**Results** With the implementation of the Beacon v2 API as backbone of the Progenetix resource - serving genome-wide CNV profiling data from more than 130’000 individual experiments, representing over 700 diagnostic entities and  more that 1’500 published studies - we could demonstrate the use of the GA4GH Beacon v2 protocol as a practical solution for the sharing of vast amounts of genomic profiling data, in a open setting and using a documented, completely open API for third party use.
Conclusion:

With the Beacon v2 protocol - as a major upgrade from the v1 standard - currently being under review as GA4GH standard, work is focussing on its implementation in a wide set of use cases, from access protected clinical information systems to public-access research databases. Importantly, an ELIXIR-supported implementation study by members of the ELIXIR h-CNV community (cnvar.org) will explore the generation of Beacon v2 powered CNV implementations by various major European genomics resources, in the fields of human genetics / rare diseases and cancer genomics.

**Poster** [[PDF]](http://info.baudisgroup.org/pdf/2022-06-13___Michael-Baudis-Progenetix-ESHG-poster.pdf)


??? Note "References"

    Huang, Q., Carrio-Cordo, P., Gao, B., Paloots, R., & Baudis, M. (2021). The Progenetix oncogenomic resource in 2021. Database (Oxford), 2021 Jul 17.

    Rehm, H. L., Page, A. J. H., Smith, L., Adams, J. B., Alterovitz, G., Babb, L. J. et al. (2021). GA4GH: International policies and standards for data sharing across genomic research and healthcare. Cell Genomics, 1(2), 100029.
    
    Salgado, D., Armean, I. M., Baudis, M., Beltran, S., Capella-Gutierrez, S., Carvalho-Silva, D. et al. (2020). The ELIXIR Human Copy Number Variations Community: building bioinformatics infrastructure for research [version 1; peer review: 1 approved]. F1000Research, 9(1229).
    
    Fiume, M., Cupak, M., Keenan, S., Rambla, J., de la Torre, S., Dyke, S. O. M. et al. (2019). Federated discovery and sharing of genomic data using Beacons. Nat Biotechnol, 37(3), 220-224.
