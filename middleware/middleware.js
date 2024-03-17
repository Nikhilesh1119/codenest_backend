import { error } from "../utils/responseWrapper.js";
import jwt from "jsonwebtoken";
import User from "../models//User.js";
import "dotenv/config";

export const fetchuser = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization?.startsWith("Bearer ")
  ) {
    return res.send(error(401, "authentication header is required"));
  }
  const accesstoken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accesstoken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;
    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "user not found"));
    }
    next();
  } catch (e) {
    return res.send(error(401, "invalid access token"));
  }
};
