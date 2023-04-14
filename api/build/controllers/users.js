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
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UsersController = {
    Create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let encryptedPassword;
        try {
            encryptedPassword = yield bcrypt_1.default
                .genSalt(5)
                .then((salt) => bcrypt_1.default.hash(req.body.password, salt));
            yield user_1.default.create({
                name: req.body.name,
                email: req.body.email,
                password: encryptedPassword,
            });
            res.status(200).json({ message: "OK" });
        }
        catch (err) {
            res.status(400).json({ message: "Bad request - user not created" });
        }
    }),
};
exports.default = UsersController;
