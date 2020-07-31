import React from "react"
import { Layout } from "./Layout"

// This is the default next-mdx-enhanced layout
// See https://github.com/hashicorp/next-mdx-enhanced for me details.
export default function MdPageLayoutFn(frontMatter) {
  return function MdPageLayout({ children: content }) {
    return (
      <Layout title={frontMatter.title} renderTitle={false}>
        <div className="content">{content}</div>
      </Layout>
    )
  }
}
