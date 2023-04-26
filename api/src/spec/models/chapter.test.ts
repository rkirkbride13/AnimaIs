import Chapter, { IChapter } from "../../models/chapter";
import mongoose from "mongoose";
import "../mongodb_helper";

describe("Chapter", () => {
  let chapter: IChapter;
  beforeEach(async () => {
    await mongoose.connection.collections.chapters.drop();
    chapter = await Chapter.create({
      user_id: "640336eb9e363bc491c41921",
      title: "The Dog",
      content: ["The dog is humankinds best friend"],
    });
  });

  it("should create an chapter", () => {
    expect(chapter.user_id).toEqual("640336eb9e363bc491c41921");
    expect(chapter.title).toEqual("The Dog");
    expect(chapter.content).toEqual(["The dog is humankinds best friend"]);
  });

  it("chapters are saved to the database and can be accessed", async () => {
    const chapters = await Chapter.find();
    expect(chapters.length).toEqual(1);
    expect(chapters[0].title).toEqual("The Dog");
  });
});
