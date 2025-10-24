import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* شعار الموقع */}
        <link rel="icon" href="/mic-wave.png" />
        <title>AI Voice Lab</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
