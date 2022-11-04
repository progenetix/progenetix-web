---
template: post.html
title: "Diffuse Intrinsic Pontine Glioma (DIPG) cohort"
author: '@qingyao'
date: 2021-02-15
---


Diffuse Intrinsic Pontine Glioma (DIPG) is a highly aggressive tumor type that originate from glial cells in the pon area of brainstem, which controls vital functions including breathing, blood pressure and heart rate. DIPG occurs frequently in the early childhood and has a 5-year survival rate below 1 percent. Progenetix has now incorporated the DIPG cohort, consisting of 1067 individuals from 18 publications. The measured data include copy number variation as well as (in part) point mutations on relevant genes, e.g. TP53, NF1, ATRX, TERT promoter.

<!--more-->

From these 18 publications studying DIPG with 1067 individuals, [Part 1] we have processed 273 individuals (364 biosamples, including 82 normals and 9 additional biosamples) through standard pipelines from raw files, where samples were deposited into public domains, e.g. GEO. [Part 2] For the rest 794 samples, we have collected CNV data and/or point mutation data directly from studies with annotation in "biosamples.info.provenance" as "dipg db import". All of these samples from the DIPG cohort are now part of progenetix with "biosamples.cohorts.id" as "pgxcohort-DIPG".


Notes and procedure of the data import and transformation:
 - In principle, DIPG IDs are treated as individual level, so multiple biosamples can belong to same DIPG ID (e.g. normal v.s. tumor).
 - When merging multiple individuals (resp. biosamples) into the one individual (resp. biosamples), a new entry is created and the old ones are deleted, but their ids as well as their "info.legacy_id"s are kept in the new entry's "info.legacy_id".
 - for part 1, we have mapped the GEO metadata to the DIPG ids, including separation of normals and tumors. The dipg ids in the form of "DIPG_BS_xxxx"(numbering from 0001 to 1067) as well as its respective GSM IDs are dropped into "info.legacy_id" when generating a timestamp id. 
 - for part 2, where dipg ids were not already present in progenetix, we have imported the data from "dipg db", with fields in the "variants" collection adapted to the current data schema. 
 - the DIPG cohort contributed 1067 individuals, 1108 biosamples, 900 callsets and 3009676 variants.

