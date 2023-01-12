import Page from "../modules/data-pages/celllines_dataPage"
import { getCytoBands } from "../utils/genome"
export default Page

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
