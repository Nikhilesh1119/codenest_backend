import User from "../models/User.js";
import Question from "../models/Questions.js";
import Answer from "../models/Answers.js";
import {LocalStorage} from "node-localstorage" ;
const localStorage = new LocalStorage('./scratch');

export const addAnswer = async (req, res) => {
    try {
        let newanswer = await Answer.create({
            questionid: req.params.id,
            answer: req.body.answer,
            postedId: req.user.id,
            postedBy: req.user.username,
            votes: 0
        })
        res.status(200).json({ "Success": "Added Answer Successfully", "status": true })
    }catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getAnswer = async (req, res) => {
    try {
        const answers = await Answer.find();
        if (!answers) {
            return res.status(404).send("Question not Found");
        }
        res.status(200).json(answers);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getAnswerById = async (req, res) => {
    try {
        const answers = await Answer.find({ questionid: req.params.id });
        res.status(200).json(answers);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const userAnswerToUpdate = async (req, res)=>{
    try{
        const answer = await Answer.findOne({_id: req.params.id});
        res.status(200).json(answer);
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const updatedAnswer = async (req, res)=>{
    try{
        const answer = await Answer.findByIdAndUpdate(req.params.id, {$set: {answer: req.body.answer}});
        res.status(200).json({status: "updated"});
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getUserAnswer = async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });
        if (!answers) {
            return res.status(404).send("Question not Found");
        }
        res.status(200).json(answers);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const userFilteredAnswer = async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;
        if (!answers) {
            return res.status(404).send("Answers not Found");
        }
        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();
            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;
            const date = year + "-" + month + "-" + day;
            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })
        const afterTagsapplied = [];
        const tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }
        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }
        if (statusAppiled)
            res.status(200).json(afterStatusApplied);
        else if (tagAppiled)
            res.status(200).json(afterTagsapplied);
        else {
            res.status(200).json(afterDateapplied);
        }
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const allFilteredAnswer = async (req, res) => {
    try {
        const answers = await Answer.find();
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;
        if (!answers) {
            return res.status(404).send("Answers not Found");
        }
        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();
            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;
            const date = year + "-" + month + "-" + day;
            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })
        const afterTagsapplied = [];
        var tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }
        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }
        if (statusAppiled)
            res.status(200).json(afterStatusApplied);
        else if (tagAppiled)
            res.status(200).json(afterTagsapplied);
        else {
            res.status(200).json(afterDateapplied);
        }
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const allAnswersTags = async (req, res) => {
    try {
        const answers = await Answer.find();
        const questions = [];
        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];
        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })
        res.status(200).json(tags);
    }catch (e) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const userAnswersTags = async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });
        const questions = [];
        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];
        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })
        res.status(200).json(tags);
    }catch (e) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const userAnsweredQuestions = async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });
        const questions = [];
        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        if (!questions) {
            return res.status(404).send("Question not Found");
        }
        res.status(200).json(questions);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const userAcceptedAnsweredQuestions = async (req, res) => {
    try {
        const answers = await Answer.find({ $and: [{ postedBy: req.params.username }, { status: "Accepted" }] });
        const questions = [];
        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        if (!questions) {
            return res.status(404).send("Question not Found");
        }
        res.status(200).json(questions);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const noOfAnswer = async (req, res) => {
    try {
        const answers = await Answer.find();
        let obj = {};
        answers.map(answer => {
            if (obj[answer.questionid] == null) {
                obj[answer.questionid] = 1;
            }
            else {
                obj[answer.questionid] += 1;
            }
        })
        res.status(200).json(obj);
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const upVote = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        const vote = answer["votes"] + 1;
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });
        res.status(200).json({ "status": "upvoted" });
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getVotes = async (req, res) => {
    const allAnswers = await Answer.find();
    const obj = {};
    allAnswers.map(ans => {
        obj[ans._id] = ans.votes;
    })
    res.status(200).json(obj);
}

export const downVote = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        const vote = answer["votes"] - 1;
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });
        res.status(200).json({ "status": "downvoted" });
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const acceptAnswer = async (req, res) => {
    try {
        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "status": "Accepted" } });
        res.status(200).json({ "status": "Accepted" });
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server error");
    }
}

export const points = async (req, res) => {
    try {
        let username = localStorage.getItem("username");
        let answers = await Answer.find({ $and: [{ "postedBy": username }, { "status": "Accepted" }] });
        res.status(200).json({ "points": answers.length * 5 });
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteAnswer = async(req, res)=>{
    try{
        await Answer.deleteOne({_id : req.params.id});
        res.status(200).json({"status":"deleted"})
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}
