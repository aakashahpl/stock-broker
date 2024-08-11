"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv_1.default.config();
const route = express_1.default.Router();
const alphavantageKey = process.env.ALPHA_VANTAGE_KEY;
const twelvedataKey = process.env.TWELVE_DATA_KEY;
if (!alphavantageKey || !twelvedataKey) {
    console.log("Please enter correct api keys in .env file");
}
const stockData = JSON.parse(fs.readFileSync("../../stock-data.json", "utf8"));
const fetchInterval = setInterval(async () => {
    let topGainers = null;
    let topLosers = null;
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours(); // Get the current hour in UTC
    // Check if the current hour is 15 (3 PM in 24-hour format)
    try {
        const stockData = JSON.parse(fs.readFileSync("/home/caesarisdead/Desktop/stock-broker/backend/stock-data.json", "utf8"));
        const response2 = await axios_1.default.get(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo`);
        topGainers = response2.data.top_gainers
            .map((gainer) => ({
            ...gainer,
            name: stockData[gainer.ticker] || "Unknown", // Add stock name if available, otherwise "Unknown"
        }))
            .slice(0, 11);
        topLosers = response2.data.top_losers
            .map((loser) => ({
            ...loser,
            name: stockData[loser.ticker] || "Unknown", // Add stock name if available, otherwise "Unknown"
        }))
            .slice(0, 10);
        // Save the data to a file
        fs.writeFileSync("../../top-gainers-losers.json", JSON.stringify({ topGainers, topLosers }));
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}, 60 * 60 * 1000); // Check every hour (60 minutes * 60 seconds * 1000 milliseconds)
route.get("/fetch", async (req, res) => {
    try {
        const fileData = fs.readFileSync("../../top-gainers-losers.json", "utf8");
        const { topGainers, topLosers } = JSON.parse(fileData);
        res.json({ TopGainers: topGainers, TopLossers: topLosers });
    }
    catch (error) {
        res.json({ Error: error });
        throw error;
    }
});
exports.default = route;
//# sourceMappingURL=frontPage.js.map