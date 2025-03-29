import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import Cookies from "universal-cookie";


interface UserStockData  {
  [symbol: string]: number; 
}

interface UserBalance {
  balance: {
    USD: number;
    stocks: {
      [symbol: string]: number; // Dynamic keys for stock symbols (e.g., AAPL, AMZN)
    };
  };
  userStockDetails: {
    [symbol: string]: StockDetails; // Dynamic keys for stock symbols
  };
}


interface StockDetails {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: FiftyTwoWeekDetails;
}

interface FiftyTwoWeekDetails {
  low: string;
  high: string;
  low_change: string;
  high_change: string;
  low_change_percent: string;
  high_change_percent: string;
  range: string;
}


export default function Home() {
  const [userBalance, setUserBalance] = useState<UserBalance | null>();
  const [userStockData, setUserStockData] = useState<UserStockData | null>();
  const [currentStocksValue,setCurrentStocksValue] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = {
          balance: {
            USD: 1663,
            stocks: {
              AAPL: 2,
              AMZN: 2,
            },
          },
          userStockDetails: {
            AAPL: {
              symbol: "AAPL",
              name: "Apple Inc",
              exchange: "NASDAQ",
              mic_code: "XNGS",
              currency: "USD",
              datetime: "2024-05-06",
              timestamp: 1715002200,
              open: "182.35001",
              high: "184.20000",
              low: "180.42000",
              close: "181.71001",
              volume: "78057800",
              previous_close: "183.38000",
              change: "-1.67000",
              percent_change: "-0.91068",
              average_volume: "71317040",
              is_market_open: false,
              fifty_two_week: {
                low: "164.08000",
                high: "199.62000",
                low_change: "17.63000",
                high_change: "-17.90999",
                low_change_percent: "10.74476",
                high_change_percent: "-8.97204",
                range: "164.080002 - 199.619995",
              },
            },
            AMZN: {
              symbol: "AMZN",
              name: "Amazon.com Inc",
              exchange: "NASDAQ",
              mic_code: "XNGS",
              currency: "USD",
              datetime: "2024-05-06",
              timestamp: 1715002200,
              open: "186.28000",
              high: "188.75000",
              low: "184.80000",
              close: "188.70000",
              volume: "34653900",
              previous_close: "186.21001",
              change: "2.48999",
              percent_change: "1.33719",
              average_volume: "53587900",
              is_market_open: false,
              fifty_two_week: {
                low: "104.70000",
                high: "189.77000",
                low_change: "84.00000",
                high_change: "-1.07001",
                low_change_percent: "80.22923",
                high_change_percent: "-0.56384",
                range: "104.699997 - 189.770004",
              },
            },
          },
        };

        // console.log(response.data);
        // setUserStockData(response.data.balance.stocks);
        // setUserBalance(response.data);

        console.log(response);
        setUserStockData(response.balance.stocks);
        setUserBalance(response);

        let currentValue = 0;
        Object.keys(response.balance.stocks).forEach((key) => {
          // console.log(response.balance.stocks[key]);
          currentValue +=
            (response.balance.stocks[key] * Number(response.userStockDetails[key].close));
            console.log("current value lasdf "+currentValue);
        });
        setCurrentStocksValue(currentValue);

        if (!response) {
          console.log("error while fetching user balance data");
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
        throw error;
      }
    }

    fetchData();

    // return () => {
    // Cleanup code goes here
    // };
  }, []);

  return (
    <>
    {/* <div className="text-white">temp code ts error</div> */}
      <main
        className={`flex min-h-screen flex-row justify-between  mx-96 mt-24`}
      >
        <div className=" w-8/12 flex flex-col justify-start gap-5">
          <div className=" font-bold text-slate-100 text-xl pb-3 ">
            Stock Holdings
          </div>
          <div className="flex flex-col w-full h-auto  justify-center border border-myBorder rounded-lg overflow-hidden ">
            <div className=" h-32 bg-myBackground2 text-white flex flex-row justify-between items-center px-8 ">
              <div className=" flex-1 flex flex-col justify-center items-center">
                <div className=" text-4xl font-bold">${currentStocksValue.toFixed(2)}</div>
                <div className=" text-base font-semibold">Current Value</div>
              </div>
              <div className="flex-[1.5] flex flex-col justify-center items-center">
                <div>
                  <div className=" flex flex-row gap-6 justify-between">
                    <div>Invested Value</div>
                    <div>$823</div>
                  </div>
                  <div className="flex flex-row  justify-between">
                    <div>Total Returns</div>
                    <div className=" text-[#0ba782] font-bold">$200</div>
                  </div>
                  <div className="flex flex-row  justify-between">
                    <div>1D Returns</div>
                    <div className=" text-[#0ba782] font-bold">$123</div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" text-slate-100 text-sm font-semibold h-14 border-b border-dashed border-myBorder flex flex-row px-4 justify-between items-center">
              <h1 className=" w-2/12">COMPANY</h1>
              <h1 className="">MKT PRICE</h1>
              <h1 className="">QTY</h1>
            </div>
            {userStockData &&Object.entries(userStockData).map(([symbol, quantity]) => (
              <div
                key={symbol}
                className="flex flex-row justify-between w-full text-white px-6 h-20 items-center border-b border-myBorder border-dashed"
              >
                <div className=" bg  w-2/12">
                  <h3 className=" font-semibold text-xl">
                    {(() => {
                      let fullName =
                        userBalance?.userStockDetails[symbol]?.name || ""; // Access the name property correctly
                      let nameArray = fullName.split(" ");
                      return nameArray[0];
                    })()}
                  </h3>
                  <h3 className=" text-sm">{symbol}</h3>
                </div>
                <h3 className=" text-base">
                  $
                  {Number(userBalance?.userStockDetails[symbol].close).toFixed(
                    2
                  )}
                </h3>
                <h3 className=" text-lg font-semibold ">{quantity}</h3> 
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full h-auto  justify-center bg-gray-700 "></div>
        </div>

        <div className=" border border-myBorder w-80 h-96"></div>
      </main>
    </>
  );
}
