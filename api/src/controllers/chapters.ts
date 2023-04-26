import { Request, Response } from "express";
import Chapter, { IChapter } from "../models/chapter";

const ChaptersController = {
  CreateContent: async (req: Request, res: Response) => {
    const openai = connectToAPI();
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write content for a book chapter titled "The ${req.body.animal}". The book is aimed at ${req.body.age} year old children. Include a list of ${req.body.facts} facts.`,
      max_tokens: 2048,
      temperature: 0,
    });
    if (!req.body.animal || !req.body.age || !req.body.facts) {
      return res.status(400).json({ message: "Missing input fields" });
    }

    const content: string = response.data.choices[0].text;
    const title: string = `The ${req.body.animal}`;
    const user_id: string = req.body.user_id;

    const chapter: IChapter = new Chapter({ user_id, title });
    const chapter_id = chapter._id.toString();
    try {
      await chapter.save();
      await Chapter.findOneAndUpdate(
        { _id: chapter_id },
        { $addToSet: { content: content } }
      );
      res.status(200).json({ message: "OK" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Chapter not created" });
    }
  },
  FindByUser: async (req: Request, res: Response) => {
    try {
      const chapters = await Chapter.find({ user_id: req.body.user_id });
      res.status(200).json({ chapters });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Chapters not found" });
    }
  },
  DeleteChapter: async (req: Request, res: Response) => {
    try {
      await Chapter.findOneAndDelete({ _id: req.get("chapter_id") });
      res.status(200).json({ message: "DELETED" });
    } catch (err) {
      res.status(400).json({ message: "Chapter not deleted" });
    }
  },
  UpdateChapter: async (req: Request, res: Response) => {
    const openai = connectToAPI();
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Continue writing this chapter: ${req.body.content}`,
      max_tokens: 2048,
      temperature: 0,
    });

    const content: string = response.data.choices[0].text;
    try {
      await Chapter.updateOne(
        { _id: req.get("chapter_id") },
        { $addToSet: { content: content } }
      );
      res.status(200).json({ message: "UPDATED" });
    } catch (error) {
      res.status(400).json({ message: "Chapter not updated" });
    }
  },
};

const connectToAPI = () => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return new OpenAIApi(configuration);
};

export default ChaptersController;
