import Page from "../../modules/data-pages/carriocordo2021heterogeneity_dataPage"
import { getCytoBands } from "../../utils/genome"
export default Page

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
