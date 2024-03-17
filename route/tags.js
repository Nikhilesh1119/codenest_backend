import express from "express";
import { getTag } from "../controller/tags.js";
import { fetchuser } from "../middleware/middleware.js";
const router = express.Router();

router.get("/gettag", fetchuser, getTag);

export default router;
