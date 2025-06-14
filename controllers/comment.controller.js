   //coment on video
   //update coment
   //delete coment
   //get all coment of the video
import { Coment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js";

import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";

const comentOnVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {

      throw new ApiError(404, "This video does not exist");
    }

    // Create the comment
    const newComment = await Coment.create({
      content,
       videoFile:videoId,
      comentedBy: userId,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateComent=asyncHandler(async (req,res) => {
const {content}=req.body;
console.log(content);

const {comentId}=req.params;
const coment=await Coment.findById(comentId)
if (!coment) {
    return new ApiError(402,"this comnt is not exist")
    
}
const updatedComent=await Coment.findByIdAndUpdate(comentId,{
    $set:{
       content
    }
},{new:true})
return res.status(200).json(new ApiResponse(200,updatedComent,"your coment is updated successfully"))

    
})
const daleteVIdeoComent=asyncHandler(async (req,res) => {

    const {comentId}=req.params;
    console.log("commnt",comentId);
    
    const userId=req.user?._id
    console.log(userId);
    
    const coment=await Coment.findById(comentId);
    if (!coment) {
        return new ApiError(402,"this coemnt id not exist")
        
    }
//deleete which useer write this coment
if (!coment.comentedBy.equals(userId)) {
   throw new ApiError(401,"you are not author to delete this comment")
}
 await coment.deleteOne()
  return res
    .status(200)
    .json(new ApiResponse(200, "Your comment is deleted successfully"));
});

const getAllComentsVideo=asyncHandler(async (req,res) => {
    const {videoId}=req.params;
const video=await Video.findById(videoId)
if (!video) {
  return new ApiError(403,"this video is not found")

  
}
 let coments=await Coment.findById(videoId)
 if (!coments) {
  return new ApiError(404,"this viedo has not any coment")
  
 }
 return res.status(200).json(
  new ApiResponse(200,coments,"your all comet is here")
 )
})
export { comentOnVideo,updateComent ,daleteVIdeoComent,getAllComentsVideo};

