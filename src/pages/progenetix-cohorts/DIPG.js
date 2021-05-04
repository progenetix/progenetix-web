import Page from "../../modules/progenetix-searchpages/DIPG/SearchSamplesPage"
import { getCytoBands } from "../../utils/genome"
export default Page

export const getStaticProps = async () => {
  return {
    props: {
      cytoBands: await getCytoBands()
    }
  }
}
