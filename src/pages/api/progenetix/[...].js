import { createProxyMiddleware } from "http-proxy-middleware"
export default createProxyMiddleware({
  target: "https://progenetix.org/",
  pathRewrite: { "^/api/progenetix": "/" },
  changeOrigin: true
})
