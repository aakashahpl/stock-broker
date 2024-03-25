import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { LineGraph } from "@groww-tech/react-charts";
const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
// import { Ap } from "./chart";

export default function Home() {
    const indexes = useRef([
        { indexName: "NASDAQ", price: 0 },
        { indexName: "S&P500", price: 0 },
        { indexName: "Dow Jones", price: 0 },
    ]);
    const topGainers = useRef([]);
    const topLossers = useRef([]);

    // const [topLosers,setTopLosers]=useState([]);

    const [update, setUpdate] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `http://localhost:3001/frontpage/fetch`
                );

                const data = response.data;

                // console.log(data.TopGainers);

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
                    topGainers.current = data.TopGainers.slice(0,12);
                    topLossers.current = data.TopLossers.slice(0,12);
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
        <>
            <main
                className={`flex min-h-screen flex-row justify-between  bg-emerald-400 mx-96`}
            >
                <div className=" w-8/12 flex flex-col justify-start gap-5">
                    <div className="flex flex-col w-full h-24  justify-center bg-gray-700 ">
                        <div className=" flex-1 font-bold text-slate-100 pb-3">
                            Index
                        </div>
                        <div className=" flex-[3] flex flex-row justify-between">
                            {indexes.current.map((element, index) => (
                                <div
                                    className=" w-4/12 mx-1 h-18 bg-[#1b1b1b] border-2 border-[#2b2b2b] flex justify-center items-center text-slate-300"
                                    key={index}
                                >
                                    <div className="flex flex-col w-11/12 ">
                                        <div>{element.indexName}</div>
                                        <div>{element.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-auto  justify-center bg-gray-700 ">
                        <div className=" flex-1 font-bold text-slate-100 pb-3">
                            Top Gainers
                        </div>
                        <div className=" grid grid-cols-4 w-full gap-y-4">
                            {topGainers.current.map((element, index) => (
                                <div
                                    className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-2 border-[#2b2b2b] flex justify-center items-center text-slate-300"
                                    key={index}
                                >
                                    <div className="flex flex-col w-11/12 ">
                                        <div>{element.ticker}</div>
                                        <div>{element.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-auto  justify-center bg-gray-700 ">
                        <div className=" flex-1 font-bold text-slate-100 pb-3">
                            Top Lossers
                        </div>
                        <div className=" grid grid-cols-4 w-full gap-y-4">
                            {topLossers.current.map((element, index) => (
                                <Link href={`/stock/${element.ticker}`}
                                    className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-2 border-[#2b2b2b] flex justify-center items-center text-slate-300"
                                    key={index}
                                >
                                    <div className="flex flex-col w-11/12 ">
                                        <div>{element.ticker}</div>
                                        <div>{element.price}</div>
                                      
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-auto  justify-center bg-gray-700 ">
                        <div className=" flex-1 font-bold text-slate-100 pb-3">
                            Most Actively Traded
                        </div>
                        <div className=" grid grid-cols-4 w-full gap-y-4">
                            {topLossers.current.map((element, index) => (
                                <div
                                    className=" w-11/12 mx-1 h-40 bg-[#1b1b1b] border-2 border-[#2b2b2b] flex justify-center items-center text-slate-300"
                                    key={index}
                                >
                                    <div className="flex flex-col w-11/12 ">
                                        <div>{element.ticker}</div>
                                        <div>{element.price}</div>
                                      
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className=" bg-white w-80 h-96"></div>
            </main>
        </>
    );
}
