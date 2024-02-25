import express from "express";
import mongoose from "mongoose";
import userModel from "../model/user";

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

export const TICKER = "GOOGLE";

const users: User[] = [
    {
        id: "1",
        balances: {
            GOOGLE: 10,
            USD: 50000,
        },
    },
    {
        id: "2",
        balances: {
            GOOGLE: 10,
            USD: 50000,
        },
    },
];

const bids: Order[] = [];
const asks: Order[] = [];

route.post("/order", (req: any, res: any) => {
    const side: string = req.body.side;
    const price: number = req.body.price;
    const quantity: number = req.body.quantity;
    const userId: string = req.body.userId;

    const remainingQty = fillOrders(side, price, quantity, userId);

    if (remainingQty == 0) {
        res.json({ filledQuantity: quantity });
        return;
    }
    if (side == "bid") {
        bids.push({
            userId,
            price,
            quantity: remainingQty,
        });
        bids.sort((a, b) => (a.price < b.price ? 1 : -1));
    } else {
        asks.push({
            userId,
            price,
            quantity: remainingQty,
        });
        asks.sort((a, b) => (a.price < b.price ? -1 : 1));
    }
    res.json({
        filledQuantity: quantity - remainingQty,
    });
});

route.get("/depth", (req: any, res: any) => {
    const depth: {
        [price: string]: {
            type: "bid" | "ask";
            quantity: number;
        };
    } = {};
    for (let i = 0; i < bids.length; i++) {
        if (!depth[bids[i].price]) {
            depth[bids[i].price] = {
                quantity: bids[i].quantity,
                type: "bid",
            };
        } else {
            depth[bids[i].price].quantity += bids[i].quantity;
        }

        if (!depth[asks[i].price]) {
            depth[asks[i].price] = {
                quantity = asks[i].quantity,
                type: "ask",
            };
        }
        else{
            depth[bids[i].price].quantity +=asks[i].quantity;
        }
    }
    return res.json({
        depth
    })
});

route.get("/balance:userId",(req:any,res:any)=>{
    const userId = req.params.userId;
    const user = userModel.findById(userId);
    if(!user){
        return res.json({
            USD : 0,
            [TICKER] : 0
        })
    }
    return res.json({
        balances: user.balances
    });
});

export default route;
