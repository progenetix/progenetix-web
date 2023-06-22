# Progenetix File Formats

## Data File Formats - `.pgxseg` Variants & `.pgxfreq` Segmental CNV Frequencies

Progenetix uses a variation of a standard tab-separated columnar text file such
as produced by array or sequencing CNV software, with an optional metadata header
for e.g. plot or grouping instructions.

Wile the first edition only was geared towards sample-linked segment annotations,
a variation is now being provided for CNV frequencies.

### `.pgxseg` Sample Variant Files

* a standard tab-delimited Progenetix segments file
    - an additional header may exist
    - only first 5 columns are necessary
    - column 5 (mean) can be empty or dot, if column 6 exists and contains status value
    - undefined fields in existing columns are replaced with the "." character
* header (optional)
    - header lines start with the `#` character
    - Plot parameters:
        * lines start with `#plotpars=>`
        * parameters are added in `parameter_name=value;other_parameter=itsValue` format - see below
        * basically any [plot parameter from PGX](https://github.com/progenetix/PGX/blob/master/config/plotdefaults.yaml) can be used
    - Sample / grouping parameters
        * the `biosample_id` parameter is required to assign values (e.g. group labels) to samples
        * `biosample_id` has to correspond to the identifiers used in column 1 of the following segments data
        * `parameter=value` pairs are semicolon-separated
        * values may be wrapped in double quotation marks (`group_label="Ductal Breast Carcinoma"`)
        * `group_id` __should__ be used for grouping
      - this is a convention for the Progenetix plotting engine
      - `group_label` is optional for grouping / labeling of the groups
    - Metadata
        * lines start with `#meta=>`
        * additional information about the file
        * (so far) only informative

For example, this API call retireves the variants for 78 samples from two NCIt
cancer types (please be aware of the `&filterLogic=OR` pragma!):

* [progenetix.org/beacon/variants/?filters=NCIT:C6393,NCIT:C4504&filterLogic=OR&output=pgxseg](http://progenetix.org/beacon/variants/?filters=NCIT:C6393,NCIT:C4504&filterLogic=OR&output=pgxseg)

An excerpt of the segment file would look like below:

```
#meta=>biosample_count=78
#plotpars=>title="Testing Custom Plot Parameters"
#plotpars=>subtitle="Some Chromosomes, Colors etc."
#plotpars=>chr2plot="3,5,7,8,11,13,16"
#plotpars=>color_var_dup_hex=#EE4500;color_var_del_hex=#09F911
#plotpars=>size_title_left_px=300
#plotpars=>size_text_title_left_px=10
#sample=>biosample_id=pgxbs-kftvhhmm;group_id=NCIT:C6393;group_label="Invasive Ductal and Invasive Lobular Breast Carcinoma"
#sample=>biosample_id=GSM252886;group_id=NCIT:C4504;group_label="Malignant Breast Phyllodes Tumor"
biosample_id  chro  start stop  mean  variant_type  probes
pgxbs-kftvhhmm  1 911484  11993973  -0.4486 DEL .
pgxbs-kftvhhmm  1 12158755  22246766  0.2859 DUP  .
pgxbs-kftvhhmm  1 22346353  24149880  -0.5713 DEL .
pgxbs-kftvhhmm  1 24160170  33603123  0.0812  . .
pgxbs-kftvhhmm  1 33683474  37248987  -0.6478 DEL .
pgxbs-kftvhhmm  1 37391587  248655165 0.0342  . .
pgxbs-kftvhhmm  2 110819  240942225 -0.0007 . .
pgxbs-kftvhhmm  3 119131  4655519 -0.0122 . .
pgxbs-kftvhhmm  3 4662952 4857477 0.9273 DUP  .
...
```

### `.pgxfreq` Segment CNV Frequencies

!!! info "New suffix `pgxfreq`"

    With the November 2022 update we changed the file suffix to `pgxfreq` to
    keep a clean separation between the (usually binned) CNV frequency files and
    the (usually raw) representation of sample-specific CNVs (and other variants).


In the frequency file (compared to the `.pgxseg` format):

* `group_id` values replace the `biosample_id`
    - multiple groups can be concatenated in the file
* `chro`, `start` and `end` are the same as in the sample files
* `gain_frequency` and `loss_frequency` indicate the *percent* values for gains
and losses overlapping the segment, respectively
* additional CNV types are under evaluation

Examples can be derived from the Progenetix "Services" API:

* [/services/intervalFrequencies/pgx:cohort-TCGAcancers/?output=pgxfreq](http://progenetix.org/services/intervalFrequencies/pgx:cohort-TCGAcancers/?output=pgxfreq)
    - single group in REST syntax (here overall CNV frequencies in >11000 cancer samples from the TCGA sample collection)
* [/services/intervalFrequencies/?filters=icdom-81403,icdom-81443&output=pgxfreq](http://progenetix.org/services/intervalFrequencies/?filters=icdom-81403,icdom-81443&output=pgxfreq)
    - 2 sets using the `filters` parameter

```
#meta=>genome_binning=1Mb;interval_number=3106
#group=>group_id=icdom-81403;label=Adenocarcinoma, NOS;dataset_id=progenetix;sample_count=18559
group_id  chro  start end gain_frequency  loss_frequency  index
icdom-81403 1 0 1000000 8.8 9.12  0
icdom-81403 1 1000000 2000000 8.49  8.68  1
icdom-81403 1 2000000 3000000 9.81  13.19 2
icdom-81403 1 3000000 4000000 10.02 15.84 3
icdom-81403 1 4000000 5000000 7.94  15.91 4
...
icdom-81403 2 228000000 229000000 7.37  6.62  477
icdom-81403 2 229000000 230000000 7.39  6.89  478
icdom-81403 2 230000000 231000000 8.3 7.0 479
icdom-81403 2 231000000 232000000 8.24  6.86  480
icdom-81403 2 232000000 233000000 9.1 7.89  481
...
```

### Data Matrix Files

#### CNV Frequency Matrix

The CNV frequency matrix contains interval CNV frequencies for genomic bins, separate for gain and loss frquencies:

* header similar to segment frequency files
* first column with group identifier
* standard genome binning on GRCh38 results in 2 x 3106[^1] value columns
* header line indicates genomic ranges for the bins
* first all gain frequencies (in %), then all losses

```
#meta=>genome_binning=1Mb;interval_number=3106
#group=>group_id=NCIT:C7376;label=Pleural Malignant Mesothelioma;dataset_id=progenetix;sample_count=240
#group=>group_id=PMID:22824167;label=Beleut M et al. (2012)...;dataset_id=progenetix;sample_count=159
group_id  1:0-1000000:gainF 1:1000000-2000000:gainF ...  1:0-1000000:lossF  1:1000000-2000000:lossF ...
NCIT:C7376  9.58  7.92  ...  1.89 1.89  ...
PMID:22824167 6.29  0.0 ... 8.18  4.4 ...
```

##### Examples

* <http://progenetix.org/services/intervalFrequencies/?datasetIds=progenetix&output=pgxmatrix&filters=NCIT:C7376,PMID:22824167>

#### CNV Status Matrix

For endpoints with per biosample or callset / analysis delvery, the Progenetix
API offers the delivery of a binned status matrix. This matrix can e.g. directly
be used for clustering CNV patterns.

* id columns, followed by
    - all "gain status" columns (e.g. 3106[^1], see above), followed by
    - all "loss status" columns
* the status is indicated by a coverage value, i.e. the fraction of how much the
binned interval overlaps with one or more CNVs of the given type.

The header will contain sample specific information.

```
#meta=>id=progenetix
#meta=>assemblyId=GRCh38
#meta=>filters=NCIT:C4443
#meta=>genome_binning=1Mb;interval_number=3106
#meta=>no_info_columns=3;no_interval_columns=6212
#sample=>biosample_id=pgxbs-kftvktaz;analysis_ids=pgxcs-kftwu9ca;group_id=NCIT:C6650;group_label=Ampulla of Vater adenocarcinoma;NCIT::id=NCIT:C6650;NCIT::label=Ampulla of Vater adenocarcinoma
#sample=>biosample_id=pgxbs-kftvkyeq;analysis_ids=pgxcs-kftwvv3p;group_id=NCIT:C3908;group_label=Ampulla of Vater Carcinoma;NCIT::id=NCIT:C3908;NCIT::label=Ampulla of Vater Carcinoma
...
#meta=>biosampleCount=26;analysisCount=26
analysis_id biosample_id  group_id  1:0-1000000:DUP 1:1000000-2000000:DUP 1:2000000-3000000:DUP 1:3000000-4000000:DUP  ...
pgxcs-kftwu9ca  pgxbs-kftvktaz  NCIT:C6650  0 0.3434  1.0 1.0
pgxcs-kftwwbry  pgxbs-kftvkzwp  NCIT:C3908  0.5801  0 0.6415  1.0
...
```

##### Examples

* [progenetix.org/beacon/callsets/?output=pgxmatrix&filters=NCIT:C4443](http://progenetix.org/beacon/callsets/?output=pgxmatrix&filters=NCIT:C4443)
