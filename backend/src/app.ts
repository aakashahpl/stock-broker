import express from "express";
import bodyParser from "body-parser";
import connectToDB from "./db";
import route1 from "./api/frontPage";
import userRoute from "./api/user";
import cors from "cors";

import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(cors());
app.use("/frontPage",route1);
app.use("/user",userRoute);

connectToDB();
const PORT = process.env.PORT||3001;
app.listen(PORT,()=>{
    console.log(`server is running on Port ${PORT}`);
}) 