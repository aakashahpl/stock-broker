import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../context/userContext";
import { DeviceProvider } from "../context/DeviceContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "../components/navbar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <DeviceProvider>
                <Navbar />
                <Toaster />
                <Component {...pageProps} />
            </DeviceProvider>
        </UserProvider>
    );
}
