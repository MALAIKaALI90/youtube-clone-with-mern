import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id); // ✅ Get full user including _id

    if (!user) {
      throw new ApiError(401, "Invalid access token: User not found");
    }

    req.user = user; // ✅ Attach the full user object to req
    next(); // Move to the next middleware or controller
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

