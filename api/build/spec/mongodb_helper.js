"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
beforeAll(function (done) {
    mongoose_1.default.connect("mongodb://0.0.0.0/AnimaIs", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose_1.default.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", function () {
        done();
    });
});
afterAll(function () {
    mongoose_1.default.connection.close();
});
