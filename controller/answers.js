import User from "../models/User.js";
import Question from "../models/Questions.js";
import Answer from "../models/Answers.js";
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage("./scratch");

export const addAnswer = async (req, res) => {
  try {
    const user = Question.findById(req.params.id);
    let newanswer = await Answer.create({
      questionid: req.params.id,
      answer: req.body.answer,
      postedId: req.body.id,
      postedBy: req.body.username,
      votes: 0,
    });
    res.status(200).json({ Success: "Added Answer Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAnswerById = async (req, res) => {
  try {
    const answers = await Answer.find({ questionid: req.params.id });
    res.status(200).json(answers);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const updatedAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, {
      $set: { answer: req.body.answer },
    });
    res.status(200).json({ status: "updated" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserAnswer = async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.params.username });
    if (!answers) {
      return res.status(404).send("Question not Found");
    }
    res.status(200).json(answers);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

export const userFilteredAnswer = async (req, res) => {
  try {
    const answers = await Answer.find({ postedBy: req.body.username });
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    if (!answers) {
      return res.status(404).send("Answers not Found");
    }
    const afterDateapplied = [];
    answers.map((ans) => {
      const year = ans.date.getUTCFullYear();
      var month = ans.date.getUTCMonth() + 1;
      var day = ans.date.getUTCDate();
      if (month >= "0" && month <= "9") month = "0" + month;
      if (day >= "0" && day <= "9") day = "0" + day;
      const date = year + "-" + month + "-" + day;
      if (date >= startDate && date <= endDate) {
        afterDateapplied.push(ans);
      }
    });
    console.log(afterDateapplied);
    res.status(200).json(afterDateapplied);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

export const noOfAnswer = async (req, res) => {
  try {
    const answers = await Answer.find();
    let obj = {};
    answers.map((answer) => {
      if (obj[answer.questionid] == null) {
        obj[answer.questionid] = 1;
      } else {
        obj[answer.questionid] += 1;
      }
    });
    res.status(200).json(obj);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const upVote = async (req, res) => {
  try {
    const curUser = req._id;
    const answer = await Answer.findById(req.params.id).populate("postedId");
    if (answer.downvotes.includes(curUser)) {
      const index = answer.downvotes.indexOf(curUser);
      answer.downvotes.splice(index, 1);
      answer.upvotes.push(curUser);
      await answer.save();
      res.status(200).json({ status: "answer upvoted" });
    } else if (answer.upvotes.includes(curUser)) {
      const index = answer.upvotes.indexOf(curUser);
      answer.upvotes.splice(index, 1);
      await answer.save();
      res.status(200).json({ status: "answer upvote removed" });
    } else {
      answer.upvotes.push(curUser);
      await answer.save();
      res.status(200).json({ status: "answer upvoted" });
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const downVote = async (req, res) => {
  try {
    const curUser = req._id;
    const answer = await Answer.findById(req.params.id).populate("postedId");
    if (answer.upvotes.includes(curUser)) {
      const index = answer.upvotes.indexOf(curUser);
      answer.upvotes.splice(index, 1);
      answer.downvotes.push(curUser);
      await answer.save();
      res.status(200).json({ status: "downvoted" });
    } else if (answer.downvotes.includes(curUser)) {
      const index = answer.downvotes.indexOf(curUser);
      answer.downvotes.splice(index, 1);
      await answer.save();
      res.status(200).json({ status: "answer downvote removed" });
    } else {
      answer.downvotes.push(curUser);
      await answer.save();
      res.status(200).json({ status: "answer downvoted" });
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

export const points = async (req, res) => {
  try {
    const name = req.params.name;
    const question = await Question.find({ postedBy: name });
    const answer = await Answer.find({ postedBy: name });
    let userpoints = 0;
    question.map((q) => {
      userpoints += q.upvotes.length * 50;
      userpoints -= q.downvotes.length * 10;
    });
    answer.map((a) => {
      userpoints += a.upvotes.length * 50;
      userpoints -= a.downvotes.length * 10;
    });
    res.status(200).json({ points: userpoints });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    await Answer.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: "deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserAnswerVotes = async (req, res) => {
  try {
    const ans = await Answer.find({ postedBy: req.params.name });
    let v = {};
    ans.map((a) => {
      v[a._id] = a.upvotes.length - a.downvotes.length;
    });
    res.status(200).json(v);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getVotes = async (req, res) => {
  const allAnswers = await Answer.find();
  const votes = {};
  allAnswers.map((ans) => {
    votes[ans._id] = ans.upvotes.length - ans.downvotes.length;
  });
  res.status(200).json(votes);
};
