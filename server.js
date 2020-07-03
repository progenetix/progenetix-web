/* eslint-disable */
const express = require("express")
const next = require("next")

const devProxy = {
  "/cgi": {
    target: "https://beacon.progenetix.org/cgi/",
    pathRewrite: { "^/cgi": "/" },
    changeOrigin: true
  },
  "/progenetix": {
    target: "https://progenetix.org/",
    pathRewrite: { "^/progenetix": "/" },
    changeOrigin: true
  }
}

const port = parseInt(process.env.PORT, 10) || 3000
const env = "development" // read it from the process.env if a production service is needed
const dev = env !== "production"
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev
})

const handle = app.getRequestHandler()

let server
app
  .prepare()
  .then(() => {
    server = express()
    const { createProxyMiddleware } = require("http-proxy-middleware")
    Object.keys(devProxy).forEach(function (context) {
      server.use(context, createProxyMiddleware(devProxy[context]))
    })

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => handle(req, res))

    server.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`> Ready on port ${port} [${env}]`)
    })
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the server")
    console.log(err)
  })
