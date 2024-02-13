import express from 'express';
import { signup,getUser,getQuestions,noOfUser,noOfQuestions,noOfAnswer,noOfAccept,deleteUser,deleteQuestion,deleteAnswer,getQuestionsByMonth,getQuestionsByYear } from '../controller/admin.js';

const router = express.Router();

router.post('/signup',signup);

router.get('/users',getUser);
router.get('/questions',getQuestions);
router.get('/noOfUsers',noOfUser);
router.get('/noOfQuestions',noOfQuestions);
router.get('/noOfAnswers',noOfAnswer);
router.get('/noOfAccept',noOfAccept);
router.get('/question-by-month',getQuestionsByMonth);
router.get('/question-by-year',getQuestionsByYear);

router.delete('/deleteUser/:id',deleteUser);
router.delete('/deleteQuestion/:id',deleteQuestion);
router.delete('/deleteanswer/:id',deleteAnswer);

export default router;
