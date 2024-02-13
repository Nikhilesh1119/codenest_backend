import express from 'express';
import * as A from '../controller/answers.js'
import { fetchuser } from '../middleware/middleware.js';

const router = express.Router();

router.post('/addanswer/:id',fetchuser, A.addAnswer);

router.get('/getanswer', A.getAnswer);
router.get('/getanswer/:id',A.getAnswerById);
router.get('/answertoupdate/:id',A.userAnswerToUpdate);
router.get('/useranswer/:username',A.getUserAnswer);
router.get('/userfilteredanswer/:username',A.userFilteredAnswer);
router.get('/allfilteredanswer',A.allFilteredAnswer);
router.get('/allansweredtags',A.allAnswersTags);
router.get('/useransweredtags',A.userAnswersTags);
router.get('/useransweredquestions',A.userAnsweredQuestions);
router.get('useracceptedansweredquestions',A.userAcceptedAnsweredQuestions);
router.get('/totalanswer',A.noOfAnswer);
router.get('/getvotes',A.getVotes);
router.get('/points',A.points);

router.put('/updateanswer/:id', A.updatedAnswer);
router.put('/upvote',A.upVote);
router.put('/downvote',A.downVote);
router.put('/acceptanswer',A.acceptAnswer);

router.delete('/answers/:id', A.deleteAnswer);

export default router;