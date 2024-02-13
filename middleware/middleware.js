// const LocalStorage = require('node-localStorage').LocalStorage;
// var localStorage = new LocalStorage('./scratch');
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const fetchuser = (req, res, next) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate using a valid token" });
  }
};
