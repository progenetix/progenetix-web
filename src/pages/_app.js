import React from "react"
import "../styles/main.scss"
import { SWRConfig } from "swr"
import fetcher from "../api/fetcher"
import { MDXProvider } from "@mdx-js/react"
import MdPage from "../components/MdPage"

const MDXWrapper = (props) => <MdPage {...props} />

export default function App({ Component, pageProps }) {
  return (
    // In this app we usually don't want auto refresh data. It's a read-only/query tyoe app and stale data is acceptable.
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <MDXProvider components={{ wrapper: MDXWrapper }}>
        <Component {...pageProps} />
      </MDXProvider>
    </SWRConfig>
  )
}
