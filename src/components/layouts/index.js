import React from "react"
import { Layout } from "./Layout"
import { Loader } from "../Loader"
import { LoadingContext, useContextLoadingMap } from "../../hooks/globalLoading"

// This is the default next-mdx-enhanced layout
// See https://github.com/hashicorp/next-mdx-enhanced for me details.

export default function MdPageLayoutFn(frontMatter) {
  const { title, headline, loadable } = frontMatter

  return function MdPageLayout({ children: content }) {
    const { handleSetIsLoading, somethingIsLoading } = useContextLoadingMap(
      loadable
    )

    return (
      <Layout title={title} headline={headline}>
        <LoadingContext.Provider
          value={{
            setIsLoading: handleSetIsLoading
          }}
        >
          <Loader isLoading={somethingIsLoading}>
            <div />
          </Loader>
          <div
            style={{ visibility: somethingIsLoading ? "hidden" : "unset" }}
            className="content"
          >
            {content}
          </div>
        </LoadingContext.Provider>
      </Layout>
    )
  }
}
