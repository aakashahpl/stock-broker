"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./db"));
const frontPage_1 = __importDefault(require("./api/frontPage"));
const user_1 = __importDefault(require("./api/user"));
const order_1 = __importDefault(require("./api/order"));
const news_1 = __importDefault(require("./api/news"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
const corsOptions = {
    origin: 'https://stock-broker-tau.vercel.app', // specify the exact origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // allow credentials (cookies, authorization headers, etc.)
};
app.use((0, cors_1.default)(corsOptions));
// app.use(cors({
//     origin: '*',
//     credentials: true
//   }));
app.use("/frontPage", frontPage_1.default);
app.use("/user", user_1.default);
app.use("/order", order_1.default);
app.use("/news", news_1.default);
app.use("/test", (req, res) => {
    res.send("api working correctly");
});
(0, db_1.default)();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on Port ${PORT}`);
});
//# sourceMappingURL=index.js.map