import express from 'express';
import * as Q from '../controller/questions.js'

const router = express.Router();

router.post('/addquestion', Q.addQuestion );

router.delete('/deletequestion/:id', Q.deleteQuestions );

router.put('/updatequestion/:id', Q.updateQuestion );
router.put('/upvote/:id', Q.upVote);
router.put('/downvote/:id', Q.downVote);

router.get('/getquestions', Q.getQuestions );
router.get('/getquestionbyhighvotes/:id', Q.getQuestionsByHighVotes);
router.get('/getquestion/:id', Q.getQuestionsById );
router.get('/getquestion/:name', Q.getUsersQuestions);
router.get('/getalltags', Q.getAllTags);
router.get('/getusertag/:name', Q.getUserTag);
router.get('/getuservotes/:name', Q.getUserVotes);
router.get('/getallvotes', Q.getAllVotes);
router.get('/getquestionsbytag', Q.getQuestionsByTag);
router.get('/answeredquestions', Q.answeredQuestion);
router.get('/unansweredquestions', Q.unAnsweredQuestion);
router.get('/search', Q.search);
router.get('/getfiltereduserquestions', Q.getFilteredUserQuestions);
router.get('/getallfilteredquestions', Q.getAllFilteredQuestions);

export default router;