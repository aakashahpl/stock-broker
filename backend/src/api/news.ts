import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

const path = require('path');
const newsPath = path.join(__dirname, 'news.json');

const route = express.Router();

const fetchInterval = setInterval(async () => {
  const currentDate = new Date();
  const currentHour = currentDate.getUTCHours(); // Get the current hour in UTC

  // Check if the current hour is 15 (3 PM in 24-hour format)

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );
    // console.log(response.data);
    fs.writeFileSync(
      newsPath,
      JSON.stringify( response.data.feed )
    );
  } catch (error) {
    console.error("Error fetching news data:", error);
  }
}, 60 * 60 * 9 * 1000); // Check every hour (60 minutes * 60 seconds * 1000 milliseconds)

route.get("/", async (req, res) => {
  try {
    const fileData = fs.readFileSync(
      newsPath,
      "utf8"
    );

    const newsData = JSON.parse(fileData);
    res.json(newsData);
  } catch (error: any) {
    res.json({ Error: error });
    throw error;
  }
});

export default route;
