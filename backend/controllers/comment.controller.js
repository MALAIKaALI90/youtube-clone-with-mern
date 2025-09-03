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
const getAllComment=asyncHandler (async (req,res) => {
   const { videoId } = req.params;  
  const allcoment=await Coment.find({ videoFile: videoId })

  
  res.status(200).json({allcoment})
})
const updateComent=asyncHandler(async (req,res) => {
const {newComent}=req.body;


const {comentId}=req.params;
const coment=await Coment.findById(comentId)
if (!coment) {
    return new ApiError(402,"this comnt is not exist")
    
}
const updatedComent=await Coment.findByIdAndUpdate(comentId,
    { $set: { content: newComent } }
  ,{new:true})
return res.status(200).json(new ApiResponse(200,"your coment is updated successfully",updatedComent))

    
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

const getAllComentsVideo = asyncHandler(async (req, res) => {
  const { userId } = req.user.Id
console.log(userId);

  const comments = await Coment.find({ comentedBy: userId })
    .populate("videoFile")  
    .populate("comentedBy", "username email"); 

  if (!comments || comments.length === 0) {
    return res.status(404).json({
      success: false,
      message: "This user has not commented on any video",
    });
  }

  const videos = comments.map(c => c.videoFile);

  return res.status(200).json({
    success: true,
    videos,
  });
});

export { comentOnVideo,updateComent ,daleteVIdeoComent,getAllComentsVideo,getAllComment};

