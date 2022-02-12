---
---

# Progenetix Publication Collection

## Progenetix publication collection: Which scientific publications are included?

The [Progenetix Publication DB](http://progenetix.org/publications/) contains articles describing whole genome screening (WGS, WES, aCGH, cCGH[^1]) experiments in cancer. Genomic information about the analyzed cancer samples is extracted from these publications to generate cancer mutation data, with a focus on copy number abnormalities (CNV / CNA).

Data from a scientific publication is included in the Progenetix publication collection if the following __three main criteria__ are fulfilled:

1. Data was obtained from a __human tumor sample__
2. Data represents the tumor at a __whole-genome level__
3. Genomic resolution is at least comparable to molecular-cytogenetic assessment (i.e. cytoband / Megabase resolution).

The table below summarizes which genome sequencing technologies generally offer relevant tumor sample data for the Progenetix web resource, and which ones don't:

Relevant technologies | Non-relevant technologies
------------ | -------------
whole-genome sequencing  |  targeted genome-sequencing
whole-exome sequencing  | gene expression arrays / sequencing
chromosomal Comparative Genomic Hybridization (CGH) | tissue microarrays
genomic arrays (SNP, aCGH) | methylation arrays[^2]

Note that, despite containing data about tumor samples at a whole-genome level, some publications might still **not** be relevant for the Progenetix publication collection. Examples of such publications are:

* publications that report previously presented data (e.g. reviews, technical publications, ...)
* publications with data that from certain _in vitro_ experiments (e.g. drug exposure)
* publications with tumor data obtained from animal models (i.e. not measuring a human genome)
* articles which report germline analyses - e.g. **GWAS** studies of individuals with a risk for - or manifestation of - a malignancy are **not** included


[^1]:
    Whole-genome screening techniques: **cCGH** chromosomal Comparative Genomic Hybridization; **aCGH** genomic arrays (including single color oligonucleotide, SNP, and large-insert clone arrays); **WES** Whole Exome Sequencing; **WGS** Whole Genome Sequencing

[^2]:
    In principle, methylation arrays could be considered as "genome screening experiments", since one may extract e.g. CNV profiles from some platforms/experiments. However, at this time we do not consider them as "compatible" platforms.
