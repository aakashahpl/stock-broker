import express from "express";
import axios from "axios";
import { createClient } from 'redis';
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

dotenv.config();

const route = express.Router();

// Redis client
const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

const stockDataPath = path.join(__dirname, "../../stock-data.json");
const TopGainersLosersPath = path.join(__dirname, "../../top-gainers-losers.json");
const alphavantageKey: string | undefined = process.env.ALPHA_VANTAGE_KEY;
const twelvedataKey: string | undefined = process.env.TWELVE_DATA_KEY;
if (!alphavantageKey || !twelvedataKey) {
  console.log("Please enter correct api keys in .env file");
}

const stockData = JSON.parse(
  fs.readFileSync(
    stockDataPath,
    "utf8"
  )
);

const fetchInterval = setInterval(async () => {
  let topGainers: any = null;
  let topLosers: any = null;
  const currentDate = new Date();
  const currentHour = currentDate.getUTCHours(); // Get the current hour in UTC

  // Check if the current hour is 15 (3 PM in 24-hour format)

  try {
    const stockData = JSON.parse(
      fs.readFileSync(
        stockDataPath,
        "utf8"
      )
    );

    const response2 = await axios.get(
      `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo`
    );

    topGainers = response2.data.top_gainers
      .map((gainer: any) => ({
        ...gainer,
        name: stockData[gainer.ticker] || "Unknown", // Add stock name if available, otherwise "Unknown"
      }))
      .slice(0, 11);
    topLosers = response2.data.top_losers
      .map((loser: any) => ({
        ...loser,
        name: stockData[loser.ticker] || "Unknown", // Add stock name if available, otherwise "Unknown"
      }))
      .slice(0, 10);

    // Save the data to a file
    fs.writeFileSync(
      TopGainersLosersPath,
      JSON.stringify({ topGainers, topLosers })
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, 60 * 60 * 1000); // Check every hour (60 minutes * 60 seconds * 1000 milliseconds)

route.get("/fetch", async (req, res) => {
  try {
    const fileData = fs.readFileSync(
      TopGainersLosersPath,
      "utf8"
    );

    const { topGainers, topLosers } = JSON.parse(fileData);
    res.json({ TopGainers: topGainers, TopLossers: topLosers });
  } catch (error: any) {
    res.json({ Error: error });
    throw error;
  }
});

route.get("/historical-data/:ticker", async (req, res) => {
  const { ticker } = req.params;
  console.log("historical-data", ticker);

  const cacheKey = `alpaca:bars:${ticker}`;

  try {
    // 1. Try to get from Redis
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Serving from cache");
      // console.log(JSON.parse(cached));
      return res.json(JSON.parse(cached));
    }

    // 2. Not in cache → Fetch from Alpaca
    const url = `https://data.alpaca.markets/v2/stocks/bars?symbols=${ticker}&timeframe=1D&start=2023-03-15&end=2025-03-15&limit=1000&adjustment=raw&feed=sip&sort=asc`;

    const options = {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY,
        'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET,
        'accept': 'application/json'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // 3. Save to Redis with 24h expiry
    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: 86400 // seconds = 24 hours
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



route.get("/all", async (req, res) => {
  try {
    const fileData = fs.readFileSync(
      stockDataPath,
      "utf8"
    );
    const data = JSON.parse(fileData);
    res.json(data);
  } catch (error: any) {
    res.json({ Error: error });
    throw error;
  }
});


export default route;
