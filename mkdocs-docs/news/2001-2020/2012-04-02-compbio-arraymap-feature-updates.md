---
title: 'arrayMap feature update(s)'
date: 2012-04-02
template: post.html
category:
  - news
tags: 
  - recovered
  - news
  - arraymap
---

## arrayMap feature update(s)

<p>Over the last weeks, we have introduced a number of new search/ordering features to arrayMap. Some of those mimic functions previously implemented in Progenetix. Overall, the highlights are:</p>

<dl>
<dt><img style="margin: 0px 10px 2px 10px;vertical-align: middle;" src="/p/bt_icd_ns.png" />ICD entity aggregation</dt>
<dd style="margin: 0px 0px 10px 70px;">all ICD-O entities with their according samples</dd>
<dt><img style="margin: 0px 10px 2px 10px;vertical-align: middle;" src="/p/bt_loc_ns.png" />ICD locus aggregation</dt>
<dd style="margin: 0px 0px 10px 70px;">all tumor loci with their according samples</dd>
<dt><img style="margin: 0px 10px 2px 10px;vertical-align: middle;" src="/p/bt_gr_ns.png" />Clinical group aggregation</dt>
<dd style="margin: 0px 0px 10px 70px;">clinical super-entities (e.g. "breast ca.": all carcinoma types with locus breast)  with their samples</dd>
<dt><img style="margin: 0px 10px 2px 10px;vertical-align: middle;" src="/p/bt_pub_ns.png" />Publication aggregation</dt>
<dd style="margin: 0px 0px 10px 70px;">all publication with samples in arrayMap</dd>
</dl>
<p>In contrast to Progenetix, we do not offer precomputed SCNA histograms. However, users can generate them on the fly, but should consider the specific challenges in doing so (e.g. noise background in frequency calculations).</p>


