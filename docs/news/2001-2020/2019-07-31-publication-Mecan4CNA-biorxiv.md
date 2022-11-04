---
title: "Minimum Error Calibration and Normalization for Genomic Copy Number Analysis"
date: 2019-07-31
template: post.html
author: '@mbaudis'
excerpt_link: https://info.baudisgroup.org/publications/2019-07-31-publication-Mecan4CNA-biorxiv/
pdf_file_name: 2019-07-31___Gao-and-Baudis__Minimum-Error-Calibration-and-Normalization-for-Genomic-Copy-Number-Analysis__biorXiv.pdf
pdf_file_type: article    # slides poster article
www_link:
www_links_formatted:
  - <a href="https://www.biorxiv.org/content/10.1101/720854v1" target="_blank">[bioRxiv]</a>
  - <a href="https://pypi.org/project/mecan4cna/" target="_blank">[Python pip]</a>
  - <a href="https://github.com/baudisgroup/mecan4cna" target="_blank">[Github]</a>  
category:
  - about
  - news
tags:
  - article
  - preprint
---

### Minimum Error Calibration and Normalization for Genomic Copy Number Analysis.
#### Bo Gao and Michael Baudis (2019)
##### bioRxiv, 2019-07-31. [DOI 10.1101/720854](https://doi.org/10.1101/720854)

<!--more-->

**Abstract** Copy number variations (CNV) are regional deviations from the normal autosomal bi-allelic DNA content. While germline CNVs are a major contributor to genomic syndromes and inherited diseases, the majority of cancers accumulate extensive “somatic” CNV (sCNV or CNA) during the process of oncogenetic transformation and progression. While specific sCNV have closely been associated with tumorigenesis, intriguingly many neoplasias exhibit recurrent sCNV patterns beyond the involvement of a few cancer driver genes.

Currently, CNV profiles of tumor samples are generated using genomic micro-arrays or high-throughput DNA sequencing. Regardless of the underlying technology, genomic copy number data is derived from the relative assessment and integration of multiple signals, with the data generation process being prone to contamination from several sources. Estimated copy number values have no absolute and linear correlation to their corresponding DNA levels, and the extent of deviation differs between sample profiles which poses a great challenge for data integration and comparison in large scale genome analysis.

In this study, we present a novel method named Minimum Error Calibration and Normalization of Copy Numbers Analysis (Mecan4CNA). For each sCNV profile, Mecan4CNA reduces the noise level, calculates values representing the normal DNA copies (baseline) and the change of one copy (level distance), and finally normalizes all values. Experiments of Mecan4CNA on simulated data showed an overall accuracy of 93% and 91% in determining the baseline and level distance, respectively. Comparison of baseline and level distance estimation with existing methods and karyotyping data on the NCI-60 tumor cell line produced coherent results. To estimate the method’s impact on downstream analyses we performed GISTIC analyses on original and Mecan4CNA data from the Cancer Genome Atlas (TCGA) where the normalized data showed prominent improvements of both sensitivity and specificity in detecting focal regions.

In general, Mecan4CNA provides an advanced method for CNA data normalization especially in research involving data of high volume and heterogeneous quality. but with its informative output and visualization can also facilitate analysis of individual CNA profiles. Mecan4CNA is freely available as a Python package and through Github.
