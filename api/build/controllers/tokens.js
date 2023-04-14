"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../models/token"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const TokensController = {
    Create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            res.status(401).json({ message: "auth error - user does not exist" });
            return;
        }
        const match = yield bcrypt_1.default
            .compare(password, user.password)
            .catch((error) => console.error(error));
        if (!match) {
            res.status(401).json({ message: "auth error - passwords do not match" });
        }
        else {
            const token = yield token_1.default.jsonwebtoken(user.id);
            res.status(200).json({ token: token, message: "OK" });
        }
    }),
};
exports.default = TokensController;
