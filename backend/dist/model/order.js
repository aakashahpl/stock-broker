"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./user"));
dotenv_1.default.config();
const orderSchema = new mongoose_1.default.Schema({
    stock: String,
    stockName: String,
    quantity: Number,
    remainingQty: Number,
    price: Number,
    date: {
        type: Date,
        default: Date.now,
    },
    status: String,
    type: String,
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: user_1.default },
});
const orderModel = mongoose_1.default.model("order", orderSchema);
exports.default = orderModel;
//# sourceMappingURL=order.js.map