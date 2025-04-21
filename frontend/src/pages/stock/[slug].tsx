import React, { useEffect } from "react";
import { useState } from "react";
import Chart from "../../components/chart";
import { useRouter } from "next/router";
import { useUser } from "../../context/userContext";
import axios from "axios";
import Image from "next/image";
import TransactionInput from "@/components/transactionInput";
import { FaCircleInfo } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Divide, LineChart } from "lucide-react";
import { MovingAverageChart } from "@/components/MovingAverageChart";
import { MonteCarloChart } from "@/components/MonteCarloChart";
import { ARIMAForecastChart } from "@/components/ArimaForecastChart";

interface StockData {
  logo: string;
  name: string;
  ticker?: string;
  country?: string;
  currency?: string;
  exchange?: string;
  ipo?: string;
  marketCapitalization?: number;
  phone?: string;
  weburl?: string;
  finnhubIndustry?: string;
}

interface StockData2 {
  symbol: string;
  name: string;
  open: number;
  previous_close: number;
  volume: number;
  high: number;
  low: number;
  close: number;
  change?: number;
  change_percent?: number;
  currency?: string;
  exchange?: string;
  datetime?: string;
}

interface OrderBookData {
  bids: {
    [price: string]: number; // Assuming the quantity is a number
  };
  asks: {
    [price: string]: number;
  };
}

function BasicComponent() {
  console.log("slug mounted");
  const [timeFrame, setTimeFrame] = useState("1M");
  const borderColor = "#2e2e2e";
  const router = useRouter();
  const { user } = useUser();
  const [slug, setSlug] = useState<string>();
  const [showCharts, setShowCharts] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [option, setOption] = useState("buy");

  useEffect(() => {
    if(typeof router.query.slug === 'string'){
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  const timeFrames = [
    { value: "1D", label: "1D" },
    { value: "1M", label: "1M" },
    { value: "1Y", label: "1Y" },
    { value: "3Y", label: "3Y" },
  ];

  const [stockData, setStockData] = useState<StockData|undefined>();
  const [stockData2, setStockData2] = useState<StockData2>();
  useEffect(() => {
    const apiUrl = `https://api.finnhub.io/api/v1/stock/profile2?symbol=${slug}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
    const apiUrl2 = `https://api.twelvedata.com/quote?symbol=AAPL&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_KEY}`;
    async function fetchData() {
      if (slug) {
        try {
          const response = await axios.get(apiUrl);
          const response2 = await axios.get(apiUrl2);
          // console.log("slug over here ",slug);
          setStockData(response.data);
          setStockData2(response2.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
    fetchData();
  }, [slug]);

  const [orderBook, setOrderBook] = useState(false);
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({ bids: {}, asks: {} });
  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_Backend_URL}/order/depth/${slug}`;
    async function fetchData() {
      if (slug) {
        try {
          const response = await axios.get(apiUrl);
          if (Object.values(response.data.depth).length != 0)
            setOrderBookData(response.data.depth);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
    fetchData();
  }, [orderBook]);

  const analyzeStock = async () => {
    if (!slug) return;
    
    try {
      setAnalyzing(true);
      // Call the API to trigger data preparation for charts
    const response = await axios.get(`${process.env.NEXT_PUBLIC_ANALYSIS_Backend_URL}/fetch-stock/${slug}`);
      
      if (response.status === 200) {
        setShowCharts(true);
      }
    } catch (error) {
      console.error("Error analyzing stock:", error);
      alert("Failed to analyze stock data. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  console.log("sloug over here",slug);
  return (
    <div className="mt-24">
      <div className=" text-white flex flex-row justify-center h-screen mt-10">
        <div className="w-6/12 ">
          <div className=" ">
            <div className=" flex justify-between items-center">
              <Image
                className=" overflow-hidden w-24 h-24"
                width={96}
                height={96}
                src={stockData?.logo}
                alt={slug || ""}
                style={{ opacity: 0.4 }}
              />
              <div className="flex gap-4">
                <Button
                  variant={"outline2"}
                  className="font-bold flex justify-center items-center px-6 text-sm"
                  onClick={analyzeStock}
                  disabled={analyzing || !slug}
                >
                  {analyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LineChart size={16} />
                      Analyze Stock
                    </div>
                  )}
                </Button>
                
                <Button
                  variant={"outline2"}
                  className="font-bold flex justify-center items-center px-6 text-sm"
                  onClick={() => setOrderBook(!orderBook)}
                >
                  {orderBook === false ? <>Order Book</> : <>Price Chart</>}
                </Button>
              </div>
            </div>
            <div className=" text-3xl font-semibold">{stockData?.name}</div>
          </div>
          <div className=" h-3/5">
            {orderBook === false ? (
              <>
                {slug&&<Chart ticker={slug} timeFrame={timeFrame} />}

                <div className=" text-4xl">{slug}</div>
                <div className=" flex flex-row justify-around w-full h-32  mt-4 border-t-[1px] border-myBorder pt-2">
                  <div className=" flex-[2] ">
                    <div className=" max-w-fit border-[1px] border-myBorder p-2 rounded-md">
                      NYSE
                    </div>
                  </div>
                  <div className="flex-[5] flex flex-row gap-4">
                    {timeFrames.map((timeframe) => (
                      <div
                        key={timeframe.value}
                        className="max-w-fit border-[1px] border-myBorder py-2 px-4 h-min rounded-full font-bold hover:cursor-pointer"
                        onClick={() => setTimeFrame(timeframe.label)}
                      >
                        {timeframe.label}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row justify-between pt-10 font-medium text-xl">
                  <div>Price(USD)</div>
                  <div>Quantity</div>
                </div>
                <div>
                  {Object.values(orderBookData.bids).length != 0 ? (
                    Object.entries(orderBookData.bids).map(([price, quant]) => (
                      <div
                        key={price}
                        className="flex flex-row justify-between w-full text-green-400 px-3 h-20 items-center border-b border-myBorder border-dashed"
                      >
                        <div>{price}</div>
                        <div>{quant}</div>
                      </div>
                    ))
                  ) : (
                    <div className=" font-bold text-xl pt-10 text-red-500">
                      No orders were placed for this stocks
                    </div>
                  )}
                </div>
                <div>
                  {Object.entries(orderBookData.asks).map(([price,quant]) => (
                    <div
                      key={price}
                      className="flex flex-row justify-between w-full text-red-600 px-3 h-20 items-center border-b border-myBorder border-dashed"
                    >
                      <div>{price}</div>
                      <div>{quant}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {showCharts && (
            <>
              <div className="flex flex-row justify-start items-center gap-2 text-xl font-semibold mt-20">
                <h1 className="text-white">Performance Analysis</h1>
                <FaCircleInfo />
              </div>
              <div className="gap-8 flex flex-col mt-4">
                <div className="border border-myBorder rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-2">Moving Average Analysis</h2>
                  <MovingAverageChart ticker={slug} />
                </div>
                <div className="border border-myBorder rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-2">Monte Carlo Simulation</h2>
                  <MonteCarloChart ticker={slug} />
                </div>
                {/* <div className="border border-myBorder rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-2">ARIMA Forecast</h2>
                  <ARIMAForecastChart ticker={slug} />
                </div> */}
                <div className="border border-myBorder rounded-lg p-4">
                  <h2 className="text-lg font-medium mb-2">LSTM Prediction</h2>
                  <img src="https://maang-stock-data-modified.s3.ap-south-1.amazonaws.com/lstm/MSFT.png" alt="" />
                </div>

              </div>
            </>
          )}
        </div>
        <TransactionInput currentStock={stockData} />
      </div>
    </div>
  );
}

export default BasicComponent;