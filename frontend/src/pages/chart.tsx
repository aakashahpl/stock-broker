import { createChart, ColorType } from "lightweight-charts";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export const ChartComponent = (props) => {
    const {
        data,
        colors: {
            backgroundColor = "black",
            lineColor = "#FFFF33",
            textColor = "black",
            areaTopColor = "#2962FF",
            areaBottomColor = "rgba(41, 98, 255, 0.28)",
        } = {},
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!chartContainerRef.current) return;
        const handleResize = () => {
            
            chart.applyOptions({
                width: chartContainerRef.current!.clientWidth,    // "!" charContainerRef.current is strictly not null 
            });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addAreaSeries({
            lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor,
        });
        newSeries.setData(data);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            chart.remove();
        };
    }, [data]);

    return (
        <>
            <div ref={chartContainerRef} />
        </>
    );
};

export default function Ap(props) {
    const [convertedData, setConvertedData] = useState([]);

    useEffect(() => {
        let formattedData: any = [];
        const fetchData = async () => {
            try {
                const url =
                    "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo";
                const response = await axios.get(url, {
                    headers: { "User-Agent": "axios" },
                });

                if (response.status === 200) {
                    const inputData = response.data;

                //transform the data from the api to your required data
                    Object.keys(inputData["Time Series (Daily)"]).forEach(
                        (key) => {
                            formattedData.push({
                                time: key,
                                value: parseFloat(
                                    inputData["Time Series (Daily)"][key][
                                        "4. close"
                                    ]
                                ),
                            });
                        }
                    );

                    setConvertedData(formattedData.reverse());
                    console.log("asldf");
                } else {
                    console.error("Status:", response.status);
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        fetchData();
    }, []);
    console.log("aakash");
    return (
        <>
            <div> {JSON.stringify(convertedData)}</div>

            <ChartComponent {...props} data={convertedData}></ChartComponent>
        </>
    );
}
