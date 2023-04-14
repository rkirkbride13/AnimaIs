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
const chapter_1 = __importDefault(require("../../models/chapter"));
const mongoose_1 = __importDefault(require("mongoose"));
require("../mongodb_helper");
describe("Chapter", () => {
    let chapter;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.collections.chapters.drop();
        chapter = yield chapter_1.default.create({
            user_id: "640336eb9e363bc491c41921",
            title: "The Dog",
            content: ["The dog is humankinds best friend"],
            image: {},
        });
    }));
    it("should create an chapter", () => {
        expect(chapter.user_id).toEqual("640336eb9e363bc491c41921");
        expect(chapter.title).toEqual("The Dog");
        expect(chapter.content).toEqual(["The dog is humankinds best friend"]);
    });
    it("chapters are saved to the database and can be accessed", () => __awaiter(void 0, void 0, void 0, function* () {
        const chapters = yield chapter_1.default.find();
        expect(chapters.length).toEqual(1);
        expect(chapters[0].title).toEqual("The Dog");
    }));
});
