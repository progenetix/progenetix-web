# Cancercelllines Resource Documentation

The _cancercelllines.org_ genomic information resource contains genome profiling data,
somatic mutation information and associated metadata for thousands of human cancer
cell lines. It has its origins in genomic copy number variation (CNV) profiling data
of cell lines originally collected as part of the  more than 100’000 individual 
datasets in the [Progenetix](http://progenetix.org) oncogenomic
resource. However, by providing genome mapped, annotated 
data for many types of genomic mutations, together with CNV profiles for a subset
of the overall more than 16'000 cell lines, _cancercelllines.org_ goes beyond the original scope of Progenetix
and provides an entry point for the comparative analysis of genomic variants in
cell lines as well as for the exploration of related publications.

!!! example "Citation"

    * cancercelllines.org: Cancer cell line oncogenomic online resource (2023)

??? tip "Additional Articles & Citation Options"

    * Huang Q, Carrio-Cordo P, Gao B, Paloots R, Baudis M. (2021) **The Progenetix oncogenomic resource in 2021.** _Database (Oxford)._ 2021 Jul 17    
    * progenetix.org: **Progenetix oncogenomic online resource** (2022)
    * Baudis M, Cleary ML. (2001) **Progenetix.net: an online repository for molecular cytogenetic aberration data.** _Bioinformatics._ 17:1228-1229      
    * Cai H, Kumar N, Ai N, Gupta S, Rath P, Baudis M.  **Progenetix: 12 years of oncogenomic data curation.** Nucleic Acids Res (2014) Jan;42   
    * Cai H, Kumar N, Baudis M. (2012) **arrayMap: a reference resource for genomic copy number imbalances in human malignancies.** _PLoS One._ 7:e36944.    
    * Baudis M. (2007) **Genomic imbalances in 5918 malignant epithelial tumors: an explorative meta-analysis of chromosomal CGH data.** _BMC Cancer._ 7:226.    
    * Baudis M. (2006) **Online database and bioinformatics toolbox to support data mining in cancer cytogenetics.** _Biotechniques._ 40:296-272.

??? info "Registration & Licenses"

    As of March 2012, no registration is required for using Progenetix and related
    resources such as _cancercelllines.org_. While the data is licensed under
    [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0)
    we suggest that you contact [Michael Baudis](https://info.baudisgroup.org/group/Michael_Baudis/)
    if you plan any commercial use of the database or are interested to incorporate
    the data into your research projects, for optional collaborative support.
    
## Related Resources

**Progenetix** The _Progenetix_ database and cancer genomic information resource provides a
comprehensive collection of genomic copy number profiling data for the majority
of cancer types (ca. 800 diagnostic codes as of 2023). It was publicly
launched in 2001, abnnounced through an article in
[_Bioinformatics_](https://academic.oup.com/bioinformatics/article/17/12/1228/225653).
The database & software are developed by the [group of Michael Baudis](https://info.baudisgroup.org)
at the [University of Zurich](https://www.mls.uzh.ch/en/research/baudis/) and the
Swiss Institute of Bioinformatics [(SIB)](http://sib.swiss/baudis-michael/).

Additional information - e.g. about contacts or related publications - is available
through the [group page](http://info.baudisgroup.org) of the Baudis group at the
University of Zürich. For a list of publication by the Baudis group you can go to
the [group's website](https://info.baudisgroup.org/categories/publications.html),
[EuropePMC](https://europepmc.org/search?query=0000-0002-9903-4248) or any of the links here.

**Beacon** The _Beacon_ project of the Global Alliance for Genomics and Health [GA4GH](https://ga4gh.org)
develops a framework and default data model for the discovery and exchange of genomic variants
and associated biomedical annotations. _cancercelllines.org_ makes extensive use of
the Beacon protocol for its API and also as engine behind its front end (see below). 

## Progenetix Source Code

With exception of some utility scripts and external dependencies (e.g.
[MongoDB](https://www.mongodb.com/try/download/community)) the following projects
provide the vast majority of the software (from database interaction to website)
behind Progenetix and Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span>.

### [`bycon`](https://github.com/progenetix/bycon)

- Python based service based on the [GA4GH Beacon protocol](http://beacon-project.io)
- software powering the _cancercelllines.org_ and _Progenetix_ resources
- [Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span>](http://beacon.progenetix.org/ui/) implementation(s) use the same code base

### [`cancercelllines-web`](https://github.com/progenetix/cancercelllines-web)

- website for _cancercelllines.org_
- implemented as [React](https://reactjs.org) / [Next.js](https://nextjs.org) project
- contains this documentation tree here as `mkdocs` project, with files in the `docs` directory

### [`byconaut`](https://github.com/progenetix/byconaut)

- extensions (server services...) and management tools for bycon-based installations

### [`progenetix-web`](https://github.com/progenetix/progenetix-web)

- website for Progenetix and its Beacon<span style="vertical-align: super; color: red; font-weight: 800;">+</span> implementations
- provides Beacon interfaces for the `bycon` server, as well as other Progenetix sevices (e.g. the [publications](http://progenetix.org/publications/) repository)
- implemented as [React](https://reactjs.org) / [Next.js](https://nextjs.org) project
- contains this documentation tree here as `mkdocs` project, with files in the `docs` directory

### Additional Projects

#### [`icdot2uberon`](https://github.com/progenetix/icdot2uberon)

* mappings between ICD-O 3 topographies and UBERON anatomical sites

#### [`ICDOntologies`](https://github.com/progenetix/ICDOntologies)

* mappings between ICD-O 3 morphology / topography pairs and NCIt neoplasm core
  cancer ontology
