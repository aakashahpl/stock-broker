import { createChart, ColorType } from "lightweight-charts";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "path";
import { Currency } from "lucide-react";

export const ChartComponent = (props: any) => {
    // console.log("current frame in chartComponent", props.frame);
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
        frame,
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
    }, [data, frame]);

    return (
        <>
            <div ref={chartContainerRef} />
        </>
    );
};

interface prop {
    ticker: string;
    timeFrame: string;
}

export default function Chart(props: prop) {
    const [convertedData, setConvertedData] = useState([]);
    let lineColor: string;
    let areaTopColor: string;
    let areaBottomColor: string;
    if (convertedData[0] - convertedData[convertedData.length - 1] > 0) {
        lineColor = "rgba(255, 123, 94, 1)";
        areaTopColor = "rgba(255, 123, 94, 0.25)";
        areaBottomColor = "rgba(255, 123, 94, 0.1)";
    } else {
        lineColor = "#70bfaa";
        areaTopColor = "rgba(52, 235, 140,0.25)";
        areaBottomColor = "rgba(52, 235, 140,0)";
    }
    const chartProps = {
        colors: {
            backgroundColor: "#121212",
            lineColor: lineColor,
            textColor: "white",
            areaTopColor: areaTopColor,
            areaBottomColor: areaBottomColor,
        },
        grid: {
            vertLines: {
                color: "#121212",
            },
            horzLines: {
                color: "#121212",
            },
        },
    };  
    const [ticker, setTicker] = useState("");
    const count = useRef(0);

    const prevFrame = useRef("");
    const [frame, setFrame] = useState("");

    //to prevent continuous rendering
    //count checks the number of renders

    if (props.ticker != undefined && count.current === 0) {
        count.current++;
        setTicker(props.ticker);
    }

    useEffect(() => {
        setFrame(props.timeFrame);
    }, [props.timeFrame]);

    const inputData: any = useRef([]);
    const formattedData: any = useRef([]);

    console.log(formattedData);

    useEffect(() => {
        console.log("inside useEffect");
        const fetchData = async () => {
            try {
                
                if (inputData.current.length === 0) {
                    // const url =
                    //     `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_KEY_2}`;
                    const url =
                        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo";

                    const response = await axios.get(url, {
                        headers: { "User-Agent": "axios" },
                    });

                    inputData.current = response.data;
                    // console.log(inputData.current);
                    //transform the data from the api to your required data
                    //required data format :--
                    //[{time:"2023-10-18",value:139.97},...]
                    Object.keys(
                        inputData.current["Time Series (Daily)"]
                    ).forEach((key) => {
                        formattedData.current.push({
                            time: key,
                            value: parseFloat(
                                inputData.current["Time Series (Daily)"][key][
                                    "4. close"
                                ]
                            ),
                        });
                    });
                }

                if (formattedData.current.length > 0) {
                    if (frame === "1M") {
                        console.log("inside 1M");
                        const formattedData30Days = formattedData.current.slice(
                            0,
                            30
                        );
                        // console.log(formattedData30Days[0]);
                        setConvertedData(formattedData30Days.reverse());
                    } else if (frame == "1Y") {
                        console.log("inside 1Y");
                        const formattedData365Days =
                            formattedData.current.slice(0, 365);

                        setConvertedData(formattedData365Days.reverse());
                    } else if (frame == "3Y") {
                        console.log("inside 1Y");
                        const formattedData365Days =
                            formattedData.current.slice(0, 356 * 3);

                        setConvertedData(formattedData365Days.reverse());
                    } else {
                        console.error("Status:", response.status);
                    }
                }
            } catch (error: any) {
                console.error("Error:", error.message);
            }
        };

        fetchData();
    }, [ticker, frame]);

    return (
        <div className="">
            {/* <div> {JSON.stringify(convertedData)}</div> */}

            <ChartComponent
                {...chartProps}
                data={convertedData}
                frame={frame}
            ></ChartComponent>
        </div>
    );
}
