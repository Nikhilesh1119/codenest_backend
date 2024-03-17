import express from "express";
import * as A from "../controller/answers.js";
import { fetchuser } from "../middleware/middleware.js";

const router = express.Router();

router.post("/addanswer/:id", fetchuser, A.addAnswer);
router.post("/userfilteredanswer", A.userFilteredAnswer);

router.put("/upvote/:id", fetchuser, A.upVote);
router.put("/downvote/:id", fetchuser, A.downVote);

router.get("/getanswer/:id", A.getAnswerById);
router.get("/useranswer/:username", A.getUserAnswer);
router.get("/totalanswer", A.noOfAnswer);
router.get("/getvotes", A.getVotes);
router.get("/getuseransvotes/:name", A.getUserAnswerVotes);
router.get("/points/:name", A.points);

router.put("/updateanswer/:id", fetchuser, A.updatedAnswer);

router.delete("/deleteanswer/:id", fetchuser, A.deleteAnswer);

export default router;
