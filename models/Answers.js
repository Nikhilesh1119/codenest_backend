import mongoose from "mongoose";

const AnswerSchema = mongoose.Schema({
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    },
    answer:{
        type:String,
        required:true
    },
    postedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    postedBy: {
        type: String,
        required: true
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
    date:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model('answer', AnswerSchema);
