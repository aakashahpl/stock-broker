import express from "express";
import mongoose from "mongoose";
import userModel from "../model/user";
import verifyToken from "../middleware/auth";
import orderModel from "../model/order";

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

const flipBalance = async (
  userId1: string,
  userId2: string,
  quantity: number,
  price: number,
  ticker: string
) => {
  try {
    let user1 = await userModel.findById(userId1);
    let user2 = await userModel.findById(userId2);

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
  } catch (error) {
    console.error("Error flipping balances:", error);
  }
};

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
        } else {
          remainingQty -= currentAsks[i].quantity;
          flipBalance(currentAsks[i].userId, userId, quantity, price, ticker);
          currentAsks.shift();
        }
      }
      return remainingQty;
    } else {
      const currentBids = tickerOrder[ticker].bids; //currentBids is in descending order
      for (let i = 0; i < currentBids.length; i++) {
        if (price > currentBids[i].price) {
          break;
        }
        if (currentBids[i].quantity > remainingQty) {
          currentBids[i].quantity -= remainingQty;
          flipBalance(userId, currentBids[i].userId, quantity, price, ticker);
          return 0;
        } else {
          remainingQty -= currentBids[i].quantity;
          flipBalance(userId, currentBids[i].userId, quantity, price, ticker);
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

route.post("/place-order", verifyToken, (req: any, res: any) => {
  const side: string = req.body.side;
  const price: number = req.body.price;
  const quantity: number = req.body.quantity;
  const userId: string = req.user.user._id;
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
  const newOrder = new orderModel({
    stock: ticker,
    quantity : quantity,
    user:userId,
    remainingQty:remainingQty,
    price:price,
    status:remainingQty===0?"complete":"pending",
    stockName:ticker,
    type:side

  });
  newOrder.save();
  res.json({
    filledQuantity: quantity - remainingQty,
  });
});

route.get("/depth/:ticker", (req: any, res: any) => {
  const ticker: string = req.params.ticker;
  console.log(ticker);
  const depth: {
    bids: {
      [price: string]: number;
    };
    asks: {
      [price: string]: number;
    };
  } = {
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
    } else {
      depth.bids.price += tickerBids[i].quantity;
    }
  }
  for (let i = 0; i < tickerAsks.length; i++) {
    if (!depth.asks[tickerAsks[i].price]) {
      depth.asks[tickerAsks[i].price] = tickerAsks[i].quantity;
    } else {
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

export default route;
