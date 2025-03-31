import express from "express";
import bodyParser from "body-parser";
import connectToDB from "./db";
import route1 from "./api/stock";
import userRoute from "./api/user";
import orderRoute from "./api/order";
import newsRoute from "./api/news";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Get port from command line arguments if provided
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const PORT = portArg ? portArg.split('=')[1] : process.env.PORT || 3001;

// Use cookieParser before bodyParser to ensure cookies are properly parsed
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Ensure the bodyParser middleware works for JSON requests
app.use(passport.initialize());

// CORS configuration to allow specific origins and credentials (cookies)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://stock-broker-tau.vercel.app',
    //   'http://localhost:3000',
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // This allows sending cookies with requests
}));

// Routes
app.use("/stock", route1);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/news", newsRoute);

// Test route for debugging (optional, can be removed once everything works)
app.use("/test", (req, res) => {
  res.send("API working correctly");
});

// Connect to the database
connectToDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
