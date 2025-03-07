import express from "express";
import bodyParser from "body-parser";
import connectToDB from "./db";
import route1 from "./api/frontPage";
import userRoute from "./api/user";
import orderRoute from "./api/order";
import newsRoute from "./api/news"
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

const corsOptions = {
  origin: 'https://stock-broker-tau.vercel.app', 
  // origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

// app.use(cors({
//     origin: '*',
//     credentials: true
//   }));


app.use("/frontPage",route1);
app.use("/user",userRoute);
app.use("/order",orderRoute);
app.use("/news",newsRoute);
app.use("/test",(req,res)=>{
  res.send("api working correctly");
})

connectToDB();
const PORT = process.env.PORT||3001;
app.listen(PORT,()=>{
    console.log(`server is running on Port ${PORT}`);
}) 

