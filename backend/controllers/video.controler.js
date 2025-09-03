//OVER TODOS
//get all video
//publish video
//get video id
//update video
//delete video

import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js";




 const incrementViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    return new ApiError(401,"there is not such video"); // skip if no videoId in params
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
console.log("video",video);

  video.views += 1;
  await video.save()
  res.json(new ApiResponse(200,video,"Video fetched and view counted"))
});


const getMyVideos = asyncHandler(async (req, res) => {
  const video = await Video.find({owner:req.user._id});

  
  return res.status(200).json(
    new ApiResponse(200, "these are all the videos you made", video)
  );
});
const getAllVideos=asyncHandler(async (req,res) => {
  const allVideos=await Video.find();
  if (!allVideos) {
  return new ApiError(500,"there is not such videok")
  }
  return res.status(200).json(
    new ApiResponse(200,"all user videos",allVideos)
  )
  })
const publishVideo=asyncHandler(async (req,res) => {
  
    const {title,discription}=req.body;
   

 if ([title,discription].some((field)=>
    field?.trim()===""

 )) {
    throw new ApiError(401,"All fields all required");
 }
 //all video files are present
  const videoLocalPath= await req.files?.videoFile[0].path;
  const thumnailLocalPath= await req.files?.thumbnail[0].path;
 if (!videoLocalPath && !thumnailLocalPath) {
    throw new ApiError(402,"video file or thumbnail is required")
    
 }
  const video=await uplaodOnCloudinary(videoLocalPath);
  const thumbnail =await uplaodOnCloudinary(thumnailLocalPath)


  
  if (!video && !thumbnail) {
    throw new ApiError (403,"video or thumbnail is required")
    
  }
  const videomade=await  Video.create({
    title,
    discription,
    videoFile:video.url,
    thumbnail:thumbnail.url,
    duration:video.duration,
      owner: req.user._id, 
   
   })
   await videomade.save()
return res.status(200).json(
    new ApiResponse(200,"video is uploaded successfully",videomade)
)
})

const getVideoById = async (req, res) => {
  try {
    const {videoId}=req.params;
    const video = await Video.findById(videoId)
     .populate("owner", "username avatar "); 
  
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

// Update a video
const updateVideo = async (req, res) => {
  const {discription,title}=req.body

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $set:{
          discription,
          title
        
        }
      },
      { new: true }
    );

    if (!updatedVideo) return res.status(407).json({ message: "Video not found" });

    res.status(200).json({ message: "Video updated", video: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateFile = async (req, res) => {
const thumnailLocalPath=req.file?.thumbnail
 const thumbnail=await uplaodOnCloudinary(thumnailLocalPath)


  try {
    const updatedFiles = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $set:{
      thumbnail,
   
        }
      },
      { new: true }
    );

    if (!updatedFiles) return res.status(407).json({ message: "Video not found" });

    res.status(200).json({ message: "Thumbnail Updated", video: updatedFiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const videoDelete = async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.videoId);
 
    
    if (!deleted) return res.status(404).json({ message: "Video not found" });

    res.status(200).json({ message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

export {publishVideo,getVideoById,updateVideo,updateFile ,videoDelete, getAllVideos,incrementViews,getMyVideos}
