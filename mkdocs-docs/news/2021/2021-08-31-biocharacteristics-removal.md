---
template: post.html
title: "API: Biosample Schema Update"
description: Conversion of `biocharacteristics` array to separate parameters
author: 'Michael Baudis'
date: 2021-08-31
---

The [`Biosample` schema](http://progenetix.org/services/schemas/Biosample/) used for exporting Progenetix data has been adjusted with respect to representation of "bio-"classifications. The previous `biocharacteristics` list parameter has been deprecated and its previous content is now expressed in[^1]:

* `histologicalDiagnosis` (PXF)
* `sampledTissue` (PXF)
* `icdoMorphology` (pgx)
* `icdoTopography` (pgx)

<!--more-->

At this stage we keep the current `externalReferences` "grab bag" list.

[^1]: Here, "PXF" means that the attribute is part of the Phenopackets standard, while "pgx" labels it as specific to Progenetix.
