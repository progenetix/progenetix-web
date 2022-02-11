---
template: blog_post.html
title: Genomic Interval Changes
description: New positions for the 1Mb interval maps
date: 2022-02-11
---

So far, CNV histograms and .pgxseg segment and matrix files used a 1Mb genome binning,
based on the consecutive assignment of 1Mb intervals from 1pter -> Yqter. This resulted
in **3102** intervals, with the last interval of each chromosome being smaller.

On 2022-02-11 we have changed the procedure. Now, the last interval of the short
arm of any chromosome is terminated at the centromere, leading to

* a (potentially) shortened "last p" interval
* a shift of most interval positions
* a changed interval number from 3102 to **3106**

Also, since a few qter intervals were very small we now use a padding factor (currently
100000 bases) to determine if the last band would be smaller - in which case it is
discarded and the previous interval extended to cover up to the telomere. This applies
to chromosomes 6 and X, where the last intervals become now slightly larger than 1Mb:

* X:155000000-156040895, size 1040895
* 6:169800000-170805979, size 1005979

Since many CNVs have natural breakpoints at chromosomal centromeres the new
interval mapping should provide a better representation of genomic events. Also,
such a mapping facilitates the calculation of e.g. arm specific CNV fractions which
are sometimes used as statistical indicators. Enjoy!