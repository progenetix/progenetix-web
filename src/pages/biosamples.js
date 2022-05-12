import Page from "../modules/data-pages/progenetix_dataPage"
import { getCytoBands } from "../utils/genome"
export default Page

// This function gets called at build time on server-side.
export const getStaticProps = async () => ({
  props: {
    cytoBands: await getCytoBands()
  }
})

// This page is an alias for search.js since /biosamples has been shared berfore...