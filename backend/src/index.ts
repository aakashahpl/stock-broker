import express from "express";
import bodyParser from "body-parser";
import connectToDB from "./db";
import route1 from "./api/stock";
import userRoute from "./api/user";
import orderRoute from "./api/order";
import newsRoute from "./api/news"
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Get port from command line arguments if provided
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const PORT = portArg ? portArg.split('=')[1] : process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// CORS configuration to accept requests from any origin
app.use(cors({
    origin: 'https://stock-broker-tau.vercel.app/',  // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // allow credentials (cookies, authorization headers, etc.)
}));

app.use("/stock", route1);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/news", newsRoute);
app.use("/test", (req, res) => {
    res.send("api working correctly");
});

connectToDB();

app.listen(PORT, () => {
    console.log(`server is running on Port ${PORT}`);
});