import User from "../models/User.js";
import Question from "../models/Questions.js";
import Answer from "../models/Answers.js";
import { success, error } from "../utils/responseWrapper.js";

export const addQuestion = async (req, res) => {
  const { title, question, tags, username } = req.body;
  try {
    let quest = await Question.create({
      user: req._id,
      title: title,
      question: question,
      tags: tags,
      postedBy: username,
      votes: [],
    });
    return res.send(success(200, "question added successfully"));
  } catch (e) {
    console.log(e);
    return res.send(error(e.message));
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("user");
    res.status(200).json(questions.reverse());
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
};

export const getQuestionsByHighVotes = async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ votes: -1 });
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
};

export const getQuestionsById = async (req, res) => {
  try {
    let question = await Question.findOne({ _id: req.params.id });
    if (!question) {
      return res.status(404).send("Question not Found");
    }
    res.status(200).json(question);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { title, question, tags } = req.body;
    const newquestion = {};
    newquestion.title = title;
    newquestion.question = question;
    newquestion.tags = tags;
    await Question.findByIdAndUpdate(
      req.params.id,
      { $set: newquestion },
      { new: true }
    );
    res.status(200).json({ status: "Question updated " });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

export const deleteQuestions = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    await Answer.deleteMany({ questionid: req.params.id });
    res.status(200).json({ status: "question deleted" });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

export const getUsersQuestions = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.name });
    const questions = await Question.find({ user: user._id });
    if (!questions) {
      return res.status(404).send("Question not Found");
    }
    res.status(200).json(questions);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

export const upVote = async (req, res) => {
  try {
    const curUser = req._id;
    const question = await Question.findById(req.params.id).populate("user");
    if (question.downvotes.includes(curUser)) {
      const index = question.downvotes.indexOf(curUser);
      question.downvotes.splice(index, 1);
      question.upvotes.push(curUser);
      await question.save();
      res.status(200).json({ status: "upvoted" });
    } else if (question.upvotes.includes(curUser)) {
      const index = question.upvotes.indexOf(curUser);
      question.upvotes.splice(index, 1);
      await question.save();
      res.status(200).json({ status: "upvote removed" });
    } else {
      question.upvotes.push(curUser);
      await question.save();
      res.status(200).json({ status: "upvoted" });
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const downVote = async (req, res) => {
  try {
    const curUser = req._id;
    const question = await Question.findById(req.params.id).populate("user");
    if (question.upvotes.includes(curUser)) {
      const index = question.upvotes.indexOf(curUser);
      question.upvotes.splice(index, 1);
      question.downvotes.push(curUser);
      await question.save();
      res.status(200).json({ status: "downvoted" });
    } else if (question.downvotes.includes(curUser)) {
      const index = question.downvotes.indexOf(curUser);
      question.downvotes.splice(index, 1);
      await question.save();
      res.status(200).json({ status: "downvote removed" });
    } else {
      question.downvotes.push(req._id);
      await question.save();
      res.status(200).json({ status: "downvoted" });
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const getUserVotes = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question)
      res.status(200).json(question.upvotes.length - question.downvotes.length);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllVotes = async (req, res) => {
  const allQuestion = await Question.find();
  const vote = {};
  allQuestion.map((e) => {
    vote[e._id] = e.upvotes.length - e.downvotes.length;
  });
  res.status(200).json(vote);
};

export const getQuestionsByTag = async (req, res) => {
  const questions = await Question.find();
  const questionsPertag = [];
  questions.map((que) => {
    que.tags.split(" ").map((tag) => {
      if (tag.toLowerCase() === req.params.name) {
        questionsPertag.push(que);
      }
    });
  });
  res.status(200).json(questionsPertag);
};

export const getFilteredUserQuestions = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    let user = await User.findOne({ username: req.body.username });
    const questions = await Question.find({ user: user._id });
    if (!questions) {
      return res.status(404).send("Question not Found");
    }
    const afterDateapplied = [];
    questions.map((que) => {
      const year = que.date.getUTCFullYear();
      var month = que.date.getUTCMonth() + 1;
      var day = que.date.getUTCDate();
      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;
      const date = year + "-" + month + "-" + day;
      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(que);
      }
    });
    res.status(200).json(afterDateapplied);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};
