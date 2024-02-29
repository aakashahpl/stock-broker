import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./navbar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Navbar />
            <Component {...pageProps} />;
        </div>
    );
}
