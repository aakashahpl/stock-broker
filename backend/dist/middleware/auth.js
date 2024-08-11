"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.authorization || req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET environment variable is not defined.');
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        // If token is valid, attach the decoded payload to the request object
        req.user = decoded;
        next();
    });
};
exports.default = verifyToken;
//# sourceMappingURL=auth.js.map