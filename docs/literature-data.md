---
title: Cell Line Literature Mining
---

## Background

![ZHAW Icon](/img/zhaw_logo.jpg){ align=right width=36px}As an extension of the standard "data resource" model of Progenetix, together in
a collaboration with a group from [the ZHAW](https://www.zhaw.ch/en/about-us/person/stog/)
we have implemented "knowledge exploration" entry points for cell line genomics.
Based on work from the [INODE](https://www.inode-project.eu/inode) project the
ZHAW team has parsed collections of scientific publications with relation to
CCL analyses for the semantic identification of functional annotations, e.g.
the contextual association of genes or genomic regions.

## Implementation

![Inode Icon](/img/inode-logo-blue.svg){ align=left width=120px}Based on a list of CCL-related publications (e.g. from the studies containing CNV
data in progenetix or those referenced in the cellosaurus entries) we utilize  subject-predicate-object triple extraction from text, and entity-ontology linking
via a graph database. Relationships extracted in a context that references a given
cell line arer then represented for some selected categories. Here, following the
overall Progenetix paradigm of whoole genome (CNV) profile representation for a start
we focus on _objects_ with genomic "mappability", especially genes and cytobands.

!!! note "Fuzziness of cell line <-> object associations"

    The listing of a given object (e.g. gene) on a cell line page is based on the
    identification of the gene id in the referencing publication. However, such an
    association may be circumstantial (e.g. the gene being identified as target in
    a list of analyzed cell line samples).
