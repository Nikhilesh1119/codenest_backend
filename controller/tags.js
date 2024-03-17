import Tags from "../models/Tags.js";
import { error, success } from "../utils/responseWrapper.js";

export const getTag = async (req, res) => {
  try {
    let tags = await Tags.find();
    res.status(200).json(tags);
  } catch (e) {
    // console.log(e.message);
    return res.send(error(400, e.message));
  }
};
