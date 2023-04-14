"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const users_1 = __importDefault(require("./routes/users"));
const tokens_1 = __importDefault(require("./routes/tokens"));
const chapters_1 = __importDefault(require("./routes/chapters"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)({ path: "./config.env" });
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// token middleware
const tokenChecker = (req, res, next) => {
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader) {
        token = authHeader.slice(7);
    }
    if (token) {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.user_id = payload.user_id;
        next();
    }
    else {
        res.status(400).json({ message: "Auth error" });
    }
};
// App routes
app.use("/users", users_1.default);
app.use("/tokens", tokens_1.default);
app.use("/chapters", tokenChecker, chapters_1.default);
