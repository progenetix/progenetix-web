import Page from "../../modules/beacon-plus/BeaconPlusPage"
import { getStaticDatatasets } from "../../hooks/api"
export default Page

// This function gets called at build time on server-side.
export const getStaticProps = async () => ({
  props: {
    datasets: await getStaticDatatasets()
  }
})
