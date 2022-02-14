---
title: 'Progenetix &amp; arrayMap Changes (2012-06-01 - 2013-05-22)'
date: 2013-05-22
template: blog_post.html
category:
  - news
  - about
tags:
  - recovered
  - changelog
  - progenetix
  - arraymap
  - news
---



#### 2013-05-22

* bug fix: fixing lack of clustering for CNA frequency profiles in the analysis section
* removed "Series Search" from the arrayMap side bar; kind of confusing - just search for the samples & select the series

#### 2013-05-12

* introduced a method to combine sample annotations and segmentation files for user data processing (see "FAQ & GUIDE")
* fixed some array plot presentation and replotting problems

#### 2013-05-05

* consolidation of script names - again, don't use deep links (besides for "api.cgi?...")
* moving of remaining sample selection options (random sample number, segments number, age range) to the sample selection page, leaving the pre-analysis page (now "prepare.cgi") for plotting/grouping options
* fixed the KM-style survival plots

#### 2013-04-10

* re-factoring of the cytobands plotting for histograms and heatmaps; this also fixes missing histogram tiles
* analysis output page: the circular histogram/connections plot and group specific histograms are now all available as both SVG and PNG image files

#### 2013-04-06

Some changes to the plotting options:

* the circular plot is now added as a default; and connections are drawn in for <= 30 samples (subject to change)
* one can now mark up multiple genes (or other loci of interest), for all plot types

#### 2013-03-25

* added option to create custom analysis groups based on text match values
* rewritten circular plot code

#### 2013-02-27

* copied data for PMIDs 17327916, 17311676, 18506749 and 18246049 from arrayMap to
Progenetix

#### 2013-02-24

* bug fix: gene selector was broken for about a week; fixed

#### 2013-02-17

* In many places, images are now converted sever side to PNG data streams and embedded into the web pages. This will substantially decrease web data traffic and page download times. Fully linked SVG images (including region links etc.) are still available through the analysis pipeline.

#### 2013-02-13

* data fix: PMID 18160781 had missing loss values (due to irregular character encoding); fixed, thanks to Emanuela Felley-Bosco for the note!

#### 2012-12-14

* moved the region filter from the analysis to the sample selection page
* added a "mark region" option to the analysis page: one now can highlight a genome region in histograms and matrix plots

#### 2012-11-29

* added "select all" option to entity lists
* implemented first version of sample-to-entity match score
* added single sample annotation input field to "User File Processing"; i.e. one can now type in CNA data for a single case, and have this visualised and similar cases listed
* added per sample CNA visualisation to the samples details listings (currently if up to 100 samples)
* added direct access to sample details listing to the subsets pages

#### 2012-11-09

* adding of abstract search to the publication search page

#### 2012-10-25

* introduction of a matching function for similar cases by CNA profile, accessible through the sample details pages of both Progenetix and arraymap

#### 2012-10-22

* Introduction of SEER groups

#### 2012-09-26

The database now contains the copy number status for different interval sizes (e.g. 1MB). With this, users can now create their own data plots (histograms etc.) using more than 10000 cancer copy number profiles with a high resolution. The options here are still being tested and improved - comments welcome!

#### 2012-09-18

* added a new export file format "ANNOTATED SEGMENTS FILE", which uses the first columns for standard segment annotation, followed by some diagnostic and clinical data; i.e., the information for a case is repeated for each segment:

```
GSM255090	22	25063244	25193559	1	NA	C50	8500/3	breast	Infiltrating duct carcinoma, NOS	Carcinomas: breast ca.	NA	1	51	0.58  
GSM255090	22	25368299	48899534	-1	NA	C50	8500/3	breast	Infiltrating duct carcinoma, NOS	Carcinomas: breast ca.	NA	1	51	0.58  
GSM255091	1	2224111	30146401	-1	NA	C50	8500/3	breast	Infiltrating duct carcinoma, NOS	Carcinomas: breast ca.	NA	0	72	0.54  
GSM255091	1	35418712	37555461	1	NA	C50	8500/3	breast	Infiltrating duct carcinoma, NOS	Carcinomas: breast ca.	NA	0	72	0.54  
```

#### 2012-09-13

* added gene selection for region specific replotting of array data

#### 2012-08-22

* the gene database has been changed to the last version of the complete (HUGO names only) Ensembl gene list for HG18; previously, only a subset of "cancer related genes" was offered in the gene selection search fields

#### 2012-07-04

* some interface and form elements have been streamlined (e.g. less commonly used selector fields, sample selection options)
* some common options are now displayed only if activated (e.g. "mouse over" to see all files available for download)
* icon quality has been enhanced for all but the details pages

#### 2012-06-13

* New: All pre-generated histogram and ideogram plots are now produced based on a 1Mb matrix, with a 500Kb minimum size filter to remove CNV/platform dependent background from some high resolution array platforms. The unfiltered data can still be visualized through the standard analysis procedures.
* Bug fix: Interactive segment size filtering so far only worked for region specific queries, but not as a general filter (see above). This has been fixed; a minimum segment size in the visualization options now will remove all smaller segments.

#### 2012-06-01

* NEW: change log; that is what is shown here
* FEATURE: The interval selector now has options to include the p-arms of acrocentric chromosomes (though the data itself there may be incompletely annotated!). Feature requested by Melody Lam.
