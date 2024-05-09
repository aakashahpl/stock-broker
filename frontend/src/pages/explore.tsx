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

export default function Home() {
  return (
    <>
      <main
        className={`flex min-h-screen flex-row justify-between  mx-96 mt-4`}
      >
        {/* <Chart ticker="AAPL" timeFrame="1M"/> */}
        <StockDetails />
        <InvestmentDetails />
      </main>
    </>
  );
}
