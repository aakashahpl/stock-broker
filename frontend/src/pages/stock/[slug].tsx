import React from "react";
import Chart from "../chart";

function BasicComponent() {
    const borderColor = "#2e2e2e";
    return (
        <div className=" flex flex-row justify-center h-screen">
            <div className="w-6/12 ">
                <Chart />

            </div>
            <div className=" flex flex-col h-3/5 w-  w-2/12 border-[1px] border-myBorder rounded ml-10">
                <div className=" flex-[2] border-b-[1px] border-myBorder"></div>
                <div className="flex-[1.5] border-b-[1px] border-myBorder">
                    <button className=" bg-myBg text-white h-full w-1/5 border-stone-50 border-2">Buy</button>
                    <button className=" bg-myBg text-white h-full w-1/5 border-stone-50 border-2">Sell</button>
                </div>
                <div className="flex-[6] "></div>
                <div className="flex-[2.5] border-t-[1px] mx-2 border-myBorder "></div>

            </div>
        </div>
    );
}

export default BasicComponent;
