import biosamplesResponse from "../components/biosamples/biosamples-response-example.json"
import { Layout } from "../components/layouts/Layout"
import BiosamplesSubsetsDataTable from "../components/biosamples/BiosamplesSubsetsDataTable"

export default function SubsetsInSamples() {
  return (
    <Layout>
      <BiosamplesSubsetsDataTable biosamplesResponse={biosamplesResponse} />
    </Layout>
  )
}
