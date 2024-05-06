import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./user";
dotenv.config();

const orderSchema = new mongoose.Schema({
  stock: String,
  stockName: String,
  quantity: Number,
  remainingQty: Number,
  price: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  status:String,
  type:String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
