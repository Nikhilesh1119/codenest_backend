import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { success, error } from "../utils/responseWrapper.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.send(error(400, "all fields are required"));
    }
    let olduser = await User.findOne({ email });
    if (olduser) {
      return res.send(error(409, "User already exists"));
    }
    olduser = await User.findOne({ username });
    if (olduser) {
      return res.send(
        error(409, "Sorry a user with this username already exist")
      );
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.send(success(200, "user created successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(400, "all fields are required"));
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.send(error(404, "user not found"));
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.send(error(403, "incorrect password"));
    }
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.send(
      success(200, { accessToken, user: user.username, userid: user._id })
    );
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: true });
    return res.send(success(200, "logged out successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

export const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401, "refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    console.log(e.message);
    return res.send(error(401, "Invalid access token"));
  }
};

//internal method
export const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "365d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
