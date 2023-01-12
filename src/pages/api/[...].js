import { createProxyMiddleware } from "http-proxy-middleware"

export default createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_SITE_URL,
  pathRewrite: { "^/api/": "/" },
  changeOrigin: true,
  followRedirects: true
})

export const config = {
  api: {
    bodyParser: false
  }
}
