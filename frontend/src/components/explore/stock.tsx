import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
const StockDetails = () => {
  const indexes = useRef([
    {
      indexName: "NASDAQ",
      price: 0,
      url: "https://s3-symbol-logo.tradingview.com/nasdaq--600.png",
    },
    {
      indexName: "S&P500",
      price: 0,
      url: "https://s3-symbol-logo.tradingview.com/indices/s-and-p-500--big.svg",
    },
    {
      indexName: "Dow Jones",
      price: 0,
      url: "https://s3-symbol-logo.tradingview.com/indices/dow-jones-composite-average-index--600.png",
    },
  ]);
  const topGainers = useRef([]);
  const topLossers = useRef([]);
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/stock/fetch`
        );

        const data = response.data;

        console.log(data.TopGainers);

        // if(data.indexesData.SPX&&data.indexesData.IXIC&&data.indexesData.DJI){

        // indexes.current[0].price = parseFloat(
        //     parseFloat(data.indexesData.SPX.values[0].close).toFixed(2)
        // );
        // indexes.current[1].price = parseFloat(
        //     parseFloat(data.indexesData.IXIC.values[0].close).toFixed(2)
        // );
        // indexes.current[2].price = parseFloat(
        //     parseFloat(data.indexesData.DJI.values[0].close).toFixed(2)
        // );

        // }
        setUpdate(1);
        if (data.TopGainers && data.TopLossers) {
          topGainers.current = data.TopGainers;
          topLossers.current = data.TopLossers;
          setUpdate(1);
        }
        if (data.TopLossers) {
          top;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }

    fetchData();

    return () => {
      // Cleanup code goes here
    };
  }, []);
  return (
    <div className=" w-10/12 flex flex-col justify-start gap-5">
      <div className="flex flex-col w-full h-48 justify-center  ">
        <div className=" flex-1 font-bold text-slate-100 text-xl pb-3">
          Indices
        </div>
        <div className=" flex-[3] flex flex-row justify-between h-40 ">
          {indexes.current.map((element, index) => (
            <div
              className=" w-4/12 mx-1 h-18 bg-[#1b1b1b] border-[1px] border-[#2b2b2b] flex justify-center items-center text-slate-300 rounded-lg hover:border-[2.5px]"
              key={index}
            >
              <div className="flex flex-col w-11/12 ">
                <img
                  src={element.url}
                  alt="unknown"
                  className=" w-16 h-16 rounded-md"
                />
                <div className=" font-bold">{element.indexName}</div>
                <div>{element.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full h-auto  justify-center  ">
        <div className=" flex-1 font-bold text-slate-100 pb-3 text-lg">
          Top Gainers
        </div>
        <div className=" grid grid-cols-4 w-full gap-y-4">
          {topGainers.current.map((element, index) => (
            <div
              className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-[1px] border-[#2b2b2b] flex justify-center items-center text-slate-300 rounded-lg hover:border-[2.5px]"
              key={index}
            >
              <div className="flex flex-col w-11/12 justify-around h-full">
                <div className=" text-sm font-bold">
                  {(() => {
                    let fullName = element.name || ""; // Access the name property correctly
                    let nameArray = fullName.split(" ");
                    return nameArray[0] + " " + nameArray[1];
                  })()}
                </div>
                <div className="px-2">
                <div className=" text-base font-semibold">
                    {element.ticker}
                  </div>
                  <div className=" text-base font-semibold">
                    ${element.price}
                  </div>
                  <div className=" text-sm font-semibold text-[#0c9b7a]">
                    {Number(element.change_amount).toFixed(2) +
                      " (" +
                      parseInt(element.change_percentage) +
                      "%)"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full h-auto  justify-center  ">
        <div className=" flex-1 font-bold text-slate-100 pb-3 text-lg   ">
          Top Lossers
        </div>
        <div className=" grid grid-cols-4 w-full gap-y-4">
          {topLossers.current.map((element, index) => (
            <Link
              href={`/stock/${element.ticker}`}
              className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-[1px] border-[#2b2b2b] flex justify-center items-center text-slate-300 rounded-lg hover:border-[2.5px]"
              key={index}
            >
              <div className="flex flex-col w-11/12 justify-around h-full">
                <div className=" text-sm font-bold">{element.name}</div>
                <div className="px-2">
                  {/* <div className=" text-base font-semibold">
                    ${element.ticker}
                  </div> */}
                  <div className=" text-base font-semibold">
                    ${element.price}
                  </div>
                  <div className=" text-sm font-semibold text-[#b94b33]">
                    {Number(element.change_amount).toFixed(2) +
                      " (" +
                      parseInt(element.change_percentage) +
                      "%)"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full h-auto  justify-center ">
        <div className=" flex-1 font-bold text-slate-100 pb-3 text-lg">
          Most Actively Traded
        </div>
        <div className=" grid grid-cols-4 w-full gap-y-4">
          {topLossers.current.map((element, index) => (
            <div
              className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-[1px] border-[#2b2b2b] flex justify-center items-center text-slate-300 rounded-lg hover:border-[2.5px]"
              key={index}
            >
              <div className="flex flex-col w-11/12 justify-around h-full">
                <div className=" text-sm font-bold">{element.name}</div>
                <div>
                  <div className=" text-sm">{element.ticker}</div>
                  <div className=" text-sm text-green-400">
                    ${element.price}$
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
