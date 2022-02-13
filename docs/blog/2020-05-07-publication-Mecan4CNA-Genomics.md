---
title: "Error Calibration ... for CNA Analysis"
date: 2020-05-06
template: blog_post.html
authors:
 - '@mbaudis'
 - '@bo'
excerpt_link: https://info.baudisgroup.org/publications/2020-05-07-publication-Mecan4CNA-Genomics/
pdf_file_name: 2020-05-06___Bo-Gao-and-Michael-Baudis__Minimum-error-calibration-and-normalization-for-genomic-copy-number-analysis__Genomics.pdf
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
---

### Minimum Error Calibration and Normalization for Genomic Copy Number Analysis.
#### Bo Gao and Michael Baudis (2020)
##### bioRxiv, 2019-07-31. [DOI 10.1101/720854](https://doi.org/10.1101/720854)
##### Genomics, Volume 112, Issue 5, September 2020, Pages 3331-3341, accepted 2020-05-06 [doi.org/10.1016/j.ygeno.2020.05.008](https://doi.org/10.1016/j.ygeno.2020.05.008).
<!--more-->

#### Abstract

##### Background
Copy number variations (CNV) are regional deviations from the normal autosomal bi-allelic DNA content. While germline CNVs are a major contributor to genomic syndromes and inherited diseases, the majority of cancers accumulate extensive "somatic" CNV (sCNV or CNA) during the process of oncogenetic transformation and progression. While specific sCNV have closely been associated with tumorigenesis, intriguingly many neoplasias exhibit recurrent sCNV patterns beyond the involvement of a few cancer driver genes. Currently, CNV profiles of tumor samples are generated using genomic micro-arrays or high-throughput DNA sequencing. Regardless of the underlying technology, genomic copy number data is derived from the relative assessment and integration of multiple signals, with the data generation process being prone to contamination from several sources. Estimated copy number values have no absolute or strictly linear correlation to their corresponding DNA levels, and the extent of deviation differs between sample profiles, which poses a great challenge for data integration and comparison in large scale genome analysis.

##### Results
In this study, we present a novel method named ”Minimum Error Calibration and Normalization for Copy Numbers Analysis” (Mecan4CNA). It only requires CNV segmentation files as input, is platform independent, and has a high performance with limited hardware requirements. For a given multi-sample copy number dataset, Mecan4CNA can batch-normalize all samples to the corresponding true copy num- ber levels of the main tumor clones. Experiments of Mecan4CNA on simulated data showed an overall accuracy of 93% and 91% in determining the normal level and single copy alteration (i.e. duplication or loss of one allele), respectively. Comparison of estimated normal levels and single copy alternations with existing methods and karyotyping data on the NCI-60 tumor cell line produced coherent results. To estimate the method’s impact on downstream analyses, we performed GISTIC analyses on the original and Mecan4CNA normalized data from the Cancer Genome Atlas (TCGA) where the normalized data showed prominent improvements of both sensitivity and specificity in detecting focal regions.

##### Conclusions
Mecan4CNA provides an advanced method for CNA data normalization, especially in meta-analyses involving large profile numbers and heterogeneous source data quality. With its informative output and visualization options, Mecan4CNA also can improve the interpretation of individual CNA profiles. Mecan4CNA is freely available as a Python package and through its code repository on Github.
