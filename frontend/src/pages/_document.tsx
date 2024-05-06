import { Html, Head, Main, NextScript } from "next/document";
import { UserProvider } from "./context/userContext";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <UserProvider>
          <Main />
          <NextScript />
        </UserProvider>
      </body>
    </Html>
  );
}
