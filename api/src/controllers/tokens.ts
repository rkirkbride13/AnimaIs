import { Request, Response } from "express";
import Token from "../models/token";
import User from "../models/user";
import bcrypt from "bcrypt";

const TokensController = {
  Create: async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "auth error - user does not exist" });
      return;
    }
    const match = await bcrypt
      .compare(password, user.password)
      .catch((error) => console.error(error));
    if (!match) {
      res.status(401).json({ message: "auth error - passwords do not match" });
    } else {
      const token = await Token.jsonwebtoken(user.id);
      res.status(200).json({ token: token, message: "OK" });
    }
  },
};

export default TokensController;
