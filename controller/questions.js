import User from "../models/User.js";
import Question from "../models/Questions.js";
import Answer from "../models/Answers.js";

export const addQuestion = async (req, res) => {
  try {
    let question = await Question.create({
      user: req.user.id,
      title: req.body.title,
      question: req.body.question,
      tags: req.body.tags,
      postedBy: req.user.username,
      votes: 0,
    });
    res.status(200).json({ Success: "Added Query Successfully", status: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
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
    let fetchquestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: newquestion },
      { new: true }
    );
    res.status(200).json({ status: "updated" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteQuestions = async (req, res) => {
  try {
    let deletequestion = await Question.findByIdAndDelete(req.params.id);
    await Answer.deleteMany({ questionid: req.params.id });
    res.status(200).json({ status: "deleted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUsersQuestions = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    const questions = await Question.find({ user: user._id });
    if (!questions) {
      return res.status(404).send("Question not Found");
    }
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllTags = async (req, res) => {
  try {
    let user = await User.find();
    const questions = await Question.find();
    const tags = [];
    questions.map((e) => {
      e.tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });
    res.status(200).json(tags);
  } catch (e) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserTag = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    const questions = await Question.find({
      user: user._id,
    });
    const tags = [];
    questions.map((que) => {
      que.tags.split(" ").map((tag) => {
        if (tags.indexOf(tag) == -1) tags.push(tag);
      });
    });
    res.status(200).json(tags);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const upVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const vote = question["votes"] + 1;
    const updatedAnswer = await Question.findByIdAndUpdate(req.params.id, {
      $set: { votes: vote },
    });
    res.status(200).json({ status: "upvoted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const downVote = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const vote = question["votes"] - 1;
    const updatedAnswer = await Question.findByIdAndUpdate(req.params.id, {
      $set: { votes: vote },
    });
    res.status(200).json({ status: "downvoted" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUserVotes = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (question) res.status(200).json(question.votes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllVotes = async (req, res) => {
  const allQuestion = await Question.find();
  const obj = {};
  allQuestion.map((e) => {
    obj[e._id] = e.votes;
  });
  res.status(200).json(obj);
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

export const answeredQuestion = async (req, res) => {
  const answers = await Answer.find();
  const questions = await Question.find();
  let ansobj = {};
  answers.map((ans) => {
    if (ansobj[ans.questionid] == null) {
      ansobj[ans.questionid] = 1;
    }
  });
  const answeredQuestion = [];
  questions.map((que) => {
    if (ansobj[que._id] === 1) {
      answeredQuestion.push(que);
    }
  });
  res.status(200).json(answeredQuestion);
};

export const unAnsweredQuestion = async (req, res) => {
  const answers = await Answer.find();
  const questions = await Question.find();
  let ansobj = {};
  answers.map((ans) => {
    if (ansobj[ans.questionid] == null) {
      ansobj[ans.questionid] = 1;
    }
  });
  const unansweredQuestion = [];
  questions.map((que) => {
    if (ansobj[que._id] == null) {
      unansweredQuestion.push(que);
    }
  });
  res.status(200).json(unansweredQuestion);
};

export const search = async (req, res) => {
  try {
    let questions = await Question.find({
      title: { $regex: req.query.keyword, $options: "i" },
    });
    if (questions.length === 0) {
      questions = await Question.find({
        tags: { $regex: req.query.keyword, $options: "i" },
      });
    }
    res.status(200).json(questions);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
};

export const getFilteredUserQuestions = async (req, res) => {
  try {
    const { startDate, endDate, tags } = req.body;
    let user = await User.findOne({ username: req.params.username });
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
    const afterTagsapplied = [];
    if (tags) {
      afterDateapplied.map((que) => {
        if (que.tags.split(" ").includes(tags)) {
          afterTagsapplied.push(que);
        }
      });
      res.status(200).json(afterTagsapplied);
    } else {
      res.status(200).json(afterDateapplied);
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllFilteredQuestions = async (req, res) => {
  try {
    const { startDate, endDate, tags } = req.body;
    let user = await User.find();
    const questions = await Question.find();
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
    const afterTagsapplied = [];
    if (tags) {
      afterDateapplied.map((que) => {
        if (que.tags.split(" ").includes(tags)) {
          afterTagsapplied.push(que);
        }
      });
      res.status(200).json(afterTagsapplied);
    } else {
      res.status(200).json(afterDateapplied);
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};
