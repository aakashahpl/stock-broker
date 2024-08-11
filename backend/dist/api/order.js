"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../model/user"));
const auth_1 = __importDefault(require("../middleware/auth"));
const order_1 = __importDefault(require("../model/order"));
const route = express_1.default.Router();
const tickerOrder = {};
// const users: User[] = [
//     {
//         id: "1",
//         balances: {
//             GOOGLE: 10,
//             USD: 50000,
//         },
//     },
//     {
//         id: "2",
//         balances: {
//             GOOGLE: 10,
//             USD: 50000,
//         },
//     },
// ];
// const asks: Order[] = [];
const flipBalance = async (userId1, userId2, quantity, price, ticker) => {
    try {
        let user1 = await user_1.default.findById(userId1);
        let user2 = await user_1.default.findById(userId2);
        if (!user1 || !user2) {
            console.log("user1 or user2 not present");
            return;
        }
        user1.balances[ticker] -= quantity;
        user2.balances[ticker] += quantity;
        user1.balances["USD"] += quantity * price;
        user2.balances["USD"] -= quantity * price;
        await user1.save();
        await user2.save();
    }
    catch (error) {
        console.error("Error flipping balances:", error);
    }
};
const fillOrders = (side, price, quantity, userId, ticker) => {
    try {
        let remainingQty = quantity;
        if (side === "bid") {
            const currentAsks = tickerOrder[ticker].asks; //currentAsks is in ascending order
            for (let i = 0; i < currentAsks.length - 1; i++) {
                if (currentAsks[i].price > price) {
                    break;
                }
                if (currentAsks[i].quantity > remainingQty) {
                    currentAsks[i].quantity -= remainingQty;
                    flipBalance(currentAsks[i].userId, userId, quantity, price, ticker);
                    remainingQty = 0;
                    return remainingQty;
                }
                else {
                    remainingQty -= currentAsks[i].quantity;
                    flipBalance(currentAsks[i].userId, userId, quantity, price, ticker);
                    currentAsks.shift();
                }
            }
            return remainingQty;
        }
        else {
            const currentBids = tickerOrder[ticker].bids; //currentBids is in descending order
            for (let i = 0; i < currentBids.length; i++) {
                if (price > currentBids[i].price) {
                    break;
                }
                if (currentBids[i].quantity > remainingQty) {
                    currentBids[i].quantity -= remainingQty;
                    flipBalance(userId, currentBids[i].userId, quantity, price, ticker);
                    return 0;
                }
                else {
                    remainingQty -= currentBids[i].quantity;
                    flipBalance(userId, currentBids[i].userId, quantity, price, ticker);
                    currentBids.shift();
                }
            }
            return remainingQty;
        }
    }
    catch (error) {
        console.log(error);
        return 0;
    }
};
route.post("/place-order", auth_1.default, (req, res) => {
    const side = req.body.side;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const userId = req.user.user._id;
    const ticker = req.body.ticker;
    if (!tickerOrder[ticker]) {
        // If ticker does not exist, create a new entry with default values
        tickerOrder[ticker] = {
            bids: [],
            asks: [],
        };
    }
    const remainingQty = fillOrders(side, price, quantity, userId, ticker);
    if (remainingQty == 0) {
        res.json({ filledQuantity: quantity });
        return;
    }
    if (side === "bid") {
        tickerOrder[ticker].bids.push({
            userId,
            price,
            quantity: remainingQty,
        });
        tickerOrder[ticker].bids.sort((a, b) => (a.price < b.price ? 1 : -1));
        console.log(tickerOrder[ticker].bids);
    }
    else {
        tickerOrder[ticker].asks.push({
            userId,
            price,
            quantity: remainingQty,
        });
        tickerOrder[ticker].asks.sort((a, b) => (a.price < b.price ? -1 : 1));
    }
    const newOrder = new order_1.default({
        stock: ticker,
        quantity: quantity,
        user: userId,
        remainingQty: remainingQty,
        price: price,
        status: remainingQty === 0 ? "complete" : "pending",
        stockName: ticker,
        type: side
    });
    newOrder.save();
    res.json({
        filledQuantity: quantity - remainingQty,
    });
});
route.get("/depth/:ticker", (req, res) => {
    const ticker = req.params.ticker;
    console.log(ticker);
    const depth = {
        bids: {},
        asks: {},
    };
    if (!tickerOrder[ticker]) {
        console.log(tickerOrder);
        return res.json({});
    }
    const tickerBids = tickerOrder[ticker].bids;
    const tickerAsks = tickerOrder[ticker].asks;
    for (let i = 0; i < tickerBids.length; i++) {
        if (!depth.bids[tickerBids[i].price]) {
            depth.bids[tickerBids[i].price] = tickerBids[i].quantity;
        }
        else {
            depth.bids.price += tickerBids[i].quantity;
        }
    }
    for (let i = 0; i < tickerAsks.length; i++) {
        if (!depth.asks[tickerAsks[i].price]) {
            depth.asks[tickerAsks[i].price] = tickerAsks[i].quantity;
        }
        else {
            depth.asks[tickerAsks[i].price] += tickerAsks[i].quantity;
        }
    }
    return res.json({
        depth,
    });
});
// route.get("/balance:userId",(req:any,res:any)=>{
//     const userId = req.params.userId;
//     const user = userModel.findById(userId);
//     if(!user){
//         return res.json({
//             USD : 0,
//             [TICKER] : 0
//         })
//     }
//     return res.json({
//         balances: user.balances
//     });
// });
exports.default = route;
//# sourceMappingURL=order.js.map