import express from "express";
import {
  signup,
  login,
  refreshTokenController,
  logout,
} from "../controller/users.js";
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshTokenController);

export default router;
