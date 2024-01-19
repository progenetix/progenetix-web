import React, { useRef, useState } from "react"
import {
  // MAX_HISTO_SAMPLES,
  SITE_DEFAULTS,
  replaceWithProxy,
  useProgenetixApi,
  useExtendedSWR
} from "../../hooks/api"
import cn from "classnames"
import BiosamplesDataTable from "./BiosamplesDataTable"
import VariantsDataTable from "./VariantsDataTable"
import { useContainerDimensions } from "../../hooks/containerDimensions"
import SVGloader from "../SVGloaders"
import { ExternalLink } from "../helpersShared/linkHelpers"
import { svgFetcher } from "../../hooks/fetcher"
import BiosamplesStatsDataTable from "./BiosamplesStatsDataTable"
import { WithData } from "../Loader"
import { openJsonInNewTab } from "../../utils/files"
import dynamic from "next/dynamic"
import { getVisualizationLink } from "../../modules/service-pages/dataVisualizationPage"

const HANDOVER_IDS = {
  histoplot: "histoplot",
  biosamples: "biosamples",
  biosamplestable: "biosamplestable",
  phenopackets: "phenopackets",
  UCSClink: "UCSClink",
  variants: "variants",
  pgxseg: "pgxseg",
  vcf: "vcf"
}

const TABS = {
  results: "Results",
  samples: "Biosamples",
  samplesMap: "Biosamples Map",
  variants: "Variants"
}

export function DatasetResultBox({ data: responseSet, query }) {
  const {
    id,
    resultsHandovers,
    info,
    resultsCount,
    paginatedResultsCount
  } = responseSet

  const handoverById = (givenId) =>
    resultsHandovers.find(({ info: { contentId } }) => contentId === givenId)

  const biosamplesHandover = handoverById(HANDOVER_IDS.biosamples)
  const biosamplesTableHandover = handoverById(HANDOVER_IDS.biosamplestable)
  const phenopacketsHandover = handoverById(HANDOVER_IDS.phenopackets)
  const variantsHandover = handoverById(HANDOVER_IDS.variants)
  const vcfHandover = handoverById(HANDOVER_IDS.vcf)
  const pgxsegHandover = handoverById(HANDOVER_IDS.pgxseg)
  const UCSCbedHandoverURL = handoverById(HANDOVER_IDS.UCSClink) === undefined ? false : handoverById(HANDOVER_IDS.UCSClink).url

  const biosamplesReply = useProgenetixApi(
    biosamplesHandover && replaceWithProxy(biosamplesHandover.url)
  )
  const variantsReply = useProgenetixApi(
    variantsHandover && replaceWithProxy(variantsHandover.url)
  )

  // the histogram is only rendered but correct handover is needed, obviously
  let histoplotUrl
  let visualizationLink
  if (handoverById(HANDOVER_IDS.histoplot)) {
    histoplotUrl = handoverById(HANDOVER_IDS.histoplot).url
    let visualizationAccessId = new URLSearchParams(
      new URL(histoplotUrl).search
    ).get("accessid")
    let visualizationFileId = new URLSearchParams(
      new URL(histoplotUrl).search
    ).get("fileId")
    let visualizationSkip = new URLSearchParams(
      new URL(histoplotUrl).search
    ).get("skip")
    let visualizationLimit = new URLSearchParams(
      new URL(histoplotUrl).search
    ).get("limit")
    visualizationLink = getVisualizationLink(id, visualizationAccessId, visualizationFileId, visualizationSkip, visualizationLimit, paginatedResultsCount)
  }

  var retrievedCount = resultsCount
  if (biosamplesReply?.data?.response?.resultSets[0].results) {
    retrievedCount =  biosamplesReply?.data?.response?.resultSets[0].results.length
  }

  // main / samples / variants
  const tabNames = []
  tabNames.push(TABS.results)

  biosamplesHandover && tabNames.push(TABS.samples)
  // biosamplesReply?.data?.response?.resultSets[0].results?.some(
  //   (biosample) => !!biosample.provenance?.geoLocation
  // ) && tabNames.push(TABS.samplesMap)

  if (handoverById(HANDOVER_IDS.variants)) tabNames.push(TABS.variants)

  const [selectedTab, setSelectedTab] = useState(tabNames[0])

  let tabComponent
  if (selectedTab === TABS.results) {
    tabComponent = (
      <ResultsTab
        variantType={query.alternateBases}
        histoplotUrl={histoplotUrl}
        biosamplesReply={biosamplesReply}
        variantCount={info.counts.variants}
        datasetId={id}
      />
    )
  } else if (selectedTab === TABS.samples) {
    tabComponent = (
      <BiosamplesDataTable apiReply={biosamplesReply} datasetId={id} />
    )
  } else if (selectedTab === TABS.samplesMap) {
    tabComponent = (
      <div>
        <h2 className="subtitle has-text-dark">Sample Origins</h2>
        <p>
          The map represents the origins of the matched samples, as derived from
          the original publication or resource repository. In the majority of
          cases this will correspond to the proxy information of the
          corresponding author&apos;s institution. Additional information can be
          found in the{" "}
          <ExternalLink
            href={`${SITE_DEFAULTS.MASTERDOCLINK}/geolocations.html`}
            label="Geographic Coordinates documentation"
          />
          {"."}
        </p>
        <BiosamplesMap apiReply={biosamplesReply} datasetId={id} />
      </div>
    )
  } else if (selectedTab === TABS.variants) {
    tabComponent = (
      <VariantsDataTable apiReply={variantsReply} datasetId={id} />
    )
  }

  return (
    <div className="box">
      <h2 className="subtitle has-text-dark">{id}</h2>
      <div className="columns">
        <div className="column is-one-third">
          <div>
            <b>Matched Samples: </b>
            {resultsCount}
          </div>
          <div>
            <b>Retrieved Samples: </b>
            {retrievedCount}
          </div>
          {info.counts.variants > 0 ? (
            <div>
              <div>
                <b>Variants: </b>
                {info.counts.variants}
              </div>
              <div>
                <b>Calls: </b>
                {info.counts.analyses}
              </div>
            </div>
          ) : null}
        </div>
        <div className="column is-one-third">
          {info.counts.variants > 0 ? (
            <div>
              <UCSCRegion query={query} />
            </div>
          ) : null}
          {info.counts.variants > 0 ? (
            <div>
              <ExternalLink
                label="Variants in UCSC"
                href={UCSCbedHandoverURL}
              />
            </div>
          ) : null}
          <div>
            <ExternalLink
              label="Dataset Responses (JSON)"
              onClick={() => openJsonInNewTab(responseSet)}
            />
          </div>
        </div>
        {visualizationLink && (
          <div className="column is-one-third">
            <a className="button is-info mb-5" href={visualizationLink}>
              Visualization options
            </a>
          </div>
        )}
      </div>
      {tabNames?.length > 0 ? (
        <div className="tabs is-boxed ">
          <ul>
            {tabNames.map((tabName, i) => (
              <li
                className={cn({
                  "is-active": selectedTab === tabName
                })}
                key={i}
                onClick={() => setSelectedTab(tabName)}
              >
                <a>{tabName}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {tabComponent ? <div>{tabComponent}</div> : null}
      <hr/>

      {biosamplesTableHandover?.pages && (
        <div className="tabs">
          <div>
            <b>Download Sample Data (TSV)</b>
            <br/>
            <ul>
              {biosamplesTableHandover.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {biosamplesHandover?.pages && (
        <div className="tabs">
          <div>
            <b>Download Sample Data (JSON)</b>
            <br/>
            <ul>
              {biosamplesHandover.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {variantsHandover?.pages && (
        <div className="tabs ">
          <div>
            <b>Download Variants (Beacon VRS)</b>
            <br/>
            <ul>
              {variantsHandover?.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {vcfHandover?.pages && (
        <div className="tabs ">
          <div>
            <b>Download Variants (VCF)</b>
            <br/>
            <ul>
              {vcfHandover?.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {pgxsegHandover?.pages && (
        <div className="tabs ">
          <div>
            <b>Download Variants (.pgxseg)</b>
            <br/>
            <ul>
              {pgxsegHandover?.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
      {phenopacketsHandover?.pages && (
        <div className="tabs">
          <div>
            <b>Download Phenopackets (JSON)</b>
            <br/>
            <ul>
              {phenopacketsHandover.pages.map((handover, i) => (
                <PagedLink key={i} handover={handover} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultsTab({
  histoplotUrl,
  biosamplesReply,
  variantCount,
  datasetId
}) {
  return (
    <div>
      {histoplotUrl && (
        <div className="mb-4">
          <CnvHistogramPreview url={histoplotUrl} />
          <ExternalLink href={histoplotUrl} label="Reload histogram in new window" />
        </div>
      )}
      <WithData
        apiReply={biosamplesReply}
        background
        render={(biosamplesResponse) => (
          <BiosamplesStatsDataTable
            biosamplesResponse={biosamplesResponse}
            variantCount={variantCount}
            datasetId={datasetId}
          />
        )}
      />
    </div>
  )
}

function CnvHistogramPreview({ url: urlString }) {
  const url = new URL(urlString)
  const componentRef = useRef()
  const { width } = useContainerDimensions(componentRef)
  url.search = new URLSearchParams([
    ...url.searchParams.entries(),
    // ["plotPars=plot_width", width]
  ]).toString() + "&plotPars=plot_width=" + width
  let withoutOrigin = replaceWithProxy(url)
  // width > 0 to make sure the component is mounted and avoid double fetch
  const dataEffect = useExtendedSWR(width > 0 && withoutOrigin, svgFetcher)
  return (
    <div ref={componentRef}>
      <SVGloader apiReply={dataEffect} />
    </div>
  )
}

function UCSCRegion({ query }) {
  return <ExternalLink href={ucscHref(query)} label=" UCSC region" />
}

function ucscHref(query) {

  let ucscstart = query.start
  let ucscend = query.end
  if (query.start > 0) {
    ucscstart = query.start
    ucscend = query.start
  }

  return `http://www.genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&position=chr${query.referenceName}%3A${ucscstart}%2D${ucscend}`
}

function PagedLink({ handover }) {
  return (
    <li>
      <ExternalLink
        href={handover.url}
        label={handover.handoverType.label}
        download
      />
    </li>
  )
}

const BiosamplesMap = dynamic(() => import("./BioSamplesMap"), {
  ssr: false
})
