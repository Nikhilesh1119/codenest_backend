import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Question from "../models/Questions.js";
import Answer from "../models/Answers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {LocalStorage }from "node-localstorage" ;
const localStorage = new LocalStorage('./scratch');

export const signup = async (req, res) => {
  try {
    let user = await Admin.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry a user with this email already exist" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    user = await Admin.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const data = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    localStorage.setItem("token", authtoken);
    localStorage.setItem("username", req.body.username);
    res.status(200).json({ success: authtoken, username: req.body.username });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const noOfUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users.length);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const noOfQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions.length);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const noOfAnswer = async (req, res) => {
  try {
    const answer = await Answer.find();
    res.status(200).json(answer.length);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const noOfAccept = async (req, res) => {
  try {
    const answer = await Answer.find({ status: "Accepted" });
    res.status(200).json(answer.length);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    User.findByIdAndRemove(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully deleted user");
      }
    });
    res.status(200).json({ status: "deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndRemove(req.params.id, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
        await Answer.deleteMany({ questionid: req.params.id }, (err, data) => {
          if (err) {
            console.log(err);
            console.log("Not deleted Answers");
          } else {
            console.log("All answers are deleted");
          }
        });
      }
    });
    res.status(200).json({ status: "deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    Answer.findByIdAndRemove(req.params.id, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
      }
    });
    res.status(200).json({ status: "deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getQuestionsByMonth = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $match: { date: { $exists: true } },
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};

export const getQuestionsByYear = async (req, res) => {
  try {
    const questions = await Question.aggregate([
      {
        $match: { date: { $exists: true } },
      },
      {
        $group: {
          _id: { $year: "$date" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("internel server error");
  }
};
