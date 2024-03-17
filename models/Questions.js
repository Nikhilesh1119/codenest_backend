import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:true
  },
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

export default mongoose.model("question", QuestionSchema);
