---
template: blog_post.html
title: Variant Types Update
description: Correct Hierarchical Queries for 
date: 2022-08-12
---

The `variantType` query parameter - recommended only for non-precise variants, i.e. such w/o a
specified allele - is now being expanded correctly. In Progenetix these are only CNVs, all
expressed as (sub)classes of _EFO:0030066_ (relative copy number variation).

```yaml
  CNV:
    variant_state: EFO:0030066
    child_terms:
    child_terms:
      - EFO:0030066
      - EFO:0030067
      - EFO:0030068
      - EFO:0030069
      - EFO:0030070
      - EFO:0030071
      - EFO:0030072
      - EFO:0030073
  DUP:
    variant_state: EFO:0030070
    child_terms:
      - EFO:0030070
      - EFO:0030071
      - EFO:0030072
      - EFO:0030073   
```
...etc. Therefore, a search w/ a `variantType` parameter of `EFO:0030066` or `DUP` will
now correctly return samples w/ any type of CNV at the indicated location. 