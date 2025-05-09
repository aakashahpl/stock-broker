import express from "express";
import user from "../model/user";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import userModel from "../model/user";
import orderModel from "../model/order";
import axios from "axios";

const Router = express.Router();

Router.get("/balance", verifyToken, async (req: any, res: any) => {
  try {
    // console.log("inside balance get");
    const cookies = req.cookies.authorization;
    console.log(cookies);
    const userId = req.user.user._id;
    const user: any = await userModel.findById(userId);
    console.log(user.balances);
    const responseData: any = { balance: user.balances };
    const symbols = Object.keys(user.balances.stocks).join(",");
    const apiUrl = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${process.env.TWELVE_DATA_KEY}`;
    const batchSymbolresponse = await axios.get(apiUrl);
    const userStockDetails  = batchSymbolresponse.data;
    responseData.userStockDetails = userStockDetails;
    console.log(responseData);

   

    return res.status(200).json(responseData);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

Router.get("/order", verifyToken, async (req: any, res: any) => {
  try {
    // console.log("inside balance get");
    // const cookies = req.cookies.authorization;
    // console.log(cookies);
    const userId = req.user.user._id;
    console.log(userId);
    const orders: any = await orderModel.find({ user: userId });
    console.log(orders);
    return res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

Router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    await user.register({ username: req.body.username }, req.body.password);
    passport.authenticate("local")(req, res, () => {
      //secret cannot be undefined
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error(
          "ACCESS_TOKEN_SECRET environment variable is not defined."
        );
      }
      const accessToken = jwt.sign(
        { user: req.body.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken: accessToken });
    });
  } catch (error: any) {
    console.log(`unable to register user : ${error.message}`);
    res.status(500);
    res.json({ error: error.message });
  }
});

Router.post("/login", async (req, res, next) => {
  try {
    const userVariable = new user({
      username: req.body.username,
      password: req.body.password,
    });

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      
      if (!user) {
        return res.status(400).json({ message: "Incorrect username or password" });
      }

      const { _id, username } = user;
      console.log("User authenticated:", user);

      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined.");
      }

      const accessToken = jwt.sign(
        { user: { _id, username } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" } // Token expires in 24 hours
      );

      // ✅ Set HTTP-only cookie on successful login
      res.cookie("authorization", accessToken, {
        httpOnly: true, // Prevent JavaScript access (XSS protection)
        secure: true, // Send only over HTTPS
        sameSite: "none", // Allow cross-origin requests
        path: "/", // Available across the entire site
        domain: process.env.COOKIE_DOMAIN, // Specify the domain (subdomains included)
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expiration (24 hours)
      });

      res.json({ message: "Login successful" });
    })(req, res);
  } catch (error: any) {
    console.error(`Unable to login: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});


Router.get("/logout", (req, res) => {
  res.clearCookie("authorization", {
    path: "/", // Ensure it clears across all routes
    httpOnly: true,
    secure: true, // Use HTTPS in production
    sameSite: "none",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

Router.put("/balance", verifyToken, async (req: any, res: any) => {
  try {
    const userId = req.user.user._id;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { balances: req.body.balances }
    );
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "balance updated",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default Router;
