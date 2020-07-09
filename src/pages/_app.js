import "../styles/main.scss"
import { SWRConfig } from "swr"
import fetcher from "../api/fetcher"

export default function App({ Component, pageProps }) {
  return (
    // In this app we usually don't want auto refresh data. It's a read-only/query tyoe app and stale data is acceptable.
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}
