//toggle video like
//togle coment like
//get all liked videos

import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { Like } from "../models/like.model.js";
import  {Coment} from "../models/comment.model.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  
const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");


let likeDoc = await Like.findOne({ videoFile: { $in: [videoId] } }
 
);

  if (!likeDoc) {
 
    likeDoc = await Like.create({
      videoFile: videoId,
      likedBy: [userId],
    });
likeDoc = await likeDoc.populate("likedBy", "username avatar");

    return res.status(201).json({
      message: "Video liked",
      likesCount: likeDoc.likedBy.length,
      isLiked: true
    });
  }

  const alreadyLiked = likeDoc.likedBy.includes(userId);

  if (alreadyLiked) {
   
    likeDoc.likedBy = likeDoc.likedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    await likeDoc.save();
    return res.status(200).json({
      message: "Video unliked",
      likesCount: likeDoc.likedBy.length,
      isLiked: false
    });
  } else {
    // Like
    likeDoc.likedBy.push(userId);
    await likeDoc.save();
    return res.status(200).json({
      message: "Video liked",
      likesCount: likeDoc.likedBy.length,
      isLiked: true
    });
  }
});    
const toggleComentLike = asyncHandler(async (req, res) => {
  const { comentId } = req.params;
  const userId = req.user._id;

  const hasComent = await Coment.findById(comentId)

  if (!hasComent) {
    throw new ApiError(404, "This comment was not found");
  }

  let comentLike = await Like.findOne({ comment: comentId });

  // If no Like doc exists for this comment → create one
  if (!comentLike) {
    comentLike = await Like.create({
      comment: comentId,
      likedBy: [userId],
    });

  
    comentLike = await comentLike.populate("likedBy", "username avatar");

    return res.status(200).json({
      message: "You successfully liked the comment",
      likesCount: comentLike.likedBy.length,
      isLiked: true,
    
    });
  }

  const alreadyLiked = comentLike.likedBy.includes(userId);

  if (!alreadyLiked) {
    comentLike.likedBy.push(userId);
    await comentLike.save();

    comentLike = await comentLike.populate("likedBy", "username avatar");

    return res.status(200).json({
      message: "You successfully liked the comment",
      likesCount: comentLike.likedBy.length,
      isLiked: true,
     
    });
  }

  // Unlike
  comentLike.likedBy = comentLike.likedBy.filter(
    (id) => id.toString() !== userId.toString()
  );
  await comentLike.save();

  comentLike = await comentLike.populate("likedBy", "username avatar");

  return res.status(200).json({
    message: "You unliked the comment",
    likesCount: comentLike.likedBy.length,
    isLiked: false,
 
  });
});
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
   new ApiResponse(200,"your liked videos are  here",getLikedVideos)
)
})
export {toggleVideoLike,getAllLikedVideos,toggleComentLike} 