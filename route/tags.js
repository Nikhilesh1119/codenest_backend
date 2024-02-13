import express from "express";
import {addTag,getTag,tagdesc} from '../controller/tags.js';

const router = express.Router();

router.post("/addtag", addTag);
router.get("/tagdesc/:tagname",tagdesc);
router.get("/gettag", getTag);

export default router;