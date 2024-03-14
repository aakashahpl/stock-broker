import React from "react";
import { useState } from "react";
import Chart from "../../component/chart";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";

function BasicComponent() {
    const [timeFrame, setTimeFrame] = useState("1M");
    const borderColor = "#2e2e2e";
    const router = useRouter();
    const { user } = useUser();
    let { slug } = router.query;
    if(slug===undefined){
        slug = "IBM";
    }
    const timeFrames = [
        { value: "1D", label: "1D" },
        { value: "1M", label: "1M" },
        { value: "1Y", label: "1Y" },
        { value: "3Y", label: "3Y" },
    ];
    return (
        <div>
            {/* <div className="text-white text-8xl">{user.email}</div> */}
            <div className=" text-white flex flex-row justify-center h-screen mt-10">
                <div className="w-6/12 ">
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
                                    onClick={()=>setTimeFrame(timeframe.label)}
                                >
                                    {timeframe.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className=" flex flex-col h-3/5 w-  w-2/12 border-[1px] border-myBorder rounded-md ml-10">
                    <div className=" flex-[2] border-b-[1px] border-myBorder"></div>
                    <div className="flex-[1.5] border-b-[1px] border-myBorder">
                        <button className=" bg-myBg text-white h-full w-1/5 border-stone-50 border-2">
                            Buy
                        </button>
                        <button className=" bg-myBg text-white h-full w-1/5 border-stone-50 border-2">
                            Sell
                        </button>
                    </div>
                    <div className="flex-[6] "></div>
                    <div className="flex-[2.5] border-t-[1px] mx-2 border-myBorder "></div>
                </div>
            </div>
        </div>
    );
}

export default BasicComponent;
