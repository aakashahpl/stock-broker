import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function InvestmentDetails() {
  const [userBalance, setUserBalance] = useState();
  const [userStockData, setUserStockData] = useState({});
  const [currentStocksValue, setCurrentStocksValue] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        // const response = await axios.get(`http://localhost:3001/user/balance`, {
        //   withCredentials: true,
        // });
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
            response.balance.stocks[key] *
            Number(response.userStockDetails[key].close);
          console.log("current value lasdf " + currentValue);
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
    <div className="  w-80 h-40 text-white">
      <div className=" flex flex-row justify-between py-4 ">
        <div className=" font-bold text-xl">Your Investments</div>
        <Link href="/user/investments"></Link>
        <h3 className=" text-[#0ba481] font-semibold">Dashboard</h3>
      </div>
      <div className=" h-20 rounded-sm border-[1px] border-[#2b2b2b] flex flex-row items-center justify-between px-4">
        <div>
          <h3 className=" text-[#0ba481] font-bold text-lg">+$9999</h3>
          <h3 className=" text-base">Total Returns</h3>
        </div>
        <div className=" text-end">
          <h3 className=" font-bold text-lg">
            ${currentStocksValue.toFixed(2)}
          </h3>
          <h3 className=" text-base">Current Value</h3>
        </div>
      </div>
      <div className=" flex flex-row justify-between py-4 mt-10 ">
        <div className=" font-bold text-xl">Your Portfolio</div>

        <h3 className=" text-[#0ba481] font-semibold">
          <Link href="/user/investments">View all</Link>
        </h3>
      </div>
      <div className=" h-80 rounded-md border-[1px] border-[#2b2b2b] overflow-x-hidden overflow-y-scroll">
        {Object.entries(userStockData).map(([symbol, quantity]) => (
          <div className=" h-20 rounded-sm border-b-[1px] border-[#2b2b2b] flex flex-row items-center justify-between px-4">
            <div>
              <h3 className=" text-base">
                {" "}
                {(() => {
                  let fullName =
                    userBalance.userStockDetails[symbol]?.name || ""; // Access the name property correctly
                  let nameArray = fullName.split(" ");
                  return nameArray[0];
                })()}
              </h3>
            </div>
            <div className=" text-end">
              <h3 className=" font-bold text-lg">
                ${Number(userBalance.userStockDetails[symbol].close).toFixed(2)}
              </h3>
              <h3 className=" font-bold text-lg">
                {Number(
                  userBalance.userStockDetails[symbol].percent_change
                ).toFixed(2)}
                %
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
