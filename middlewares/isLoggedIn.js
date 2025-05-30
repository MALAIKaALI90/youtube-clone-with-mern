import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const  verifyJwt=asyncHandler(async(req,res,next)=>{
   try {
     const token= req.cookies?.AccessToken;
     if (!token) {
        throw new ApiError(501,"Unauthorized");
        
         
     }
      const decodedToken=jwt.verify(token,process.env. ACCESS_TOKEN_SECRET);
      const user=  await User.findById(decodedToken?._id).select("_password _refreshToken")
      if (!user) {
         throw new Error(401,"Envalid Acess Token");
         
         
      }
     req.user=user;
 next()
   } catch (error) {
    throw new Error(401,"invalid access token");
    
    
   }
})
