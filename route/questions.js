import express from "express";
import * as Q from "../controller/questions.js";
import { fetchuser } from "../middleware/middleware.js";
const router = express.Router();

router.post("/addquestion", fetchuser, Q.addQuestion);
router.post("/getfiltereduserquestions", Q.getFilteredUserQuestions);

router.delete("/deletequestion/:id", fetchuser, Q.deleteQuestions);

router.put("/updatequestion/:id", fetchuser, Q.updateQuestion);
router.put("/upvote/:id", fetchuser, Q.upVote);
router.put("/downvote/:id", fetchuser, Q.downVote);

router.get("/getquestions", Q.getQuestions);
router.get("/getquestion/:id", Q.getQuestionsById);
router.get("/getquestionbyname/:name", Q.getUsersQuestions);
router.get("/getuservotes/:id", Q.getUserVotes);
router.get("/getallvotes", Q.getAllVotes);

export default router;
