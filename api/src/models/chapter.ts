import mongoose, { Schema, Document } from "mongoose";

export interface IChapter extends Document {
  user_id: string;
  title: string;
  content: Array<string>;
}

const ChapterSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: Array, default: [] },
});

const Chapter = mongoose.model<IChapter>("Chapter", ChapterSchema);

export default Chapter;
