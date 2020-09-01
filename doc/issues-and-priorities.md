## Issue & Priorities Tracker

Under each date stamp, current issues & needed fixes are listed top -> down in
order of urgency & perceived feasibility of fast implementation).

### 2020-09-01

#### Fixes

*  ~~Subsets: Selecting a subset shows the number of child_terms in the selector
collection, not the number of selected samples~~
*  ~~In the DataVisualizationPage, the gene label selector should allow multiple
labels~~
* Cytobands: To be implemented ...
* ~~Search Result: "Show JSON Response" should just open a new page/pop-up/panel w/
the (nice) JSON response, not initiate a download ([part of issue 33](https://github.com/ptoussai/progenetix-next/issues/33))~~
* ~~"Dataset Responses" is shown on the Progenetix samples Search page although `includeDatasetResponses` is set to `hidden`. This parameter is anyway confusing
and could be excluded from visibility altogether (but not completely "purged").~~
* ~~The Histogram should (in Beacon+) _only_ being shown if the `variantType`
parameter was DUP/DEL; For the Progenetix interface it could be default (i.e.
since the subsets don't have variant queries ...).~~
* The frequency table probably only makes sense if there had been a gene/position
... search, not if there was just a subset(s) selection. Or maybe in a modified
version, w/o the frequncy calculation (but indicating codes, numbers).

#### Enhancements

* ~~Search Result: Biosamples, variants ... results should have a download button
for the JSON data ([part of issue 33](https://github.com/ptoussai/progenetix-next/issues/33))~~
* Search Result and Visualization: SVGs should have download links
* ~~Navigation: After doing a query for samples from subsets one cannot navigate back
to the subsets page~~
* Publications: Indicate if publication has samples in progenetix/arraymap (known
  from `counts.progenetix` now; see [issue 37](https://github.com/ptoussai/progenetix-next/issues/37)
* Subsets: Sample counts behind code should be/have a clickable link for initiating
a search on tis code (& its children)
* Using a set of pre-fetched filter codes to select a random example from them
for homepage histogram generation ([issue #34](https://github.com/ptoussai/progenetix-next/issues/34))
* The frequency table should show labels, too (Shortened? Hover?).
* Beacon/Search: "examples" should only be displayed with a new search, and hidden/collapsed
on existing (generated) pages.
