"use client"
import { createChart, ColorType } from "lightweight-charts";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "path";
import { Currency } from "lucide-react";

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
  }

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

  const [initialData,setInitialData] = useState([
    { time: "2018-12-30", value: 169.19 },
    { time: "2018-12-31", value: 169.29 },
  ]);

//   const initialData=[
//     { time: "2018-12-23", value: 31.11 },
//     { time: "2018-12-24", value: 27.02 },
//     { time: "2018-12-25", value: 27.32 },
//     { time: "2018-12-26", value: 25.17 },
//     { time: "2018-12-27", value: 28.89 },
//     { time: "2018-12-28", value: 25.46 },
//     { time: "2018-12-29", value: 23.92 },
//     { time: "2018-12-30", value: 22.68 },
//     { time: "2018-12-31", value: 22.67 },
//   ]

  const socket = new WebSocket(
    "wss://ws.finnhub.io?token=cnv0m69r01qub9j05af0cnv0m69r01qub9j05afg"
  );
  socket.addEventListener("open", function (event) {
    socket.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
  });
  const count = useRef(0);
  socket.addEventListener("message", function (event) {
    console.log("Message from server ", event.data);
    const rawData = JSON.parse(event.data);
    // console.log(rawData.data);
    const finalArray = rawData.data;
    const formattedData = finalArray.map((item:any,index:any) => {
        const date = new Date(item.t);
  
        // Increment date by one day for each item
        date.setDate(date.getDate() + count.current);
        count.current++;
        // Convert incremented date to string in YYYY-MM-DD format
        const formattedDate = date.toISOString().split('T')[0];
      
        // Format value to 2 decimal places
        const value = item.p.toFixed(2);
        
        return {
          time: formattedDate,
          value: parseFloat(value),
        };
    });
    console.log(formattedData);
    setInitialData(initialData.concat(formattedData));

});

  return (
    <div className="">
      {/* <div> {JSON.stringify(convertedData)}</div> */}

      <ChartComponent {...chartProps} data={initialData}></ChartComponent>
    </div>
  );
}
