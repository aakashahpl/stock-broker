import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const route = express.Router();


const alphavantageKey:string|undefined = process.env.ALPHA_VANTAGE_KEY;
const twelvedataKey:string|undefined = process.env.TWELVE_DATA_KEY;
if(!alphavantageKey||!twelvedataKey){
    console.log("Please enter correct api keys in .env file");
}
route.get("/fetch",async (req,res)=>{
    try {

        // const response1 = await axios.get(
           
        //     `https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI&interval=1day&apikey=${twelvedataKey}`
        // );
        const response2 = await axios.get(
            `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo`
        );
        

        // const indexesData = response1.data;
        const topGainers = response2.data.top_gainers;
        const topLosers = response2.data.top_losers;
        res.json({TopGainers:topGainers,TopLossers:topLosers});
        
        
    } catch (error:any) {
        res.json({"Error": error});
        throw error;
    }
})

export default route;