import express from "express";
import cors from "cors";
import { configDB } from "./config/configDB.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

import tagRouter from "./route/tags.js";
import commentRouter from "./route/comments.js";
import userRouter from "./route/users.js";
import questionRouter from "./route/questions.js";
import answerRouter from "./route/answers.js";

const origin = "http://localhost:3000";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin,
  })
);
app.use(cookieParser());

app.use("/api/tag", tagRouter);
app.use("/api/comment", commentRouter);
app.use("/api/user", userRouter);
app.use("/api/question", questionRouter);
app.use("/api/answer", answerRouter);

app.get("/", (req, res) => {
  res.send("This is a stack CODENEST Project by Nikhilesh Chouhan");
});

app.listen(process.env.PORT, () => {
  configDB();
  console.log(`Server running on port ${process.env.PORT}`);
});
