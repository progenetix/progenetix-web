import Page from "../../modules/progenetix-searchpages/gao-2021-signatures/SearchSamplesPage"
import { getCytoBands } from "../../utils/genome"
export default Page

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
