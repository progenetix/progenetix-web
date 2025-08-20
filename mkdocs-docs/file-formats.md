# Progenetix File Formats

## Data File Formats - `.pgxseg` Variants & `.pgxfreq` Segmental CNV Frequencies

Progenetix uses a variation of a standard tab-separated columnar text file such
as produced by array or sequencing CNV software, with an optional metadata header
for e.g. plot or grouping instructions.

Wile the first edition only was geared towards sample-linked segment annotations,
a variation is now being provided for CNV frequencies.

### `pgxseg` Sample Variant Files

* a standard tab-delimited Progenetix segments file
    - an additional header may exist
    - only first 5 columns are necessary _but_ complete lines might be expected from downstream parsers
    - columns **have to use these column headers**:
    - column 5 (log2) can be empty or dot, if column 6 exists and contains status value
    - undefined fields in existing columns are replaced with the "." character
```
biosample_id	reference_name	start	end	log2	variant_type	reference_sequence	sequence	variant_state_id	variant_state_label
pgxbs-kftvjv8w	2	79005161	90144630	-0.2239	DEL	.	.	EFO:0030068	low-level loss
pgxbs-kftvjv8w	11	11228096	14560216	0.7632	DUP	.	.	EFO:0030072	high-level gain
```
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

#### Examples:

* [/services/pgxsegvariants/pgxbs-kftvjv8w](http://progenetix.org/services/pgxsegvariants/pgxbs-kftvjv8w)
* [/services/pgxsegvariants/?filters=NCIT:C6393](http://progenetix.org/services/pgxsegvariants/?filters=NCIT:C6393)

#### Processing Note

* `pgxseg` lines can be deparsed using this regular expression (Python flavor):
```python
re.compile(
    r"""
    (?P<biosample_id>[^:]+)((?:::)|\t)
    (?P<reference_name>[\w:]+)(?:\2)
    (?P<start>\d+)(?:\2)
    (?P<end>\d+)(?:\2)
    (?P<value>[^\s]*)(?:\2)
    (?P<variant_type>[\w]*)(?:\2)
    (?P<reference_sequence>[\.ACGTN]*)(?:\2)
    (?P<sequence>[\.ACGTN]*)(?:\2)
    (?:
        (?P<variant_state_id>[\w:]*)(?:\2)
        (?P<variant_state_label>[\w\- ]*)
        ((?:\2)(?P<__other__>.*))?
    )?        
    """, re.X)
```
* the `value` parameter is used by local convention; e.g. as `log2` value or
  absolute count (e.g. copy number)
* columns after `sequence` are optional and up for future definition; e.g.
  `variant_state_id` and `variant_state_label` are used to indicate the variant
  state, such as "loss" or "high-level gain" (see EFO and SO)
    - in case these are indicated they *should take precedence over the `variant_type`
      annotation*

An excerpt of the file would look like below:

```
#sample=>id=pgxbs-kftvhubq;biosample_id=pgxbs-kftvhubq;individual_id=pgxind-kftx3rie;biosample_name=cb5043e3-c1c1-4b06-9135-1aada484ba4b;notes=Primary Tumor;histological_diagnosis_id=NCIT:C6393;histological_diagnosis_label=Invasive Breast Ductal Carcinoma and Invasive Lobular Carcinoma;pathological_stage_id=NCIT:C27968;pathological_stage_label=Stage IIB;biosample_status_id=EFO:0009656;biosample_status_label=neoplastic sample;sample_origin_type_id=OBI:0001479;sample_origin_type_label=specimen from organism;sampled_tissue_id=UBERON:0000310;sampled_tissue_label=breast;tnm=NCIT:C48724::T2 Stage Finding&&NCIT:C48706::N1 Stage Finding&&NCIT:C48699::M0 Stage Finding;age_iso=P61Y2M13D;icdo_morphology_id=pgx:icdom-85223;icdo_morphology_label=Infiltrating duct and lobular carcinoma;icdo_topography_id=pgx:icdot-C50.9;icdo_topography_label=Breast, NOS;pubmed_id=23000897;pubmed_label=Cancer Genome Atlas Network. (2012): Comprehensive molecular portraits of human breast...;tcgaproject_id=pgx:TCGA-BRCA;tcgaproject_label=Breast invasive carcinoma;cohorts=pgx:cohort-TCGA::TCGA samples&&pgx:cohort-2021progenetix::Version at Progenetix Update 2021&&pgx:cohort-TCGAcancers::TCGA Cancer samples;geoprov_city=Chapel Hill;geoprov_country=United States of America;geoprov_iso_alpha3=USA;geoprov_long_lat=-79.06::35.91
# ... more sample lines
biosample_id	reference_name	start	end	log2	variant_type	reference_sequence	sequence	variant_state_id	variant_state_label
pgxbs-kftvi7s5	1	3301765	34493787	0.1927	DUP	.	.	EFO:0030071	low-level gain
pgxbs-kftvhmav	1	7994229	7996294	-1.4841	DEL	.	.	EFO:0020073	high-level loss
pgxbs-kftvhqsu	1	19765862	19766132	-1.7355	DEL	.	.	EFO:0020073	high-level loss
pgxbs-kftvhygw	1	43911001	44679178	0.3129	DUP	.	.	EFO:0030071	low-level gain
pgxbs-kftvhygw	1	46710934	47016934	0.2956	DUP	.	.	EFO:0030071	low-level gain
pgxbs-kftvht9x	1	60402269	60402865	-1.2955	DEL	.	.	EFO:0020073	high-level loss
pgxbs-kftvhmav	1	74571388	74571389		SNV	T	A	SO:0001483	SNP
pgxbs-kftvi6ts	1	84174010	84226850	0.3655	DUP	.	.	EFO:0030071	low-level gain
pgxbs-kftvhv13	1	85190631	85190632		SNV	T	C	SO:0001483	SNP
pgxbs-kftvhqsu	1	102396750	103156433	-0.3723	DEL	.	.	EFO:0030068	low-level loss
pgxbs-kftvi4rx	1	165094663	165210937	0.977	DUP	.	.	EFO:0030072	high-level gain
pgxbs-kftvht9x	1	171282243	171282244		SNV	C	A	SO:0001483	SNP
...
```

### `pgxfreq` Segment CNV Frequencies

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
#group=>group_id=pubmed:22824167;label=Beleut M et al. (2012)...;dataset_id=progenetix;sample_count=159
group_id  1:0-1000000:gainF 1:1000000-2000000:gainF ...  1:0-1000000:lossF  1:1000000-2000000:lossF ...
NCIT:C7376  9.58  7.92  ...  1.89 1.89  ...
pubmed:22824167 6.29  0.0 ... 8.18  4.4 ...
```

##### Examples

* <http://progenetix.org/services/intervalFrequencies/?datasetIds=progenetix&output=pgxmatrix&filters=NCIT:C7376,pubmed:22824167>

#### CNV Status Matrix

For endpoints with per biosample or analysis / analysis delvery, the Progenetix
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

* [progenetix.org/beacon/analyses/?output=pgxmatrix&filters=NCIT:C4443](http://progenetix.org/beacon/analyses/?output=pgxmatrix&filters=NCIT:C4443)
