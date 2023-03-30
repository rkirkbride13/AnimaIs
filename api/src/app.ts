import express, { Express } from "express";
import cors from "cors";
import { config } from "dotenv";
import usersRouter from "./routes/users";

config({ path: "./config.env" });
const app: Express = express();
app.use(cors());
app.use(express.json());

// App routes
app.use("/users", usersRouter);

export { app };
