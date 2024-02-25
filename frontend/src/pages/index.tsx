import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineGraph } from "@groww-tech/react-charts";
const inter = Inter({ subsets: ["latin"] });
import {Ap} from "./chart";


import React, {  useRef } from 'react';

let indexes = [
    { indexName: "NIFTY50" },
    { indexName: "SENSEX" },
    { indexName: "BANKNIFTY" },
];
const initialData = [
	{ time: '2018-12-22', value: 32.51 },
	{ time: '2018-12-23', value: 31.11 },
	{ time: '2018-12-24', value: 27.02 },
	{ time: '2018-12-25', value: 27.32 },
	{ time: '2018-12-26', value: 25.17 },
	{ time: '2018-12-27', value: 28.89 },
	{ time: '2018-12-28', value: 25.46 },
	{ time: '2018-12-29', value: 23.92 },
	{ time: '2018-12-30', value: 22.68 },
	{ time: '2018-12-31', value: 22.67 },
];

const data1 = [
    [1652672700000, 1288.4],
    [1652673000000, 1294.9],
    [1652673300000, 1297],
    [1652673600000, 1297.3],
    [1652673900000, 1301.45],
    [1652674200000, 1300.6],
    [1652674500000, 1308.4],
    [1652674800000, 1300],
    [1652675100000, 1306],
    [1652675400000, 1304.45],
    [1652675700000, 1306.45],
    [1652676000000, 1306.75],
    [1652676300000, 1304.55],
    [1652676600000, 1302.7],
    [1652676900000, 1302.65],
    [1652677200000, 1302.5],
    [1652677500000, 1304.45],
    [1652677800000, 1304.85],
    [1652678100000, 1304.05],
    [1652678400000, 1302],
    [1652678700000, 1303.6],
    [1652679000000, 1305.5],
    [1652679300000, 1306.4],
    [1652679600000, 1306.1],
    [1652679900000, 1306.15],
    [1652680200000, 1305.35],
    [1652680500000, 1303.65],
    [1652680800000, 1303.85],
    [1652681100000, 1301.1],
    [1652681400000, 1301],
    [1652681700000, 1298.5],
    [1652682000000, 1298.15],
    [1652682300000, 1297.3],
    [1652682600000, 1295.35],
    [1652682900000, 1296.05],
    [1652683200000, 1293.8],
    [1652683500000, 1297.2],
    [1652683800000, 1298.6],
    [1652684100000, 1297],
    [1652684400000, 1299.95],
    [1652684700000, 1297.3],
    [1652685000000, 1293.95],
    [1652685300000, 1292.3],
    [1652685600000, 1295.15],
    [1652685900000, 1297.05],
    [1652686200000, 1296],
    [1652686500000, 1295.5],
    [1652686800000, 1296.3],
    [1652687100000, 1298.95],
    [1652687400000, 1299.2],
    [1652687700000, 1299.4],
    [1652688000000, 1300.95],
    [1652688300000, 1302.6],
    [1652688600000, 1303.5],
    [1652688900000, 1303.2],
    [1652689200000, 1304.3],
    [1652689500000, 1303.2],
    [1652689800000, 1305.2],
    [1652690100000, 1305],
    [1652690400000, 1301.95],
    [1652690700000, 1302.35],
    [1652691000000, 1303.5],
    [1652691300000, 1302.45],
    [1652691600000, 1302.3],
    [1652691900000, 1303.6],
    [1652692200000, 1308],
    [1652692500000, 1308],
    [1652692800000, 1309.5],
    [1652693100000, 1307.75],
    [1652693400000, 1305.5],
    [1652693700000, 1303.75],
    [1652694000000, 1304.1],
    [1652694300000, 1305.65],
    [1652694600000, 1306.8],
    [1652694900000, 1308],
];

export default function Home() {
    useEffect(() => {
        // This code block will run after the component mounts
        // It can be used to fetch data, subscribe to events, etc.

        const url =
            "https://api.upstox.com/v2/historical-candle/NSE_EQ%7CINE848E01016/1minute/2023-11-13/2023-11-12";
        const headers = {
            Accept: "application/json",
        };

        axios
            .get(url, { headers })
            .then((response) => {
                // Do something with the response data (e.g., print it)
                console.log(response.data);
            })
            .catch((error) => {
                // Print an error message if the request was not successful
                console.error(
                    `Error: ${error.response.status} - ${error.response.data}`
                );
            });
        // Cleanup function: runs when the component unmounts or before re-running the effect
        return () => {
            // Perform any cleanup (e.g., unsubscribe from events)
            // This function is optional but useful for cleanup tasks
        };
    }, []); // Empty dependency array means this effect only runs once after the component mounts
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
           
            <LineGraph
                width={200}
                height={80}
                paddingHorz={4}
                paddingVert={4}
                linePaths={[
                    {
                        series: data1,
                        color: "#00D09C",
                        strokeWidth: 2,
                        key: "line-graph",
                        showLastPointBlinking: true,
                        strokeOpacity: 1,
                        isSeriesToScale: true,
                        allowToolTip: false,
                    },
                ]}
            />
            <div className="flex flex-col  w-5/12 h-24">
                <div className=" flex-1 font-bold text-slate-100 pb-3">
                    Index
                </div>
                <div className=" flex-[3] flex flex-row justify-between">
                    {indexes.map((element, index) => (
                        <div
                            className=" w-4/12 mx-1 h-18 bg-slate-600 rounded flex justify-center items-center"
                            key={index}
                        >
                            <div className="flex flex-col w-11/12 ">
                                <div>{element.indexName}</div>
                                <div>price</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
