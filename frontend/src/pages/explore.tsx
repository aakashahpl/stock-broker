import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { LineGraph } from "@groww-tech/react-charts";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import StockDetails from "@/components/explore/stock";
import InvestmentDetails from "@/components/explore/investment";
import Chart from "@/components/realTimeChart";
import Navbar from "../components/navbar";
import Search from "../components/Search";


export default function Home() {
  return (

    <main
      className={`flex min-h-screen flex-row justify-between mx-auto max-w-[60%] mt-24 `}
    >

      {/* <Chart ticker="AAPL" timeFrame="1M"/> */}
      <StockDetails />
      <InvestmentDetails />
    </main>

  );
}
