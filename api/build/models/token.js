"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" });
const secret = process.env.JWT_SECRET;
class Token {
    static jsonwebtoken(user_id) {
        return (0, jsonwebtoken_1.sign)({ user_id: user_id, iat: Math.floor(Date.now() / 1000) }, secret);
    }
}
exports.default = Token;
