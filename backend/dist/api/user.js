"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../model/user"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const user_2 = __importDefault(require("../model/user"));
const order_1 = __importDefault(require("../model/order"));
const axios_1 = __importDefault(require("axios"));
const Router = express_1.default.Router();
Router.get("/balance", auth_1.default, async (req, res) => {
    try {
        // console.log("inside balance get");
        const cookies = req.cookies.authorization;
        console.log(cookies);
        const userId = req.user.user._id;
        const user = await user_2.default.findById(userId);
        console.log(user.balances);
        const responseData = { balance: user.balances };
        const symbols = Object.keys(user.balances.stocks).join(",");
        const apiUrl = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${process.env.TWELVE_DATA_KEY}`;
        const batchSymbolresponse = await axios_1.default.get(apiUrl);
        const userStockDetails = batchSymbolresponse.data;
        responseData.userStockDetails = userStockDetails;
        console.log(responseData);
        return res.status(200).json(responseData);
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
Router.get("/order", auth_1.default, async (req, res) => {
    try {
        // console.log("inside balance get");
        // const cookies = req.cookies.authorization;
        // console.log(cookies);
        const userId = req.user.user._id;
        console.log(userId);
        const orders = await order_1.default.find({ user: userId });
        console.log(orders);
        return res.status(200).json({
            success: true,
            orders: orders,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
Router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        await user_1.default.register({ username: req.body.username }, req.body.password);
        passport_1.default.authenticate("local")(req, res, () => {
            //secret cannot be undefined
            if (!process.env.ACCESS_TOKEN_SECRET) {
                throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined.");
            }
            const accessToken = jsonwebtoken_1.default.sign({ user: req.body.email }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        });
    }
    catch (error) {
        console.log(`unable to register user : ${error.message}`);
        res.status(500);
        res.json({ error: error.message });
    }
});
Router.post("/login", async (req, res, next) => {
    try {
        const userVariable = new user_1.default({
            username: req.body.username,
            password: req.body.password,
        });
        passport_1.default.authenticate("local", (err, user, info) => {
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
            const accessToken = jsonwebtoken_1.default.sign({ user: { _id, username } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" } // Token expires in 24 hours
            );
            // ✅ Set HTTP-only cookie on successful login
            res.cookie("authorization", accessToken, {
                httpOnly: true, // Prevent JavaScript access (XSS protection)
                secure: true, // Send only over HTTPS
                sameSite: "none", // Allow cross-origin requests
                path: "/", // Available across the entire site
                domain: ".zenith-broker.vercel.app", // Specify the domain (subdomains included)
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expiration (24 hours)
            });
            res.json({ message: "Login successful" });
        })(req, res);
    }
    catch (error) {
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
Router.put("/balance", auth_1.default, async (req, res) => {
    try {
        const userId = req.user.user._id;
        const updatedUser = await user_2.default.findOneAndUpdate({ _id: userId }, { balances: req.body.balances });
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "balance updated",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = Router;
//# sourceMappingURL=user.js.map