import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    },
    answerid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'answer'
    },
    postedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    postedBy: {
        type: String,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now()
    },
})

export default mongoose.model('comment', CommentSchema);
