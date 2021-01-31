import Page from "../../modules/beacon-instances/1000-genomes-cnv/BeaconPage"
import { getStaticDatatasets } from "../../hooks/api"
import { getCytoBands } from "../../utils/genome"
export default Page

// This function gets called at build time on server-side.
export const getStaticProps = async () => ({
  props: {
    datasets: await getStaticDatatasets(),
    cytoBands: await getCytoBands()
  }
})
