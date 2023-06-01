---
template: post.html
title: Implementing <code>alphanumeric</code> filters
description: Age queries as first use case for comparator queries
date: 2023-06-01
links:
  - '[`bycon` change notes](http://bycon.progenetix.org/changes-todo/)'
  - '[Beacon filters](http://docs.genomebeacons.org/filters/#filter-types)'
---

![age query image](/img/age-query.png){ width="280" style="float: right; margin: 0px 0px 10px 20px;" }While the Beacon v2 API has _in principle_ support for an `alphanumeric` [filter
type](http://docs.genomebeacons.org/filters/#filter-types) so far in [`bycon`](http://bycon.progenetix.org/)
there had been no dedicated support. With yesterday's `v1.0.49` update the library
now supports such queries, implemented & tested specifically for age (...at diagnosis)
valuse. 

<!--more-->

