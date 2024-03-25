import React, { useEffect } from "react";
import { useState } from "react";
import Chart from "../../components/chart";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import axios from "axios";
import Image from "next/image";
import TransactionInput from "@/components/transactionInput";
import { FaCircleInfo } from "react-icons/fa6";

function BasicComponent() {
    const [timeFrame, setTimeFrame] = useState("1M");
    const borderColor = "#2e2e2e";
    const router = useRouter();
    const { user } = useUser();
    // console.log(router.query.slug);
    const [slug, setSlug] = useState(router.query.slug);
    // console.log(slug);

    useEffect(() => {
        setSlug(router.query.slug);
    }, [router.query.slug]);

    const timeFrames = [
        { value: "1D", label: "1D" },
        { value: "1M", label: "1M" },
        { value: "1Y", label: "1Y" },
        { value: "3Y", label: "3Y" },
    ];

    const [stockData, setStockData] = useState({});
    const [stockData2, setStockData2] = useState({});
    useEffect(() => {
        const apiUrl = `https://api.finnhub.io/api/v1/stock/profile2?symbol=${slug}&token=cnv0m69r01qub9j05af0cnv0m69r01qub9j05afg`;
        const apiUrl2 = `https://api.twelvedata.com/quote?symbol=AAPL&apikey=765204f9080943c8a1b8c253ce302ff9`;
        async function fetchData() {
            if (slug) {
                try {
                    const response = await axios.get(apiUrl);
                    const response2 = await axios.get(apiUrl2);
                    // console.log("Data:", response.data);
                    setStockData(response.data);
                    setStockData2(response2.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }
        fetchData();
    }, [slug]);

    const [option, setOption] = useState("buy");
    return (
        <div>
            <div className=" text-white flex flex-row justify-center h-screen mt-10">
                <div className="w-6/12 ">
                    <div className=" ">
                        <div>
                            <Image
                                className=" overflow-hidden w-24 h-24"
                                width={10}
                                height={10}
                                src={stockData.logo}
                                alt=""
                                style={{ opacity: 0.4 }}
                            />
                        </div>
                        <div className=" text-3xl font-semibold">
                            {stockData.name}
                        </div>
                    </div>
                    <Chart ticker={slug} timeFrame={timeFrame} />
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
                                    onClick={() =>
                                        setTimeFrame(timeframe.label)
                                    }
                                >
                                    {timeframe.label}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className=" flex flex-row justify-start items-center gap-2 text-xl font-semibold">
                        <h1 className="text-white">Performance</h1>
                        <FaCircleInfo />
                    </div>
                    <div className=" grid grid-cols-4 grid-flow-row h-56 border">
                        <div>
                            <div>Open</div>
                            <div>{stockData2.open}</div>
                        </div>
                        <div>
                            <div>Prev. Close</div>
                            <div>{stockData2.previous_close}</div>
                        </div>
                        <div>
                            <div>Volume</div>
                            <div>{stockData2.volume}</div>
                        </div>
                        <div>
                            <div>Total traded value</div>
                            <div>{stockData2.volume}</div>
                        </div>
                        <div>
                            <div>Upper Circuit</div>
                            <div>{stockData2.high}</div>
                        </div>
                        <div>
                            <div>Lower Circuit</div>
                            <div>{stockData2.low}</div>
                        </div>

                    </div>
                </div>
                <TransactionInput currentStock={stockData} />
            </div>
        </div>
    );
}

export default BasicComponent;




{/* <div className="performacePopup_popUpContainer__DPKnI">
    <div className="absolute-center">
        <div className="absolute-center backgroundAccentSubtle performacePopup_infoWrap__kdOVV">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height="30"
                width="30"
                className="contentAccent absolute-center"
            >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"></path>
            </svg>
        </div>
    </div>
    <div className="absolute-center  bodyLargeHeavy performacePopup_popUpHead__INA5d">
        PERFORMANCE
    </div>
    <div className="absolute-center bodyBase">
        Performance has numbers that shows how the Stock is performing. These
        numbers change on a daily basis
    </div>
    <div className="row col l12">
        <div className="row performacePopup_popUp__kSA_K">
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Today's High</div>
                <div>
                    Today's High is the highest price at which the Stock has
                    been traded that day
                </div>
            </div>
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Opening Price</div>
                <div>
                    Opening Price is the price at which the Stock starts trading
                    during that day when the exchange opens
                </div>
            </div>
        </div>
        <div className="row performacePopup_popUp__kSA_K">
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Today's Low</div>
                <div>
                    Today's Low is the lowest price at which the Stock has been
                    traded that day
                </div>
            </div>
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Prev. Close</div>
                <div>
                    Closing Price is the price at which the Stock ends trading
                    when the exchange closes
                </div>
            </div>
        </div>
        <div className="row performacePopup_popUp__kSA_K">
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">52W High</div>
                <div>
                    52W High is the highest price at which the Stock has been
                    traded in the last 52 weeks
                </div>
            </div>
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">52W Low</div>
                <div>
                    52W Low is the lowest price at which the Stock has been
                    traded in the last 52 weeks
                </div>
            </div>
        </div>
        <div className="row performacePopup_popUp__kSA_K">
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Volume</div>
                <div>
                    Volume or Trading Volume is the total number of an Stock
                    traded, both bought and sold, on the exchange for the day
                </div>
            </div>
            <div className="col l6  bodyBase performacePopup_popUpWrap__gpBwk">
                <div className="bodyBaseHeavy">Value</div>
                <div>
                    Value is the total value of an Stock traded, both bought and
                    sold, on the exchange for the day
                </div>
            </div>
        </div>
    </div>
</div> */}
