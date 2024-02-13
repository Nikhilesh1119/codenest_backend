import express from 'express';
import { addComment,getComment } from '../controller/comments.js';
import {fetchuser} from '../middleware/middleware.js'
const router = express.Router();

router.post('/addcomment/:id',fetchuser,addComment);
router.get("/fetchComments",getComment);

export default router
