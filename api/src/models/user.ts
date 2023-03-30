import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true } as any,
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  } as any,
  password: { type: String, required: true } as any,
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
