import React, { useEffect } from "react";
import { useState } from "react";
import Chart from "../../component/chart";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";
import axios from "axios";
import Image from "next/image";

function BasicComponent() {
    const [timeFrame, setTimeFrame] = useState("1M");
    const borderColor = "#2e2e2e";
    const router = useRouter();
    const { user } = useUser();
    console.log(router.query.slug);
    const [slug, setSlug] = useState(router.query.slug);
    console.log(slug);

    useEffect(() => {
        setSlug(router.query.slug);
    }, [router.query.slug]);

    const timeFrames = [
        { value: "1D", label: "1D" },
        { value: "1M", label: "1M" },
        { value: "1Y", label: "1Y" },
        { value: "3Y", label: "3Y" },
    ];


    const [stockData,setStockData] =  useState({});
    useEffect(() => {
        const apiUrl = `https://api.finnhub.io/api/v1/stock/profile2?symbol=${slug}&token=cns5e01r01qmmmfkrc8gcns5e01r01qmmmfkrc90`;

        async function fetchData() {
            if (slug) {
                try {
                    const response = await axios.get(apiUrl);
                    console.log("Data:", response.data);
                    setStockData(response.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        }
        fetchData();
    }, [slug]);



    const [option,setOption] = useState("buy");
    return (
        <div>
            {/* <div className="text-white text-8xl">{user.email}</div> */}
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
                        <div className=" text-3xl font-semibold">{stockData.name}</div>
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
                </div>
                <div className=" flex flex-col h-3/5 w-2/12 border-[1px] border-myBorder rounded-md ml-10">
                    <div className=" flex-[1.5] border-b-[1px] border-myBorder flex flex-col justify-center items-start px-2 ">
                        <div className=" text-lg">{stockData.name}</div>
                        <div className=" text-sm">132.23</div>
                    </div>
                    <div className="flex-[1] border-b-[1px] border-myBorder px-2">
                        <button className=" bg-myBg text-white h-full w-1/5 focus:border-b-4 border-[#0abb92]">
                            Buy
                        </button>
                        <button className=" bg-myBg text-white h-full w-1/5  focus:border-b-4 border-[#0abb92] ">
                            Sell
                        </button>
                    </div>
                    <div className="flex-[6] ">
                        <div className=" flex flex-row justify-start items-center gap-2 px-2 h-12">
                        <button className=" focus:bg-[#10362d] focus:text-[#0ba782] font-semibold bg-myBg text-white text-xs rounded-full bg-[#252525] px-3 py-2 ">
                            Delivery
                        </button>
                        <button className="focus:bg-[#10362d] focus:text-[#0ba782] font-semibold bg-myBg text-white text-xs rounded-full bg-[#252525] px-3 py-2">
                            Intraday
                        </button>
                        </div>
                    </div>
                    <div className="flex-[2.5] border-t-[1px] mx-2 border-myBorder "></div>
                </div>
            </div>
        </div>
    );
}

export default BasicComponent;
