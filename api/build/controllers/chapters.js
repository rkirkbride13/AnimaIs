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
const chapter_1 = __importDefault(require("../models/chapter"));
const ChaptersController = {
    CreateContent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const openai = connectToAPI();
        const response = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Write content for a book chapter titled "The ${req.body.animal}". The book is aimed at ${req.body.age} year old children. Include a list of ${req.body.facts} facts.`,
            max_tokens: 2048,
            temperature: 0,
        });
        if (!req.body.animal || !req.body.age || !req.body.facts) {
            return res.status(400).json({ message: "Missing input fields" });
        }
        const content = response.data.choices[0].text;
        const title = `The ${req.body.animal}`;
        const user_id = req.body.user_id;
        const chapter = new chapter_1.default({ user_id, title });
        const chapter_id = chapter._id.toString();
        try {
            yield chapter.save();
            yield chapter_1.default.findOneAndUpdate({ _id: chapter_id }, { $addToSet: { content: content } });
            res.status(200).json({ message: "OK" });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ message: "Chapter not created" });
        }
    }),
    FindByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chapters = yield chapter_1.default.find({ user_id: req.body.user_id });
            res.status(200).json({ chapters });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ message: "Chapters not found" });
        }
    }),
    DeleteChapter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield chapter_1.default.findOneAndDelete({ _id: req.get("chapter_id") });
            res.status(200).json({ message: "DELETED" });
        }
        catch (err) {
            res.status(400).json({ message: "Chapter not deleted" });
        }
    }),
    UpdateChapter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const openai = connectToAPI();
        const response = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Continue writing this chapter: ${req.body.content}`,
            max_tokens: 2048,
            temperature: 0,
        });
        const content = response.data.choices[0].text;
        try {
            yield chapter_1.default.updateOne({ _id: req.get("chapter_id") }, { $addToSet: { content: content } });
            res.status(200).json({ message: "UPDATED" });
        }
        catch (error) {
            res.status(400).json({ message: "Chapter not updated" });
        }
    }),
};
const connectToAPI = () => {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    return new OpenAIApi(configuration);
};
exports.default = ChaptersController;
