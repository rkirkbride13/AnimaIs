import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import usersRouter from "./routes/users";
import tokensRouter from "./routes/tokens";
import chaptersRouter from "./routes/chapters";
import JWT, { JwtPayload } from "jsonwebtoken";

config({ path: "./config.env" });
const app: Express = express();
app.use(cors());
app.use(express.json());

// token middleware
const tokenChecker = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  const authHeader = req.get("Authorization");

  if (authHeader) {
    token = authHeader.slice(7);
  }
  
  if (token) {
    const payload = JWT.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    req.body.user_id = payload.user_id
    next()
  } else {
    res.status(400).json({ message: "Auth error" })
  }
};

// App routes
app.use("/users", usersRouter);
app.use("/tokens", tokensRouter);
app.use("/chapters", tokenChecker, chaptersRouter);

export { app };
