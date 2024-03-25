import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "./context/userContext";
import Navbar from "../components/navbar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Navbar/>   
            <Component {...pageProps} />
        </UserProvider>
    );
}
