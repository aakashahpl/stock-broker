import express from "express";
import mongoose from "mongoose";
import userModel from "../model/user";
import verifyToken from "../middleware/auth";

const route = express.Router();

interface Balances {
    [key: string]: number;
}

interface User {
    id: string;
    balances: Balances;
}

interface Order {
    userId: string;
    price: number;
    quantity: number;
}

interface TickerOrders {
    [ticker: string]: {
        bids: Order[];
        asks: Order[];
    };
}

const tickerOrder: TickerOrders = {};
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

const fillOrders = (
    side: string,
    price: number,
    quantity: number,
    userId: string,
    ticker: string
): number => {
    try {
        let remainingQty = quantity;
        if (side === "bid") {
            const currentAsks = tickerOrder[ticker].asks;
            for (let i = 0; i < currentAsks.length - 1; i++) {
                if (currentAsks[i].price > price) {
                    break;
                }
                if (currentAsks[i].quantity > remainingQty) {
                    currentAsks[i].quantity -= remainingQty;
                    // flipBalance();
                    remainingQty = 0;
                    return remainingQty;
                } else {
                    remainingQty -= currentAsks[i].quantity;
                    // flipBalance();
                    currentAsks.shift();
                }
            }
            return remainingQty;
        } else {
            const currentBids = tickerOrder[ticker].bids;
            for (let i = 0; i<currentBids.length; i++) {
                if (price > currentBids[i].price) {
                    break;
                }
                if (currentBids[i].quantity > remainingQty) {
                    currentBids[i].quantity -= remainingQty;
                    // flipBalance();
                    return 0;
                } else {
                    remainingQty -= currentBids[i].quantity;
                    // flipBalance();
                    currentBids.shift();
                }
            }
            return remainingQty;
        }
    } catch (error: any) {
        console.log(error);
        return 0;
    }
   
};

route.post("/place", verifyToken, (req: any, res: any) => {
    const side: string = req.body.side;
    const price: number = req.body.price;
    const quantity: number = req.body.quantity;
    const userId: string = req.user._id;
    const ticker: string = req.body.ticker;

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
    } else {
        tickerOrder[ticker].asks.push({
            userId,
            price,
            quantity: remainingQty,
        });
        tickerOrder[ticker].asks.sort((a, b) => (a.price < b.price ? -1 : 1));
    }
    res.json({
        filledQuantity: quantity - remainingQty,
    });
});

route.get("/depth/:ticker", (req: any, res: any) => {
    const ticker: string = req.query.ticker;
    const depth: {
        [price: string]: {
            type: "bid" | "ask";
            quantity: number;
        };
    } = {};
    const tickerBids = tickerOrder[ticker].bids;
    const tickerAsks = tickerOrder[ticker].asks;

    for (let i = 0; i < tickerBids.length; i++) {
        if (!depth[tickerBids[i].price]) {
            depth[tickerBids[i].price] = {
                quantity: tickerBids[i].quantity,
                type: "bid",
            };
        } else {
            depth[tickerBids[i].price].quantity += tickerBids[i].quantity;
        }

        if (!depth[tickerAsks[i].price]) {
            depth[tickerAsks[i].price] = {
                quantity: tickerAsks[i].quantity,
                type: "ask",
            };
        } else {
            depth[tickerAsks[i].price].quantity += tickerAsks[i].quantity;
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

export default route;
