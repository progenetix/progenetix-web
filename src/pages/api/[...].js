import { createProxyMiddleware } from "http-proxy-middleware"
export default createProxyMiddleware({
  target: "https://beacon.progenetix.org/",
  pathRewrite: { "^/api": "/" },
  changeOrigin: true
})
