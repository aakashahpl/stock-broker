import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// const inter = Inter({ subsets: ["latin"] });
import Link from "next/link";
import Cookies from "universal-cookie";

export default function Home() {
    const stockData = {
        AAPL: 100,
        MSFT: 75,
        GOOGL: 50,
        AMZN: 60,
        FB: 80,
        TSLA: 70,
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(
                    `http://localhost:3001/user/balance`,
                    { withCredentials: true }
                );
                console.log(response.data);
                if (!response) {
                    console.log("alsdjf");
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
            <main
                className={`flex min-h-screen flex-row justify-between  mx-96 mt-10`}
            >
                <div className=" w-8/12 flex flex-col justify-start gap-5">
                    <div className=" font-bold text-slate-100 pb-3 ">
                        Holdings
                    </div>
                    <div className="flex flex-col w-full h-auto  justify-center border border-myBorder rounded-lg overflow-hidden ">
                        <div className=" h-32 bg-myBackground2 text-white flex flex-row justify-between items-center px-8 ">
                            <div className=" flex-1 flex flex-col justify-center items-center">
                                <div className=" text-4xl font-bold">
                                    $1,023
                                </div>
                                <div className=" text-base font-semibold">
                                    Current Value
                                </div>
                            </div>
                            <div className="flex-[1.5] flex flex-col justify-center items-center">
                                <div>
                                    <div className=" flex flex-row gap-6 justify-between">
                                        <div>Invested Value</div>
                                        <div>$823</div>
                                    </div>
                                    <div className="flex flex-row  justify-between">
                                        <div>Total Returns</div>
                                        <div className=" text-[#0ba782] font-bold">
                                            $200
                                        </div>
                                    </div>
                                    <div className="flex flex-row  justify-between">
                                        <div>1D Returns</div>
                                        <div className=" text-[#0ba782] font-bold">
                                            $123
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {Object.entries(stockData).map(([symbol, quantity]) => (
                            <div
                                key={symbol}
                                className="flex flex-row justify-between w-full text-white px-3 h-20 items-center border-b border-myBorder border-dashed"
                            >
                                <div>{symbol}</div>
                                <div>{quantity}</div>
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
