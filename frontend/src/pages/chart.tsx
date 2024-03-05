import { createChart, ColorType } from "lightweight-charts";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { render } from "react-dom";

export const ChartComponent = (props: any) => {
    const {
        data,
        colors: {
            backgroundColor = "black",
            lineColor = "#FFFF33",
            textColor = "black",
            areaTopColor = "#2962FF",
            areaBottomColor = "rgba(41, 98, 255, 0.28)",
        } = {},
        grid,
    } = props;

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current!.clientWidth, // "!" charContainerRef.current is strictly not null
            });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            grid: grid,
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

interface prop {
    ticker: string;
}
export default function Chart(props: prop) {
    const [convertedData, setConvertedData] = useState([]);
    const chartProps = {
        colors: {
            backgroundColor: "#121212",
            lineColor: "#FF5733",
            textColor: "white",
            areaTopColor: "rgba(255, 123, 94, 0.5)",
            areaBottomColor: "rgba(255, 87, 51, 0.28)",
        },
        grid: {
            vertLines: {
                color: "#2B2B43",
            },
            horzLines: {
                color: "#363C4E",
            },
        },
    };
    const [ticker, setTicker] = useState("");
    const count = useRef(0);

    //to prevent continuous rendering
    //count checks the number of renders
    if (props.ticker != undefined && count.current === 0) {
        count.current++;
        setTicker(props.ticker);
    }
    useEffect(() => {
        let formattedData: any = [];

        console.log(props);

        const fetchData = async () => {
            try {
                console.log(ticker);
                // const url =
                //     `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_KEY_2}`;
                const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo`;

                const response = await axios.get(url, {
                    headers: { "User-Agent": "axios" },
                });

                if (response.status === 200) {
                    const inputData = response.data;

                    //transform the data from the api to your required data
                    //required data format :--
                    //[{time:"2023-10-18",value:139.97},...]

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
                    const formattedData30Days = formattedData.slice(0,30);
                    console.log(formattedData30Days[0]);
                    setConvertedData(formattedData30Days.reverse());
                } else {
                    console.error("Status:", response.status);
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        fetchData();
    }, [ticker]);

    return (
        <div className="">
            {/* <div> {JSON.stringify(convertedData)}</div> */}

            <ChartComponent
                {...chartProps}
                data={convertedData}
            ></ChartComponent>
        </div>
    );
}
