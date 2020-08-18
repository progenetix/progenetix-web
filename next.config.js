const withMdxEnhanced = require("next-mdx-enhanced")

module.exports = withMdxEnhanced({
  layoutPath: "src/components/layouts",
  defaultLayout: true,
  fileExtensions: ["mdx", "md"],
  remarkPlugins: [],
  rehypePlugins: [],
  extendFrontMatter: {
    // eslint-disable-next-line no-unused-vars
    process: (mdxContent, frontMatter) => {},
    phase: "prebuild|loader|both"
  }
})({
  // eslint-disable-next-line no-unused-vars
  webpack(config, options) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: "js-yaml-loader"
    })
    return config
  },
  exportTrailingSlash: true
})
