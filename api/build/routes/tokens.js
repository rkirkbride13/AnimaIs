"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokens_1 = __importDefault(require("../controllers/tokens"));
const router = (0, express_1.Router)();
router.post("/", tokens_1.default.Create);
exports.default = router;
