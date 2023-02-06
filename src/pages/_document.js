import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import {SITE_DEFAULTS} from "../hooks/api"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" type="image/png" href="/img/pgx-logo.png" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${SITE_DEFAULTS.TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${SITE_DEFAULTS.TRACKING_ID}');
        `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
