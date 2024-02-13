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
    votes:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:String,
        default: "Not Accepted"
    }
})

export default mongoose.model('answer', AnswerSchema);
