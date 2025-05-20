import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* Viewport meta tag removed - it should be in layout.tsx instead */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
