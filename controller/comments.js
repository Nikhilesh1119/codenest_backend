import Comment from '../models/Comments.js'

export const addComment=async (req, res) => {
    try {
        let comment = await Comment.create({
            questionid: req.body.qid,
            answerid: req.params.id,
            postedId: req.user.id,
            postedBy: req.user.username,
            comment: req.body.comment
        })
        res.status(200).json({ "Success": "Added Commnet Successfully", "status": true })
    }catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getComment=async(req, res)=>{
    try{
        let comments = await Comment.find({questionid : req.body.qid, answerid:req.body.ansid});
        res.status(200).json(comments);
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal server error");
    }
}
