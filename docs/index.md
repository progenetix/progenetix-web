
# Progenetix Cancer Genomics Platform Documentation Site

The Progenetix database and cancer genomic information resource
contains genome profiles of more than 100’000 individual cancer genome screening
experiments. The genomic profiling data was derived from genomic arrays and chromosomal
[Comparative Genomic Hybridization (CGH)](https://en.wikipedia.org/wiki/Comparative_genomic_hybridization)
as well as Whole Genome or Whole Exome Sequencing (WGS, WES) studies. Genomic profiles
are either processed from various raw data formats or are extracted from published
experimental results.
![progenetix arraymap cancercelllines logo](/img/arraymap-cancercelllines-progenetix-logos-1200x240.png){: style="float: right; width: 400px; margin-top: 0px;"}
Additionally to the CNV-centric _progenetix_ collection the platforms ecosystem
contains additional datasets with partially overlapping content. [_cancercelllines.org_](https://cancercelllines.org)
is an information resource presenting known mutations from (as of 2023) more than 
16000 cancer cell lines, additional to more than 5000 CNV profiles from cell line
profiling experiments. [_arrayMap_](http://arraymap.org) represents the subset of
the [_progenetix_](https://progenetix.org) data for which probe-specific data from
genomic array experiments is available.


!!! tip "Tracking News"

    For occasional news and messages - and to submit feedback - we suggest that you
    follow Progenetix on Mastodon \@progenetix\@genomic.social [:fontawesome-brands-mastodon:](https://genomic.social/@progenetix)

!!! example "Citation"

    Huang Q, Carrio-Cordo P, Gao B, Paloots R, Baudis M. (2021) **The Progenetix oncogenomic resource in 2021.** _Database (Oxford)._ 2021 Jul 17    
    progenetix.org: **Progenetix oncogenomic online resource** (2022)   
    

??? tip "Additional Articles & Citation Options"

    Baudis M, Cleary ML. (2001) **Progenetix.net: an online repository for molecular cytogenetic aberration data.** _Bioinformatics._ 17:1228-1229      
    Cai H, Kumar N, Ai N, Gupta S, Rath P, Baudis M.  **Progenetix: 12 years of oncogenomic data curation.** Nucleic Acids Res (2014) Jan;42   
    Cai H, Kumar N, Baudis M. (2012) **arrayMap: a reference resource for genomic copy number imbalances in human malignancies.** _PLoS One._ 7:e36944.    
    Baudis M. (2007) **Genomic imbalances in 5918 malignant epithelial tumors: an explorative meta-analysis of chromosomal CGH data.** _BMC Cancer._ 7:226.    
    Baudis M. (2006) **Online database and bioinformatics toolbox to support data mining in cancer cytogenetics.** _Biotechniques._ 40:296-272.

??? info "Registration & Licenses"

    As of March 2012, no specific registration is required for using the Progenetix and and arrayMap resources. While the data is licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0) we suggest that you contact [Michael Baudis](https://info.baudisgroup.org/group/Michael_Baudis/) if you plan any commercial use of the database or are interested to incorporate the data into your research projects.
    
The __Progenetix__ database and cancer genomic information resource was publicly launched in 2001, abnnounced through an article in [_Bioinformatics_](https://academic.oup.com/bioinformatics/article/17/12/1228/225653). The database & software are developed by the [group of Michael Baudis](https://info.baudisgroup.org) at the [University of Zurich](https://www.mls.uzh.ch/en/research/baudis/) and the Swiss Institute of Bioinformatics [(SIB)](http://sib.swiss/baudis-michael/).

Additional information - e.g. about contacts or related publications - is available through the [group page](http://info.baudisgroup.org) of the Baudis group at the University of Zürich. For a list of publication by the Baudis group you can go to the [group's website](https://info.baudisgroup.org/categories/publications.html),  [EuropePMC](https://europepmc.org/search?query=0000-0002-9903-4248) or any of the links here.

----

## Progenetix Source Code

With exception of some utility scripts and external dependencies (e.g. [MongoDB](https://www.mongodb.com/try/download/community)) the following projects provide the vast majority of the software (from database interaction to website) behind Progenetix and Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span>.

### [`bycon`](https://github.com/progenetix/bycon)

- Python based service based on the [GA4GH Beacon protocol](http://beacon-project.io)
- software powering the Progenetix resource
- [Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span>](http://beacon.progenetix.org/ui/) implementation(s) use the same code base

### [`progenetix-web`](https://github.com/progenetix/progenetix-web)

- website for Progenetix and its Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span> implementations
- provides Beacon interfaces for the `bycon` server, as well as other Progenetix sevices (e.g. the [publications](http://progenetix.org/publications/) repository)
- implemented as [React](https://reactjs.org) / [Next.js](https://nextjs.org) project
- contains this documentation tree here as `mkdocs` project, with files in the `docs` directory

### [`PGX`](https://github.com/progenetix/PGX)

- a Perl ibrary providing utility functions for Progenetix CNV data
- used for data transformation, e.g. binning of segmental CNV data
- main purpose now in providing the various plots (CNV histograms, clusterd CNV profiles, array plots)

### Additional Projects

#### Information extraction for cancer cell line genes

Recently we performed data enrichment for cancer cell line genes in collaboration
with Zurich University of Applied Sciences. By using natural
language processing tool we were able to identify gene information associated
with cancer cell lines. The results can be found:

* Navigate to [`Cell Line Listings`](https://cancercelllines.org/subsets/cellosaurus-subsets/) 
* Use search bar to find the cell line of interest
* You will be redirected to cell line page where cell line metadata and
variant information is displayed.
* By scrolling down, you can find the section **Literature Derived Contextual Information**.
* There, all gene results are listed. Gene of interest can be visualised on the CNV
frequency plot by clicking on the gene.

#### [`icdot2uberon`](https://github.com/progenetix/icdot2uberon)

* mappings between ICD-O 3 topographies and UBERON anatomical sites

#### [`ICDOntologies`](https://github.com/progenetix/ICDOntologies)

* mappings between ICD-O 3 morphology / topography pairs and NCIt neoplasm core
  cancer ontology
