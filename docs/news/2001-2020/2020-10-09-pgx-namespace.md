---
title: "pgx namespace and persistant identifiers"
template: post.html
date: 2020-10-09
authors:
  - '@mbaudis'
category:
  - news
tags:
  - Progenetix
  - identifiers
  - services
---

While the `pgx` prefix had been registered in 2017 with [identifiers.org](https://registry.identifiers.org/registry/pgx)
we recently changed the resolver and target mappings on the Progenetix server.
This went hand-in-hand with the generation of unique & persistant identifiers
for the main data items.

<!--more-->

* biosample: [pgxbs-kftva5zv](http://progenetix.org/services/ids/pgxbs-kftva5zv) => for identifiers.org `pgx:pgxbs-kftva5zv`
* callset: [pgxcs-kftvlijb](http://progenetix.org/services/ids/pgxcs-kftvlijb) => for identifiers.org `pgx:pgxcs-kftvlijb`
* individual: [pgxind-kftx266l](http://progenetix.org/services/ids/pgxind-kftx266l) => for identifiers.org `pgx:pgxind-kftx266l`

The mappings are enabled through the new id resolver endpoint "http://progenetix.org/services/ids/{$id}"

#### Additional Links

* [identifiers.org](https://registry.identifiers.org/registry/pgx)
