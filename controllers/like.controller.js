//toggle video like
//togle coment like
//get all liked videos

import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js";
import { Like } from "../models/like.model.js";
import { Aggregate } from "mongoose";
import { User } from "../models/user.model.js";

 const toggleVideoLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Find like document for the video
  let likeDoc = await Like.findOne({ videoFile: videoId });

  if (!likeDoc) {
    // No like doc exists, create one and add user
    likeDoc = await Like.create({
      videoFile: [videoId],
      likedBy: [userId],
    });
    return res.status(201).json({ message: "Video liked" });
  }

  // Like doc exists, check if user has already liked
  const alreadyLiked = likeDoc.likedBy.includes(userId);

  if (alreadyLiked) {
    // Unlike the video
    likeDoc.likedBy = likeDoc.likedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
   likeDoc. likedBy-=1
    await likeDoc.save();
    return res.status(200).json({ message: "Video unliked",userId });
  } else {
    // Like the video

    likeDoc.likedBy.push(userId);
       likeDoc. likedBy+=1
    await likeDoc.save();
    return res.status(200).json({ message: "Video liked",userId });
  }

});
    
const toggleComentLike=asyncHandler(async (req,res) => {

    const {comentId}=req.params;
    const userId=req.user._id
   const hasComent= await Comment.findById(comentId)
   if (!hasComent) {
    return new ApiError(500,"thihs coment is  ot found ")
    
   }
    const ComentLiked=await Like.findById(comentId);
    if (!ComentLiked) {
        await Like.create({
          comment:[comentId],
          likedBy:[userId]

        })

        
    }
        const alreadyLikedCom=ComentLiked.likedBy.includes(userId);

if (!alreadyLikedCom) {
    ComentLiked.likedBy+=1
    ComentLiked.likedBy.push(userId)
return new ApiResponse(200,"you succefully liked the commnt")
    
}
 ComentLiked.likedBy = ComentLiked.likedBy.filter(
      (id) => id.toString() !== userId.toString()
       
    );
ComentLiked.likedBy-=1
ComentLiked.save();
return new ApiResponse(200,ComentLiked,"you unlked the commet")

})
const getAllLikedVideos=asyncHandler(async (req,res) => {
   

 const getLikedVideos = await Like.aggregate([
  {
    $lookup: {
      from: "videos", // collection name must be in lowercase
      localField: "videoFile",
      foreignField: "_id",
      as: "likedVideo"
    }
  },
  {
    $addFields: {
      likesCount: { $size: "$likedBy" },
      isLiked: {
        $cond: {
          if: { $in: [req.user._id, "$likedBy"] },
          then: true,
          else: false
        }
      }
    }
  },
  {
    $project: {
      likedVideo: 1,
      likesCount: 1,
      isLiked: 1
    }
  }
]);
return res.status(200).json(
   new ApiResponse(200,"your liked videos is here",getLikedVideos)
)
})
export {toggleVideoLike,getAllLikedVideos,toggleComentLike} 