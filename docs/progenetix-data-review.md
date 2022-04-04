# Progenetix Data Review

This is a tracker for datasets which should be reviewed / flagged / re-processed or
added to Progenetix in the first place. Please check & comment when done.


* [ ] **2022-04-04 [pgx:icdom-84421](https://progenetix.org/subsets/subsetdetails/?datasetIds=progenetix&id=pgx:icdom-84421)**

The samples are highly skewed towards deletion...

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=pgx:icdom-84421)

--------------------------------------------------------------------------------

* [X] **2022-02-07 [PMID:16737909](https://progenetix.org/publications/details/?id=PMID:16737909)**
* [X] **2022-02-07 [PMID:16790082](https://progenetix.org/publications/details/?id=PMID:16790082)**

Excluded due to lacking CNV annotations (source file w/ complex karyotypes but
not parsed correctly in FMP).

* [X] **2022-02-02 [PMID:17934521](https://progenetix.org/publications/details/?id=PMID:17934521)**

* SOLVED 2022-02-02: the 12 samples w/ platform geo:GPL5055 have _only_ chr1 probes; **removed**. The other 96 arrays (like the exaample below) are GPL5056 and have also genome covering probes

* odd provenance; the samples have been tagged - and seem to correspond - to [GSE7428](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE7426) with the data per sample on the
server corresponding to the **chr 1 only** arrays from GEO
* however, the stored variants & summary profile indicate nice whole-genome CNV profiles
* have to look-up provenance; maybe mix of annotations (from where?) and arrays?

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=PMID:17934521)

* This example really looks like a combination of whole-chromosome CNVs & array for chr1:

![](https://progenetix.org/cgi/PGX/cgi/singlePlot.cgi?analysisIds=pgxcs-kftw94yk&datasetIds=progenetix)


--------------------------------------------------------------------------------

* [ ] **2022-01-19 [PMID:24454681](https://progenetix.org/publications/details/?id=PMID:24454681)**

* noisy

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=PMID:24454681)


--------------------------------------------------------------------------------

* [ ] **2022-01-18 [geo:GSE58579](https://progenetix.org/subsets/subsetdetails/?datasetIds=progenetix&id=geo:GSE58579)**

* very biased towards deletion

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=geo:GSE58579)

--------------------------------------------------------------------------------

* [ ] **2022-01-18 [PMID:23583283](https://progenetix.org/publications/details/?id=PMID:23583283)**

* noisy and biased to deletion

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=PMID:23583283)

--------------------------------------------------------------------------------

* [X] **2021-12-17 [PMID:19330026](https://progenetix.org/publications/details/?id=PMID:19330026)**

* SOLVED 2022-02-03: removed
* only partial genome coverage => should be flagged/removed?

--------------------------------------------------------------------------------

* [ ] **2021-10-29 [PMID:22962301](https://progenetix.org/publications/details/?id=PMID:22962301)**

* baseline shifted towards deletions

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=PMID:22962301)

--------------------------------------------------------------------------------

* [ ] **2021-09-07 [PMID:23417712](https://progenetix.org/publications/details/?id=PMID:23417712)**

* highly noisy/spiky
* AFAIK was from methylation arrays & kept for DIPG project?
* review / discard / select samples?

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=PMID:23417712)

--------------------------------------------------------------------------------

* [X] **2021-09-07 [NCIT:C7431](https://progenetix.org/subsets/biosubsets/?filters=NCIT:C7431&datasetIds=progenetix) [FIXED](https://docs.progenetix.org/en/latest/changelog.html#bug-fix-frequency-maps)**

* very strange frequency plot, with just some spikes; looks like either only 2 or such samples with only background are processed (while 3234 are listed), or some value error?
* all (?) child terms are fine
* `byconeer/frequencymapsCreator.py -d progenetix -p "NCIT:C7431"` doesn't help...

![](https://progenetix.org/cgi/PGX/cgi/collationPlots.cgi?datasetIds=progenetix&id=NCIT:C7431)

