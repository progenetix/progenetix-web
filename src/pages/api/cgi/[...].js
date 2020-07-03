import { createProxyMiddleware } from "http-proxy-middleware"
export default createProxyMiddleware({
  target: "https://beacon.progenetix.org/cgi/",
  pathRewrite: { "^/api/cgi": "/" },
  changeOrigin: true
})
