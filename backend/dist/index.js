"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./db"));
const stock_1 = __importDefault(require("./api/stock"));
const user_1 = __importDefault(require("./api/user"));
const order_1 = __importDefault(require("./api/order"));
const news_1 = __importDefault(require("./api/news"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Get port from command line arguments if provided
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const PORT = portArg ? portArg.split('=')[1] : process.env.PORT || 3001;
// Use cookieParser before bodyParser to ensure cookies are properly parsed
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // Ensure the bodyParser middleware works for JSON requests
app.use(passport_1.default.initialize());
// CORS configuration to allow specific origins and credentials (cookies)
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://stock-broker-tau.vercel.app',
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // This allows sending cookies with requests
}));
// Routes
app.use("/stock", stock_1.default);
app.use("/user", user_1.default);
app.use("/order", order_1.default);
app.use("/news", news_1.default);
// Test route for debugging (optional, can be removed once everything works)
app.use("/test", (req, res) => {
    res.send("API working correctly");
});
// Connect to the database
(0, db_1.default)();
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
//# sourceMappingURL=index.js.map