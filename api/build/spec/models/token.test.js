"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = __importDefault(require("../../models/token"));
describe("Token", () => {
    it("returns a token containing the user_id", () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2023, 2, 3, 11, 37, 0)));
        const user_id = "123abc";
        const token = token_1.default.jsonwebtoken(user_id);
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        expect(payload).toEqual({ iat: 1677843420, user_id: "123abc" });
    });
});
