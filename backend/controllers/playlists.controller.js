    import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const madePlaylist=asyncHandler(async (req,res) => {

  const { title,  discription } = req.body;
  const userId = req.user._id;

  const playlist = await Playlist.create({ title,
      discription,
    createdBy: userId });
  res.status(201).json(new ApiResponse(201, playlist, "Playlist created"));
});

// 2. Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});
 const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
  await playlist.save();

  res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
})

// 4. Get all playlists of a user
 const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await Playlist.find({ createdBy: userId });
  res.status(200).json(new ApiResponse(200, playlists, "User playlists"));
});

// 5. Get one playlist with videos
const getPlaylistDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId)
    .populate("videos")
    .populate("createdBy", "username");

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.status(200).json(new ApiResponse(200, playlist, "Playlist details"));
});

// 6. Delete playlist
 const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (playlist.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await playlist.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Playlist deleted"));
});
export {madePlaylist,addVideoToPlaylist, removeVideoFromPlaylist,getUserPlaylists, deletePlaylist ,getPlaylistDetails}