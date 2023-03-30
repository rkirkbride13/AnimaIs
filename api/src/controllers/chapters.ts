import { Request, Response } from "express";
import Chapter, { IChapter } from "../models/chapter";

const ChaptersController = {
  CreateContent: async (req: Request, res: Response) => {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write content for a book chapter titled" ${req.body.title}. Do not include the chapter title`,
      max_tokens: 2048,
      temperature: 0,
    });

    const content = response.data.choices[0].text;
    const title = req.body.title;
    const user_id = req.body.user_id;

    const chapter: IChapter = new Chapter({ user_id, title, content });

    try {
      await chapter.save();
      res.status(200).json({ message: "OK" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Chapter not created" });
    }
  },
};

export default ChaptersController;
