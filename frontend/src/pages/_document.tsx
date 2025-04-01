import { Html, Head, Main, NextScript } from "next/document";
import { UserProvider } from "../context/userContext";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Zenith</title>
        <link rel="icon" href="/zenith-logo2.svg" />
      </Head>
      <body>
        <UserProvider>
          <Main />
          <NextScript />
        </UserProvider>
      </body>
    </Html>
  );
}
