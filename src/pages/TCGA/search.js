import Page from "../../modules/progenetix-searchpages/TCGA/SearchSamplesPage"
import { getCytoBands } from "../../utils/genome"
export default Page

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
