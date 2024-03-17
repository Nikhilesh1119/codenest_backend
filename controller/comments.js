import Comment from "../models/Comments.js";

export const addComment = async (req, res) => {
  const { id, comment, qid, username, name } = req.body;
  try {
    const com = await Comment.create({
      questionid: qid,
      answerid: id,
      postedId: name,
      postedBy: username,
      comment: comment,
    });
    res.status(200).json({ message: "Added Commnet Successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getComment = async (req, res) => {
  try {
    let comments = await Comment.find({
      answerid: req.params.id,
    }).populate("postedId");
    res.status(200).json(comments);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal server error");
  }
};
