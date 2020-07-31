import React from "react"
import { Layout } from "./Layout"

export default function MdPage({ children, metadata }) {
  return (
    <Layout title={metadata?.title} renderTitle={false}>
      <div className="content">{children}</div>
    </Layout>
  )
}
