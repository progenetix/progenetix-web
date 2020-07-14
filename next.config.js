const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
})

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"],
  webpack(config, options) {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: "js-yaml-loader"
    })
    return config
  }
})
