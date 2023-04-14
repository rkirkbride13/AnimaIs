"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapters_1 = __importDefault(require("../controllers/chapters"));
const router = (0, express_1.Router)();
router.post("/", chapters_1.default.CreateContent);
router.get("/", chapters_1.default.FindByUser);
router.delete("/", chapters_1.default.DeleteChapter);
router.patch("/", chapters_1.default.UpdateChapter);
exports.default = router;
